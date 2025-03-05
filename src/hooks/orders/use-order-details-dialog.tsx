
import { useState } from "react";

export const useOrderDetailsDialog = () => {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

  const openOrderDetails = (orderId: string) => {
    setSelectedOrderId(orderId);
    setIsDetailsDialogOpen(true);
  };

  const handleDetailsDialogClose = () => {
    setIsDetailsDialogOpen(false);
    setSelectedOrderId(null);
  };

  return {
    selectedOrderId,
    isDetailsDialogOpen,
    openOrderDetails,
    handleDetailsDialogClose
  };
};
