
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/utils/format";

interface PaymentStatusCellProps {
  paymentStatus: string;
  paymentAmount?: number;
  total?: number;
  isEditing: boolean;
  handlePaymentStatusChange: (value: string) => void;
  handlePaymentAmountChange?: (value: string) => void;
}

export function PaymentStatusCell({ 
  paymentStatus, 
  paymentAmount, 
  total = 0, 
  isEditing, 
  handlePaymentStatusChange, 
  handlePaymentAmountChange 
}: PaymentStatusCellProps) {
  
  const calculateDueAmount = () => {
    if (!total) return 0;
    if (paymentStatus === "paid") return 0;
    if (paymentStatus === "partial" && paymentAmount !== null && paymentAmount !== undefined) {
      return total - paymentAmount;
    }
    return total;
  };

  if (isEditing) {
    return (
      <div className="space-y-2">
        <Select 
          value={paymentStatus} 
          onValueChange={handlePaymentStatusChange}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select payment status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="partial">Partial Payment</SelectItem>
            <SelectItem value="refunded">Refunded</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
        
        {paymentStatus === 'partial' && handlePaymentAmountChange && (
          <div className="mt-2">
            <Input
              type="number"
              placeholder="Payment amount"
              value={paymentAmount || ""}
              onChange={(e) => handlePaymentAmountChange(e.target.value)}
              className="w-full"
              min={0}
              max={total}
              step={0.01}
            />
          </div>
        )}
      </div>
    );
  }
  
  return (
    <div>
      <Badge 
        variant={paymentStatus === 'paid' ? 'default' : 
                paymentStatus === 'partial' ? 'outline' :
                paymentStatus === 'pending' ? 'secondary' : 
                'destructive'}
      >
        {paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1)}
      </Badge>
      
      {paymentStatus === 'partial' && paymentAmount && (
        <div className="text-xs mt-1">
          <div>Paid: {formatCurrency(paymentAmount)}</div>
          <div>Due: {formatCurrency(calculateDueAmount())}</div>
        </div>
      )}
      {paymentStatus === 'pending' && (
        <div className="text-xs mt-1">
          Due: {formatCurrency(total)}
        </div>
      )}
    </div>
  );
}
