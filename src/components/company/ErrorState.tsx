
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

interface ErrorStateProps {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
  collapsed: boolean;
  toggleCollapse: () => void;
  error: string | null;
  title?: string;
}

export const ErrorState = ({
  isOpen,
  toggle,
  close,
  collapsed,
  toggleCollapse,
  error,
  title = "Access Denied"
}: ErrorStateProps) => {
  const navigate = useNavigate();
  
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
          <Card className="w-full max-w-lg">
            <CardHeader>
              <CardTitle className="text-red-500">{title}</CardTitle>
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
};
