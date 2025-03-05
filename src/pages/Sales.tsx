
import { useState } from "react";
import { Calendar, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { useSidebar } from "@/hooks/use-sidebar";
import { useSalesData } from "@/hooks/sales/useSalesData";
import { SalesStats } from "@/components/sales/SalesStats";
import { SalesTrend } from "@/components/sales/SalesTrend";
import { CategorySales } from "@/components/sales/CategorySales";
import { TopProducts } from "@/components/sales/TopProducts";
import { DueCustomersTable } from "@/components/sales/DueCustomersTable";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";

const Sales = () => {
  const { isOpen, toggle, close, collapsed, toggleCollapse } = useSidebar();
  const {
    period,
    setPeriod,
    salesData,
    salesLoading,
    salesSummary,
    summaryLoading,
    categoryData,
    categoryLoading,
    topProductsData,
    productsLoading,
    trend
  } = useSalesData();

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
              <h1 className="text-3xl font-bold tracking-tight mb-1">Sales Dashboard</h1>
              <p className="text-muted-foreground">Analyze your sales data and performance</p>
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
          
          <SalesStats 
            totalSales={salesSummary?.totalSales || 0}
            totalOrders={salesSummary?.totalOrders || 0}
            averageOrderValue={salesSummary?.averageOrderValue || 0}
            conversionRate={salesSummary?.conversionRate || 0}
            trend={trend}
          />
          
          <SalesTrend 
            salesData={salesData || []}
            period={period}
            setPeriod={setPeriod}
            isLoading={salesLoading}
          />
          
          <div className="grid gap-6 md:grid-cols-2 mb-8">
            <CategorySales 
              categoryData={categoryData || []}
              isLoading={categoryLoading}
            />
            
            <TopProducts 
              productsData={topProductsData || []}
              isLoading={productsLoading}
            />
          </div>

          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Customers with Due Payments
                </CardTitle>
                <CardDescription>Overview of customers with pending payments</CardDescription>
              </CardHeader>
              <CardContent>
                <DueCustomersTable />
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Sales;
