import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import * as XLSX from 'xlsx';

interface Product {
  id: string;
  name: string;
  // other product properties
}

export function useProductOperations(refetchProducts: () => void) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { toast } = useToast();

  const handleAddProduct = () => {
    refetchProducts();
  };

  const handleEditProduct = () => {
    refetchProducts();
  };

  const handleDeleteSuccess = () => {
    setSelectedProduct(null);
    refetchProducts();
  };

  const handleImportSuccess = () => {
    refetchProducts();
  };

  const handleExportToExcel = (products: Product[]) => {
    try {
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
}
