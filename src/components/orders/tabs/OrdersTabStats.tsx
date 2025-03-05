
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface OrdersTabStatsProps {
  isLoading: boolean;
  count: number;
  paymentTotal?: number;
}

export function OrdersTabStats({ isLoading, count, paymentTotal }: OrdersTabStatsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant="outline" className="ml-2 -mr-1 cursor-help">
            {isLoading ? <Skeleton className="h-4 w-4" /> : count}
            {paymentTotal !== undefined && !isLoading && paymentTotal > 0 && (
              <span className="text-xs ml-1 text-green-600">{formatCurrency(paymentTotal)}</span>
            )}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>{count} {count === 1 ? 'order' : 'orders'}</p>
          {paymentTotal !== undefined && paymentTotal > 0 && (
            <p className="text-green-600">Total payments: {formatCurrency(paymentTotal)}</p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
