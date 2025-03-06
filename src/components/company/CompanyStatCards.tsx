
import { Users, Package2, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CompanyStatsProps {
  customersCount: number;
  productsCount: number;
  ordersCount: number;
}

export const CompanyStatCards = ({ 
  customersCount, 
  productsCount, 
  ordersCount 
}: CompanyStatsProps) => {
  return (
    <div className="grid gap-6 md:grid-cols-3 mb-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Customers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <Users className="h-5 w-5 text-muted-foreground mr-2" />
            <span className="text-2xl font-bold">{customersCount}</span>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <Package2 className="h-5 w-5 text-muted-foreground mr-2" />
            <span className="text-2xl font-bold">{productsCount}</span>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <FileText className="h-5 w-5 text-muted-foreground mr-2" />
            <span className="text-2xl font-bold">{ordersCount}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
