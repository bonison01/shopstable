
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface EditableOrderData {
  id: string;
  status: string;
  payment_status: string;
}

export const useOrders = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<EditableOrderData | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const { toast } = useToast();

  const { data: orders, isLoading, error, refetch } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
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
  });

  const handleAddOrder = () => {
    setAddDialogOpen(false);
    refetch();
  };

  const filteredOrders = orders?.filter(order => 
    order.customers?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getOrdersByStatus = (status: string) => {
    return filteredOrders?.filter(order => order.status === status) || [];
  };

  const startEditing = (order: any) => {
    setEditingOrder({
      id: order.id,
      status: order.status,
      payment_status: order.payment_status
    });
  };

  const cancelEditing = () => {
    setEditingOrder(null);
  };

  const openOrderDetails = (orderId: string) => {
    setSelectedOrderId(orderId);
    setIsDetailsDialogOpen(true);
  };

  const handleDetailsDialogClose = () => {
    setIsDetailsDialogOpen(false);
    setSelectedOrderId(null);
  };

  const handleStatusChange = (value: string) => {
    if (editingOrder) {
      setEditingOrder({ ...editingOrder, status: value });
    }
  };

  const handlePaymentStatusChange = (value: string) => {
    if (editingOrder) {
      setEditingOrder({ ...editingOrder, payment_status: value });
    }
  };

  const updateOrder = async () => {
    if (!editingOrder) return;
    
    setIsUpdating(true);
    
    try {
      const { error } = await supabase
        .from('orders')
        .update({
          status: editingOrder.status,
          payment_status: editingOrder.payment_status
        })
        .eq('id', editingOrder.id);
        
      if (error) {
        throw error;
      }
      
      toast({
        title: "Order Updated",
        description: `Order #${editingOrder.id.substring(0, 8)} has been updated successfully.`,
      });
      
      refetch();
      setEditingOrder(null);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: error.message || "Failed to update order",
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  return {
    orders,
    filteredOrders: filteredOrders || [],
    isLoading,
    searchQuery,
    setSearchQuery,
    addDialogOpen,
    setAddDialogOpen,
    handleAddOrder,
    editingOrder,
    startEditing,
    cancelEditing,
    updateOrder,
    isUpdating,
    handleStatusChange,
    handlePaymentStatusChange,
    getOrdersByStatus,
    selectedOrderId,
    isDetailsDialogOpen,
    openOrderDetails,
    handleDetailsDialogClose
  };
};
