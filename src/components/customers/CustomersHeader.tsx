
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import AddCustomerForm from "@/components/forms/AddCustomerForm";

interface CustomersHeaderProps {
  onAddCustomer?: () => void;
}

export const CustomersHeader = ({ onAddCustomer }: CustomersHeaderProps) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const handleAddSuccess = () => {
    setIsAddDialogOpen(false);
    if (onAddCustomer) {
      onAddCustomer();
    }
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-1">Customers</h1>
        <p className="text-muted-foreground">Manage your customer relationships</p>
      </div>
      <Button className="mt-4 sm:mt-0" onClick={() => setIsAddDialogOpen(true)}>
        <Plus className="h-4 w-4 mr-2" />
        Add Customer
      </Button>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
          </DialogHeader>
          <AddCustomerForm onSuccess={handleAddSuccess} />
        </DialogContent>
      </Dialog>
    </div>
  );
};
