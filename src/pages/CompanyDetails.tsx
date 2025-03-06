
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/auth/useAuth";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/hooks/use-sidebar";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Building2, Users, Package2, FileText } from "lucide-react";

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

const CompanyDetails = () => {
  const { companyId } = useParams<{ companyId: string }>();
  const { isOpen, toggle, close, collapsed, toggleCollapse } = useSidebar();
  const { staffCompanyAccess, user } = useAuth();
  const [company, setCompany] = useState<CompanyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Check if user has access to this company
  const hasAccess = () => {
    console.log("Checking access for company:", companyId);
    console.log("Staff company access:", staffCompanyAccess);
    
    if (!staffCompanyAccess || !companyId) return false;
    
    const hasAccess = staffCompanyAccess.some(company => company.id === companyId);
    console.log("Has access:", hasAccess);
    return hasAccess;
  };

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      if (!companyId) return;
      
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
        
        // Get company details and owner info
        const { data, error } = await supabase
          .from('profiles')
          .select(`
            id,
            business_name,
            created_at,
            owner:id (
              first_name,
              last_name,
              email
            )
          `)
          .eq('id', companyId)
          .single();

        if (error) throw error;
        
        console.log("Fetched company data:", data);
        
        // Get count statistics
        const [customersResult, productsResult, ordersResult] = await Promise.all([
          supabase.from('customers').select('id', { count: 'exact' }).eq('company_id', companyId),
          supabase.from('products').select('id', { count: 'exact' }).eq('company_id', companyId),
          supabase.from('orders').select('id', { count: 'exact' }).eq('company_id', companyId)
        ]);

        const companyData: CompanyData = {
          ...data,
          customers_count: customersResult.count || 0,
          products_count: productsResult.count || 0,
          orders_count: ordersResult.count || 0
        };

        console.log("Company data with counts:", companyData);
        setCompany(companyData);
      } catch (error: any) {
        console.error("Error fetching company details:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyDetails();
  }, [companyId, staffCompanyAccess]);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-muted/40">
        <Sidebar isOpen={isOpen} onClose={close} collapsed={collapsed} onToggleCollapse={toggleCollapse} />
        <div className={cn(
          "flex flex-1 flex-col transition-all duration-300 ease-in-out",
          collapsed ? "md:ml-16" : "md:ml-64"
        )}>
          <Navbar toggleSidebar={toggle} isSidebarCollapsed={collapsed} />
          <main className="flex items-center justify-center flex-1 p-4 md:p-6">
            <div className="text-center">
              <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-primary" />
              <p>Loading company details...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error || !hasAccess()) {
    return (
      <div className="flex min-h-screen bg-muted/40">
        <Sidebar isOpen={isOpen} onClose={close} collapsed={collapsed} onToggleCollapse={toggleCollapse} />
        <div className={cn(
          "flex flex-1 flex-col transition-all duration-300 ease-in-out",
          collapsed ? "md:ml-16" : "md:ml-64"
        )}>
          <Navbar toggleSidebar={toggle} isSidebarCollapsed={collapsed} />
          <main className="flex items-center justify-center flex-1 p-4 md:p-6">
            <Card className="w-full max-w-lg">
              <CardHeader>
                <CardTitle className="text-red-500">Access Denied</CardTitle>
                <CardDescription>
                  {error || "You don't have access to this company"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <button 
                  onClick={() => navigate('/companies')}
                  className="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-primary/90"
                >
                  Return to Companies List
                </button>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="flex min-h-screen bg-muted/40">
        <Sidebar isOpen={isOpen} onClose={close} collapsed={collapsed} onToggleCollapse={toggleCollapse} />
        <div className={cn(
          "flex flex-1 flex-col transition-all duration-300 ease-in-out",
          collapsed ? "md:ml-16" : "md:ml-64"
        )}>
          <Navbar toggleSidebar={toggle} isSidebarCollapsed={collapsed} />
          <main className="flex items-center justify-center flex-1 p-4 md:p-6">
            <Card className="w-full max-w-lg">
              <CardHeader>
                <CardTitle>Company Not Found</CardTitle>
                <CardDescription>
                  The company you're looking for doesn't exist or you don't have access to it.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <button 
                  onClick={() => navigate('/companies')}
                  className="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-primary/90"
                >
                  Return to Companies List
                </button>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
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
          <div className="mb-6">
            <div className="flex items-center gap-2">
              <Building2 className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold tracking-tight">{company.business_name}</h1>
            </div>
            <p className="text-muted-foreground mt-1">
              Company dashboard and statistics
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Customers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-muted-foreground mr-2" />
                  <span className="text-2xl font-bold">{company.customers_count}</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Package2 className="h-5 w-5 text-muted-foreground mr-2" />
                  <span className="text-2xl font-bold">{company.products_count}</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-muted-foreground mr-2" />
                  <span className="text-2xl font-bold">{company.orders_count}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="customers">Customers</TabsTrigger>
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <Card>
                <CardHeader>
                  <CardTitle>Company Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium">Business Name</p>
                      <p className="text-lg">{company.business_name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Owner</p>
                      <p className="text-lg">{company.owner.first_name} {company.owner.last_name}</p>
                      <p className="text-sm text-muted-foreground">{company.owner.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Company Created</p>
                      <p className="text-lg">{new Date(company.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="customers">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Management</CardTitle>
                  <CardDescription>View and manage company customers</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Customer management coming soon...</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="products">
              <Card>
                <CardHeader>
                  <CardTitle>Product Inventory</CardTitle>
                  <CardDescription>View and manage company products</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Product management coming soon...</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle>Order Management</CardTitle>
                  <CardDescription>View and manage company orders</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Order management coming soon...</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default CompanyDetails;
