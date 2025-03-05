import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { formatCurrency } from "@/utils/format";
import { Calendar, Download, TrendingUp, Users, Package, ShoppingCart, Banknote } from "lucide-react";
import { StatsCard } from "@/components/ui/StatsCard";
import { useToast } from "@/hooks/use-toast";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

const Sales = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [period, setPeriod] = useState("week");
  const { toast } = useToast();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const { data: salesData, isLoading: salesLoading } = useQuery({
    queryKey: ['sales-data', period],
    queryFn: async () => {
      const daysInPeriod = period === 'week' ? 7 : period === 'month' ? 30 : 90;
      const labels = [];
      const data = [];
      
      const now = new Date();
      for (let i = 0; i < daysInPeriod; i++) {
        const date = new Date();
        date.setDate(now.getDate() - (daysInPeriod - 1) + i);
        
        if (period === 'week') {
          labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
        } else {
          labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        }
        
        data.push({
          date: labels[i],
          sales: Math.floor(Math.random() * 5000) + 1000,
        });
      }
      
      return data;
    },
  });

  const { data: salesSummary, isLoading: summaryLoading } = useQuery({
    queryKey: ['sales-summary'],
    queryFn: async () => {
      const { data: orders, error } = await supabase
        .from('orders')
        .select('*');
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching sales data",
          description: error.message,
        });
        throw error;
      }
      
      const totalSales = orders?.reduce((sum, order) => sum + (order.total || 0), 0) || 0;
      const averageOrderValue = orders?.length ? totalSales / orders.length : 0;
      const totalOrders = orders?.length || 0;
      
      return {
        totalSales,
        averageOrderValue,
        totalOrders,
        conversionRate: 15.8,
      };
    },
  });

  const calculateTrend = () => {
    if (!salesData || salesData.length < 2) return 0;
    
    const firstValue = salesData[0].sales;
    const lastValue = salesData[salesData.length - 1].sales;
    
    return (((lastValue - firstValue) / firstValue) * 100).toFixed(1);
  };

  const trend = parseFloat(calculateTrend() as string);

  return (
    <div className="flex min-h-screen bg-muted/40">
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
      
      <div className="flex flex-1 flex-col">
        <Navbar toggleSidebar={toggleSidebar} />
        
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-1">Sales Dashboard</h1>
              <p className="text-muted-foreground">Analyze your sales data and performance</p>
            </div>
            <div className="flex gap-2 mt-4 sm:mt-0">
              <Button variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Select Dates
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <StatsCard
              title="Total Sales"
              value={formatCurrency(salesSummary?.totalSales || 0)}
              icon={<Banknote className="h-5 w-5" />}
              trend={{ value: trend, isPositive: trend >= 0 }}
              className="stagger-delay-1"
            />
            <StatsCard
              title="Total Orders"
              value={salesSummary?.totalOrders || 0}
              icon={<ShoppingCart className="h-5 w-5" />}
              trend={{ value: 5.2, isPositive: true }}
              className="stagger-delay-2"
            />
            <StatsCard
              title="Average Order Value"
              value={formatCurrency(salesSummary?.averageOrderValue || 0)}
              icon={<TrendingUp className="h-5 w-5" />}
              trend={{ value: 2.1, isPositive: true }}
              className="stagger-delay-3"
            />
            <StatsCard
              title="Conversion Rate"
              value={`${salesSummary?.conversionRate || 0}%`}
              icon={<Users className="h-5 w-5" />}
              trend={{ value: 1.2, isPositive: true }}
              className="stagger-delay-4"
            />
          </div>
          
          <div className="grid gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle>Sales Trend</CardTitle>
                  <CardDescription>Sales performance over time</CardDescription>
                </div>
                <Tabs 
                  value={period} 
                  onValueChange={setPeriod} 
                  className="w-[320px]"
                >
                  <TabsList className="grid grid-cols-3">
                    <TabsTrigger value="week">Week</TabsTrigger>
                    <TabsTrigger value="month">Month</TabsTrigger>
                    <TabsTrigger value="quarter">Quarter</TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="h-[350px]">
                  {salesLoading ? (
                    <div className="flex justify-center items-center h-full">
                      <div className="animate-pulse">Loading sales data...</div>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={salesData}>
                        <XAxis dataKey="date" />
                        <YAxis 
                          tickFormatter={(value) => 
                            new Intl.NumberFormat('en-US', {
                              notation: 'compact',
                              compactDisplay: 'short',
                            }).format(value)
                          }
                        />
                        <RechartsTooltip
                          formatter={(value: number) => [formatCurrency(value), 'Sales']}
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
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Sales by Category</CardTitle>
                <CardDescription>Distribution of sales across product categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Electronics', value: 40 },
                          { name: 'Accessories', value: 30 },
                          { name: 'Furniture', value: 15 },
                          { name: 'Clothing', value: 10 },
                          { name: 'Other', value: 5 },
                        ]}
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
                          index,
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
                              {name} ({value}%)
                            </text>
                          );
                        }}
                      >
                        {([...Array(5)]).map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Top Products</CardTitle>
                <CardDescription>Best-selling products by revenue</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: 'Premium Headphones', sales: 12000 },
                        { name: 'Ultra HD Monitor', sales: 9500 },
                        { name: 'Ergonomic Keyboard', sales: 7200 },
                        { name: 'Wireless Mouse', sales: 6400 },
                        { name: 'Laptop Stand', sales: 4800 },
                      ]}
                      layout="vertical"
                      margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
                    >
                      <XAxis type="number" 
                        tickFormatter={(value) => 
                          new Intl.NumberFormat('en-US', {
                            notation: 'compact',
                            compactDisplay: 'short',
                          }).format(value)
                        }
                      />
                      <YAxis type="category" dataKey="name" width={100} />
                      <RechartsTooltip
                        formatter={(value: number) => [formatCurrency(value), 'Sales']}
                      />
                      <Bar dataKey="sales" fill="#2563eb" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Sales;
