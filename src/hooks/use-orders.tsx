
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface EditableOrderData {
  id: string;
  status: string;
  payment_status: string;
  payment_amount?: number;
  total?: number;
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
      payment_status: order.payment_status,
      payment_amount: order.payment_amount || 0,
      total: order.total
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
      setEditingOrder({ 
        ...editingOrder, 
        payment_status: value,
        // Reset payment amount if payment status is not partial
        payment_amount: value === 'partial' ? editingOrder.payment_amount : undefined
      });
    }
  };

  const handlePaymentAmountChange = (value: string) => {
    if (editingOrder) {
      // Ensure the payment amount doesn't exceed the total
      const numValue = parseFloat(value) || 0;
      const validValue = Math.min(numValue, editingOrder.total || 0);
      
      setEditingOrder({ 
        ...editingOrder, 
        payment_amount: validValue 
      });
    }
  };

  const updateOrder = async () => {
    if (!editingOrder) return;
    
    setIsUpdating(true);
    
    try {
      // Prepare update data based on payment status
      const updateData: any = {
        status: editingOrder.status,
        payment_status: editingOrder.payment_status
      };
      
      // Include payment_amount only for partial payments
      if (editingOrder.payment_status === 'partial' && editingOrder.payment_amount !== undefined) {
        updateData.payment_amount = editingOrder.payment_amount;
      } else {
        // Set payment_amount to null for other payment statuses
        updateData.payment_amount = null;
      }
      
      const { error } = await supabase
        .from('orders')
        .update(updateData)
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
    handlePaymentAmountChange,
    getOrdersByStatus,
    selectedOrderId,
    isDetailsDialogOpen,
    openOrderDetails,
    handleDetailsDialogClose
  };
};
