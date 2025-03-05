
import { Button } from "@/components/ui/button";

interface CustomerFormActionsProps {
  isSubmitting: boolean;
  onCancel: () => void;
}

const CustomerFormActions = ({ isSubmitting, onCancel }: CustomerFormActionsProps) => {
  return (
    <div className="flex justify-end gap-2">
      <Button type="button" variant="outline" onClick={onCancel}>
        Cancel
      </Button>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Adding..." : "Add Customer"}
      </Button>
    </div>
  );
};

export default CustomerFormActions;
