
import { TrendingUp, Users, ShoppingCart, Banknote } from "lucide-react";
import { StatsCard } from "@/components/ui/StatsCard";
import { formatCurrency } from "@/utils/format";

interface SalesStatsProps {
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
  conversionRate: number;
  trend: number;
  ordersTrend: number;
  aovTrend: number;
  conversionTrend: number;
  isLoading?: boolean;
}

export const SalesStats = ({
  totalSales,
  totalOrders,
  averageOrderValue,
  conversionRate,
  trend,
  ordersTrend,
  aovTrend,
  conversionTrend,
  isLoading = false
}: SalesStatsProps) => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
      <StatsCard
        title="Total Sales"
        value={formatCurrency(isLoading ? 0 : totalSales)}
        icon={<Banknote className="h-5 w-5" />}
        trend={{ value: trend, isPositive: trend >= 0 }}
        className="stagger-delay-1"
      />
      <StatsCard
        title="Total Orders"
        value={isLoading ? 0 : totalOrders}
        icon={<ShoppingCart className="h-5 w-5" />}
        trend={{ value: ordersTrend, isPositive: ordersTrend >= 0 }}
        className="stagger-delay-2"
      />
      <StatsCard
        title="Average Order Value"
        value={formatCurrency(isLoading ? 0 : averageOrderValue)}
        icon={<TrendingUp className="h-5 w-5" />}
        trend={{ value: aovTrend, isPositive: aovTrend >= 0 }}
        className="stagger-delay-3"
      />
      <StatsCard
        title="Conversion Rate"
        value={`${isLoading ? 0 : conversionRate}%`}
        icon={<Users className="h-5 w-5" />}
        trend={{ value: conversionTrend, isPositive: conversionTrend >= 0 }}
        className="stagger-delay-4"
      />
    </div>
  );
};
