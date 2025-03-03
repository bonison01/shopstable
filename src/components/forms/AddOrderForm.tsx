
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, Plus, Trash2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { formatCurrency } from "@/utils/format";

interface Customer {
  id: string;
  name: string;
  email: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

interface OrderItem {
  product_id: string;
  product_name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

const AddOrderForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const [order, setOrder] = useState({
    customer_id: "",
    status: "pending",
    payment_status: "pending",
    items: [] as OrderItem[],
  });

  const [currentItem, setCurrentItem] = useState({
    product_id: "",
    quantity: 1,
  });

  // Fetch customers
  const { data: customers, isLoading: customersLoading } = useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customers')
        .select('id, name, email')
        .order('name');
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching customers",
          description: error.message,
        });
        throw error;
      }
      
      return data as Customer[] || [];
    },
  });

  // Fetch products
  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, price, stock')
        .order('name');
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching products",
          description: error.message,
        });
        throw error;
      }
      
      return data as Product[] || [];
    },
  });

  const handleChange = (name: string, value: string) => {
    setOrder(prev => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (name: string, value: string | number) => {
    setCurrentItem(prev => ({ ...prev, [name]: value }));
  };

  const addItem = () => {
    if (!currentItem.product_id || currentItem.quantity <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid item",
        description: "Please select a product and enter a valid quantity",
      });
      return;
    }

    const product = products?.find(p => p.id === currentItem.product_id);
    if (!product) return;

    // Check if we have sufficient stock
    if (currentItem.quantity > product.stock) {
      toast({
        variant: "destructive",
        title: "Insufficient stock",
        description: `Only ${product.stock} units available`,
      });
      return;
    }

    // Check if product already exists in order
    const existingItemIndex = order.items.findIndex(
      item => item.product_id === currentItem.product_id
    );

    if (existingItemIndex >= 0) {
      // Update existing item
      const updatedItems = [...order.items];
      const newQuantity = updatedItems[existingItemIndex].quantity + currentItem.quantity;
      
      // Check if the total quantity would exceed stock
      if (newQuantity > product.stock) {
        toast({
          variant: "destructive",
          title: "Insufficient stock",
          description: `You already have ${updatedItems[existingItemIndex].quantity} in your order. Only ${product.stock} units available in total.`,
        });
        return;
      }
      
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity: newQuantity,
        subtotal: product.price * newQuantity,
      };
      
      setOrder(prev => ({ ...prev, items: updatedItems }));
    } else {
      // Add new item
      const newItem: OrderItem = {
        product_id: product.id,
        product_name: product.name,
        price: product.price,
        quantity: currentItem.quantity,
        subtotal: product.price * currentItem.quantity,
      };
      
      setOrder(prev => ({
        ...prev,
        items: [...prev.items, newItem],
      }));
    }

    // Reset current item
    setCurrentItem({
      product_id: "",
      quantity: 1,
    });
  };

  const removeItem = (index: number) => {
    const updatedItems = [...order.items];
    updatedItems.splice(index, 1);
    setOrder(prev => ({ ...prev, items: updatedItems }));
  };

  const calculateTotal = (): number => {
    return order.items.reduce((sum, item) => sum + item.subtotal, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Simple validation
      if (!order.customer_id) {
        throw new Error("Please select a customer");
      }

      if (order.items.length === 0) {
        throw new Error("Please add at least one item to the order");
      }

      const total = calculateTotal();

      // Start a transaction
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

      // Update product stock
      for (const item of order.items) {
        const { error: stockError } = await supabase
          .from('products')
          .update({ 
            stock: supabase.rpc('decrement', { x: item.quantity }),
            last_updated: new Date().toISOString()
          })
          .eq('id', item.product_id);

        if (stockError) {
          console.error("Error updating stock:", stockError);
          // Continue with other updates even if one fails
        }
      }

      // Update customer stats
      const { error: customerError } = await supabase
        .from('customers')
        .update({ 
          total_orders: supabase.rpc('increment', { x: 1 }),
          total_spent: supabase.rpc('add_amount', { amount: total })
        })
        .eq('id', order.customer_id);

      if (customerError) {
        console.error("Error updating customer stats:", customerError);
        // Continue even if this fails
      }

      toast({
        title: "Order Created",
        description: `Order #${orderData.id.substring(0, 8)} has been created.`,
      });

      // Reset form
      setOrder({
        customer_id: "",
        status: "pending",
        payment_status: "pending",
        items: [],
      });

      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || "An error occurred while creating the order");
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Failed to create order",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="customer">Customer *</Label>
          <Select 
            value={order.customer_id} 
            onValueChange={(value) => handleChange("customer_id", value)}
            disabled={customersLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select customer" />
            </SelectTrigger>
            <SelectContent>
              {customers?.map(customer => (
                <SelectItem key={customer.id} value={customer.id}>
                  {customer.name} ({customer.email})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="status">Order Status</Label>
          <Select 
            value={order.status} 
            onValueChange={(value) => handleChange("status", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="payment_status">Payment Status</Label>
          <Select 
            value={order.payment_status} 
            onValueChange={(value) => handleChange("payment_status", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select payment status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="border p-4 rounded-md">
        <h3 className="font-medium mb-2">Order Items</h3>
        
        <div className="flex flex-col md:flex-row gap-3 mb-4">
          <div className="flex-grow space-y-2">
            <Label htmlFor="product">Product</Label>
            <Select 
              value={currentItem.product_id} 
              onValueChange={(value) => handleItemChange("product_id", value)}
              disabled={productsLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select product" />
              </SelectTrigger>
              <SelectContent>
                {products?.map(product => (
                  <SelectItem key={product.id} value={product.id} disabled={product.stock <= 0}>
                    {product.name} - {formatCurrency(product.price)} {product.stock <= 0 ? "(Out of stock)" : `(${product.stock} in stock)`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="w-full md:w-24 space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input 
              id="quantity" 
              type="number" 
              min="1" 
              step="1" 
              value={currentItem.quantity} 
              onChange={(e) => handleItemChange("quantity", parseInt(e.target.value) || 1)} 
            />
          </div>
          
          <div className="flex items-end">
            <Button 
              type="button" 
              onClick={addItem}
              disabled={!currentItem.product_id}
            >
              <Plus className="h-4 w-4 mr-2" /> Add Item
            </Button>
          </div>
        </div>
        
        {order.items.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-2 text-left">Product</th>
                  <th className="py-2 text-right">Price</th>
                  <th className="py-2 text-right">Quantity</th>
                  <th className="py-2 text-right">Subtotal</th>
                  <th className="py-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2">{item.product_name}</td>
                    <td className="py-2 text-right">{formatCurrency(item.price)}</td>
                    <td className="py-2 text-right">{item.quantity}</td>
                    <td className="py-2 text-right">{formatCurrency(item.subtotal)}</td>
                    <td className="py-2 text-right">
                      <Button size="sm" variant="ghost" onClick={() => removeItem(index)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={3} className="py-2 text-right font-medium">Total:</td>
                  <td className="py-2 text-right font-medium">{formatCurrency(calculateTotal())}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            No items added to this order yet.
          </div>
        )}
      </div>
      
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => {
          if (onSuccess) onSuccess();
        }}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting || order.items.length === 0}>
          {isSubmitting ? "Creating..." : "Create Order"}
        </Button>
      </div>
    </form>
  );
};

export default AddOrderForm;
