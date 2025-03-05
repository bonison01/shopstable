
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { StaffMember, EditableStaffData } from "./types";

export const useStaffOperations = (refetch: () => void) => {
  const [editingStaff, setEditingStaff] = useState<EditableStaffData | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

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
  const handleDeleteStaff = async (selectedStaffIds: string[]) => {
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

      refetch();
      return true;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error deleting staff",
        description: error.message,
      });
      return false;
    }
  };

  // Handle field change
  const handleFieldChange = (field: keyof EditableStaffData, value: string) => {
    if (editingStaff) {
      setEditingStaff({ ...editingStaff, [field]: value });
    }
  };

  return {
    editingStaff,
    isUpdating,
    startEditing,
    cancelEditing,
    updateStaff,
    handleDeleteStaff,
    handleFieldChange
  };
};
