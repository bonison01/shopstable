
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth/useAuth";

export const useSalesData = () => {
  const [period, setPeriod] = useState("week");
  const { toast } = useToast();
  const { user } = useAuth();

  const { data: salesData, isLoading: salesLoading } = useQuery({
    queryKey: ['sales-data', period, user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const daysInPeriod = period === 'week' ? 7 : period === 'month' ? 30 : 90;
      const labels = [];
      const data = [];
      
      const now = new Date();
      for (let i = 0; i < daysInPeriod; i++) {
        const date = new Date();
        date.setDate(now.getDate() - (daysInPeriod - 1) + i);
        
        if (period === 'week') {
          labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
        } else {
          labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        }
        
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
        
        const { data: ordersForDay, error } = await supabase
          .from('orders')
          .select('total')
          .eq('user_id', user.id)
          .gte('created_at', startOfDay.toISOString())
          .lt('created_at', endOfDay.toISOString());
          
        if (error) {
          console.error("Error fetching sales data:", error);
          throw error;
        }
        
        const dayTotal = ordersForDay?.reduce((sum, order) => sum + (order.total || 0), 0) || 0;
        
        data.push({
          date: labels[i],
          sales: dayTotal,
        });
      }
      
      return data;
    },
    enabled: !!user,
  });

  const { data: salesSummary, isLoading: summaryLoading } = useQuery({
    queryKey: ['sales-summary', user?.id],
    queryFn: async () => {
      if (!user) return { totalSales: 0, averageOrderValue: 0, totalOrders: 0, conversionRate: 0 };
      
      const { data: orders, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching sales data",
          description: error.message,
        });
        throw error;
      }
      
      const totalSales = orders?.reduce((sum, order) => sum + (order.total || 0), 0) || 0;
      const averageOrderValue = orders?.length ? totalSales / orders.length : 0;
      const totalOrders = orders?.length || 0;
      
      return {
        totalSales,
        averageOrderValue,
        totalOrders,
        conversionRate: 15.8,
      };
    },
    enabled: !!user,
  });

  const { data: categoryData, isLoading: categoryLoading } = useQuery({
    queryKey: ['sales-by-category', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data: products, error } = await supabase
        .from('products')
        .select('category, price, stock')
        .eq('user_id', user.id);
        
      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching category data",
          description: error.message,
        });
        throw error;
      }
      
      const categorySales: Record<string, number> = {};
      
      products?.forEach(product => {
        const category = product.category;
        const productValue = product.price * product.stock;
        
        if (!categorySales[category]) {
          categorySales[category] = 0;
        }
        
        categorySales[category] += productValue;
      });
      
      // Fix the type issue in the reduce function
      const totalValue = Object.values(categorySales).reduce((sum: number, val: number) => sum + val, 0);
      
      const formattedData = Object.keys(categorySales).map(category => ({
        name: category,
        value: Math.round((categorySales[category] / totalValue) * 100)
      }));
      
      return formattedData;
    },
    enabled: !!user,
  });

  const { data: topProductsData, isLoading: productsLoading } = useQuery({
    queryKey: ['top-products', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data: orderItems, error } = await supabase
        .from('order_items')
        .select(`
          product_name, 
          price, 
          quantity,
          orders:order_id (
            user_id
          )
        `)
        .eq('orders.user_id', user.id);
        
      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching product data",
          description: error.message,
        });
        throw error;
      }
      
      const productSales = {};
      
      orderItems?.forEach(item => {
        const productName = item.product_name;
        const itemValue = item.price * item.quantity;
        
        if (!productSales[productName]) {
          productSales[productName] = 0;
        }
        
        productSales[productName] += itemValue;
      });
      
      const sortedProducts = Object.keys(productSales)
        .map(name => ({ name, sales: productSales[name] }))
        .sort((a, b) => b.sales - a.sales)
        .slice(0, 5);
      
      return sortedProducts;
    },
    enabled: !!user,
  });

  const calculateTrend = () => {
    if (!salesData || salesData.length < 2) return 0;
    
    const firstValue = salesData[0].sales;
    const lastValue = salesData[salesData.length - 1].sales;
    
    if (firstValue === 0) return 0;
    
    return ((lastValue - firstValue) / firstValue) * 100;
  };

  const trend = calculateTrend();

  return {
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
  };
};
