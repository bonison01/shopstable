
import { ArrowUpRight, ArrowDownRight, Wallet, CreditCard } from "lucide-react";
import { StatsCard } from "@/components/ui/StatsCard";
import { formatCurrency } from "@/utils/format";

interface CashFlowStatsProps {
  totalIncome: number;
  totalExpenses: number;
  netCashFlow: number;
  transactionCount: number;
  incomeTrend?: number;
  expensesTrend?: number;
  netCashFlowTrend?: number;
  isLoading: boolean;
}

export const CashFlowStats = ({
  totalIncome,
  totalExpenses,
  netCashFlow,
  transactionCount,
  incomeTrend = 8.4,
  expensesTrend = 5.6,
  netCashFlowTrend = 12.3,
  isLoading
}: CashFlowStatsProps) => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
      <StatsCard
        title="Total Income"
        value={formatCurrency(isLoading ? 0 : totalIncome || 0)}
        icon={<ArrowUpRight className="h-5 w-5" />}
        trend={{ value: incomeTrend, isPositive: true }}
        className="stagger-delay-1"
      />
      <StatsCard
        title="Total Expenses"
        value={formatCurrency(isLoading ? 0 : totalExpenses || 0)}
        icon={<ArrowDownRight className="h-5 w-5" />}
        trend={{ value: expensesTrend, isPositive: false }}
        className="stagger-delay-2"
      />
      <StatsCard
        title="Net Cash Flow"
        value={formatCurrency(isLoading ? 0 : netCashFlow || 0)}
        icon={<Wallet className="h-5 w-5" />}
        trend={{ value: netCashFlowTrend, isPositive: true }}
        className="stagger-delay-3"
      />
      <StatsCard
        title="Transactions"
        value={isLoading ? 0 : transactionCount || 0}
        icon={<CreditCard className="h-5 w-5" />}
        description="Total recorded transactions"
        className="stagger-delay-4"
      />
    </div>
  );
};
