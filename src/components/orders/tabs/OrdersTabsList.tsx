
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrdersTabStats } from "./OrdersTabStats";

interface OrdersTabsListProps {
  isLoading: boolean;
  filteredOrders: any[];
  pendingCount: number;
  processingCount: number;
  shippedCount: number;
  deliveredCount: number;
}

export function OrdersTabsList({
  isLoading,
  filteredOrders,
  pendingCount,
  processingCount,
  shippedCount,
  deliveredCount
}: OrdersTabsListProps) {
  return (
    <TabsList className="mb-4 bg-background">
      <TabsTrigger value="all" className="relative">
        All
        <OrdersTabStats isLoading={isLoading} count={filteredOrders.length} />
      </TabsTrigger>
      <TabsTrigger value="pending" className="relative">
        Pending
        <OrdersTabStats isLoading={isLoading} count={pendingCount} />
      </TabsTrigger>
      <TabsTrigger value="processing" className="relative">
        Processing
        <OrdersTabStats isLoading={isLoading} count={processingCount} />
      </TabsTrigger>
      <TabsTrigger value="shipped" className="relative">
        Shipped
        <OrdersTabStats isLoading={isLoading} count={shippedCount} />
      </TabsTrigger>
      <TabsTrigger value="delivered" className="relative">
        Delivered
        <OrdersTabStats isLoading={isLoading} count={deliveredCount} />
      </TabsTrigger>
    </TabsList>
  );
}
