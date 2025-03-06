import { Menu, BellDot, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ModeToggle } from "./ModeToggle";
import { useAuth } from "@/contexts/auth/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";

interface NavbarProps {
  toggleSidebar: () => void;
  isSidebarCollapsed: boolean;
}

export function Navbar({ toggleSidebar, isSidebarCollapsed }: NavbarProps) {
  const { user, profile, signOut, staffCompanyAccess } = useAuth();
  const navigate = useNavigate();
  
  // Get user initials for avatar
  const getInitials = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase();
    }
    return user?.email?.substring(0, 2).toUpperCase() || "U";
  };

  const handleSignOut = async () => {
    try {
      console.log("Signing out user...");
      await signOut();
      console.log("User signed out successfully");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="mr-2 md:hidden">
          <Menu className="h-5 w-5" />
        </Button>

        <div className={cn("mr-4 flex items-center", isSidebarCollapsed ? "md:ml-0" : "md:hidden")}>
          <span className="font-bold">CustomerFlow</span>
          {profile?.business_name && (
            <span className="ml-2 text-sm text-muted-foreground">
              | {profile.business_name}
            </span>
          )}
        </div>
      </div>

      <div className="relative hidden flex-1 md:flex">
        <Input
          type="search"
          placeholder="Search..."
          className="w-full max-w-[500px] pl-9"
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="absolute left-3 top-1/2 -translate-y-1/2 transform text-muted-foreground"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      </div>

      <div className="flex items-center gap-2">
        {(profile?.role === 'admin' || profile?.role === 'staff') && staffCompanyAccess && staffCompanyAccess.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Building2 className="h-4 w-4" />
                <span className="hidden sm:inline">Companies</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Available Companies</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                {staffCompanyAccess.map((company) => (
                  <DropdownMenuItem 
                    key={company.id}
                    onClick={() => navigate(`/companies/${company.id}`)}
                  >
                    {company.business_name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        <Button variant="ghost" size="icon" aria-label="Notifications">
          <BellDot className="h-5 w-5" />
        </Button>

        <ModeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarImage src="" alt={profile?.first_name || user?.email} />
                <AvatarFallback>{getInitials()}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {profile?.first_name ? `${profile.first_name} ${profile.last_name}` : "User"}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email}
                </p>
                {profile?.business_name && (
                  <p className="text-xs font-medium text-muted-foreground">
                    {profile.business_name}
                  </p>
                )}
                {profile?.role && (
                  <p className="text-xs font-medium text-primary">
                    Role: {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
                  </p>
                )}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/settings")}>
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
