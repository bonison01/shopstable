
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatPhoneNumber } from "@/utils/format";

interface CustomerFormFieldsProps {
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    status: string;
    customer_type: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
}

const CustomerFormFields = ({ 
  customer, 
  handleChange, 
  handleSelectChange 
}: CustomerFormFieldsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name *</Label>
        <Input 
          id="name" 
          name="name" 
          value={customer.name} 
          onChange={handleChange} 
          placeholder="John Doe"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <Input 
          id="email" 
          name="email"
          type="email"
          value={customer.email} 
          onChange={handleChange} 
          placeholder="john.doe@example.com"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input 
          id="phone" 
          name="phone" 
          value={formatPhoneNumber(customer.phone)} 
          onChange={handleChange} 
          placeholder="(123) 456-7890"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select 
          value={customer.status} 
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
      
      <div className="space-y-2">
        <Label htmlFor="customer_type">Customer Type</Label>
        <Select 
          value={customer.customer_type} 
          onValueChange={(value) => handleSelectChange("customer_type", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select customer type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="retail">Retail</SelectItem>
            <SelectItem value="wholesale">Wholesale</SelectItem>
            <SelectItem value="trainer">Trainer</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="address">Address</Label>
        <Textarea 
          id="address" 
          name="address" 
          value={customer.address} 
          onChange={handleChange} 
          placeholder="Enter full address"
          rows={3}
        />
      </div>
    </div>
  );
};

export default CustomerFormFields;
