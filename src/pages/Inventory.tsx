import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import AddProductForm from "@/components/forms/AddProductForm";
import EditProductForm from "@/components/forms/EditProductForm";
import * as XLSX from 'xlsx';
import { Package } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

// Import refactored components
import ProductCard from "@/components/inventory/ProductCard";
import SearchAndFilters from "@/components/inventory/SearchAndFilters";
import ImportDialog from "@/components/inventory/ImportDialog";
import DeleteConfirmDialog from "@/components/inventory/DeleteConfirmDialog";
import InventoryHeader from "@/components/inventory/InventoryHeader";
import EmptyInventory from "@/components/inventory/EmptyInventory";

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

const Inventory = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [stockFilter, setStockFilter] = useState("all");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { toast } = useToast();
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const closeSidebar = () => {
    setSidebarOpen(false);
  };
  
  const { data: products, isLoading, error, refetch } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name');
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching products",
          description: error.message,
        });
        throw error;
      }
      
      return data || [];
    },
  });

  const filteredProducts = products?.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStock = 
      stockFilter === "all" || 
      (stockFilter === "in-stock" && product.stock > 0) ||
      (stockFilter === "low-stock" && product.stock <= product.threshold && product.stock > 0) ||
      (stockFilter === "out-of-stock" && product.stock === 0);
    
    return matchesSearch && matchesStock;
  });

  const handleAddProduct = () => {
    setAddDialogOpen(false);
    refetch();
  };

  const handleEditProduct = () => {
    setEditDialogOpen(false);
    refetch();
  };

  const handleExportToExcel = () => {
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

  const handleDeleteSuccess = () => {
    setSelectedProduct(null);
    refetch();
  };

  return (
    <div className="flex min-h-screen bg-muted/40">
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
      
      <div className="flex flex-1 flex-col">
        <Navbar toggleSidebar={toggleSidebar} />
        
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <InventoryHeader 
            onAddProduct={() => setAddDialogOpen(true)}
            onExportToExcel={handleExportToExcel}
            onImportExcel={() => setImportDialogOpen(true)}
          />
          
          <SearchAndFilters 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            stockFilter={stockFilter}
            setStockFilter={setStockFilter}
          />
          
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-pulse">Loading inventory...</div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500">
              Error loading inventory. Please try again.
            </div>
          ) : filteredProducts?.length === 0 ? (
            <EmptyInventory onAddProduct={() => setAddDialogOpen(true)} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts?.map((product: Product) => (
                <ProductCard 
                  key={product.id}
                  product={product}
                  onEdit={(product) => {
                    setSelectedProduct(product);
                    setEditDialogOpen(true);
                  }}
                  onDelete={(product) => {
                    setSelectedProduct(product);
                    setDeleteDialogOpen(true);
                  }}
                />
              ))}
            </div>
          )}
          
          <DeleteConfirmDialog 
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            product={selectedProduct}
            onSuccess={handleDeleteSuccess}
          />
          
          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh]">
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
                <DialogDescription>
                  Fill in the details to add a new product to your inventory.
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className="h-[calc(90vh-150px)] pr-4">
                <div className="pr-3">
                  <AddProductForm onSuccess={handleAddProduct} />
                </div>
              </ScrollArea>
            </DialogContent>
          </Dialog>
          
          <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh]">
              <DialogHeader>
                <DialogTitle>Edit Product</DialogTitle>
                <DialogDescription>
                  Update the details of your product.
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className="h-[calc(90vh-150px)] pr-4">
                <div className="pr-3">
                  {selectedProduct && (
                    <EditProductForm 
                      product={selectedProduct} 
                      onSuccess={handleEditProduct} 
                      onCancel={() => setEditDialogOpen(false)} 
                    />
                  )}
                </div>
              </ScrollArea>
            </DialogContent>
          </Dialog>
          
          <ImportDialog 
            open={importDialogOpen}
            onOpenChange={setImportDialogOpen}
            onSuccess={refetch}
          />
        </main>
      </div>
    </div>
  );
};

export default Inventory;
