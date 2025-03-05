
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Customer } from "@/pages/Customers";
import { useAuth } from "@/contexts/AuthContext";

export const useCustomers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth(); // Get the current authenticated user

  // Fetch customers data
  const { data: customers, isLoading, refetch } = useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching customers",
          description: error.message,
        });
        throw error;
      }

      return data as Customer[];
    },
    enabled: !!user, // Only run query when user is authenticated
  });

  // Filter customers based on search query
  const filteredCustomers = customers?.filter((customer) =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.phone?.includes(searchQuery)
  );

  // Handle customer selection
  const toggleCustomerSelection = (customerId: string) => {
    setSelectedCustomers((prev) =>
      prev.includes(customerId)
        ? prev.filter((id) => id !== customerId)
        : [...prev, customerId]
    );
  };

  // Handle select all customers
  const toggleSelectAll = () => {
    if (selectedCustomers.length === filteredCustomers?.length) {
      setSelectedCustomers([]);
    } else {
      setSelectedCustomers(filteredCustomers?.map((customer) => customer.id) || []);
    }
  };

  // Handle customer deletion
  const handleDeleteCustomers = async () => {
    try {
      const { error } = await supabase
        .from("customers")
        .delete()
        .in("id", selectedCustomers);

      if (error) throw error;

      toast({
        title: "Customers deleted",
        description: `Successfully deleted ${selectedCustomers.length} customer(s)`,
      });

      setSelectedCustomers([]);
      setIsDeleteDialogOpen(false);
      refetch();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error deleting customers",
        description: error.message,
      });
    }
  };

  // Open customer details dialog
  const openCustomerDetails = (customerId: string) => {
    setSelectedCustomerId(customerId);
    setIsDetailsDialogOpen(true);
  };

  // Handle customer details dialog close
  const handleDetailsDialogClose = () => {
    setSelectedCustomerId(null);
    setIsDetailsDialogOpen(false);
  };

  return {
    customers: filteredCustomers,
    isLoading,
    searchQuery,
    setSearchQuery,
    selectedCustomers,
    setSelectedCustomers,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    selectedCustomerId,
    isDetailsDialogOpen,
    refetch,
    toggleCustomerSelection,
    toggleSelectAll,
    handleDeleteCustomers,
    openCustomerDetails,
    handleDetailsDialogClose,
  };
};
