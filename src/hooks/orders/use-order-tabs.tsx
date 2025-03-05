
import { useState } from "react";

export const useOrderTabs = (getOrdersByStatus: (status: string) => any[], filteredOrders: any[]) => {
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

  return {
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
  };
};
