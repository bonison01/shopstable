
import { EditableOrderData } from "@/hooks/use-orders";
import { LoadingState } from "./table/LoadingState";
import { EmptyOrdersState } from "./table/EmptyOrdersState";
import { OrderTableHeader } from "./table/OrderTableHeader";
import { OrderTableRow } from "./table/OrderTableRow";

interface OrdersTableProps {
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

export const OrdersTable = ({ 
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
}: OrdersTableProps) => {
  if (isLoading) {
    return <LoadingState />;
  }

  if (orders.length === 0) {
    return <EmptyOrdersState onAddOrder={onAddOrder} />;
  }

  return (
    <div className="data-table-container fade-in">
      <table className="w-full border-collapse">
        <OrderTableHeader />
        <tbody>
          {orders.map((order) => (
            <OrderTableRow
              key={order.id}
              order={order}
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
          ))}
        </tbody>
      </table>
    </div>
  );
};
