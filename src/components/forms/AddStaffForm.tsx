
import { useStaffForm } from "@/hooks/staff/use-staff-form";
import { useAuth } from "@/contexts/auth/useAuth";
import StaffFormError from "./StaffForm/StaffFormError";
import StaffPersonalInfo from "./StaffForm/StaffPersonalInfo";
import StaffRoleSettings from "./StaffForm/StaffRoleSettings";
import StaffCompanyAccess from "./StaffForm/StaffCompanyAccess";
import StaffFormActions from "./StaffForm/StaffFormActions";

const AddStaffForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const { profile } = useAuth();
  const {
    staff,
    isSubmitting,
    error,
    handleChange,
    handleSelectChange,
    handleCheckboxChange,
    handleSubmit
  } = useStaffForm(onSuccess);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <StaffFormError error={error} />
      
      <StaffPersonalInfo
        firstName={staff.first_name}
        lastName={staff.last_name}
        email={staff.staff_email}
        handleChange={handleChange}
      />
      
      <StaffRoleSettings
        role={staff.role}
        status={staff.status}
        onRoleChange={(value) => handleSelectChange("role", value)}
        onStatusChange={(value) => handleSelectChange("status", value)}
      />
      
      <StaffCompanyAccess
        businessName={profile?.business_name}
        grantAccess={staff.grant_company_access}
        onAccessChange={handleCheckboxChange}
      />
      
      <StaffFormActions 
        isSubmitting={isSubmitting}
        onCancel={() => {
          if (onSuccess) onSuccess();
        }}
      />
    </form>
  );
};

export default AddStaffForm;
