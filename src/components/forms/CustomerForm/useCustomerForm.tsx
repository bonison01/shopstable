
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/auth/useAuth";

export const useCustomerForm = (onSuccess?: () => void) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  
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

  const validateCustomer = () => {
    if (!user) {
      return "You must be logged in to add a customer";
    }
    
    if (!customer.name || !customer.email) {
      return "Please fill in all required fields";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customer.email)) {
      return "Please enter a valid email address";
    }
    
    return null;
  };

  const saveCustomer = async () => {
    try {
      // Check if email already exists for this user
      // We're now only checking for duplicates with the same user_id
      const { data: existingCustomer } = await supabase
        .from('customers')
        .select('id')
        .eq('email', customer.email)
        .eq('user_id', user!.id) // Check only among user's own customers
        .maybeSingle();

      if (existingCustomer) {
        throw new Error("A customer with this email already exists in your account");
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
          user_id: user!.id, // Set user_id to current authenticated user
        })
        .select();

      if (error) throw error;
      
      return data;
    } catch (error) {
      throw error;
    }
  };

  const resetForm = () => {
    setCustomer({
      name: "",
      email: "",
      phone: "",
      address: "",
      status: "active",
      customer_type: "retail",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const validationError = validateCustomer();
    if (validationError) {
      setError(validationError);
      setIsSubmitting(false);
      return;
    }

    try {
      await saveCustomer();

      toast({
        title: "Customer Added",
        description: `${customer.name} has been added to customers.`,
      });

      resetForm();
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

  return {
    customer,
    isSubmitting,
    error,
    handleChange,
    handleSelectChange,
    handleSubmit,
    resetForm
  };
};
