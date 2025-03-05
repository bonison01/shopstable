
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface OrderDetailsData {
  id: string;
  status: string;
  payment_status: string;
  total: number;
  date: string;
  payment_due_date?: string;
  customers: {
    name: string;
    email: string;
  };
  order_items: Array<{
    id: string;
    product_name: string;
    quantity: number;
    price: number;
    subtotal: number;
  }>;
}

export function useOrderDetails(orderId: string | null, isOpen: boolean) {
  const { toast } = useToast();

  const { data: order, isLoading } = useQuery({
    queryKey: ["order", orderId],
    queryFn: async () => {
      if (!orderId) return null;
      
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          customers:customer_id (*),
          order_items (*)
        `)
        .eq("id", orderId)
        .single();
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching order",
          description: error.message,
        });
        throw error;
      }
      
      return data as OrderDetailsData;
    },
    enabled: !!orderId && isOpen,
  });

  return {
    order,
    isLoading,
  };
}
