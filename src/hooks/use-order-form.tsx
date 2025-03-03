
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export interface Customer {
  id: string;
  name: string;
  email: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
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
    onSuccess
  };
};
