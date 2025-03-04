
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate, getStatusColor } from "@/utils/format";
import { FileText, Plus, Search, Save, Check, X, Edit, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogTrigger 
} from "@/components/ui/dialog";
import AddOrderForm from "@/components/forms/AddOrderForm";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EditableOrderData {
  id: string;
  status: string;
  payment_status: string;
}

const Orders = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const { toast } = useToast();
  const [editingOrder, setEditingOrder] = useState<EditableOrderData | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const { data: orders, isLoading, error, refetch } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          customers:customer_id (
            name,
            email
          ),
          order_items (*)
        `)
        .order('date', { ascending: false });
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching orders",
          description: error.message,
        });
        throw error;
      }
      
      return data || [];
    },
  });

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleAddOrder = () => {
    setAddDialogOpen(false);
    refetch();
  };

  const filteredOrders = orders?.filter(order => 
    order.customers?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getOrdersByStatus = (status: string) => {
    return filteredOrders?.filter(order => order.status === status) || [];
  };

  const startEditing = (order: any) => {
    setEditingOrder({
      id: order.id,
      status: order.status,
      payment_status: order.payment_status
    });
  };

  const cancelEditing = () => {
    setEditingOrder(null);
  };

  const updateOrder = async () => {
    if (!editingOrder) return;
    
    setIsUpdating(true);
    
    try {
      const { error } = await supabase
        .from('orders')
        .update({
          status: editingOrder.status,
          payment_status: editingOrder.payment_status
        })
        .eq('id', editingOrder.id);
        
      if (error) {
        throw error;
      }
      
      toast({
        title: "Order Updated",
        description: `Order #${editingOrder.id.substring(0, 8)} has been updated successfully.`,
      });
      
      refetch();
      setEditingOrder(null);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: error.message || "Failed to update order",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleStatusChange = (value: string) => {
    if (editingOrder) {
      setEditingOrder({ ...editingOrder, status: value });
    }
  };

  const handlePaymentStatusChange = (value: string) => {
    if (editingOrder) {
      setEditingOrder({ ...editingOrder, payment_status: value });
    }
  };

  return (
    <div className="flex min-h-screen bg-muted/40">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex flex-1 flex-col">
        <Navbar toggleSidebar={toggleSidebar} />
        
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 fade-in">
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-1">Orders</h1>
              <p className="text-muted-foreground">Manage and track customer orders</p>
            </div>
            <div className="flex gap-2 mt-4 sm:mt-0">
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search orders..."
                  className="pl-8 w-full sm:w-[200px] lg:w-[300px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-primary/90">
                    <Plus className="h-4 w-4 mr-2" />
                    New Order
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Create New Order</DialogTitle>
                    <DialogDescription>
                      Fill in the details to create a new customer order.
                    </DialogDescription>
                  </DialogHeader>
                  <AddOrderForm onSuccess={handleAddOrder} />
                </DialogContent>
              </Dialog>
              <Button variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="all" className="w-full fade-in">
            <TabsList className="mb-6">
              <TabsTrigger value="all">All Orders</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="processing">Processing</TabsTrigger>
              <TabsTrigger value="shipped">Shipped</TabsTrigger>
              <TabsTrigger value="delivered">Delivered</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-0">
              <OrdersTable 
                orders={filteredOrders || []} 
                isLoading={isLoading} 
                onAddOrder={() => setAddDialogOpen(true)}
                editingOrder={editingOrder}
                startEditing={startEditing}
                cancelEditing={cancelEditing}
                updateOrder={updateOrder}
                isUpdating={isUpdating}
                handleStatusChange={handleStatusChange}
                handlePaymentStatusChange={handlePaymentStatusChange}
              />
            </TabsContent>
            
            <TabsContent value="pending" className="mt-0">
              <OrdersTable 
                orders={getOrdersByStatus('pending')} 
                isLoading={isLoading} 
                onAddOrder={() => setAddDialogOpen(true)}
                editingOrder={editingOrder}
                startEditing={startEditing}
                cancelEditing={cancelEditing}
                updateOrder={updateOrder}
                isUpdating={isUpdating}
                handleStatusChange={handleStatusChange}
                handlePaymentStatusChange={handlePaymentStatusChange}
              />
            </TabsContent>
            
            <TabsContent value="processing" className="mt-0">
              <OrdersTable 
                orders={getOrdersByStatus('processing')} 
                isLoading={isLoading} 
                onAddOrder={() => setAddDialogOpen(true)}
                editingOrder={editingOrder}
                startEditing={startEditing}
                cancelEditing={cancelEditing}
                updateOrder={updateOrder}
                isUpdating={isUpdating}
                handleStatusChange={handleStatusChange}
                handlePaymentStatusChange={handlePaymentStatusChange}
              />
            </TabsContent>
            
            <TabsContent value="shipped" className="mt-0">
              <OrdersTable 
                orders={getOrdersByStatus('shipped')} 
                isLoading={isLoading} 
                onAddOrder={() => setAddDialogOpen(true)}
                editingOrder={editingOrder}
                startEditing={startEditing}
                cancelEditing={cancelEditing}
                updateOrder={updateOrder}
                isUpdating={isUpdating}
                handleStatusChange={handleStatusChange}
                handlePaymentStatusChange={handlePaymentStatusChange}
              />
            </TabsContent>
            
            <TabsContent value="delivered" className="mt-0">
              <OrdersTable 
                orders={getOrdersByStatus('delivered')} 
                isLoading={isLoading} 
                onAddOrder={() => setAddDialogOpen(true)}
                editingOrder={editingOrder}
                startEditing={startEditing}
                cancelEditing={cancelEditing}
                updateOrder={updateOrder}
                isUpdating={isUpdating}
                handleStatusChange={handleStatusChange}
                handlePaymentStatusChange={handlePaymentStatusChange}
              />
            </TabsContent>
            
            <TabsContent value="cancelled" className="mt-0">
              <OrdersTable 
                orders={getOrdersByStatus('cancelled')} 
                isLoading={isLoading} 
                onAddOrder={() => setAddDialogOpen(true)}
                editingOrder={editingOrder}
                startEditing={startEditing}
                cancelEditing={cancelEditing}
                updateOrder={updateOrder}
                isUpdating={isUpdating}
                handleStatusChange={handleStatusChange}
                handlePaymentStatusChange={handlePaymentStatusChange}
              />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

interface OrdersTableProps {
  orders: any[];
  isLoading: boolean;
  onAddOrder: () => void;
  editingOrder: EditableOrderData | null;
  startEditing: (order: any) => void;
  cancelEditing: () => void;
  updateOrder: () => Promise<void>;
  isUpdating: boolean;
  handleStatusChange: (value: string) => void;
  handlePaymentStatusChange: (value: string) => void;
}

const OrdersTable = ({ 
  orders, 
  isLoading, 
  onAddOrder,
  editingOrder,
  startEditing,
  cancelEditing,
  updateOrder,
  isUpdating,
  handleStatusChange,
  handlePaymentStatusChange
}: OrdersTableProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse flex items-center">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          Loading orders...
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 border rounded-lg bg-card">
        <div className="text-center">
          <p className="text-muted-foreground mb-2">No orders found</p>
          <Button variant="outline" size="sm" onClick={onAddOrder}>
            <Plus className="h-4 w-4 mr-2" />
            Create New Order
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="data-table-container fade-in">
      <table className="w-full border-collapse">
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
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b hover:bg-muted/40 transition-colors">
              <td className="py-3 px-4 font-medium">{order.id.substring(0, 8)}</td>
              <td className="py-3 px-4">{order.customers?.name || 'Unknown'}</td>
              <td className="py-3 px-4">{formatDate(order.date)}</td>
              <td className="py-3 px-4">
                {editingOrder && editingOrder.id === order.id ? (
                  <Select 
                    value={editingOrder.status} 
                    onValueChange={handleStatusChange}
                  >
                    <SelectTrigger className="w-full">
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
                ) : (
                  <Badge className={`${getStatusColor(order.status)} text-white`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                )}
              </td>
              <td className="py-3 px-4">{order.order_items?.length || 0}</td>
              <td className="py-3 px-4">
                {editingOrder && editingOrder.id === order.id ? (
                  <Select 
                    value={editingOrder.payment_status} 
                    onValueChange={handlePaymentStatusChange}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select payment status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="refunded">Refunded</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Badge 
                    variant={order.payment_status === 'paid' ? 'default' : 
                            order.payment_status === 'pending' ? 'secondary' : 
                            'destructive'}
                  >
                    {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                  </Badge>
                )}
              </td>
              <td className="py-3 px-4 text-right font-medium">{formatCurrency(order.total)}</td>
              <td className="py-3 px-4">
                {editingOrder && editingOrder.id === order.id ? (
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={updateOrder}
                      disabled={isUpdating}
                    >
                      {isUpdating ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4" />
                      )}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={cancelEditing}
                      disabled={isUpdating}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => startEditing(order)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm">
                      <FileText className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Orders;
