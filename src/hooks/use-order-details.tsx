
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth/useAuth";

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
  const { user } = useAuth();

  const { data: order, isLoading } = useQuery({
    queryKey: ["order", orderId, user?.id],
    queryFn: async () => {
      if (!orderId || !user) return null;
      
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          customers:customer_id (*),
          order_items (*)
        `)
        .eq("id", orderId)
        .eq("user_id", user.id) // Only fetch orders that belong to this user
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
    enabled: !!orderId && !!user && isOpen,
  });

  return {
    order,
    isLoading,
  };
}
