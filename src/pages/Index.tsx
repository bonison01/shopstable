import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { 
  BarChart3, 
  Users, 
  Package, 
  ShoppingCart, 
  Banknote, 
  ChevronRight,
  AlertCircle,
  Clock,
  UserPlus,
  FileText,
  TrendingUp
} from "lucide-react";
import { StatsCard } from "@/components/ui/StatsCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line
} from "recharts";
import { formatCurrency, formatDate } from "@/utils/format";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { useSidebar } from "@/hooks/use-sidebar";
import { cn } from "@/lib/utils";

interface RecentActivity {
  id: string;
  type: string;
  message: string;
  time: string;
  created_at: string;
}

interface TopProduct {
  id: string;
  name: string;
  sales: number;
  percentage: number;
}

const orderStatusColors = {
  pending: "#f59e0b",
  processing: "#3b82f6",
  shipped: "#8b5cf6",
  delivered: "#10b981",
  cancelled: "#ef4444",
};

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [salesData, setSalesData] = useState<any[]>([]);

  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['dashboard-data'],
    queryFn: async () => {
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*');
      
      if (ordersError) {
        console.error("Error fetching orders:", ordersError);
        throw ordersError;
      }

      const { data: customersData, error: customersError } = await supabase
        .from('customers')
        .select('*');

      if (customersError) {
        console.error("Error fetching customers:", customersError);
        throw customersError;
      }

      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*');

      if (productsError) {
        console.error("Error fetching products:", productsError);
        throw productsError;
      }

      const totalRevenue = ordersData?.reduce((sum, order) => sum + (order.total || 0), 0) || 0;
      
      const lowStockProducts = productsData?.filter(product => (product.stock || 0) <= (product.threshold || 5)).length || 0;
      
      const pendingOrders = ordersData?.filter(order => order.status === 'pending').length || 0;

      const orderStats = ordersData?.reduce((acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      const orderStatusData = Object.entries(orderStats).map(([name, value]) => ({
        name,
        value,
      }));

      return {
        totalCustomers: customersData?.length || 0,
        totalProducts: productsData?.length || 0,
        totalOrders: ordersData?.length || 0,
        totalRevenue,
        lowStockProducts,
        pendingOrders,
        orderStatusData
      };
    }
  });

  const { isOpen, toggle, close, collapsed, toggleCollapse } = useSidebar();

  useEffect(() => {
    const fetchRecentActivity = async () => {
      try {
        const { data: recentOrders, error: ordersError } = await supabase
          .from('orders')
          .select('id, date, total, status, customer_id, customers(name)')
          .order('date', { ascending: false })
          .limit(3);
        
        if (ordersError) throw ordersError;

        const { data: recentCustomers, error: customersError } = await supabase
          .from('customers')
          .select('id, name, created_at')
          .order('created_at', { ascending: false })
          .limit(2);
        
        if (customersError) throw customersError;

        const activities: RecentActivity[] = [];

        recentOrders?.forEach((order: any) => {
          activities.push({
            id: order.id,
            type: 'new_order',
            message: `New order (${formatCurrency(order.total)}) from ${order.customers?.name || 'Unknown Customer'}`,
            time: formatDate(order.date),
            created_at: order.date
          });
        });

        recentCustomers?.forEach((customer: any) => {
          activities.push({
            id: customer.id,
            type: 'new_customer',
            message: `New customer ${customer.name} registered`,
            time: formatDate(customer.created_at),
            created_at: customer.created_at
          });
        });

        activities.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

        setRecentActivity(activities.slice(0, 5));
      } catch (error) {
        console.error("Error fetching recent activity:", error);
      }
    };

    const fetchTopProducts = async () => {
      try {
        const { data: orderItems, error: orderItemsError } = await supabase
          .from('order_items')
          .select('product_id, product_name, quantity');
        
        if (orderItemsError) throw orderItemsError;
        
        const productSales: Record<string, { id: string, name: string, quantity: number }> = {};
        
        orderItems?.forEach((item: any) => {
          if (!item.product_id) return;
          
          if (!productSales[item.product_id]) {
            productSales[item.product_id] = {
              id: item.product_id,
              name: item.product_name,
              quantity: 0
            };
          }
          
          productSales[item.product_id].quantity += item.quantity;
        });
        
        const sortedProducts = Object.values(productSales)
          .sort((a, b) => b.quantity - a.quantity)
          .slice(0, 5);
        
        const totalSales = sortedProducts.reduce((sum, product) => sum + product.quantity, 0);
        
        const formattedTopProducts = sortedProducts.map(product => ({
          id: product.id,
          name: product.name,
          sales: product.quantity,
          percentage: Math.round((product.quantity / totalSales) * 100)
        }));
        
        setTopProducts(formattedTopProducts);
      } catch (error) {
        console.error("Error fetching top products:", error);
      }
    };

    const fetchSalesData = async () => {
      try {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 11);
        
        const { data: orders, error } = await supabase
          .from('orders')
          .select('date, total')
          .gte('date', startDate.toISOString())
          .lte('date', endDate.toISOString());
        
        if (error) throw error;
        
        const monthlySales: Record<string, number> = {};
        
        for (let i = 0; i < 12; i++) {
          const date = new Date();
          date.setMonth(date.getMonth() - i);
          const monthKey = date.toLocaleString('en-US', { month: 'short', year: 'numeric' });
          monthlySales[monthKey] = 0;
        }
        
        orders?.forEach((order: any) => {
          const orderDate = new Date(order.date);
          const monthKey = orderDate.toLocaleString('en-US', { month: 'short', year: 'numeric' });
          
          if (monthlySales[monthKey] !== undefined) {
            monthlySales[monthKey] += order.total;
          }
        });
        
        const salesChartData = Object.entries(monthlySales)
          .map(([month, sales]) => ({ month, sales }))
          .reverse();
        
        setSalesData(salesChartData);
      } catch (error) {
        console.error("Error fetching sales data:", error);
      }
    };

    fetchRecentActivity();
    fetchTopProducts();
    fetchSalesData();
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const calculateTrend = () => {
    if (salesData.length < 2) return 0;
    
    const currentMonth = salesData[salesData.length - 1].sales;
    const previousMonth = salesData[salesData.length - 2].sales;
    
    if (previousMonth === 0) return 100;
    
    return ((currentMonth - previousMonth) / previousMonth * 100).toFixed(1);
  };

  return (
    <div className="flex min-h-screen bg-muted/40">
      <Sidebar 
        isOpen={isOpen} 
        onClose={close} 
        collapsed={collapsed}
        onToggleCollapse={toggleCollapse}
      />
      
      <div className={cn(
        "flex flex-1 flex-col transition-all duration-300 ease-in-out",
        collapsed ? "md:ml-16" : "md:ml-64"
      )}>
        <Navbar 
          toggleSidebar={toggle} 
          isSidebarCollapsed={collapsed}
        />
        
        <main className="flex-1 px-4 py-8 md:px-6 lg:px-8 animate-fade-in">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-1">Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, Admin User</p>
            </div>
            <div className="flex gap-2 mt-4 md:mt-0">
              <Button>
                <FileText className="h-4 w-4 mr-2" />
                Generate Reports
              </Button>
            </div>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8 animate-fade-in">
            <StatsCard
              title="Total Customers"
              value={isLoading ? "-" : dashboardData?.totalCustomers || 0}
              icon={<Users className="h-5 w-5" />}
              trend={{ value: 12, isPositive: true }}
              className="stagger-delay-1"
            />
            <StatsCard
              title="Total Products"
              value={isLoading ? "-" : dashboardData?.totalProducts || 0}
              icon={<Package className="h-5 w-5" />}
              description={`${isLoading ? "-" : dashboardData?.lowStockProducts || 0} items low in stock`}
              className="stagger-delay-2"
            />
            <StatsCard
              title="Total Orders"
              value={isLoading ? "-" : dashboardData?.totalOrders || 0}
              icon={<ShoppingCart className="h-5 w-5" />}
              description={`${isLoading ? "-" : dashboardData?.pendingOrders || 0} pending orders`}
              className="stagger-delay-3"
            />
            <StatsCard
              title="Total Revenue"
              value={isLoading ? "-" : formatCurrency(dashboardData?.totalRevenue || 0)}
              icon={<Banknote className="h-5 w-5" />}
              trend={{ value: parseFloat(calculateTrend() as string) || 0, isPositive: parseFloat(calculateTrend() as string) >= 0 }}
              className="stagger-delay-4"
            />
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 mb-8">
            <Card className="lg:col-span-4 animate-fade-in stagger-delay-1">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Sales Overview</CardTitle>
                  <CardDescription>Monthly sales performance</CardDescription>
                </div>
                <Tabs defaultValue="chart">
                  <TabsList className="grid grid-cols-2 w-[180px]">
                    <TabsTrigger value="chart">Chart</TabsTrigger>
                    <TabsTrigger value="trend">Trend</TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="chart">
                  <TabsContent value="chart" className="h-[300px]">
                    {salesData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={salesData}>
                          <XAxis dataKey="month" />
                          <YAxis
                            tickFormatter={(value) =>
                              new Intl.NumberFormat("en-US", {
                                notation: "compact",
                                compactDisplay: "short",
                              }).format(value)
                            }
                          />
                          <RechartsTooltip
                            formatter={(value: number) =>
                              formatCurrency(value)
                            }
                          />
                          <Bar dataKey="sales" fill="#2563eb" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-muted-foreground">Loading sales data...</p>
                      </div>
                    )}
                  </TabsContent>
                  <TabsContent value="trend" className="h-[300px]">
                    {salesData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={salesData}>
                          <XAxis dataKey="month" />
                          <YAxis
                            tickFormatter={(value) =>
                              new Intl.NumberFormat("en-US", {
                                notation: "compact",
                                compactDisplay: "short",
                              }).format(value)
                            }
                          />
                          <RechartsTooltip
                            formatter={(value: number) =>
                              formatCurrency(value)
                            }
                          />
                          <Line 
                            type="monotone" 
                            dataKey="sales" 
                            stroke="#2563eb" 
                            strokeWidth={2}
                            dot={{ r: 3 }}
                            activeDot={{ r: 5 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-muted-foreground">Loading sales data...</p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
            
            <Card className="lg:col-span-3 animate-fade-in stagger-delay-2">
              <CardHeader>
                <CardTitle>Order Status</CardTitle>
                <CardDescription>Current order distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  {isLoading ? (
                    <div className="animate-pulse">Loading order status data...</div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={dashboardData?.orderStatusData || []}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                          label={({
                            cx,
                            cy,
                            midAngle,
                            innerRadius,
                            outerRadius,
                            value,
                            index,
                          }) => {
                            const RADIAN = Math.PI / 180;
                            const radius = 25 + innerRadius + (outerRadius - innerRadius);
                            const x = cx + radius * Math.cos(-midAngle * RADIAN);
                            const y = cy + radius * Math.sin(-midAngle * RADIAN);
                            const name = dashboardData?.orderStatusData[index]?.name;

                            return (
                              <text
                                x={x}
                                y={y}
                                textAnchor={x > cx ? "start" : "end"}
                                dominantBaseline="central"
                                fill="#888888"
                                fontSize="12"
                              >
                                {name}{" "}
                                ({value})
                              </text>
                            );
                          }}
                        >
                          {(dashboardData?.orderStatusData || []).map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={Object.values(orderStatusColors)[index % Object.values(orderStatusColors).length]}
                            />
                          ))}
                        </Pie>
                        <RechartsTooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 mb-8">
            <Card className="lg:col-span-4 animate-fade-in stagger-delay-3">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest events in your store</CardDescription>
                </div>
                <Button variant="ghost" size="sm">
                  View all
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.length > 0 ? recentActivity.map((activity) => {
                    const icons = {
                      new_order: <ShoppingCart className="h-8 w-8 text-blue-500" />,
                      payment: <Banknote className="h-8 w-8 text-green-500" />,
                      stock_alert: <AlertCircle className="h-8 w-8 text-amber-500" />,
                      new_customer: <UserPlus className="h-8 w-8 text-purple-500" />,
                      shipped: <Package className="h-8 w-8 text-indigo-500" />,
                    };
                    
                    return (
                      <div
                        key={activity.id}
                        className="flex items-center gap-4 rounded-lg border p-3 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                          {icons[activity.type as keyof typeof icons]}
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium">{activity.message}</p>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Clock className="mr-1 h-3 w-3" />
                            <span>{activity.time}</span>
                          </div>
                        </div>
                      </div>
                    );
                  }) : (
                    <div className="text-center py-6 text-muted-foreground">
                      <p>No recent activity found</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card className="lg:col-span-3 animate-fade-in stagger-delay-4">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle>Top Products</CardTitle>
                  <CardDescription>Best selling items this month</CardDescription>
                </div>
                <Link to="/inventory">
                  <Button variant="ghost" size="sm">
                    View all
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topProducts.length > 0 ? topProducts.map((product, index) => (
                    <div key={product.id} className="flex items-center">
                      <div
                        className="mr-4 h-2 w-2 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">{product.name}</p>
                          <span className="text-sm text-muted-foreground">
                            {product.percentage}%
                          </span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-muted">
                          <div
                            className="h-2 rounded-full"
                            style={{
                              width: `${product.percentage}%`,
                              backgroundColor: COLORS[index % COLORS.length],
                            }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{product.sales} units sold</span>
                          <div className="flex items-center">
                            <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                            <span>+{Math.round(product.percentage / 5)}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-6 text-muted-foreground">
                      <p>No product sales data available</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
