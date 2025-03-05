
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface StaffCompanyAccessProps {
  businessName: string | undefined;
  grantAccess: boolean;
  onAccessChange: (checked: boolean | string) => void;
}

const StaffCompanyAccess = ({
  businessName,
  grantAccess,
  onAccessChange
}: StaffCompanyAccessProps) => {
  if (!businessName) return null;
  
  return (
    <div className="flex items-center space-x-2 pt-2">
      <Checkbox 
        id="grant_company_access" 
        checked={grantAccess}
        onCheckedChange={onAccessChange}
      />
      <Label 
        htmlFor="grant_company_access" 
        className="text-sm font-normal cursor-pointer"
      >
        Grant access to {businessName}
      </Label>
    </div>
  );
};

export default StaffCompanyAccess;
