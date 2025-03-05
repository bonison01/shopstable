
import { Button } from "@/components/ui/button";

interface StaffFormActionsProps {
  isSubmitting: boolean;
  onCancel: () => void;
}

const StaffFormActions = ({ isSubmitting, onCancel }: StaffFormActionsProps) => {
  return (
    <div className="flex justify-end gap-2">
      <Button type="button" variant="outline" onClick={onCancel}>
        Cancel
      </Button>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Adding..." : "Add Staff"}
      </Button>
    </div>
  );
};

export default StaffFormActions;
