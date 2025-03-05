
import { TrendingUp, Users, ShoppingCart, Banknote } from "lucide-react";
import { StatsCard } from "@/components/ui/StatsCard";
import { formatCurrency } from "@/utils/format";

interface SalesStatsProps {
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
  conversionRate: number;
  trend: number;
}

export const SalesStats = ({
  totalSales,
  totalOrders,
  averageOrderValue,
  conversionRate,
  trend
}: SalesStatsProps) => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
      <StatsCard
        title="Total Sales"
        value={formatCurrency(totalSales)}
        icon={<Banknote className="h-5 w-5" />}
        trend={{ value: trend, isPositive: trend >= 0 }}
        className="stagger-delay-1"
      />
      <StatsCard
        title="Total Orders"
        value={totalOrders}
        icon={<ShoppingCart className="h-5 w-5" />}
        trend={{ value: 5.2, isPositive: true }}
        className="stagger-delay-2"
      />
      <StatsCard
        title="Average Order Value"
        value={formatCurrency(averageOrderValue)}
        icon={<TrendingUp className="h-5 w-5" />}
        trend={{ value: 2.1, isPositive: true }}
        className="stagger-delay-3"
      />
      <StatsCard
        title="Conversion Rate"
        value={`${conversionRate}%`}
        icon={<Users className="h-5 w-5" />}
        trend={{ value: 1.2, isPositive: true }}
        className="stagger-delay-4"
      />
    </div>
  );
};
