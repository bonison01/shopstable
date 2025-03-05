
import { useState } from "react";
import { useStaffData } from "./use-staff-data";
import { useStaffSelection } from "./use-staff-selection";
import { useStaffOperations } from "./use-staff-operations";
import { useStaffUI } from "./use-staff-ui";

export const useStaff = () => {
  // Fetch staff data
  const { staffMembers, isLoading, refetch } = useStaffData();
  
  // UI state management
  const {
    searchQuery,
    setSearchQuery,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    selectedStaffId,
    isDetailsDialogOpen,
    isAddDialogOpen,
    setIsAddDialogOpen,
    filterStaff,
    openStaffDetails,
    handleDetailsDialogClose
  } = useStaffUI();
  
  // Staff selection state
  const {
    selectedStaffIds,
    setSelectedStaffIds,
    toggleStaffSelection,
    toggleSelectAll
  } = useStaffSelection(staffMembers);
  
  // Staff CRUD operations
  const {
    editingStaff,
    isUpdating,
    startEditing,
    cancelEditing,
    updateStaff,
    handleDeleteStaff,
    handleFieldChange
  } = useStaffOperations(refetch);
  
  // Filter staff based on search query
  const filteredStaff = filterStaff(staffMembers);

  // Wrapper for delete operation that manages UI state
  const deleteStaff = async () => {
    const success = await handleDeleteStaff(selectedStaffIds);
    if (success) {
      setSelectedStaffIds([]);
      setIsDeleteDialogOpen(false);
    }
  };

  return {
    staffMembers: filteredStaff,
    isLoading,
    searchQuery,
    setSearchQuery,
    selectedStaffIds,
    setSelectedStaffIds,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    selectedStaffId,
    isDetailsDialogOpen,
    isAddDialogOpen,
    setIsAddDialogOpen,
    editingStaff,
    isUpdating,
    refetch,
    toggleStaffSelection,
    toggleSelectAll,
    handleDeleteStaff: deleteStaff,
    openStaffDetails,
    handleDetailsDialogClose,
    startEditing,
    cancelEditing,
    updateStaff,
    handleFieldChange
  };
};
