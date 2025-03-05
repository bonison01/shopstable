
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface StaffPersonalInfoProps {
  firstName: string;
  lastName: string;
  email: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const StaffPersonalInfo = ({
  firstName,
  lastName,
  email,
  handleChange
}: StaffPersonalInfoProps) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="first_name">First Name *</Label>
          <Input 
            id="first_name" 
            name="first_name" 
            value={firstName} 
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
            value={lastName} 
            onChange={handleChange} 
            placeholder="Doe"
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="staff_email">Email *</Label>
        <Input 
          id="staff_email" 
          name="staff_email"
          type="email"
          value={email} 
          onChange={handleChange} 
          placeholder="john.doe@example.com"
          required
        />
      </div>
    </>
  );
};

export default StaffPersonalInfo;
