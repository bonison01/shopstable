
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Trash2, UserPlus } from "lucide-react";

interface StaffToolbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedStaffIds: string[];
  onAddStaff: () => void;
  onDeleteSelected: () => void;
}

export function StaffToolbar({
  searchQuery,
  setSearchQuery,
  selectedStaffIds,
  onAddStaff,
  onDeleteSelected,
}: StaffToolbarProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
      <div className="relative w-full sm:max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search staff..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="flex items-center gap-2">
        {selectedStaffIds.length > 0 && (
          <Button
            variant="destructive"
            size="sm"
            onClick={onDeleteSelected}
            className="h-9"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete ({selectedStaffIds.length})
          </Button>
        )}
        <Button onClick={onAddStaff} className="h-9">
          <UserPlus className="mr-2 h-4 w-4" />
          Add Staff
        </Button>
      </div>
    </div>
  );
}
