
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface EmptyOrdersStateProps {
  onAddOrder: () => void;
}

export function EmptyOrdersState({ onAddOrder }: EmptyOrdersStateProps) {
  return (
    <div className="flex justify-center items-center h-64 border rounded-lg bg-card">
      <div className="text-center">
        <p className="text-muted-foreground mb-2">No orders found</p>
        <Button variant="outline" size="sm" onClick={onAddOrder}>
          <Plus className="h-4 w-4 mr-2" />
          Create New Order
        </Button>
      </div>
    </div>
  );
}
