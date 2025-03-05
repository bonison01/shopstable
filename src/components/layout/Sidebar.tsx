import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { X, Home, CreditCard, Users, Package, LineChart, BarChart3, DollarSign, Settings, Users2 } from "lucide-react";
import { useAuth } from "@/contexts/auth/useAuth";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  collapsed: boolean;
  active?: boolean;
}

export function Sidebar({ isOpen, onClose, collapsed, onToggleCollapse }: SidebarProps) {
  const location = useLocation();
  const { profile } = useAuth();
  
  const NavItem = ({ icon, label, href, collapsed, active }: NavItemProps) => (
    <Link to={href} className="w-full">
      <Button
        variant="ghost"
        className={cn(
          "flex w-full items-center justify-start gap-3 rounded-md px-3 py-2",
          "hover:bg-muted",
          "transition-colors",
          active ? "bg-muted" : "",
          collapsed ? "justify-center px-2" : ""
        )}
      >
        {icon}
        {!collapsed && <span>{label}</span>}
      </Button>
    </Link>
  );

  const navigation = [
    { icon: <Home size={20} />, label: "Dashboard", href: "/" },
    { icon: <CreditCard size={20} />, label: "Orders", href: "/orders" },
    { icon: <Users size={20} />, label: "Customers", href: "/customers" },
    { icon: <Package size={20} />, label: "Inventory", href: "/inventory" },
    { icon: <LineChart size={20} />, label: "Sales", href: "/sales" },
    { icon: <BarChart3 size={20} />, label: "Analytics", href: "/analytics" },
    { icon: <DollarSign size={20} />, label: "Cash Flow", href: "/cash-flow" },
    { icon: <Users2 size={20} />, label: "Staff", href: "/staff" },
    { icon: <Settings size={20} />, label: "Settings", href: "/settings" },
  ];

  const sidebarContent = (
    <div className="flex h-full flex-col px-2 py-4">
      <div className="mb-10 flex items-center justify-between border-b pb-4">
        {!collapsed && (
          <div>
            <h2 className="text-lg font-bold">CustomerFlow</h2>
            {profile?.business_name && (
              <p className="text-sm text-muted-foreground">{profile.business_name}</p>
            )}
          </div>
        )}
        {!collapsed && (
          <Button variant="ghost" size="icon" className="md:hidden" onClick={onClose}>
            <X size={20} />
          </Button>
        )}
      </div>

      <div className="space-y-1">
        {navigation.map((item, index) => (
          <NavItem
            key={index}
            icon={item.icon}
            label={item.label}
            href={item.href}
            collapsed={collapsed}
            active={location.pathname === item.href}
          />
        ))}
      </div>

      <div className="mt-auto space-y-1">
        <Button
          variant="ghost"
          className={cn(
            "flex w-full items-center justify-start gap-3 rounded-md px-3 py-2",
            "hover:bg-muted",
            "transition-colors",
            collapsed ? "justify-center px-2" : ""
          )}
          onClick={onToggleCollapse}
        >
          {collapsed ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-panel-right-close"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
              <path d="M15 3v18" />
              <path d="m8 9 3 3-3 3" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-panel-right-open"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
              <path d="M15 3v18" />
              <path d="m10 15-3-3 3-3" />
            </svg>
          )}
          {!collapsed && <span>Collapse</span>}
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Sidebar (Sheet) */}
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="left" className="p-0">
          {sidebarContent}
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-20 hidden flex-col border-r bg-background md:flex",
          collapsed ? "w-16" : "w-64"
        )}
      >
        {sidebarContent}
      </div>
    </>
  );
}
