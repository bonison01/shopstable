
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/utils/format";

interface OrderItemsTabProps {
  orderItems: any[];
  total: number;
}

export function OrderItemsTab({ orderItems, total }: OrderItemsTabProps) {
  if (!orderItems || orderItems.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No items found for this order.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border mt-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead className="text-right">Quantity</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">Subtotal</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orderItems.map((item: any) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.product_name}</TableCell>
              <TableCell className="text-right">{item.quantity}</TableCell>
              <TableCell className="text-right">{formatCurrency(item.price)}</TableCell>
              <TableCell className="text-right font-medium">{formatCurrency(item.subtotal)}</TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell colSpan={3} className="text-right font-bold">Total</TableCell>
            <TableCell className="text-right font-bold">{formatCurrency(total)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
