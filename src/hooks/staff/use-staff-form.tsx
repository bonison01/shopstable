
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/auth/useAuth";

export interface StaffFormData {
  staff_email: string;
  first_name: string;
  last_name: string;
  role: string;
  status: string;
  grant_company_access: boolean;
}

export const useStaffForm = (onSuccess?: () => void) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user, profile } = useAuth();
  
  const [staff, setStaff] = useState<StaffFormData>({
    staff_email: "",
    first_name: "",
    last_name: "",
    role: "staff",
    status: "active",
    grant_company_access: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setStaff(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setStaff(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean | string) => {
    setStaff(prev => ({ ...prev, grant_company_access: !!checked }));
  };

  const validateForm = () => {
    // Simple validation
    if (!staff.staff_email || !staff.first_name || !staff.last_name) {
      throw new Error("Please fill in all required fields");
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(staff.staff_email)) {
      throw new Error("Please enter a valid email address");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      validateForm();

      if (!user?.id) {
        throw new Error("You must be logged in to add a staff member");
      }

      // Check if email already exists
      const { data: existingStaff } = await supabase
        .from('staff')
        .select('id')
        .eq('staff_email', staff.staff_email)
        .maybeSingle();

      if (existingStaff) {
        throw new Error("A staff member with this email already exists");
      }

      // Insert to Supabase
      const { data, error } = await supabase
        .from('staff')
        .insert({
          staff_email: staff.staff_email,
          first_name: staff.first_name,
          last_name: staff.last_name,
          role: staff.role,
          status: staff.status,
          user_id: user.id
        })
        .select();

      if (error) throw error;

      // If granting company access and we have a business name
      if (staff.grant_company_access && profile?.business_name && data?.[0]?.id) {
        // Add company access record
        const { error: accessError } = await supabase
          .from('company_access')
          .insert({
            staff_id: data[0].id,
            owner_id: user.id,
            business_name: profile.business_name
          });

        if (accessError) {
          console.error("Error adding company access:", accessError);
          toast({
            variant: "destructive",
            title: "Warning",
            description: "Staff member was added but company access could not be granted",
          });
        }
      }

      toast({
        title: "Staff Added",
        description: `${staff.first_name} ${staff.last_name} has been added as ${staff.role}.`,
      });

      // Reset form
      setStaff({
        staff_email: "",
        first_name: "",
        last_name: "",
        role: "staff",
        status: "active",
        grant_company_access: true,
      });

      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || "An error occurred while adding the staff member");
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Failed to add staff member",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    staff,
    isSubmitting,
    error,
    handleChange,
    handleSelectChange,
    handleCheckboxChange,
    handleSubmit
  };
};
