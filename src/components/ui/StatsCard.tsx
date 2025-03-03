
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export const StatsCard = ({
  title,
  value,
  icon,
  description,
  trend,
  className,
}: StatsCardProps) => {
  return (
    <div className={cn(
      "p-6 rounded-lg bg-white shadow-subtle transition-all-300 hover-lift hover:shadow-elevation",
      className
    )}>
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className="text-primary p-2 rounded-md bg-primary/5">{icon}</div>
      </div>
      
      <div className="space-y-1">
        <p className="text-2xl font-semibold text-foreground">{value}</p>
        
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
        
        {trend && (
          <div className="flex items-center mt-1">
            <span className={cn(
              "text-xs font-medium mr-1",
              trend.isPositive ? "text-green-500" : "text-red-500"
            )}>
              {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
            </span>
            <span className="text-xs text-muted-foreground">vs last month</span>
          </div>
        )}
      </div>
    </div>
  );
};
