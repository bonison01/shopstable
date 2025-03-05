
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface ProductFormErrorProps {
  error: string | null;
}

const ProductFormError = ({ error }: ProductFormErrorProps) => {
  if (!error) return null;
  
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  );
};

export default ProductFormError;
