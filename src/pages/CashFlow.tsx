
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { formatCurrency } from "@/utils/format";
import { ArrowUpRight, ArrowDownRight, Calendar, Download, CreditCard, Wallet, DollarSign, Filter } from "lucide-react";
import { StatsCard } from "@/components/ui/StatsCard";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const CashFlow = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [period, setPeriod] = useState("week");
  const { toast } = useToast();
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("income");

  // Query for cash flow summary
  const { data: cashFlowSummary, isLoading: summaryLoading, refetch: refetchSummary } = useQuery({
    queryKey: ['cash-flow-summary'],
    queryFn: async () => {
      const { data: transactions, error } = await supabase
        .from('cash_transactions')
        .select('*');
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching cash flow data",
          description: error.message,
        });
        throw error;
      }
      
      // Calculate summary statistics
      const totalIncome = transactions?.reduce((sum, tx) => 
        sum + (tx.type === 'income' ? tx.amount : 0), 0) || 0;
      
      const totalExpenses = transactions?.reduce((sum, tx) => 
        sum + (tx.type === 'expense' ? tx.amount : 0), 0) || 0;
      
      const netCashFlow = totalIncome - totalExpenses;
      
      return {
        totalIncome,
        totalExpenses,
        netCashFlow,
        transactionCount: transactions?.length || 0
      };
    },
  });

  // Query for cash flow history
  const { data: cashFlowHistory, isLoading: historyLoading, refetch: refetchHistory } = useQuery({
    queryKey: ['cash-flow-history', period],
    queryFn: async () => {
      const days = period === 'week' ? 7 : period === 'month' ? 30 : 90;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      
      const { data: transactions, error } = await supabase
        .from('cash_transactions')
        .select('*')
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: true });
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching transaction history",
          description: error.message,
        });
        throw error;
      }
      
      // Group by day
      const groupedByDay = transactions?.reduce((acc, tx) => {
        const date = format(new Date(tx.created_at), 'MMM dd');
        if (!acc[date]) {
          acc[date] = { 
            date, 
            income: 0, 
            expense: 0 
          };
        }
        
        if (tx.type === 'income') {
          acc[date].income += tx.amount;
        } else {
          acc[date].expense += tx.amount;
        }
        
        return acc;
      }, {} as Record<string, any>) || {};
      
      return Object.values(groupedByDay);
    },
  });

  // Query for recent transactions
  const { data: recentTransactions, isLoading: transactionsLoading, refetch: refetchTransactions } = useQuery({
    queryKey: ['recent-transactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cash_transactions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching recent transactions",
          description: error.message,
        });
        throw error;
      }
      
      return data;
    },
  });

  // Function to handle adding a new transaction
  const handleAddTransaction = async () => {
    if (!description || !amount) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please provide both description and amount",
      });
      return;
    }

    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid amount",
        description: "Please enter a valid positive number",
      });
      return;
    }

    const { data, error } = await supabase
      .from('cash_transactions')
      .insert([
        { 
          description,
          amount: amountValue,
          type,
          created_at: new Date().toISOString()
        }
      ]);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error adding transaction",
        description: error.message,
      });
      return;
    }

    toast({
      title: "Transaction added",
      description: "The transaction has been recorded successfully",
    });

    // Reset form
    setDescription("");
    setAmount("");
    
    // Refresh data
    refetchSummary();
    refetchHistory();
    refetchTransactions();
  };

  // Setup Supabase realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel('cash-flow-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'cash_transactions' }, 
        (payload) => {
          // Refresh queries when data changes
          refetchSummary();
          refetchHistory();
          refetchTransactions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetchSummary, refetchHistory, refetchTransactions]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-muted/40">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex flex-1 flex-col">
        <Navbar toggleSidebar={toggleSidebar} />
        
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-1">Cash Flow Management</h1>
              <p className="text-muted-foreground">Track income, expenses, and financial transactions</p>
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
              title="Total Income"
              value={formatCurrency(summaryLoading ? 0 : cashFlowSummary?.totalIncome || 0)}
              icon={<ArrowUpRight className="h-5 w-5" />}
              trend={{ value: 8.4, isPositive: true }}
              className="stagger-delay-1"
            />
            <StatsCard
              title="Total Expenses"
              value={formatCurrency(summaryLoading ? 0 : cashFlowSummary?.totalExpenses || 0)}
              icon={<ArrowDownRight className="h-5 w-5" />}
              trend={{ value: 5.6, isPositive: false }}
              className="stagger-delay-2"
            />
            <StatsCard
              title="Net Cash Flow"
              value={formatCurrency(summaryLoading ? 0 : cashFlowSummary?.netCashFlow || 0)}
              icon={<Wallet className="h-5 w-5" />}
              trend={{ value: 12.3, isPositive: true }}
              className="stagger-delay-3"
            />
            <StatsCard
              title="Transactions"
              value={summaryLoading ? 0 : cashFlowSummary?.transactionCount || 0}
              icon={<CreditCard className="h-5 w-5" />}
              description="Total recorded transactions"
              className="stagger-delay-4"
            />
          </div>
          
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-3 mb-8">
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle>Cash Flow Analysis</CardTitle>
                  <CardDescription>Income vs. expenses over time</CardDescription>
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
                  {historyLoading ? (
                    <div className="flex justify-center items-center h-full">
                      <div className="animate-pulse">Loading cash flow data...</div>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={cashFlowHistory || []}>
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
                          formatter={(value: number, name: string) => [
                            formatCurrency(value), 
                            name.charAt(0).toUpperCase() + name.slice(1)
                          ]}
                        />
                        <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Add Transaction</CardTitle>
                <CardDescription>Record a new income or expense</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Tabs defaultValue="income" value={type} onValueChange={setType}>
                      <TabsList className="grid grid-cols-2 w-full">
                        <TabsTrigger value="income">Income</TabsTrigger>
                        <TabsTrigger value="expense">Expense</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="description" className="text-sm font-medium">
                      Description
                    </label>
                    <Input
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Enter transaction description"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="amount" className="text-sm font-medium">
                      Amount
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="amount"
                        type="number"
                        min="0"
                        step="0.01"
                        className="pl-10"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={handleAddTransaction}
                >
                  {type === 'income' ? 'Add Income' : 'Add Expense'}
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Latest financial activities</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </CardHeader>
            <CardContent>
              {transactionsLoading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-pulse">Loading transactions...</div>
                </div>
              ) : (
                <div className="relative w-full overflow-auto">
                  <table className="w-full caption-bottom text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="h-12 px-4 text-left font-medium">Description</th>
                        <th className="h-12 px-4 text-left font-medium">Type</th>
                        <th className="h-12 px-4 text-left font-medium">Date</th>
                        <th className="h-12 px-4 text-right font-medium">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentTransactions && recentTransactions.length > 0 ? (
                        recentTransactions.map((transaction) => (
                          <tr
                            key={transaction.id}
                            className="border-b transition-colors hover:bg-muted/50"
                          >
                            <td className="p-4 align-middle">{transaction.description}</td>
                            <td className="p-4 align-middle">
                              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                transaction.type === 'income' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {transaction.type === 'income' ? 'Income' : 'Expense'}
                              </span>
                            </td>
                            <td className="p-4 align-middle">
                              {format(new Date(transaction.created_at), 'PPP')}
                            </td>
                            <td className={`p-4 align-middle text-right font-medium ${
                              transaction.type === 'income' 
                                ? 'text-green-600' 
                                : 'text-red-600'
                            }`}>
                              {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="p-4 text-center text-muted-foreground">
                            No transactions found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default CashFlow;
