
import { cn } from "@/lib/utils";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { useSidebar } from "@/hooks/use-sidebar";
import { BusinessSettings } from "@/components/settings/BusinessSettings";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

const Settings = () => {
  const { isOpen, toggle, close, collapsed, toggleCollapse } = useSidebar();
  const { isLoading } = useAuth();

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
            <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground">
              Manage your account and business settings
            </p>
          </div>
          
          <div className="space-y-6">
            <BusinessSettings />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;
