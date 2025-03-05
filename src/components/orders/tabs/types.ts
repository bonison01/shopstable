
import { EditableOrderData } from "@/hooks/orders/types";

export interface OrderTabsProps {
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

export interface OrderTabStatsData {
  count: number;
  paymentTotal: number;
}

export interface OrdersTabsCalculatedData {
  pendingOrders: any[];
  processingOrders: any[];
  shippedOrders: any[];
  deliveredOrders: any[];
  allPaymentTotal: number;
  pendingPaymentTotal: number;
  processingPaymentTotal: number;
  shippedPaymentTotal: number;
  deliveredPaymentTotal: number;
}
