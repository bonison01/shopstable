
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { EditableOrderData } from "./types";
import { useAuth } from "@/contexts/auth/useAuth";

export const useOrderEditing = (refetch: () => void) => {
  const [editingOrder, setEditingOrder] = useState<EditableOrderData | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

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
    if (!editingOrder || !user) return;
    
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
        .eq('id', editingOrder.id)
        .eq('user_id', user.id); // Ensure we can only update orders belonging to this user
        
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
    editingOrder,
    isUpdating,
    startEditing,
    cancelEditing,
    updateOrder,
    handleStatusChange,
    handlePaymentStatusChange,
    handlePaymentAmountChange
  };
};
