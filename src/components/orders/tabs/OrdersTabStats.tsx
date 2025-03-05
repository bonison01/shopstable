
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface OrdersTabStatsProps {
  isLoading: boolean;
  count: number;
}

export function OrdersTabStats({ isLoading, count }: OrdersTabStatsProps) {
  return (
    <Badge variant="outline" className="ml-2 -mr-1">
      {isLoading ? <Skeleton className="h-4 w-4" /> : count}
    </Badge>
  );
}
