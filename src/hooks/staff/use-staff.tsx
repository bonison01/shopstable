
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { StaffMember, EditableStaffData } from "./types";
import { useAuth } from "@/contexts/auth/useAuth";

export const useStaff = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStaffIds, setSelectedStaffIds] = useState<string[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<EditableStaffData | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch staff data
  const { data: staffMembers, isLoading, refetch } = useQuery({
    queryKey: ["staff"],
    queryFn: async () => {
      // First get staff members
      const { data: staffData, error } = await supabase
        .from("staff")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching staff",
          description: error.message,
        });
        throw error;
      }

      // Get company access for staff members
      const staffIds = staffData.map(staff => staff.id);
      
      if (staffIds.length === 0) {
        return staffData as StaffMember[];
      }

      const { data: companyAccessData, error: companyError } = await supabase
        .from("company_access")
        .select("*")
        .in("staff_id", staffIds);

      if (companyError) {
        console.error("Error fetching company access:", companyError);
      }

      // Merge staff with company access
      const enrichedStaffData = staffData.map(staff => {
        const accessRecords = companyAccessData?.filter(
          access => access.staff_id === staff.id
        ) || [];
        
        return {
          ...staff,
          company_access: accessRecords.length > 0 ? accessRecords : undefined,
        };
      });
      
      return enrichedStaffData as StaffMember[];
    },
    enabled: !!user, // Only fetch when user is authenticated
  });

  // Filter staff based on search query
  const filteredStaff = staffMembers?.filter((staff) =>
    staff.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    staff.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    staff.staff_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    staff.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
    if (selectedStaffIds.length === filteredStaff?.length) {
      setSelectedStaffIds([]);
    } else {
      setSelectedStaffIds(filteredStaff?.map((staff) => staff.id) || []);
    }
  };

  // Start editing staff
  const startEditing = (staff: StaffMember) => {
    setEditingStaff({
      id: staff.id,
      staff_email: staff.staff_email,
      first_name: staff.first_name,
      last_name: staff.last_name,
      role: staff.role,
      status: staff.status
    });
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingStaff(null);
  };

  // Update staff
  const updateStaff = async () => {
    if (!editingStaff) return;
    
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from("staff")
        .update({
          first_name: editingStaff.first_name,
          last_name: editingStaff.last_name,
          role: editingStaff.role,
          status: editingStaff.status
        })
        .eq("id", editingStaff.id);

      if (error) throw error;

      toast({
        title: "Staff updated",
        description: "Staff member has been updated successfully",
      });

      setEditingStaff(null);
      refetch();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error updating staff",
        description: error.message,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle staff deletion
  const handleDeleteStaff = async () => {
    try {
      // First, delete related company access records
      for (const staffId of selectedStaffIds) {
        const { error: accessError } = await supabase
          .from("company_access")
          .delete()
          .eq("staff_id", staffId);
          
        if (accessError) {
          console.error("Error deleting company access:", accessError);
        }
      }
      
      // Then delete staff records
      const { error } = await supabase
        .from("staff")
        .delete()
        .in("id", selectedStaffIds);

      if (error) throw error;

      toast({
        title: "Staff deleted",
        description: `Successfully deleted ${selectedStaffIds.length} staff member(s)`,
      });

      setSelectedStaffIds([]);
      setIsDeleteDialogOpen(false);
      refetch();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error deleting staff",
        description: error.message,
      });
    }
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

  // Handle field change
  const handleFieldChange = (field: keyof EditableStaffData, value: string) => {
    if (editingStaff) {
      setEditingStaff({ ...editingStaff, [field]: value });
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
    handleDeleteStaff,
    openStaffDetails,
    handleDetailsDialogClose,
    startEditing,
    cancelEditing,
    updateStaff,
    handleFieldChange
  };
};
