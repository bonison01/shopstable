
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";
import { formatCurrency } from "@/utils/format";

interface TopProductsProps {
  productsData: any[];
  isLoading: boolean;
}

export const TopProducts = ({ productsData, isLoading }: TopProductsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Products</CardTitle>
        <CardDescription>Best-selling products by revenue</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-pulse">Loading product data...</div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={productsData || []}
                layout="vertical"
                margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
              >
                <XAxis type="number" 
                  tickFormatter={(value) => 
                    new Intl.NumberFormat('en-US', {
                      notation: 'compact',
                      compactDisplay: 'short',
                    }).format(value)
                  }
                />
                <YAxis type="category" dataKey="name" width={100} />
                <RechartsTooltip
                  formatter={(value: number) => [formatCurrency(value), 'Sales']}
                />
                <Bar dataKey="sales" fill="#2563eb" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
