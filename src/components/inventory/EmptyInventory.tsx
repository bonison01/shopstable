
import { Button } from "@/components/ui/button";
import { Package, Plus } from "lucide-react";

interface EmptyInventoryProps {
  onAddProduct: () => void;
}

const EmptyInventory = ({ onAddProduct }: EmptyInventoryProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-64 border rounded-lg bg-card p-8">
      <Package className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium mb-2">No products found</h3>
      <p className="text-muted-foreground mb-6 text-center">Your inventory is empty. Add your first product to get started.</p>
      <Button onClick={onAddProduct}>
        <Plus className="h-4 w-4 mr-2" />
        Add Your First Product
      </Button>
    </div>
  );
};

export default EmptyInventory;
