
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteStaffDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  count: number;
}

export function DeleteStaffDialog({
  isOpen,
  onClose,
  onDelete,
  count,
}: DeleteStaffDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete {count > 1 ? 'these staff members' : 'this staff member'}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. {count > 1 ? 'These staff members' : 'This staff member'} will be permanently removed from your business.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
