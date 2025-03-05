
import { StaffMember } from "@/hooks/staff/types";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface StaffListProps {
  staffMembers: StaffMember[] | undefined;
  isLoading: boolean;
  selectedStaffIds: string[];
  toggleStaffSelection: (staffId: string) => void;
  toggleSelectAll: () => void;
  openStaffDetails: (staffId: string) => void;
  startEditing: (staff: StaffMember) => void;
  setSelectedStaffIds: (ids: string[]) => void;
  setIsDeleteDialogOpen: (isOpen: boolean) => void;
}

export function StaffList({
  staffMembers,
  isLoading,
  selectedStaffIds,
  toggleStaffSelection,
  toggleSelectAll,
  openStaffDetails,
  startEditing,
  setSelectedStaffIds,
  setIsDeleteDialogOpen,
}: StaffListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4 border rounded-lg">
            <Skeleton className="h-5 w-5" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-4 w-72" />
            </div>
            <Skeleton className="h-8 w-24" />
          </div>
        ))}
      </div>
    );
  }

  if (!staffMembers || staffMembers.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg">
        <h3 className="text-lg font-medium mb-2">No staff members found</h3>
        <p className="text-muted-foreground">Add staff members to help manage your business.</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-muted/50">
          <tr>
            <th className="p-3 text-left">
              <Checkbox
                checked={
                  staffMembers.length > 0 &&
                  selectedStaffIds.length === staffMembers.length
                }
                onCheckedChange={toggleSelectAll}
                aria-label="Select all"
              />
            </th>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">Role</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {staffMembers.map((staff) => (
            <tr key={staff.id} className="border-t">
              <td className="p-3">
                <Checkbox
                  checked={selectedStaffIds.includes(staff.id)}
                  onCheckedChange={() => toggleStaffSelection(staff.id)}
                  aria-label={`Select ${staff.first_name}`}
                />
              </td>
              <td className="p-3 font-medium">
                {staff.first_name} {staff.last_name}
              </td>
              <td className="p-3 text-muted-foreground">{staff.staff_email}</td>
              <td className="p-3">
                <Badge variant={staff.role === "admin" ? "default" : "outline"}>
                  {staff.role}
                </Badge>
              </td>
              <td className="p-3">
                <Badge
                  variant={staff.status === "active" ? "success" : "destructive"}
                >
                  {staff.status}
                </Badge>
              </td>
              <td className="p-3">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openStaffDetails(staff.id)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => startEditing(staff)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setSelectedStaffIds([staff.id]);
                      setIsDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
