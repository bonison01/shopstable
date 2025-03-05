import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { formatCurrency } from "@/utils/format";
import { BarChart3, ArrowRight } from "lucide-react";
import { StatsCard } from "@/components/ui/StatsCard";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/hooks/use-sidebar";
import { cn } from "@/lib/utils";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

const Analytics = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ['analytics-data'],
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
      
      const ordersByStatus = ordersData?.reduce((acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      const monthlyData = generateMonthlyData(ordersData || []);

      return {
        totalCustomers: customersData?.length || 0,
        totalProducts: productsData?.length || 0,
        totalOrders: ordersData?.length || 0,
        totalRevenue,
        ordersByStatus,
        monthlyData
      };
    }
  });

  const generateMonthlyData = (orders: any[]) => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    
    const monthlyData = monthNames.map(month => ({
      month,
      revenue: 0,
      orders: 0
    }));
    
    orders.forEach(order => {
      const orderDate = new Date(order.created_at);
      if (orderDate.getFullYear() === currentYear) {
        const monthIndex = orderDate.getMonth();
        monthlyData[monthIndex].revenue += (order.total || 0);
        monthlyData[monthIndex].orders += 1;
      }
    });
    
    return monthlyData;
  };

  const { isOpen, toggle, close, collapsed, toggleCollapse } = useSidebar();

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
        
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-1">Analytics</h1>
              <p className="text-muted-foreground">Detailed business performance metrics</p>
            </div>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <StatsCard
              title="Total Customers"
              value={isLoading ? "-" : analyticsData?.totalCustomers || 0}
              icon={<BarChart3 className="h-5 w-5" />}
              className="stagger-delay-1"
            />
            <StatsCard
              title="Total Products"
              value={isLoading ? "-" : analyticsData?.totalProducts || 0}
              icon={<BarChart3 className="h-5 w-5" />}
              className="stagger-delay-2"
            />
            <StatsCard
              title="Total Orders"
              value={isLoading ? "-" : analyticsData?.totalOrders || 0}
              icon={<BarChart3 className="h-5 w-5" />}
              className="stagger-delay-3"
            />
            <StatsCard
              title="Total Revenue"
              value={isLoading ? "-" : formatCurrency(analyticsData?.totalRevenue || 0)}
              icon={<BarChart3 className="h-5 w-5" />}
              className="stagger-delay-4"
            />
          </div>
          
          <div className="grid gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle>Revenue Trend</CardTitle>
                  <CardDescription>Monthly revenue throughout the year</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="h-[350px]">
                  {isLoading ? (
                    <div className="flex justify-center items-center h-full">
                      <div className="animate-pulse">Loading analytics data...</div>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={analyticsData?.monthlyData || []}>
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
                          formatter={(value: number) => [formatCurrency(value), 'Revenue']}
                        />
                        <Line
                          type="monotone"
                          dataKey="revenue"
                          stroke="#2563eb"
                          strokeWidth={2}
                          dot={{ r: 3 }}
                          activeDot={{ r: 5 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Order Status Distribution</CardTitle>
                <CardDescription>Breakdown of orders by status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  {isLoading ? (
                    <div className="flex justify-center items-center h-full">
                      <div className="animate-pulse">Loading order status data...</div>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={Object.entries(analyticsData?.ordersByStatus || {}).map(([name, value]) => ({
                            name,
                            value
                          }))}
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
                            name,
                            value,
                          }) => {
                            const RADIAN = Math.PI / 180;
                            const radius = 25 + innerRadius + (outerRadius - innerRadius);
                            const x = cx + radius * Math.cos(-midAngle * RADIAN);
                            const y = cy + radius * Math.sin(-midAngle * RADIAN);

                            return (
                              <text
                                x={x}
                                y={y}
                                textAnchor={x > cx ? "start" : "end"}
                                dominantBaseline="central"
                                fill="#888888"
                                fontSize="12"
                              >
                                {name} ({value})
                              </text>
                            );
                          }}
                        >
                          {Object.keys(analyticsData?.ordersByStatus || {}).map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <RechartsTooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Monthly Orders</CardTitle>
                <CardDescription>Number of orders per month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  {isLoading ? (
                    <div className="flex justify-center items-center h-full">
                      <div className="animate-pulse">Loading monthly order data...</div>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={analyticsData?.monthlyData || []}>
                        <XAxis dataKey="month" />
                        <YAxis />
                        <RechartsTooltip />
                        <Bar dataKey="orders" fill="#8884d8" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
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

export default Analytics;
