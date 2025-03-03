
import { useState } from "react";
import { Link } from "react-router-dom";
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
import { 
  statsSummary, 
  recentActivity, 
  orders, 
  salesData,
  topProducts
} from "@/data/mockData";
import { formatCurrency } from "@/utils/format";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";

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

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Calculate order status stats
  const orderStats = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const orderStatusData = Object.entries(orderStats).map(([name, value]) => ({
    name,
    value,
  }));

  // Calculate payment status stats
  const paymentStats = orders.reduce((acc, order) => {
    acc[order.paymentStatus] = (acc[order.paymentStatus] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="flex min-h-screen bg-muted/40">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex flex-1 flex-col">
        <Navbar toggleSidebar={toggleSidebar} />
        
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
              value={statsSummary.totalCustomers}
              icon={<Users className="h-5 w-5" />}
              trend={{ value: 12, isPositive: true }}
              className="stagger-delay-1"
            />
            <StatsCard
              title="Total Products"
              value={statsSummary.totalProducts}
              icon={<Package className="h-5 w-5" />}
              description={`${statsSummary.lowStockProducts} items low in stock`}
              className="stagger-delay-2"
            />
            <StatsCard
              title="Total Orders"
              value={statsSummary.totalOrders}
              icon={<ShoppingCart className="h-5 w-5" />}
              description={`${statsSummary.pendingOrders} pending orders`}
              className="stagger-delay-3"
            />
            <StatsCard
              title="Total Revenue"
              value={formatCurrency(statsSummary.totalRevenue)}
              icon={<Banknote className="h-5 w-5" />}
              trend={{ value: 8.2, isPositive: true }}
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
                  </TabsContent>
                  <TabsContent value="trend" className="h-[300px]">
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
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={orderStatusData}
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

                          return (
                            <text
                              x={x}
                              y={y}
                              textAnchor={x > cx ? "start" : "end"}
                              dominantBaseline="central"
                              fill="#888888"
                              fontSize="12"
                            >
                              {orderStatusData[index].name}{" "}
                              ({value})
                            </text>
                          );
                        }}
                      >
                        {orderStatusData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={Object.values(orderStatusColors)[index % Object.values(orderStatusColors).length]}
                          />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                    </PieChart>
                  </ResponsiveContainer>
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
                  {recentActivity.map((activity) => {
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
                  })}
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
                  {topProducts.map((product, index) => (
                    <div key={index} className="flex items-center">
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
                  ))}
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
