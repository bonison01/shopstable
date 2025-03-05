
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth/useAuth";

export const useOrdersData = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const { user } = useAuth();

  const { data: orders, isLoading, error, refetch } = useQuery({
    queryKey: ['orders', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          customers:customer_id (
            name,
            email
          ),
          order_items (*)
        `)
        .eq('user_id', user.id) // Filter orders by user_id
        .order('date', { ascending: false });
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching orders",
          description: error.message,
        });
        throw error;
      }
      
      return data || [];
    },
    enabled: !!user, // Only run when user is authenticated
  });

  const filteredOrders = orders?.filter(order => 
    order.customers?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getOrdersByStatus = (status: string) => {
    return filteredOrders?.filter(order => order.status === status) || [];
  };

  return {
    orders,
    filteredOrders: filteredOrders || [],
    isLoading,
    searchQuery,
    setSearchQuery,
    refetch,
    getOrdersByStatus
  };
};
