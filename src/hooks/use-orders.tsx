
import { useOrdersData } from "./orders/use-orders-data";
import { useOrderEditing } from "./orders/use-order-editing";
import { useOrderDetailsDialog } from "./orders/use-order-details-dialog";
import { useOrderCreation } from "./orders/use-order-creation";
import { EditableOrderData } from "./orders/types";

export type { EditableOrderData } from "./orders/types";

export const useOrders = () => {
  const { 
    orders,
    filteredOrders,
    isLoading,
    searchQuery,
    setSearchQuery,
    refetch,
    getOrdersByStatus
  } = useOrdersData();

  const {
    editingOrder,
    isUpdating,
    startEditing,
    cancelEditing,
    updateOrder,
    handleStatusChange,
    handlePaymentStatusChange,
    handlePaymentAmountChange
  } = useOrderEditing(refetch);

  const {
    selectedOrderId,
    isDetailsDialogOpen,
    openOrderDetails,
    handleDetailsDialogClose
  } = useOrderDetailsDialog();

  const {
    addDialogOpen,
    setAddDialogOpen,
    handleAddOrder: handleAddOrderBase
  } = useOrderCreation();

  const handleAddOrder = () => {
    handleAddOrderBase();
    refetch();
  };
  
  return {
    // Orders data
    orders,
    filteredOrders,
    isLoading,
    searchQuery,
    setSearchQuery,
    getOrdersByStatus,
    
    // Order editing
    editingOrder,
    startEditing,
    cancelEditing,
    updateOrder,
    isUpdating,
    handleStatusChange,
    handlePaymentStatusChange,
    handlePaymentAmountChange,
    
    // Order detail dialog
    selectedOrderId,
    isDetailsDialogOpen,
    openOrderDetails,
    handleDetailsDialogClose,
    
    // Order creation
    addDialogOpen,
    setAddDialogOpen,
    handleAddOrder
  };
};
