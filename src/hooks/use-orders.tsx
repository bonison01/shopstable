
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
      // Ensure the payment amount is positive and doesn't exceed the total
      const numValue = Math.max(0.01, parseFloat(value) || 0);
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
      // Store original payment values to detect changes
      const originalPaymentStatus = editingOrder.payment_status;
      const originalPaymentAmount = editingOrder.payment_amount;
      
      // Prepare update data based on payment status
      const updateData: any = {
        status: editingOrder.status,
        payment_status: editingOrder.payment_status
      };
      
      // Include payment_amount only for partial payments
      if (editingOrder.payment_status === 'partial' && editingOrder.payment_amount !== undefined) {
        // Ensure amount is positive
        if (editingOrder.payment_amount <= 0) {
          throw new Error("Payment amount must be greater than zero");
        }
        updateData.payment_amount = editingOrder.payment_amount;
      } else if (editingOrder.payment_status === 'paid') {
        // For paid status, set payment_amount to total
        updateData.payment_amount = editingOrder.total;
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
      
      // Display cash flow notification when payment is recorded
      const paymentChanged = 
        (originalPaymentStatus !== 'paid' && editingOrder.payment_status === 'paid') ||
        (originalPaymentStatus !== 'partial' && editingOrder.payment_status === 'partial') ||
        (originalPaymentStatus === 'partial' && originalPaymentAmount !== editingOrder.payment_amount);
      
      if (paymentChanged) {
        toast({
          title: "Payment Recorded",
          description: "This payment has been automatically tracked in the cash flow system.",
          variant: "default",
        });
      }
      
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
