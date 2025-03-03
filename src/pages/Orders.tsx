
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
import { FileText, Plus, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Orders = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const { data: orders, isLoading, error } = useQuery({
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

  const filteredOrders = orders?.filter(order => 
    order.customers?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getOrdersByStatus = (status: string) => {
    return filteredOrders?.filter(order => order.status === status) || [];
  };

  return (
    <div className="flex min-h-screen bg-muted/40">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex flex-1 flex-col">
        <Navbar toggleSidebar={toggleSidebar} />
        
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
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
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Order
              </Button>
              <Button variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="all">All Orders</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="processing">Processing</TabsTrigger>
              <TabsTrigger value="shipped">Shipped</TabsTrigger>
              <TabsTrigger value="delivered">Delivered</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-0">
              <OrdersTable orders={filteredOrders || []} isLoading={isLoading} />
            </TabsContent>
            
            <TabsContent value="pending" className="mt-0">
              <OrdersTable orders={getOrdersByStatus('pending')} isLoading={isLoading} />
            </TabsContent>
            
            <TabsContent value="processing" className="mt-0">
              <OrdersTable orders={getOrdersByStatus('processing')} isLoading={isLoading} />
            </TabsContent>
            
            <TabsContent value="shipped" className="mt-0">
              <OrdersTable orders={getOrdersByStatus('shipped')} isLoading={isLoading} />
            </TabsContent>
            
            <TabsContent value="delivered" className="mt-0">
              <OrdersTable orders={getOrdersByStatus('delivered')} isLoading={isLoading} />
            </TabsContent>
            
            <TabsContent value="cancelled" className="mt-0">
              <OrdersTable orders={getOrdersByStatus('cancelled')} isLoading={isLoading} />
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
}

const OrdersTable = ({ orders, isLoading }: OrdersTableProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse">Loading orders...</div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 border rounded-lg bg-card">
        <div className="text-center">
          <p className="text-muted-foreground mb-2">No orders found</p>
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Create New Order
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b text-left">
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
            <tr key={order.id} className="border-b hover:bg-muted/50 transition-colors">
              <td className="py-3 px-4 font-medium">{order.id.substring(0, 8)}</td>
              <td className="py-3 px-4">{order.customers?.name || 'Unknown'}</td>
              <td className="py-3 px-4">{formatDate(order.date)}</td>
              <td className="py-3 px-4">
                <Badge className={`${getStatusColor(order.status)} text-white`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Badge>
              </td>
              <td className="py-3 px-4">{order.order_items?.length || 0}</td>
              <td className="py-3 px-4">
                <Badge 
                  variant={order.payment_status === 'paid' ? 'default' : 
                           order.payment_status === 'pending' ? 'secondary' : 
                           'destructive'}
                >
                  {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                </Badge>
              </td>
              <td className="py-3 px-4 text-right font-medium">{formatCurrency(order.total)}</td>
              <td className="py-3 px-4">
                <Button variant="ghost" size="sm">View</Button>
                <Button variant="ghost" size="sm">Edit</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Orders;
