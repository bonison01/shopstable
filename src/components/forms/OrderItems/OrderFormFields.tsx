
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { type Customer } from "@/hooks/use-order-form";

interface OrderFormFieldsProps {
  customerId: string;
  status: string;
  paymentStatus: string;
  customers?: Customer[];
  customersLoading: boolean;
  onFieldChange: (name: string, value: string) => void;
}

export const OrderFormFields = ({
  customerId,
  status,
  paymentStatus,
  customers,
  customersLoading,
  onFieldChange
}: OrderFormFieldsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="customer">Customer *</Label>
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
            <SelectItem value="overdue">Overdue</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
