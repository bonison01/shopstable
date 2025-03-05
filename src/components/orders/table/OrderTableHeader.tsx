
export function OrderTableHeader() {
  return (
    <thead>
      <tr className="border-b text-left bg-muted/50">
        <th className="py-3 px-4 font-medium">Order ID</th>
        <th className="py-3 px-4 font-medium">Customer</th>
        <th className="py-3 px-4 font-medium">Date</th>
        <th className="py-3 px-4 font-medium">Status</th>
        <th className="py-3 px-4 font-medium">Items</th>
        <th className="py-3 px-4 font-medium">Payment</th>
        <th className="py-3 px-4 font-medium text-right">Total</th>
        <th className="py-3 px-4 font-medium">Actions</th>
      </tr>
    </thead>
  );
}
