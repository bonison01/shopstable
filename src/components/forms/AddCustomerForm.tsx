
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { formatPhoneNumber } from "@/utils/format";
import { useAuth } from "@/contexts/AuthContext";

const AddCustomerForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth(); // Get the current authenticated user
  
  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    status: "active",
    customer_type: "retail",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === "phone") {
      // Keep only numbers for the database, but format for display
      const onlyNums = value.replace(/\D/g, "");
      setCustomer(prev => ({ ...prev, [name]: onlyNums }));
    } else {
      setCustomer(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setCustomer(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!user) {
      setError("You must be logged in to add a customer");
      setIsSubmitting(false);
      return;
    }

    try {
      // Simple validation
      if (!customer.name || !customer.email) {
        throw new Error("Please fill in all required fields");
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(customer.email)) {
        throw new Error("Please enter a valid email address");
      }

      // Check if email already exists
      const { data: existingCustomer } = await supabase
        .from('customers')
        .select('id')
        .eq('email', customer.email)
        .eq('user_id', user.id) // Check only among user's own customers
        .maybeSingle();

      if (existingCustomer) {
        throw new Error("A customer with this email already exists");
      }

      // Insert to Supabase
      const { data, error } = await supabase
        .from('customers')
        .insert({
          name: customer.name,
          email: customer.email,
          phone: customer.phone || null,
          address: customer.address || null,
          status: customer.status,
          customer_type: customer.customer_type,
          user_id: user.id, // Set user_id to current authenticated user
        })
        .select();

      if (error) throw error;

      toast({
        title: "Customer Added",
        description: `${customer.name} has been added to customers.`,
      });

      // Reset form
      setCustomer({
        name: "",
        email: "",
        phone: "",
        address: "",
        status: "active",
        customer_type: "retail",
      });

      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || "An error occurred while adding the customer");
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Failed to add customer",
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
      
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => {
          if (onSuccess) onSuccess();
        }}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Adding..." : "Add Customer"}
        </Button>
      </div>
    </form>
  );
};

export default AddCustomerForm;
