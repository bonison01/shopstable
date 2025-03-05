
import { formatCurrency, formatDate } from "@/utils/format";
import { OrderStatusCell } from "./OrderStatusCell";
import { PaymentStatusCell } from "./PaymentStatusCell";
import { OrderActions } from "./OrderActions";
import { EditableOrderData } from "@/hooks/use-orders";

interface OrderTableRowProps {
  order: any;
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

export function OrderTableRow({
  order,
  editingOrder,
  startEditing,
  cancelEditing,
  updateOrder,
  isUpdating,
  handleStatusChange,
  handlePaymentStatusChange,
  handlePaymentAmountChange,
  openOrderDetails
}: OrderTableRowProps) {
  const isEditing = editingOrder && editingOrder.id === order.id;
  
  return (
    <tr className="border-b hover:bg-muted/40 transition-colors">
      <td className="py-3 px-4 font-medium">{order.id.substring(0, 8)}</td>
      <td className="py-3 px-4">{order.customers?.name || 'Unknown'}</td>
      <td className="py-3 px-4">{formatDate(order.date)}</td>
      <td className="py-3 px-4">
        <OrderStatusCell
          status={isEditing ? editingOrder.status : order.status}
          isEditing={!!isEditing}
          handleStatusChange={handleStatusChange}
        />
      </td>
      <td className="py-3 px-4">{order.order_items?.length || 0}</td>
      <td className="py-3 px-4">
        <PaymentStatusCell
          paymentStatus={isEditing ? editingOrder.payment_status : order.payment_status}
          paymentAmount={isEditing ? editingOrder.payment_amount : order.payment_amount}
          total={order.total}
          isEditing={!!isEditing}
          handlePaymentStatusChange={handlePaymentStatusChange}
          handlePaymentAmountChange={handlePaymentAmountChange}
        />
      </td>
      <td className="py-3 px-4 text-right font-medium">{formatCurrency(order.total)}</td>
      <td className="py-3 px-4">
        <OrderActions
          isEditing={!!isEditing}
          orderId={order.id}
          isUpdating={isUpdating}
          updateOrder={updateOrder}
          cancelEditing={cancelEditing}
          startEditing={() => startEditing(order)}
          openOrderDetails={openOrderDetails}
        />
      </td>
    </tr>
  );
}
