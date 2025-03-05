
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { type Customer } from "@/hooks/use-order-form";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/utils/format";

interface OrderFormFieldsProps {
  customerId: string;
  status: string;
  paymentStatus: string;
  paymentAmount?: number;
  total?: number;
  customers?: Customer[];
  customersLoading: boolean;
  onFieldChange: (name: string, value: string) => void;
  onPaymentAmountChange?: (value: string) => void;
}

export const OrderFormFields = ({
  customerId,
  status,
  paymentStatus,
  paymentAmount,
  total = 0,
  customers,
  customersLoading,
  onFieldChange,
  onPaymentAmountChange
}: OrderFormFieldsProps) => {
  // Get the selected customer
  const selectedCustomer = customers?.find(c => c.id === customerId);

  const calculateDueAmount = () => {
    if (!total) return 0;
    if (paymentStatus === "paid") return 0;
    if (paymentStatus === "partial" && paymentAmount !== null && paymentAmount !== undefined) {
      return total - paymentAmount;
    }
    return total;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="customer">Customer *</Label>
        <div className="flex flex-col space-y-1">
          <Select 
            value={customerId} 
            onValueChange={(value) => onFieldChange("customer_id", value)}
            disabled={customersLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select customer" />
            </SelectTrigger>
            <SelectContent>
              {customers?.map(customer => (
                <SelectItem key={customer.id} value={customer.id}>
                  {customer.name} ({customer.email})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedCustomer?.customer_type && (
            <Badge className="self-start mt-1" variant="outline">
              {selectedCustomer.customer_type.charAt(0).toUpperCase() + selectedCustomer.customer_type.slice(1)} Customer
            </Badge>
          )}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="status">Order Status</Label>
        <Select 
          value={status} 
          onValueChange={(value) => onFieldChange("status", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="payment_status">Payment Status</Label>
        <Select 
          value={paymentStatus} 
          onValueChange={(value) => onFieldChange("payment_status", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select payment status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="partial">Partial Payment</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        
        {paymentStatus === 'partial' && onPaymentAmountChange && (
          <div className="mt-2">
            <Input
              type="number"
              placeholder="Payment amount"
              value={paymentAmount || ""}
              onChange={(e) => onPaymentAmountChange(e.target.value)}
              className="w-full"
              min={0.01}
              max={total}
              step={0.01}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Due: {formatCurrency(calculateDueAmount())}
            </p>
            <p className="text-xs text-muted-foreground">
              This payment will be recorded in the cash flow system
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
