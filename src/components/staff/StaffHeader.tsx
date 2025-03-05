
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { UserPlus } from "lucide-react";
import AddStaffForm from "../forms/AddStaffForm";

interface StaffHeaderProps {
  addDialogOpen: boolean;
  setAddDialogOpen: (open: boolean) => void;
  onAddStaff: () => void;
}

export function StaffHeader({
  addDialogOpen,
  setAddDialogOpen,
  onAddStaff,
}: StaffHeaderProps) {
  return (
    <div className="flex flex-col gap-4 mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Staff Management</h1>
          <p className="text-muted-foreground">
            Add and manage staff members who can access your business data.
          </p>
        </div>
        <Button onClick={() => setAddDialogOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Staff
        </Button>
      </div>

      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Add Staff Member</DialogTitle>
            <DialogDescription>
              Add a new staff member to help manage your business.
            </DialogDescription>
          </DialogHeader>
          <AddStaffForm onSuccess={() => {
            setAddDialogOpen(false);
            onAddStaff();
          }} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
