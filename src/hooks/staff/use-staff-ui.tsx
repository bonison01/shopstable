
import { useState } from "react";
import { StaffMember } from "./types";

export const useStaffUI = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Filter staff based on search query
  const filterStaff = (staffMembers: StaffMember[] | undefined) => {
    return staffMembers?.filter((staff) =>
      staff.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.staff_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.role.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  // Open staff details dialog
  const openStaffDetails = (staffId: string) => {
    setSelectedStaffId(staffId);
    setIsDetailsDialogOpen(true);
  };

  // Handle staff details dialog close
  const handleDetailsDialogClose = () => {
    setSelectedStaffId(null);
    setIsDetailsDialogOpen(false);
  };

  return {
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
  };
};
