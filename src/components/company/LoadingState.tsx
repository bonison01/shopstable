
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";

interface LoadingStateProps {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
  collapsed: boolean;
  toggleCollapse: () => void;
}

export const LoadingState = ({
  isOpen,
  toggle,
  close,
  collapsed,
  toggleCollapse
}: LoadingStateProps) => {
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
};
