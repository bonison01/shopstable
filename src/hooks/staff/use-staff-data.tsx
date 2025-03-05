
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { StaffMember, CompanyAccess } from "./types";
import { useAuth } from "@/contexts/auth/useAuth";

export const useStaffData = () => {
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
        .select("id, business_name, owner_id, staff_id, created_at")
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
          company_access: accessRecords.length > 0 ? accessRecords as CompanyAccess[] : undefined,
        };
      });
      
      return enrichedStaffData as StaffMember[];
    },
    enabled: !!user, // Only fetch when user is authenticated
  });

  return {
    staffMembers,
    isLoading,
    refetch
  };
};
