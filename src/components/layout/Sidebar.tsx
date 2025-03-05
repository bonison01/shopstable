
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  BarChart, 
  Users, 
  Package, 
  ShoppingCart, 
  ClipboardList, 
  ChevronLeft, 
  Home, 
  Settings, 
  LifeBuoy,
  LogOut,
  Menu,
  ChevronRight,
  Wallet
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export function Sidebar({ isOpen, onClose, collapsed, onToggleCollapse }: SidebarProps) {
  const location = useLocation();
  const { signOut, isAdmin } = useAuth();
  
  // Prevent sidebar clicks from propagating to the global click handler
  const handleSidebarClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  
  const mainItems = [
    { name: "Dashboard", path: "/", icon: Home },
    { name: "Customers", path: "/customers", icon: Users },
    { name: "Inventory", path: "/inventory", icon: Package },
    { name: "Sales", path: "/sales", icon: ShoppingCart },
    { name: "Orders", path: "/orders", icon: ClipboardList },
    { name: "Analytics", path: "/analytics", icon: BarChart },
    { name: "Cash Flow", path: "/cash-flow", icon: Wallet },
  ];
  
  const secondaryItems = [
    { name: "Settings", path: "/settings", icon: Settings },
    { name: "Help & Support", path: "/support", icon: LifeBuoy },
  ];

  return (
    <aside
      id="main-sidebar"
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex flex-col border-r bg-background transition-all duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        collapsed ? "w-16" : "w-64"
      )}
      onClick={handleSidebarClick}
    >
      <div className="flex h-16 items-center gap-2 border-b px-4">
        {!collapsed && <div className="font-semibold text-xl text-primary">CustomerFlow</div>}
        <div className="flex items-center ml-auto">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onToggleCollapse}
            className="md:flex hidden"
          >
            {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="md:hidden"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      <ScrollArea className="flex-1 py-4">
        <nav className="flex flex-col gap-2 px-2">
          {mainItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => onClose()}
              className={cn(
                "group flex items-center gap-3 rounded-md px-3 py-2 hover:bg-accent transition-colors",
                location.pathname === item.path && "bg-accent font-medium text-accent-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          ))}
        </nav>
        
        <Separator className="my-4 mx-2" />
        
        <div className="px-2">
          {!collapsed && <p className="mb-2 px-4 text-xs font-medium text-muted-foreground">Settings</p>}
          <nav className="flex flex-col gap-2">
            {secondaryItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => onClose()}
                className={cn(
                  "group flex items-center gap-3 rounded-md px-3 py-2 hover:bg-accent transition-colors",
                  location.pathname === item.path && "bg-accent font-medium text-accent-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            ))}
          </nav>
        </div>
      </ScrollArea>
      
      <div className="mt-auto border-t p-4">
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-2"
          onClick={() => signOut()}
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && <span>Logout</span>}
        </Button>
      </div>
    </aside>
  );
}
