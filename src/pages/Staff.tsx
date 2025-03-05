
import { cn } from "@/lib/utils";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { useSidebar } from "@/hooks/use-sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useStaff } from "@/hooks/staff/use-staff";
import { StaffHeader } from "@/components/staff/StaffHeader";
import { StaffToolbar } from "@/components/staff/StaffToolbar";
import { StaffList } from "@/components/staff/StaffList";
import { DeleteStaffDialog } from "@/components/staff/DeleteStaffDialog";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Staff = () => {
  const { isOpen, toggle, close, collapsed, toggleCollapse } = useSidebar();
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [authLoading, user, navigate]);

  const {
    staffMembers,
    isLoading,
    searchQuery,
    setSearchQuery,
    selectedStaffIds,
    setSelectedStaffIds,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isAddDialogOpen,
    setIsAddDialogOpen,
    refetch,
    toggleStaffSelection,
    toggleSelectAll,
    handleDeleteStaff,
    openStaffDetails,
    startEditing
  } = useStaff();

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
          <StaffHeader 
            addDialogOpen={isAddDialogOpen}
            setAddDialogOpen={setIsAddDialogOpen}
            onAddStaff={refetch}
          />

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Staff Members</CardTitle>
              <CardDescription>
                View and manage your staff members who can access your business data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <StaffToolbar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedStaffIds={selectedStaffIds}
                onAddStaff={() => setIsAddDialogOpen(true)}
                onDeleteSelected={() => setIsDeleteDialogOpen(true)}
              />

              <StaffList
                staffMembers={staffMembers}
                isLoading={isLoading}
                selectedStaffIds={selectedStaffIds}
                toggleStaffSelection={toggleStaffSelection}
                toggleSelectAll={toggleSelectAll}
                openStaffDetails={openStaffDetails}
                startEditing={startEditing}
                setSelectedStaffIds={setSelectedStaffIds}
                setIsDeleteDialogOpen={setIsDeleteDialogOpen}
              />
            </CardContent>
          </Card>

          {/* Delete Confirmation Dialog */}
          <DeleteStaffDialog
            isOpen={isDeleteDialogOpen}
            onClose={() => setIsDeleteDialogOpen(false)}
            onDelete={handleDeleteStaff}
            count={selectedStaffIds.length}
          />
        </main>
      </div>
    </div>
  );
};

export default Staff;
