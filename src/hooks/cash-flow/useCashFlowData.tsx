
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { useAuth } from "@/contexts/auth/useAuth";

export const useCashFlowData = () => {
  const [period, setPeriod] = useState("week");
  const { toast } = useToast();
  const { user } = useAuth();

  // Query for cash flow summary
  const { 
    data: cashFlowSummary, 
    isLoading: summaryLoading, 
    refetch: refetchSummary 
  } = useQuery({
    queryKey: ['cash-flow-summary', user?.id],
    queryFn: async () => {
      if (!user) return { totalIncome: 0, totalExpenses: 0, netCashFlow: 0, transactionCount: 0 };
      
      const { data: transactions, error } = await supabase
        .from('cash_transactions')
        .select('*')
        .eq('user_id', user.id);
      
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
    enabled: !!user,
  });

  // Query for cash flow history
  const { 
    data: cashFlowHistory, 
    isLoading: historyLoading, 
    refetch: refetchHistory 
  } = useQuery({
    queryKey: ['cash-flow-history', period, user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const days = period === 'week' ? 7 : period === 'month' ? 30 : 90;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      
      const { data: transactions, error } = await supabase
        .from('cash_transactions')
        .select('*')
        .eq('user_id', user.id)
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
    enabled: !!user,
  });

  // Query for recent transactions
  const { 
    data: recentTransactions, 
    isLoading: transactionsLoading, 
    refetch: refetchTransactions 
  } = useQuery({
    queryKey: ['recent-transactions', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('cash_transactions')
        .select('*')
        .eq('user_id', user.id)
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
    enabled: !!user,
  });

  // Function to handle refreshing all data
  const refreshAllData = () => {
    refetchSummary();
    refetchHistory();
    refetchTransactions();
  };

  // Setup Supabase realtime subscription
  useEffect(() => {
    if (!user) return;
    
    const channel = supabase
      .channel('cash-flow-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'cash_transactions', filter: `user_id=eq.${user.id}` }, 
        () => {
          // Refresh queries when data changes
          refreshAllData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return {
    // State
    period,
    setPeriod,
    
    // Data
    cashFlowSummary: cashFlowSummary || { 
      totalIncome: 0, 
      totalExpenses: 0, 
      netCashFlow: 0, 
      transactionCount: 0 
    },
    cashFlowHistory: cashFlowHistory || [],
    recentTransactions: recentTransactions || [],
    
    // Loading states
    summaryLoading,
    historyLoading,
    transactionsLoading,
    
    // Actions
    refreshAllData
  };
};
