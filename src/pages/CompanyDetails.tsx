
import { useParams } from "react-router-dom";
import { useAuth } from "@/contexts/auth/useAuth";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/hooks/use-sidebar";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { useCompanyDetails } from "@/hooks/company/use-company-details";
import { LoadingState } from "@/components/company/LoadingState";
import { ErrorState } from "@/components/company/ErrorState";
import { CompanyHeader } from "@/components/company/CompanyHeader";
import { CompanyStatCards } from "@/components/company/CompanyStatCards";
import { CompanyTabs } from "@/components/company/CompanyTabs";
import { useEffect } from "react";

const CompanyDetails = () => {
  const { companyId } = useParams<{ companyId: string }>();
  const { isOpen, toggle, close, collapsed, toggleCollapse } = useSidebar();
  const { staffCompanyAccess, user, signOut } = useAuth();
  
  // For debugging: Log important state values
  useEffect(() => {
    console.log("CompanyDetails rendered with:", {
      companyId,
      user: user ? "User exists" : "No user",
      staffCompanyAccess: staffCompanyAccess ? `Access list: ${staffCompanyAccess.length}` : "No access data"
    });
  }, [companyId, user, staffCompanyAccess]);

  // Check if user has access to this company
  const hasAccess = () => {
    console.log("Checking access for company:", companyId);
    console.log("Staff company access:", staffCompanyAccess);
    
    if (!staffCompanyAccess || !companyId) return false;
    
    const hasAccess = staffCompanyAccess.some(company => company.id === companyId);
    console.log("Has access:", hasAccess);
    return hasAccess;
  };

  const { company, loading, error } = useCompanyDetails(companyId, hasAccess);

  // Debug the result of useCompanyDetails
  useEffect(() => {
    console.log("Company details state:", {
      loading,
      error,
      company: company ? "Company data exists" : "No company data"
    });
  }, [company, loading, error]);

  if (loading) {
    return (
      <LoadingState
        isOpen={isOpen}
        toggle={toggle}
        close={close}
        collapsed={collapsed}
        toggleCollapse={toggleCollapse}
      />
    );
  }

  if (error || !hasAccess()) {
    return (
      <ErrorState
        isOpen={isOpen}
        toggle={toggle}
        close={close}
        collapsed={collapsed}
        toggleCollapse={toggleCollapse}
        error={error}
      />
    );
  }

  if (!company) {
    return (
      <ErrorState
        isOpen={isOpen}
        toggle={toggle}
        close={close}
        collapsed={collapsed}
        toggleCollapse={toggleCollapse}
        error="The company you're looking for doesn't exist or you don't have access to it."
        title="Company Not Found"
      />
    );
  }

  return (
    <div className="flex min-h-screen bg-muted/40">
      <Sidebar isOpen={isOpen} onClose={close} collapsed={collapsed} onToggleCollapse={toggleCollapse} />
      <div className={cn(
        "flex flex-1 flex-col transition-all duration-300 ease-in-out",
        collapsed ? "md:ml-16" : "md:ml-64"
      )}>
        <Navbar toggleSidebar={toggle} isSidebarCollapsed={collapsed} />
        <main className="flex-1 p-4 md:p-6">
          <CompanyHeader businessName={company.business_name} />
          <CompanyStatCards
            customersCount={company.customers_count}
            productsCount={company.products_count}
            ordersCount={company.orders_count}
          />
          <CompanyTabs
            businessName={company.business_name}
            owner={company.owner}
            createdAt={company.created_at}
          />
        </main>
      </div>
    </div>
  );
};

export default CompanyDetails;
