
import { TabsContent } from "@/components/ui/tabs";
import { OrdersTable } from "../OrdersTable";
import { EditableOrderData } from "@/hooks/use-orders";

interface OrdersTabContentProps {
  value: string;
  orders: any[];
  isLoading: boolean;
  onAddOrder: () => void;
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

export function OrdersTabContent({
  value,
  orders,
  isLoading,
  onAddOrder,
  editingOrder,
  startEditing,
  cancelEditing,
  updateOrder,
  isUpdating,
  handleStatusChange,
  handlePaymentStatusChange,
  handlePaymentAmountChange,
  openOrderDetails
}: OrdersTabContentProps) {
  return (
    <TabsContent value={value} className="mt-0">
      <OrdersTable
        orders={orders}
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
  );
}
