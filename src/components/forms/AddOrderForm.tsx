import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useOrderForm } from "@/hooks/use-order-form";
import { OrderFormFields } from "./OrderItems/OrderFormFields";
import { OrderItemManager } from "./OrderItems/OrderItemManager";
import { addOrderItem, removeOrderItem } from "./OrderItems/OrderItemLogic";
import { createOrder } from "@/services/order-service";

const AddOrderForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const {
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
    toast
  } = useOrderForm(onSuccess);

  const addItem = () => {
    const updatedItems = addOrderItem(
      currentItem,
      order,
      products,
      customers,
      (message) => toast({
        variant: "destructive",
        title: "Invalid item",
        description: message,
      })
    );

    if (updatedItems) {
      setOrder(prev => ({ ...prev, items: updatedItems }));
      setCurrentItem({ product_id: "", quantity: 1 });
    }
  };

  const removeItem = (index: number) => {
    const updatedItems = removeOrderItem(order.items, index);
    setOrder(prev => ({ ...prev, items: updatedItems }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Add payment_amount for 'paid' status
    if (order.payment_status === 'paid') {
      order.payment_amount = calculateTotal();
    }

    const result = await createOrder(order);

    if (result.success) {
      toast({
        title: "Order Created",
        description: `Order #${result.orderId?.substring(0, 8)} has been created.`,
      });

      setOrder({
        customer_id: "",
        status: "pending",
        payment_status: "pending",
        items: [],
      });

      if (onSuccess) onSuccess();
    } else {
      setError(result.error || "An error occurred while creating the order");
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error || "Failed to create order",
      });
    }

    setIsSubmitting(false);
  };

  // New handler for updating subtotal
  const handleSubtotalChange = (index: number, value: number) => {
    const updatedItems = [...order.items];
    updatedItems[index] = {
      ...updatedItems[index],
      subtotal: value,
    };
    setOrder(prev => ({ ...prev, items: updatedItems }));
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

      <OrderFormFields
        customerId={order.customer_id}
        status={order.status}
        paymentStatus={order.payment_status}
        customers={customers}
        customersLoading={customersLoading}
        onFieldChange={handleChange}
      />

      <OrderItemManager
        items={order.items}
        currentItem={currentItem}
        products={products}
        productsLoading={productsLoading}
        onAddItem={addItem}
        onRemoveItem={removeItem}
        onItemChange={handleItemChange}
        calculateTotal={calculateTotal}
        onSubtotalChange={handleSubtotalChange} // Pass the handler for updating subtotal
      />

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
