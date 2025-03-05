
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrdersTable } from "./OrdersTable";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EditableOrderData } from "@/hooks/use-orders";

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
      <TabsList className="mb-4 bg-background">
        <TabsTrigger value="all" className="relative">
          All
          <Badge variant="outline" className="ml-2 -mr-1">
            {isLoading ? <Skeleton className="h-4 w-4" /> : filteredOrders.length}
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="pending" className="relative">
          Pending
          <Badge variant="outline" className="ml-2 -mr-1">
            {isLoading ? <Skeleton className="h-4 w-4" /> : pendingCount}
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="processing" className="relative">
          Processing
          <Badge variant="outline" className="ml-2 -mr-1">
            {isLoading ? <Skeleton className="h-4 w-4" /> : processingCount}
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="shipped" className="relative">
          Shipped
          <Badge variant="outline" className="ml-2 -mr-1">
            {isLoading ? <Skeleton className="h-4 w-4" /> : shippedCount}
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="delivered" className="relative">
          Delivered
          <Badge variant="outline" className="ml-2 -mr-1">
            {isLoading ? <Skeleton className="h-4 w-4" /> : deliveredCount}
          </Badge>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="all" className="mt-0">
        <OrdersTable
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
      </TabsContent>

      <TabsContent value="pending" className="mt-0">
        <OrdersTable
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
      </TabsContent>

      <TabsContent value="processing" className="mt-0">
        <OrdersTable
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
      </TabsContent>

      <TabsContent value="shipped" className="mt-0">
        <OrdersTable
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
      </TabsContent>

      <TabsContent value="delivered" className="mt-0">
        <OrdersTable
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
      </TabsContent>
    </Tabs>
  );
};
