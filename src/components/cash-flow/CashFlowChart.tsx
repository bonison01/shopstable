
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";
import { formatCurrency } from "@/utils/format";

interface CashFlowChartProps {
  cashFlowHistory: any[];
  period: string;
  setPeriod: (period: string) => void;
  isLoading: boolean;
}

export const CashFlowChart = ({ 
  cashFlowHistory, 
  period, 
  setPeriod, 
  isLoading 
}: CashFlowChartProps) => {
  return (
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
          {isLoading ? (
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
  );
};
