
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface CustomersHeaderProps {
  onAddCustomer?: () => void;
}

export const CustomersHeader = ({ onAddCustomer }: CustomersHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-1">Customers</h1>
        <p className="text-muted-foreground">Manage your customer relationships</p>
      </div>
      <Button className="mt-4 sm:mt-0" onClick={onAddCustomer}>
        <Plus className="h-4 w-4 mr-2" />
        Add Customer
      </Button>
    </div>
  );
};
