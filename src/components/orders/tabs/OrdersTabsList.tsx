
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrdersTabStats } from "./OrdersTabStats";

interface OrdersTabsListProps {
  isLoading: boolean;
  filteredOrders: any[];
  pendingCount: number;
  processingCount: number;
  shippedCount: number;
  deliveredCount: number;
  allPaymentTotal?: number;
  pendingPaymentTotal?: number;
  processingPaymentTotal?: number;
  shippedPaymentTotal?: number;
  deliveredPaymentTotal?: number;
}

export function OrdersTabsList({
  isLoading,
  filteredOrders,
  pendingCount,
  processingCount,
  shippedCount,
  deliveredCount,
  allPaymentTotal,
  pendingPaymentTotal,
  processingPaymentTotal,
  shippedPaymentTotal,
  deliveredPaymentTotal
}: OrdersTabsListProps) {
  return (
    <TabsList className="mb-4 bg-background">
      <TabsTrigger value="all" className="relative">
        All
        <OrdersTabStats 
          isLoading={isLoading} 
          count={filteredOrders.length} 
          paymentTotal={allPaymentTotal} 
        />
      </TabsTrigger>
      <TabsTrigger value="pending" className="relative">
        Pending
        <OrdersTabStats 
          isLoading={isLoading} 
          count={pendingCount} 
          paymentTotal={pendingPaymentTotal} 
        />
      </TabsTrigger>
      <TabsTrigger value="processing" className="relative">
        Processing
        <OrdersTabStats 
          isLoading={isLoading} 
          count={processingCount} 
          paymentTotal={processingPaymentTotal}
        />
      </TabsTrigger>
      <TabsTrigger value="shipped" className="relative">
        Shipped
        <OrdersTabStats 
          isLoading={isLoading} 
          count={shippedCount} 
          paymentTotal={shippedPaymentTotal}
        />
      </TabsTrigger>
      <TabsTrigger value="delivered" className="relative">
        Delivered
        <OrdersTabStats 
          isLoading={isLoading} 
          count={deliveredCount} 
          paymentTotal={deliveredPaymentTotal}
        />
      </TabsTrigger>
    </TabsList>
  );
}
