
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/auth/useAuth";
import * as XLSX from 'xlsx';

interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  category_type?: string | null;
  description?: string | null;
  price: number;
  wholesale_price?: number | null;
  retail_price?: number | null;
  trainer_price?: number | null;
  purchased_price?: number | null;
  stock: number;
  threshold: number;
  image_url?: string | null;
  created_at?: string | null;
  last_updated?: string | null;
}

export function useProductOperations(refetchProducts: () => void) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { toast } = useToast();
  const { user } = useAuth(); // Get current authenticated user

  const handleAddProduct = () => {
    console.log("Product added - refetching products");
    refetchProducts();
  };

  const handleEditProduct = () => {
    console.log("Product edited - refetching products");
    refetchProducts();
  };

  const handleDeleteSuccess = async (productId?: string) => {
    if (productId && user) {
      // Add user_id filtering when deleting products
      await supabase
        .from("products")
        .delete()
        .eq("id", productId)
        .eq("user_id", user.id); // Only delete products owned by this user
    }
    
    console.log("Product deleted - refetching products");
    setSelectedProduct(null);
    refetchProducts();
  };

  const handleImportSuccess = () => {
    console.log("Products imported - refetching products");
    // Force a refetch with a small delay to ensure DB operations complete
    setTimeout(() => {
      refetchProducts();
    }, 1500); // Increased delay to ensure all DB operations complete
  };

  const handleExportToExcel = (products: Product[]) => {
    try {
      if (!products || products.length === 0) {
        toast({
          variant: "destructive",
          title: "Export Failed",
          description: "No products to export",
        });
        return;
      }
      
      const worksheet = XLSX.utils.json_to_sheet(products || []);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory");
      XLSX.writeFile(workbook, "inventory_export.xlsx");
      toast({
        title: "Export Successful",
        description: "Inventory has been exported to Excel",
      });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Export Failed",
        description: err.message || "Failed to export inventory",
      });
    }
  };

  return {
    selectedProduct,
    setSelectedProduct,
    handleAddProduct,
    handleEditProduct,
    handleDeleteSuccess,
    handleImportSuccess,
    handleExportToExcel
  };
};
