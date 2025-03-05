
import { Tabs } from "@/components/ui/tabs";
import { OrdersTabsList } from "./tabs/OrdersTabsList";
import { OrdersTabContent } from "./tabs/OrdersTabContent";
import { useOrderTabs } from "@/hooks/orders/use-order-tabs";
import { OrderTabsProps } from "./tabs/types";

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
}: OrderTabsProps) => {
  const {
    activeTab,
    setActiveTab,
    pendingOrders,
    processingOrders,
    shippedOrders,
    deliveredOrders,
    allPaymentTotal,
    pendingPaymentTotal,
    processingPaymentTotal,
    shippedPaymentTotal,
    deliveredPaymentTotal
  } = useOrderTabs(getOrdersByStatus, filteredOrders);

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
