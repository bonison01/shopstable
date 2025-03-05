
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/auth/useAuth";

export interface Customer {
  id: string;
  name: string;
  email: string;
  customer_type?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  wholesale_price?: number | null;
  retail_price?: number | null;
  trainer_price?: number | null;
}

export interface OrderItem {
  product_id: string;
  product_name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface OrderFormState {
  customer_id: string;
  status: string;
  payment_status: string;
  payment_amount?: number;
  items: OrderItem[];
}

export interface CurrentItemState {
  product_id: string;
  quantity: number;
}

export const useOrderForm = (onSuccess?: () => void) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth(); // Get current authenticated user
  
  const [order, setOrder] = useState<OrderFormState>({
    customer_id: "",
    status: "pending",
    payment_status: "pending",
    items: [],
  });

  const [currentItem, setCurrentItem] = useState<CurrentItemState>({
    product_id: "",
    quantity: 1,
  });

  const { data: customers, isLoading: customersLoading } = useQuery({
    queryKey: ['customers', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('customers')
        .select('id, name, email, customer_type')
        .eq('user_id', user.id) // Only fetch customers that belong to this user
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
    enabled: !!user, // Only run query when user is authenticated
  });

  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ['products', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('products')
        .select('id, name, price, stock, wholesale_price, retail_price, trainer_price')
        .eq('user_id', user.id) // Only fetch products that belong to this user
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
    enabled: !!user, // Only run query when user is authenticated
  });

  const handleChange = (name: string, value: string) => {
    setOrder(prev => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (name: string, value: string | number) => {
    setCurrentItem(prev => ({ ...prev, [name]: value }));
  };

  const calculateTotal = (): number => {
    return order.items.reduce((sum, item) => sum + item.subtotal, 0);
  };

  return {
    order,
    setOrder,
    currentItem,
    setCurrentItem,
    isSubmitting,
    setIsSubmitting,
    error,
    setError,
    customers,
    customersLoading,
    products,
    productsLoading,
    handleChange,
    handleItemChange,
    calculateTotal,
    toast,
    onSuccess,
    user // Return the user so it can be accessed in components
  };
};
