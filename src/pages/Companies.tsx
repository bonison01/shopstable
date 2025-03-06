
import { cn } from "@/lib/utils";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { useSidebar } from "@/hooks/use-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/auth/useAuth";
import { Building2, CalendarDays, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";

const Companies = () => {
  const { isOpen, toggle, close, collapsed, toggleCollapse } = useSidebar();
  const { staffCompanyAccess } = useAuth();

  if (!staffCompanyAccess || staffCompanyAccess.length === 0) {
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
              <h1 className="text-2xl font-bold tracking-tight">Shared Companies</h1>
              <p className="text-muted-foreground mt-1">
                You don't have access to any companies yet.
              </p>
            </div>
          </main>
        </div>
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
            <h1 className="text-2xl font-bold tracking-tight">Shared Companies</h1>
            <p className="text-muted-foreground mt-1">
              Companies you have access to
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {staffCompanyAccess.map((company) => (
              <Card key={company.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-lg">
                    <Building2 className="h-5 w-5 mr-2 text-primary" />
                    {company.business_name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-muted-foreground mb-4">
                    <CalendarDays className="h-4 w-4 mr-1" />
                    <span>Access granted on {format(new Date(company.created_at || ''), 'MMM d, yyyy')}</span>
                  </div>
                  <Link 
                    to={`/companies/${company.id}`}
                    className="inline-flex items-center text-sm font-medium text-primary hover:underline"
                  >
                    View company details
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Companies;
