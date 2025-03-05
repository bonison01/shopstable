
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { OrderDetailsTab } from "./details/OrderDetailsTab";
import { OrderItemsTab } from "./details/OrderItemsTab";
import { OrderDetailsSkeleton } from "./details/OrderDetailsSkeleton";
import { OrderNotFound } from "./details/OrderNotFound";

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
          <OrderDetailsSkeleton />
        ) : order ? (
          <Tabs defaultValue="details">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">Order Details</TabsTrigger>
              <TabsTrigger value="items">Order Items</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="pt-4">
              <OrderDetailsTab order={order} />
            </TabsContent>
            
            <TabsContent value="items">
              <OrderItemsTab 
                orderItems={order.order_items} 
                total={order.total} 
              />
            </TabsContent>
          </Tabs>
        ) : (
          <OrderNotFound />
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
