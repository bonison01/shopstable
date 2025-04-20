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

    // Handle payment logic
    let paymentAmount = null;
    if (order.payment_status === 'paid') {
      paymentAmount = total;
    } else if (order.payment_status === 'partial' && order.payment_amount !== undefined) {
      if (order.payment_amount <= 0) {
        throw new Error("Payment amount must be greater than zero");
      }
      paymentAmount = Math.min(order.payment_amount, total);
    }

    // Create order
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_id: order.customer_id,
        status: order.status,
        payment_status: order.payment_status,
        payment_amount: paymentAmount,
        total: total,
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // Insert order items
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

    // Deduct inventory stock
    await updateProductStocks(order.items);

    // Update customer stats
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
  data: { status?: string; payment_status?: string; payment_amount?: number | null }
): Promise<OrderUpdateResult> => {
  try {
    if (data.payment_amount !== undefined && data.payment_amount !== null && data.payment_amount <= 0) {
      throw new Error("Payment amount must be greater than zero");
    }

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
      const { data: productData, error: fetchError } = await supabase
        .from('products')
        .select('stock')
        .eq('id', item.product_id)
        .single();

      if (fetchError || !productData) {
        console.error("Error fetching product stock:", fetchError);
        continue;
      }

      const currentStock = productData.stock || 0;
      const newStock = Math.max(0, currentStock - item.quantity);

      const { error: updateError } = await supabase
        .from('products')
        .update({
          stock: newStock,
          last_updated: new Date().toISOString()
        })
        .eq('id', item.product_id);

      if (updateError) {
        console.error("Error updating stock for product", item.product_id, updateError);
      }
    } catch (err) {
      console.error("Unhandled error updating stock for item:", item.product_id, err);
    }
  }
};

const updateCustomerStats = async (customerId: string, total: number) => {
  try {
    const { data: customerData, error: fetchError } = await supabase
      .from('customers')
      .select('total_orders, total_spent')
      .eq('id', customerId)
      .single();

    if (fetchError || !customerData) {
      console.error("Error fetching customer:", fetchError);
      return;
    }

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
  } catch (error) {
    console.error("Error updating customer stats:", error);
  }
};
