
import { useState } from "react";
import { Tabs } from "@/components/ui/tabs";
import { EditableOrderData } from "@/hooks/use-orders";
import { OrdersTabsList } from "./tabs/OrdersTabsList";
import { OrdersTabContent } from "./tabs/OrdersTabContent";

interface OrdersTabsProps {
  filteredOrders: any[];
  isLoading: boolean;
  onAddOrder: () => void;
  getOrdersByStatus: (status: string) => any[];
  editingOrder: EditableOrderData | null;
  startEditing: (order: any) => void;
  cancelEditing: () => void;
  updateOrder: () => Promise<void>;
  isUpdating: boolean;
  handleStatusChange: (value: string) => void;
  handlePaymentStatusChange: (value: string) => void;
  handlePaymentAmountChange?: (value: string) => void;
  openOrderDetails: (orderId: string) => void;
}

export const OrdersTabs = ({
  filteredOrders,
  isLoading,
  onAddOrder,
  getOrdersByStatus,
  editingOrder,
  startEditing,
  cancelEditing,
  updateOrder,
  isUpdating,
  handleStatusChange,
  handlePaymentStatusChange,
  handlePaymentAmountChange,
  openOrderDetails
}: OrdersTabsProps) => {
  const [activeTab, setActiveTab] = useState("all");

  // Count of orders by status
  const pendingCount = getOrdersByStatus("pending").length;
  const processingCount = getOrdersByStatus("processing").length;
  const shippedCount = getOrdersByStatus("shipped").length;
  const deliveredCount = getOrdersByStatus("delivered").length;

  return (
    <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
      <OrdersTabsList
        isLoading={isLoading}
        filteredOrders={filteredOrders}
        pendingCount={pendingCount}
        processingCount={processingCount}
        shippedCount={shippedCount}
        deliveredCount={deliveredCount}
      />

      <OrdersTabContent
        value="all"
        orders={filteredOrders}
        isLoading={isLoading}
        onAddOrder={onAddOrder}
        editingOrder={editingOrder}
        startEditing={startEditing}
        cancelEditing={cancelEditing}
        updateOrder={updateOrder}
        isUpdating={isUpdating}
        handleStatusChange={handleStatusChange}
        handlePaymentStatusChange={handlePaymentStatusChange}
        handlePaymentAmountChange={handlePaymentAmountChange}
        openOrderDetails={openOrderDetails}
      />

      <OrdersTabContent
        value="pending"
        orders={getOrdersByStatus("pending")}
        isLoading={isLoading}
        onAddOrder={onAddOrder}
        editingOrder={editingOrder}
        startEditing={startEditing}
        cancelEditing={cancelEditing}
        updateOrder={updateOrder}
        isUpdating={isUpdating}
        handleStatusChange={handleStatusChange}
        handlePaymentStatusChange={handlePaymentStatusChange}
        handlePaymentAmountChange={handlePaymentAmountChange}
        openOrderDetails={openOrderDetails}
      />

      <OrdersTabContent
        value="processing"
        orders={getOrdersByStatus("processing")}
        isLoading={isLoading}
        onAddOrder={onAddOrder}
        editingOrder={editingOrder}
        startEditing={startEditing}
        cancelEditing={cancelEditing}
        updateOrder={updateOrder}
        isUpdating={isUpdating}
        handleStatusChange={handleStatusChange}
        handlePaymentStatusChange={handlePaymentStatusChange}
        handlePaymentAmountChange={handlePaymentAmountChange}
        openOrderDetails={openOrderDetails}
      />

      <OrdersTabContent
        value="shipped"
        orders={getOrdersByStatus("shipped")}
        isLoading={isLoading}
        onAddOrder={onAddOrder}
        editingOrder={editingOrder}
        startEditing={startEditing}
        cancelEditing={cancelEditing}
        updateOrder={updateOrder}
        isUpdating={isUpdating}
        handleStatusChange={handleStatusChange}
        handlePaymentStatusChange={handlePaymentStatusChange}
        handlePaymentAmountChange={handlePaymentAmountChange}
        openOrderDetails={openOrderDetails}
      />

      <OrdersTabContent
        value="delivered"
        orders={getOrdersByStatus("delivered")}
        isLoading={isLoading}
        onAddOrder={onAddOrder}
        editingOrder={editingOrder}
        startEditing={startEditing}
        cancelEditing={cancelEditing}
        updateOrder={updateOrder}
        isUpdating={isUpdating}
        handleStatusChange={handleStatusChange}
        handlePaymentStatusChange={handlePaymentStatusChange}
        handlePaymentAmountChange={handlePaymentAmountChange}
        openOrderDetails={openOrderDetails}
      />
    </Tabs>
  );
};
