
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { FileText, Plus, Search } from "lucide-react";
import AddOrderForm from "@/components/forms/AddOrderForm";

interface OrdersHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  addDialogOpen: boolean;
  setAddDialogOpen: (open: boolean) => void;
  handleAddOrder: () => void;
}

export const OrdersHeader = ({
  searchQuery,
  setSearchQuery,
  addDialogOpen,
  setAddDialogOpen,
  handleAddOrder
}: OrdersHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-1">Orders</h1>
        <p className="text-muted-foreground">Manage and track customer orders</p>
      </div>
      <div className="flex gap-2 mt-4 sm:mt-0">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search orders..."
            className="pl-8 w-full sm:w-[200px] lg:w-[300px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              New Order
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Order</DialogTitle>
              <DialogDescription>
                Fill in the details to create a new customer order.
              </DialogDescription>
            </DialogHeader>
            <AddOrderForm onSuccess={handleAddOrder} />
          </DialogContent>
        </Dialog>
        <Button variant="outline">
          <FileText className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>
    </div>
  );
};
