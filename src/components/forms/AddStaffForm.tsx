
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from "@/contexts/auth/useAuth";
import { Checkbox } from "@/components/ui/checkbox";

const AddStaffForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user, profile } = useAuth();
  
  const [staff, setStaff] = useState({
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Simple validation
      if (!staff.staff_email || !staff.first_name || !staff.last_name) {
        throw new Error("Please fill in all required fields");
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(staff.staff_email)) {
        throw new Error("Please enter a valid email address");
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
      if (!user?.id) {
        throw new Error("You must be logged in to add a staff member");
      }

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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="first_name">First Name *</Label>
          <Input 
            id="first_name" 
            name="first_name" 
            value={staff.first_name} 
            onChange={handleChange} 
            placeholder="John"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="last_name">Last Name *</Label>
          <Input 
            id="last_name" 
            name="last_name" 
            value={staff.last_name} 
            onChange={handleChange} 
            placeholder="Doe"
            required
          />
        </div>
        
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="staff_email">Email *</Label>
          <Input 
            id="staff_email" 
            name="staff_email"
            type="email"
            value={staff.staff_email} 
            onChange={handleChange} 
            placeholder="john.doe@example.com"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Select 
            value={staff.role} 
            onValueChange={(value) => handleSelectChange("role", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="staff">Staff</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select 
            value={staff.status} 
            onValueChange={(value) => handleSelectChange("status", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {profile?.business_name && (
          <div className="md:col-span-2 flex items-center space-x-2 pt-2">
            <Checkbox 
              id="grant_company_access" 
              checked={staff.grant_company_access}
              onCheckedChange={handleCheckboxChange}
            />
            <Label 
              htmlFor="grant_company_access" 
              className="text-sm font-normal cursor-pointer"
            >
              Grant access to {profile.business_name}
            </Label>
          </div>
        )}
      </div>
      
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => {
          if (onSuccess) onSuccess();
        }}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Adding..." : "Add Staff"}
        </Button>
      </div>
    </form>
  );
};

export default AddStaffForm;
