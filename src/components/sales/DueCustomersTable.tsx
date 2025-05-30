
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { formatCurrency, formatDate, calculateDaysLeft } from "@/utils/format";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth/useAuth";

export const DueCustomersTable = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  
  const { data: dueOrders, isLoading } = useQuery({
    queryKey: ['due-orders', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data: orders, error } = await supabase
        .from('orders')
        .select(`
          id,
          total,
          customer_id,
          payment_due_date,
          payment_status,
          payment_amount,
          customers (
            name,
            email,
            phone
          )
        `)
        .eq('user_id', user.id)
        .or('payment_status.eq.pending,payment_status.eq.partial')
        .order('payment_due_date', { ascending: true });
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching due payments",
          description: error.message,
        });
        throw error;
      }
      
      // Format the due orders with additional information
      return orders.map(order => {
        const daysLeft = order.payment_due_date 
          ? calculateDaysLeft(order.payment_due_date) 
          : 0;
          
        const urgencyLevel = 
          daysLeft <= 0 ? "critical" :
          daysLeft <= 3 ? "high" :
          daysLeft <= 7 ? "medium" : "low";
        
        // Calculate due amount
        const dueAmount = order.payment_status === "partial" && order.payment_amount 
          ? order.total - order.payment_amount 
          : order.total;
          
        return {
          ...order,
          daysLeft,
          urgencyLevel,
          dueAmount
        };
      });
    },
    enabled: !!user,
  });

  const getTotalDueAmount = () => {
    if (!dueOrders) return 0;
    return dueOrders.reduce((sum, order) => sum + (order.dueAmount || 0), 0);
  };

  const renderUrgencyBadge = (urgencyLevel: string) => {
    switch(urgencyLevel) {
      case 'critical':
        return <Badge className="bg-red-500">Overdue</Badge>;
      case 'high':
        return <Badge className="bg-orange-500">Due Soon</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-500">Due in 7 days</Badge>;
      default:
        return <Badge className="bg-green-500">Upcoming</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-pulse">Loading due payments...</div>
      </div>
    );
  }

  if (!dueOrders || dueOrders.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No pending payments found. All customers are up to date.
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-medium">Total due amount: {formatCurrency(getTotalDueAmount())}</h3>
          <p className="text-muted-foreground text-sm">{dueOrders.length} customers with pending payments</p>
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Due Amount</TableHead>
              <TableHead className="text-right">Total Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dueOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.customers?.name}</TableCell>
                <TableCell>
                  <div className="text-sm">{order.customers?.email}</div>
                  {order.customers?.phone && (
                    <div className="text-xs text-muted-foreground">{order.customers.phone}</div>
                  )}
                </TableCell>
                <TableCell>
                  {order.payment_due_date ? (
                    <div>
                      <div>{formatDate(order.payment_due_date)}</div>
                      <div className="text-xs text-muted-foreground">
                        {order.daysLeft <= 0 
                          ? 'Overdue' 
                          : `${order.daysLeft} days left`}
                      </div>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">Not set</span>
                  )}
                </TableCell>
                <TableCell>
                  {renderUrgencyBadge(order.urgencyLevel)}
                  <div className="text-xs mt-1">
                    {order.payment_status === 'partial' ? 'Partial Payment' : 'Pending'}
                  </div>
                </TableCell>
                <TableCell className="text-right font-medium">{formatCurrency(order.dueAmount)}</TableCell>
                <TableCell className="text-right text-muted-foreground">{formatCurrency(order.total)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
