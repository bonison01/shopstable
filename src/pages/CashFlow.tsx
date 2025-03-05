
import { Calendar, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { useSidebar } from "@/hooks/use-sidebar";
import { CashFlowStats } from "@/components/cash-flow/CashFlowStats";
import { CashFlowChart } from "@/components/cash-flow/CashFlowChart";
import { TransactionForm } from "@/components/cash-flow/TransactionForm";
import { TransactionsList } from "@/components/cash-flow/TransactionsList";
import { useCashFlowData } from "@/hooks/cash-flow/useCashFlowData";

const CashFlow = () => {
  const { isOpen, toggle, close, collapsed, toggleCollapse } = useSidebar();
  const {
    period,
    setPeriod,
    cashFlowSummary,
    cashFlowHistory,
    recentTransactions,
    summaryLoading,
    historyLoading,
    transactionsLoading,
    refreshAllData
  } = useCashFlowData();

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
          
          <CashFlowStats
            totalIncome={cashFlowSummary.totalIncome}
            totalExpenses={cashFlowSummary.totalExpenses}
            netCashFlow={cashFlowSummary.netCashFlow}
            transactionCount={cashFlowSummary.transactionCount}
            isLoading={summaryLoading}
          />
          
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-3 mb-8">
            <CashFlowChart
              cashFlowHistory={cashFlowHistory}
              period={period}
              setPeriod={setPeriod}
              isLoading={historyLoading}
            />
            
            <TransactionForm
              onTransactionAdded={refreshAllData}
            />
          </div>
          
          <TransactionsList
            transactions={recentTransactions}
            isLoading={transactionsLoading}
          />
        </main>
      </div>
    </div>
  );
};

export default CashFlow;
