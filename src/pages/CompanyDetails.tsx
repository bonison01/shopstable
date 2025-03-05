
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { useSidebar } from "@/hooks/use-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Building2, Users, Boxes, CreditCard, Calendar } from "lucide-react";
import { format } from "date-fns";

const CompanyDetails = () => {
  const { companyId } = useParams<{ companyId: string }>();
  const { isOpen, toggle, close, collapsed, toggleCollapse } = useSidebar();

  // Fetch company details
  const { data: company, isLoading: companyLoading } = useQuery({
    queryKey: ["company-details", companyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("company_access")
        .select("*")
        .eq("id", companyId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!companyId
  });

  // Fetch owner profile
  const { data: owner, isLoading: ownerLoading } = useQuery({
    queryKey: ["company-owner", company?.owner_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", company?.owner_id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!company?.owner_id
  });

  // Fetch company stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["company-stats", company?.owner_id],
    queryFn: async () => {
      const [customers, products, orders] = await Promise.all([
        supabase
          .from("customers")
          .select("count")
          .eq("user_id", company?.owner_id)
          .single(),
        supabase
          .from("products")
          .select("count")
          .eq("user_id", company?.owner_id)
          .single(),
        supabase
          .from("orders")
          .select("count, created_at")
          .eq("user_id", company?.owner_id)
          .order("created_at", { ascending: false })
          .limit(1)
      ]);

      const latestOrderDate = orders.data && orders.data.length > 0 
        ? orders.data[0].created_at 
        : null;

      return {
        customers: customers.data?.count || 0,
        products: products.data?.count || 0,
        orders: orders.data?.count || 0,
        latestOrderDate
      };
    },
    enabled: !!company?.owner_id
  });

  const isLoading = companyLoading || ownerLoading || statsLoading;

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-muted/40">
      <Sidebar 
        isOpen={isOpen} 
        onClose={close} 
        collapsed={collapsed}
        onToggleCollapse={toggleCollapse}
      />
      
      <div className={cn(
        "flex flex-1 flex-col transition-all duration-300 ease-in-out",
        collapsed ? "md:ml-16" : "md:ml-64"
      )}>
        <Navbar 
          toggleSidebar={toggle} 
          isSidebarCollapsed={collapsed}
        />
        
        <main className="flex-1 p-4 md:p-6">
          <div className="mb-6">
            <div className="flex items-center space-x-2">
              <Building2 className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold tracking-tight">{company?.business_name}</h1>
            </div>
            <p className="text-muted-foreground mt-1">
              Company details and overview
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Users className="h-4 w-4 mr-2 text-blue-500" /> 
                  Customers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.customers}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Boxes className="h-4 w-4 mr-2 text-orange-500" /> 
                  Products
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.products}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <CreditCard className="h-4 w-4 mr-2 text-green-500" /> 
                  Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.orders}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-purple-500" /> 
                  Latest Order
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold">
                  {stats?.latestOrderDate 
                    ? format(new Date(stats.latestOrderDate), 'MMM d, yyyy')
                    : 'No orders yet'}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Company Name</h3>
                  <p className="mt-1">{company?.business_name}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Access Granted</h3>
                  <p className="mt-1">{company?.created_at ? format(new Date(company.created_at), 'MMMM d, yyyy') : 'Unknown'}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Owner Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Owner Name</h3>
                  <p className="mt-1">{owner?.first_name} {owner?.last_name}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                  <p className="mt-1">{owner?.email}</p>
                </div>
                
                {owner?.phone && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Phone</h3>
                    <p className="mt-1">{owner?.phone}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CompanyDetails;
