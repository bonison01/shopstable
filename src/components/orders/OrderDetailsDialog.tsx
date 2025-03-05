
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { formatCurrency, formatDate, getStatusColor } from "@/utils/format";
import { useToast } from "@/hooks/use-toast";

interface OrderDetailsDialogProps {
  orderId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function OrderDetailsDialog({ 
  orderId, 
  isOpen, 
  onClose
}: OrderDetailsDialogProps) {
  const { toast } = useToast();

  const { data: order, isLoading: isLoadingOrder } = useQuery({
    queryKey: ["order", orderId],
    queryFn: async () => {
      if (!orderId) return null;
      
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          customers:customer_id (*),
          order_items (*)
        `)
        .eq("id", orderId)
        .single();
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching order",
          description: error.message,
        });
        throw error;
      }
      
      return data;
    },
    enabled: !!orderId && isOpen,
  });

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

  if (!orderId) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) onClose();
    }}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {isLoadingOrder ? "Loading Order..." : `Order #${orderId.substring(0, 8)}`}
          </DialogTitle>
        </DialogHeader>

        {isLoadingOrder ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : order ? (
          <Tabs defaultValue="details">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">Order Details</TabsTrigger>
              <TabsTrigger value="items">Order Items</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="pt-4">
              <div className="space-y-4">
                <Card>
                  <CardContent className="p-6">
                    <dl className="divide-y divide-gray-200">
                      <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium text-muted-foreground">Order ID</dt>
                        <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">{order.id}</dd>
                      </div>
                      <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium text-muted-foreground">Date</dt>
                        <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">{formatDate(order.date)}</dd>
                      </div>
                      <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium text-muted-foreground">Customer</dt>
                        <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
                          {order.customers?.name} ({order.customers?.email})
                        </dd>
                      </div>
                      <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium text-muted-foreground">Status</dt>
                        <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
                          {renderStatusBadge(order.status)}
                        </dd>
                      </div>
                      <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium text-muted-foreground">Payment Status</dt>
                        <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
                          {renderPaymentStatusBadge(order.payment_status)}
                        </dd>
                      </div>
                      <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium text-muted-foreground">Total Items</dt>
                        <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">{order.order_items?.length || 0}</dd>
                      </div>
                      <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium text-muted-foreground">Total Amount</dt>
                        <dd className="mt-1 text-sm font-medium sm:col-span-2 sm:mt-0">
                          {formatCurrency(order.total)}
                        </dd>
                      </div>
                      {order.payment_due_date && (
                        <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                          <dt className="text-sm font-medium text-muted-foreground">Payment Due Date</dt>
                          <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
                            {formatDate(order.payment_due_date)}
                          </dd>
                        </div>
                      )}
                    </dl>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="items">
              {order.order_items && order.order_items.length > 0 ? (
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
                      {order.order_items.map((item: any) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.product_name}</TableCell>
                          <TableCell className="text-right">{item.quantity}</TableCell>
                          <TableCell className="text-right">{formatCurrency(item.price)}</TableCell>
                          <TableCell className="text-right font-medium">{formatCurrency(item.subtotal)}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={3} className="text-right font-bold">Total</TableCell>
                        <TableCell className="text-right font-bold">{formatCurrency(order.total)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No items found for this order.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Order not found.</p>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
