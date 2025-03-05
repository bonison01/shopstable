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
  const pendingOrders = getOrdersByStatus("pending");
  const processingOrders = getOrdersByStatus("processing");
  const shippedOrders = getOrdersByStatus("shipped");
  const deliveredOrders = getOrdersByStatus("delivered");
  
  // Calculate payment totals for each status
  const calculatePaymentTotal = (orders: any[]) => {
    return orders.reduce((total, order) => {
      if (order.payment_status === 'paid') {
        return total + (order.total || 0);
      } else if (order.payment_status === 'partial' && order.payment_amount) {
        return total + order.payment_amount;
      }
      return total;
    }, 0);
  };
  
  const allPaymentTotal = calculatePaymentTotal(filteredOrders);
  const pendingPaymentTotal = calculatePaymentTotal(pendingOrders);
  const processingPaymentTotal = calculatePaymentTotal(processingOrders);
  const shippedPaymentTotal = calculatePaymentTotal(shippedOrders);
  const deliveredPaymentTotal = calculatePaymentTotal(deliveredOrders);

  return (
    <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
      <OrdersTabsList
        isLoading={isLoading}
        filteredOrders={filteredOrders}
        pendingCount={pendingOrders.length}
        processingCount={processingOrders.length}
        shippedCount={shippedOrders.length}
        deliveredCount={deliveredOrders.length}
        allPaymentTotal={allPaymentTotal}
        pendingPaymentTotal={pendingPaymentTotal}
        processingPaymentTotal={processingPaymentTotal}
        shippedPaymentTotal={shippedPaymentTotal}
        deliveredPaymentTotal={deliveredPaymentTotal}
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
        orders={pendingOrders}
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
        orders={processingOrders}
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
        orders={shippedOrders}
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
        orders={deliveredOrders}
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
