
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrdersTable } from "./OrdersTable";

interface EditableOrderData {
  id: string;
  status: string;
  payment_status: string;
}

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
  openOrderDetails
}: OrdersTabsProps) => {
  return (
    <Tabs defaultValue="all" className="w-full fade-in">
      <TabsList className="mb-6">
        <TabsTrigger value="all">All Orders</TabsTrigger>
        <TabsTrigger value="pending">Pending</TabsTrigger>
        <TabsTrigger value="processing">Processing</TabsTrigger>
        <TabsTrigger value="shipped">Shipped</TabsTrigger>
        <TabsTrigger value="delivered">Delivered</TabsTrigger>
        <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
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
          openOrderDetails={openOrderDetails}
        />
      </TabsContent>
      
      <TabsContent value="pending" className="mt-0">
        <OrdersTable 
          orders={getOrdersByStatus('pending')} 
          isLoading={isLoading} 
          onAddOrder={onAddOrder}
          editingOrder={editingOrder}
          startEditing={startEditing}
          cancelEditing={cancelEditing}
          updateOrder={updateOrder}
          isUpdating={isUpdating}
          handleStatusChange={handleStatusChange}
          handlePaymentStatusChange={handlePaymentStatusChange}
          openOrderDetails={openOrderDetails}
        />
      </TabsContent>
      
      <TabsContent value="processing" className="mt-0">
        <OrdersTable 
          orders={getOrdersByStatus('processing')} 
          isLoading={isLoading} 
          onAddOrder={onAddOrder}
          editingOrder={editingOrder}
          startEditing={startEditing}
          cancelEditing={cancelEditing}
          updateOrder={updateOrder}
          isUpdating={isUpdating}
          handleStatusChange={handleStatusChange}
          handlePaymentStatusChange={handlePaymentStatusChange}
          openOrderDetails={openOrderDetails}
        />
      </TabsContent>
      
      <TabsContent value="shipped" className="mt-0">
        <OrdersTable 
          orders={getOrdersByStatus('shipped')} 
          isLoading={isLoading} 
          onAddOrder={onAddOrder}
          editingOrder={editingOrder}
          startEditing={startEditing}
          cancelEditing={cancelEditing}
          updateOrder={updateOrder}
          isUpdating={isUpdating}
          handleStatusChange={handleStatusChange}
          handlePaymentStatusChange={handlePaymentStatusChange}
          openOrderDetails={openOrderDetails}
        />
      </TabsContent>
      
      <TabsContent value="delivered" className="mt-0">
        <OrdersTable 
          orders={getOrdersByStatus('delivered')} 
          isLoading={isLoading} 
          onAddOrder={onAddOrder}
          editingOrder={editingOrder}
          startEditing={startEditing}
          cancelEditing={cancelEditing}
          updateOrder={updateOrder}
          isUpdating={isUpdating}
          handleStatusChange={handleStatusChange}
          handlePaymentStatusChange={handlePaymentStatusChange}
          openOrderDetails={openOrderDetails}
        />
      </TabsContent>
      
      <TabsContent value="cancelled" className="mt-0">
        <OrdersTable 
          orders={getOrdersByStatus('cancelled')} 
          isLoading={isLoading} 
          onAddOrder={onAddOrder}
          editingOrder={editingOrder}
          startEditing={startEditing}
          cancelEditing={cancelEditing}
          updateOrder={updateOrder}
          isUpdating={isUpdating}
          handleStatusChange={handleStatusChange}
          handlePaymentStatusChange={handlePaymentStatusChange}
          openOrderDetails={openOrderDetails}
        />
      </TabsContent>
    </Tabs>
  );
};
