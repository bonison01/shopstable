
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, formatDate, getStatusColor } from "@/utils/format";

interface OrderDetailsTabProps {
  order: any;
}

export function OrderDetailsTab({ order }: OrderDetailsTabProps) {
  if (!order) return null;

  const renderStatusBadge = (status: string) => {
    return <Badge className={`${getStatusColor(status)} text-white`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>;
  };

  const renderPaymentStatusBadge = (status: string) => {
    const variant = status === "paid" ? "default" : 
                   status === "pending" ? "secondary" : 
                   "destructive";
    return <Badge variant={variant}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>;
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-6">
          <dl className="divide-y divide-gray-200">
            <DetailRow label="Order ID" value={order.id} />
            <DetailRow label="Date" value={formatDate(order.date)} />
            <DetailRow 
              label="Customer" 
              value={`${order.customers?.name} (${order.customers?.email})`} 
            />
            <DetailRow 
              label="Status" 
              value={renderStatusBadge(order.status)} 
              isComponent
            />
            <DetailRow 
              label="Payment Status" 
              value={renderPaymentStatusBadge(order.payment_status)} 
              isComponent
            />
            <DetailRow label="Total Items" value={order.order_items?.length || 0} />
            <DetailRow 
              label="Total Amount" 
              value={formatCurrency(order.total)}
              isBold
            />
            {order.payment_due_date && (
              <DetailRow 
                label="Payment Due Date" 
                value={formatDate(order.payment_due_date)} 
              />
            )}
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}

interface DetailRowProps {
  label: string;
  value: React.ReactNode;
  isComponent?: boolean;
  isBold?: boolean;
}

function DetailRow({ label, value, isComponent = false, isBold = false }: DetailRowProps) {
  return (
    <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
      <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
      <dd className={`mt-1 text-sm ${isBold ? 'font-medium' : ''} sm:col-span-2 sm:mt-0`}>
        {value}
      </dd>
    </div>
  );
}
