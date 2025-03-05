
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Filter, Search, Trash2 } from "lucide-react";

interface CustomersToolbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCustomers: string[];
  onDeleteSelected: () => void;
}

export const CustomersToolbar = ({
  searchQuery,
  setSearchQuery,
  selectedCustomers,
  onDeleteSelected,
}: CustomersToolbarProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between mb-4 gap-4">
      <div className="relative w-full sm:w-72">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search customers..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
        {selectedCustomers.length > 0 && (
          <Button
            variant="destructive"
            size="sm"
            onClick={onDeleteSelected}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete ({selectedCustomers.length})
          </Button>
        )}
      </div>
    </div>
  );
};
