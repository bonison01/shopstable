
import { useState } from "react";
import { StaffMember } from "./types";

export const useStaffSelection = (staffMembers: StaffMember[] | undefined) => {
  const [selectedStaffIds, setSelectedStaffIds] = useState<string[]>([]);
  
  // Handle staff selection
  const toggleStaffSelection = (staffId: string) => {
    setSelectedStaffIds((prev) =>
      prev.includes(staffId)
        ? prev.filter((id) => id !== staffId)
        : [...prev, staffId]
    );
  };

  // Handle select all staff
  const toggleSelectAll = () => {
    if (selectedStaffIds.length === staffMembers?.length) {
      setSelectedStaffIds([]);
    } else {
      setSelectedStaffIds(staffMembers?.map((staff) => staff.id) || []);
    }
  };

  return {
    selectedStaffIds,
    setSelectedStaffIds,
    toggleStaffSelection,
    toggleSelectAll
  };
};
