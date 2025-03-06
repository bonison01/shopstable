
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

// Types
interface CompanyData {
  id: string;
  business_name: string;
  created_at: string;
  owner: {
    first_name: string;
    last_name: string;
    email: string;
  };
  customers_count: number;
  products_count: number;
  orders_count: number;
}

interface OwnerData {
  first_name: string;
  last_name: string;
  email: string;
}

export const useCompanyDetails = (companyId: string | undefined, hasAccess: () => boolean) => {
  const [company, setCompany] = useState<CompanyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      if (!companyId) {
        console.log("No company ID provided");
        setLoading(false);
        setError("No company ID provided");
        return;
      }
      
      // Verify access
      if (!hasAccess()) {
        console.log("No access to this company");
        setError("You don't have access to this company");
        setLoading(false);
        return;
      }

      try {
        console.log("Fetching company details for ID:", companyId);
        setLoading(true);
        
        // First, fetch basic company details
        const { data: companyData, error: companyError } = await supabase
          .from('profiles')
          .select(`
            id,
            business_name,
            created_at
          `)
          .eq('id', companyId)
          .single();

        if (companyError) {
          console.error("Error fetching company data:", companyError);
          throw companyError;
        }
        
        if (!companyData) {
          console.error("No company data found");
          throw new Error("Company not found");
        }
        
        console.log("Fetched company data:", companyData);
        
        // Then, fetch owner details separately
        const { data: ownerData, error: ownerError } = await supabase
          .from('profiles')
          .select(`
            first_name,
            last_name,
            email
          `)
          .eq('id', companyId)
          .single();
          
        // Initialize the owner data with fallback if there's an error
        let finalOwnerData: OwnerData;
        if (ownerError || !ownerData) {
          console.error("Error fetching owner data:", ownerError);
          finalOwnerData = {
            first_name: "Unknown",
            last_name: "Owner",
            email: "unknown@example.com"
          };
        } else {
          finalOwnerData = ownerData;
        }
        
        // Get count statistics with proper error handling
        let customersCount = 0;
        let productsCount = 0;
        let ordersCount = 0;
        
        try {
          const { count } = await supabase
            .from('customers')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', companyId);
          
          customersCount = count || 0;
        } catch (err) {
          console.error("Error fetching customers count:", err);
        }
        
        try {
          const { count } = await supabase
            .from('products')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', companyId);
          
          productsCount = count || 0;
        } catch (err) {
          console.error("Error fetching products count:", err);
        }
        
        try {
          const { count } = await supabase
            .from('orders')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', companyId);
          
          ordersCount = count || 0;
        } catch (err) {
          console.error("Error fetching orders count:", err);
        }

        const companyWithDetails: CompanyData = {
          ...companyData,
          owner: finalOwnerData,
          customers_count: customersCount,
          products_count: productsCount,
          orders_count: ordersCount
        };

        console.log("Company data with counts:", companyWithDetails);
        setCompany(companyWithDetails);
        setError(null);
      } catch (error: any) {
        console.error("Error fetching company details:", error);
        setError(error.message || "An error occurred while fetching company details");
        setCompany(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyDetails();
  }, [companyId, hasAccess]);

  return { company, loading, error };
};
