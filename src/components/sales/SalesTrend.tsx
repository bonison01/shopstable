
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";
import { formatCurrency } from "@/utils/format";

interface SalesTrendProps {
  salesData: any[];
  period: string;
  setPeriod: (period: string) => void;
  isLoading: boolean;
}

export const SalesTrend = ({ salesData, period, setPeriod, isLoading }: SalesTrendProps) => {
  return (
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
            {isLoading ? (
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
  );
};
