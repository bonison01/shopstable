
import { Loader2 } from "lucide-react";

export function LoadingState() {
  return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-pulse flex items-center">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        Loading orders...
      </div>
    </div>
  );
}
