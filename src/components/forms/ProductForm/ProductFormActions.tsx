
import { Button } from "@/components/ui/button";

interface ProductFormActionsProps {
  isSubmitting: boolean;
  onCancel: () => void;
}

const ProductFormActions = ({ isSubmitting, onCancel }: ProductFormActionsProps) => {
  return (
    <div className="flex justify-end gap-2">
      <Button type="button" variant="outline" onClick={onCancel}>
        Cancel
      </Button>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Adding..." : "Add Product"}
      </Button>
    </div>
  );
};

export default ProductFormActions;
