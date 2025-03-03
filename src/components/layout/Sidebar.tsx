
import { useState } from "react";
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
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();
  const { signOut, isAdmin } = useAuth();
  
  const mainItems = [
    { name: "Dashboard", path: "/", icon: Home },
    { name: "Customers", path: "/customers", icon: Users },
    { name: "Inventory", path: "/inventory", icon: Package },
    { name: "Sales", path: "/sales", icon: ShoppingCart },
    { name: "Orders", path: "/orders", icon: ClipboardList },
    { name: "Analytics", path: "/analytics", icon: BarChart },
  ];
  
  const secondaryItems = [
    { name: "Settings", path: "/settings", icon: Settings },
    { name: "Help & Support", path: "/support", icon: LifeBuoy },
  ];

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-background transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}
    >
      <div className="flex h-16 items-center gap-2 border-b px-6">
        <div className="font-semibold text-xl text-primary">CustomerFlow</div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onClose}
          className="absolute right-2 top-3 md:hidden"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
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
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
        
        <Separator className="my-4 mx-2" />
        
        <div className="px-2">
          <p className="mb-2 px-4 text-xs font-medium text-muted-foreground">Settings</p>
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
                <span>{item.name}</span>
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
          <span>Logout</span>
        </Button>
      </div>
    </aside>
  );
}
