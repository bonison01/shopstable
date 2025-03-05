import { useState } from "react";
import { useSidebar } from "@/hooks/use-sidebar";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "@/components/layout/ModeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  BarChart3,
  ChevronDown,
  ChevronsUpDown,
  LayoutDashboard,
  ListChecks,
  LogOut,
  LucideIcon,
  Settings,
  ShoppingBag,
  Users,
} from 'lucide-react';

interface NavItemProps {
  name: string;
  href: string;
  icon: LucideIcon;
}

const navigationLinks = [
  {
    name: 'Dashboard',
    href: '/',
    icon: <LayoutDashboard size={18} />,
  },
  {
    name: 'Orders',
    href: '/orders',
    icon: <ListChecks size={18} />,
  },
  {
    name: 'Customers',
    href: '/customers',
    icon: <ChevronsUpDown size={18} />,
  },
  {
    name: 'Inventory',
    href: '/inventory',
    icon: <ShoppingBag size={18} />,
  },
  {
    name: 'Sales',
    href: '/sales',
    icon: <BarChart3 size={18} />,
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: <BarChart3 size={18} />,
  },
  {
    name: 'Cash Flow',
    href: '/cash-flow',
    icon: <BarChart3 size={18} />,
  },
  {
    name: 'Staff',
    href: '/staff',
    icon: <Users size={18} />,
  },
];

export function Sidebar({ isOpen, onClose, collapsed, onToggleCollapse }: { isOpen: boolean, onClose: () => void, collapsed: boolean, onToggleCollapse: () => void }) {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetTrigger asChild>
          <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border bg-popover text-popover-foreground hover:bg-secondary h-10 px-4 py-2 md:hidden">Open Menu</button>
        </SheetTrigger>
        <SheetContent className="w-full sm:max-w-xs">
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
            <SheetDescription>
              Manage your account preferences, reports, and more.
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-4">
            <div className="flex items-center space-x-2">
              <Avatar>
                <AvatarImage src={`https://avatar.vercel.sh/${user?.email}.png`} />
                <AvatarFallback>{profile?.first_name?.[0]}{profile?.last_name?.[0]}</AvatarFallback>
              </Avatar>
              <p className="font-medium">{profile?.first_name} {profile?.last_name}</p>
            </div>
            <Separator />
            <Accordion type="single" collapsible>
              <AccordionItem value="links">
                <AccordionTrigger className="text-left">
                  Navigation Links
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid gap-2">
                    {navigationLinks.map((link) => (
                      <a key={link.name} href={link.href} className="flex items-center space-x-2 rounded-md p-2 hover:bg-secondary">
                        {link.icon}
                        <span>{link.name}</span>
                      </a>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="reports">
                <AccordionTrigger className="text-left">
                  Reports
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid gap-2">
                    <a href="#" className="flex items-center space-x-2 rounded-md p-2 hover:bg-secondary">
                      <BarChart3 size={18} />
                      <span>Sales Report</span>
                    </a>
                    <a href="#" className="flex items-center space-x-2 rounded-md p-2 hover:bg-secondary">
                      <BarChart3 size={18} />
                      <span>Inventory Report</span>
                    </a>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <Separator />
            <ModeToggle />
          </div>
        </SheetContent>
      </Sheet>

      <div className={`hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-gray-50 border-r dark:bg-gray-800 dark:border-gray-700 transition-transform duration-300 ease-in-out ${collapsed ? '-translate-x-56' : 'translate-x-0'}`}>
        <div className="flex items-center justify-between h-16 px-4 border-b dark:border-gray-700">
          <span className="text-lg font-semibold">CustomerFlow</span>
          <button onClick={onToggleCollapse} className="p-2 text-gray-500 hover:bg-gray-200 rounded-md dark:text-gray-400 dark:hover:bg-gray-700">
            {collapsed ? <ArrowLeft size={16} /> : <ChevronsUpDown size={16} />}
          </button>
        </div>
        <div className="flex flex-col flex-grow p-4">
          <nav className="flex-1 space-y-1">
            {navigationLinks.map((link) => (
              <a key={link.name} href={link.href} className="flex items-center space-x-2 rounded-md p-2 hover:bg-gray-200 dark:hover:bg-gray-700">
                {link.icon}
                <span className={`${collapsed ? 'hidden' : 'block'}`}>{link.name}</span>
              </a>
            ))}
          </nav>
        </div>
        <div className="flex items-center justify-between p-4 border-t dark:border-gray-700">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={`https://avatar.vercel.sh/${user?.email}.png`} alt={user?.email || "Avatar"} />
                  <AvatarFallback>{profile?.first_name?.[0]}{profile?.last_name?.[0]}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuHeader className="font-normal">
                <div className="flex flex-col space-y-1.5 p-2">
                  <p className="text-sm font-medium leading-none">{profile?.first_name} {profile?.last_name}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuHeader>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                Settings
                <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                Log out
                <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <ModeToggle />
        </div>
      </div>
    </>
  );
}
