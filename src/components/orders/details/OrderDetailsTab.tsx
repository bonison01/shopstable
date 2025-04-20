import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  formatCurrency,
  formatDate,
  getStatusColor,
} from "@/utils/format";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DollarSign, ArrowUpCircle, Trash2 } from "lucide-react";
import { useState } from "react";

interface OrderDetailsTabProps {
  order: any;
  onDelete?: (orderId: string) => void; // Optional delete callback
}

export function OrderDetailsTab({ order, onDelete }: OrderDetailsTabProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!order) return null;

  const renderStatusBadge = (status: string) => {
    return (
      <Badge className={`${getStatusColor(status)} text-white`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const renderPaymentStatusBadge = (status: string) => {
    const variant =
      status === "paid"
        ? "default"
        : status === "partial"
        ? "outline"
        : status === "pending"
        ? "secondary"
        : "destructive";

    const showCashFlowIcon =
      status === "paid" ||
      (status === "partial" && order.payment_amount);

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="inline-flex items-center gap-1">
              <Badge variant={variant}>
                {showCashFlowIcon && (
                  <DollarSign className="h-3 w-3 mr-1" />
                )}
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Badge>
              {showCashFlowIcon && (
                <ArrowUpCircle className="h-4 w-4 text-green-500" />
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            {showCashFlowIcon ? (
              <p>Payment tracked in cash flow system</p>
            ) : (
              <p>No payment recorded in cash flow</p>
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  const calculateDueAmount = () => {
    if (!order.total) return 0;
    if (order.payment_status === "paid") return 0;
    if (
      order.payment_status === "partial" &&
      order.payment_amount !== null &&
      order.payment_amount !== undefined
    ) {
      return order.total - order.payment_amount;
    }
    return order.total;
  };

  const dueAmount = calculateDueAmount();

  const handleDelete = async () => {
    const confirmed = confirm(
      "Are you sure you want to delete this order?"
    );
    if (!confirmed) return;

    try {
      setIsDeleting(true);
      await onDelete?.(order.id); // Trigger the delete callback
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setIsDeleting(false);
    }
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
            {order.payment_status === "partial" &&
              order.payment_amount && (
                <>
                  <DetailRow
                    label="Amount Paid"
                    value={formatCurrency(order.payment_amount)}
                  />
                  <DetailRow
                    label="Due Amount"
                    value={formatCurrency(dueAmount)}
                    isBold
                  />
                </>
              )}
            {order.payment_status === "pending" && (
              <DetailRow
                label="Due Amount"
                value={formatCurrency(dueAmount)}
                isBold
              />
            )}
            <DetailRow
              label="Total Items"
              value={order.order_items?.length || 0}
            />
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

      {/* Delete Button */}
      <div className="flex justify-end">
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md disabled:opacity-50"
        >
          <Trash2 className="w-4 h-4" />
          {isDeleting ? "Deleting..." : "Delete Order"}
        </button>
      </div>
    </div>
  );
}

interface DetailRowProps {
  label: string;
  value: React.ReactNode;
  isComponent?: boolean;
  isBold?: boolean;
}

function DetailRow({
  label,
  value,
  isComponent = false,
  isBold = false,
}: DetailRowProps) {
  return (
    <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
      <dt className="text-sm font-medium text-muted-foreground">
        {label}
      </dt>
      <dd
        className={`mt-1 text-sm ${
          isBold ? "font-medium" : ""
        } sm:col-span-2 sm:mt-0`}
      >
        {value}
      </dd>
    </div>
  );
}
