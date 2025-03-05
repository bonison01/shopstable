
import { useState } from "react";

export const useOrderCreation = () => {
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const handleAddOrder = () => {
    setAddDialogOpen(false);
  };

  return {
    addDialogOpen,
    setAddDialogOpen,
    handleAddOrder
  };
};
