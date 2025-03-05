
import { Button } from "@/components/ui/button";
import { Loader2, Save, X, Eye, Edit } from "lucide-react";

interface OrderActionsProps {
  isEditing: boolean;
  orderId: string;
  isUpdating: boolean;
  updateOrder: () => Promise<void>;
  cancelEditing: () => void;
  startEditing: (order: any) => void;
  openOrderDetails: (orderId: string) => void;
}

export function OrderActions({
  isEditing,
  orderId,
  isUpdating,
  updateOrder,
  cancelEditing,
  startEditing,
  openOrderDetails
}: OrderActionsProps) {
  if (isEditing) {
    return (
      <div className="flex space-x-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={updateOrder}
          disabled={isUpdating}
        >
          {isUpdating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={cancelEditing}
          disabled={isUpdating}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }
  
  return (
    <div className="flex space-x-2">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => openOrderDetails(orderId)}
      >
        <Eye className="h-4 w-4 mr-1" />
        View
      </Button>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => startEditing({ id: orderId })}
      >
        <Edit className="h-4 w-4 mr-1" />
        Edit
      </Button>
    </div>
  );
}
