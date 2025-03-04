
import { supabase } from "@/integrations/supabase/client";
import { type OrderFormState, type OrderItem } from "@/hooks/use-order-form";

export interface OrderCreationResult {
  success: boolean;
  error?: string;
  orderId?: string;
}

export interface OrderUpdateResult {
  success: boolean;
  error?: string;
}

export const createOrder = async (order: OrderFormState): Promise<OrderCreationResult> => {
  try {
    if (!order.customer_id) {
      throw new Error("Please select a customer");
    }

    if (order.items.length === 0) {
      throw new Error("Please add at least one item to the order");
    }

    const total = order.items.reduce((sum, item) => sum + item.subtotal, 0);

    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_id: order.customer_id,
        status: order.status,
        payment_status: order.payment_status,
        total: total,
      })
      .select()
      .single();

    if (orderError) throw orderError;

    const orderItems = order.items.map(item => ({
      order_id: orderData.id,
      product_id: item.product_id,
      product_name: item.product_name,
      quantity: item.quantity,
      price: item.price,
      subtotal: item.subtotal,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    await updateProductStocks(order.items);
    await updateCustomerStats(order.customer_id, total);

    return {
      success: true,
      orderId: orderData.id
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "An error occurred while creating the order"
    };
  }
};

export const updateOrder = async (
  orderId: string, 
  data: { status?: string; payment_status?: string }
): Promise<OrderUpdateResult> => {
  try {
    const { error } = await supabase
      .from('orders')
      .update(data)
      .eq('id', orderId);
      
    if (error) throw error;
    
    return {
      success: true
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "An error occurred while updating the order"
    };
  }
};

const updateProductStocks = async (items: OrderItem[]) => {
  for (const item of items) {
    try {
      // First, we need to get the current product to update it
      const { data: productData, error: fetchError } = await supabase
        .from('products')
        .select('stock')
        .eq('id', item.product_id)
        .single();
        
      if (fetchError) {
        console.error("Error fetching product:", fetchError);
        continue;
      }
        
      // Try to use RPC but now without the id parameter which was causing the error
      const { error: rpcError } = await supabase.rpc('decrement', {
        x: item.quantity
      });

      if (rpcError) {
        // If RPC fails, fall back to direct update
        console.error("Error using RPC to update stock:", rpcError);
        
        const newStock = Math.max(0, (productData.stock || 0) - item.quantity);
        const { error: updateError } = await supabase
          .from('products')
          .update({ 
            stock: newStock,
            last_updated: new Date().toISOString()
          })
          .eq('id', item.product_id);
          
        if (updateError) {
          console.error("Error updating stock:", updateError);
        }
      }
    } catch (error) {
      console.error("Error updating product stock:", error);
    }
  }
};

const updateCustomerStats = async (customerId: string, total: number) => {
  try {
    // First get current customer data
    const { data: customerData, error: fetchError } = await supabase
      .from('customers')
      .select('total_orders, total_spent')
      .eq('id', customerId)
      .single();
      
    if (fetchError) {
      console.error("Error fetching customer:", fetchError);
      return;
    }
    
    // Fix RPC call by removing the id parameter
    const { error: rpcError } = await supabase.rpc('add_amount', {
      base: customerData.total_spent || 0,
      amount: total
    });

    if (rpcError) {
      // If RPC fails, fall back to direct update
      console.error("Error using RPC to update customer stats:", rpcError);
      
      const newTotalOrders = (customerData.total_orders || 0) + 1;
      const newTotalSpent = (customerData.total_spent || 0) + total;
      
      const { error: updateError } = await supabase
        .from('customers')
        .update({ 
          total_orders: newTotalOrders,
          total_spent: newTotalSpent
        })
        .eq('id', customerId);
        
      if (updateError) {
        console.error("Error updating customer stats:", updateError);
      }
    }
  } catch (error) {
    console.error("Error updating customer stats:", error);
  }
};
