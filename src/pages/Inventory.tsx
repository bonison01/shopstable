
import { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// Import refactored components
import SearchAndFilters from "@/components/inventory/SearchAndFilters";
import InventoryHeader from "@/components/inventory/InventoryHeader";
import ProductListing from "@/components/inventory/ProductListing";
import InventoryDialogs from "@/components/inventory/InventoryDialogs";

// Import custom hooks
import { useSidebar } from "@/hooks/use-sidebar";
import { useProductOperations } from "@/hooks/use-product-operations";
import { useProductFilters } from "@/hooks/use-product-filters";

const Inventory = () => {
  // UI state
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const { toast } = useToast();
  const mainContentRef = useRef<HTMLDivElement>(null);
  
  // Custom hooks
  const { isOpen: sidebarOpen, toggle: toggleSidebar, close: closeSidebar, setupOutsideClickHandler, collapsed: sidebarCollapsed, toggleCollapse } = useSidebar();
  
  // Fetch products data
  const { data: products, isLoading, error, refetch } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      console.log("Fetching products from database...");
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name');
      
      if (error) {
        console.error("Error fetching products:", error);
        toast({
          variant: "destructive",
          title: "Error fetching products",
          description: error.message,
        });
        throw error;
      }
      
      console.log("Products fetched successfully:", data?.length);
      return data || [];
    },
  });

  // Product operations
  const { 
    selectedProduct, 
    setSelectedProduct, 
    handleAddProduct, 
    handleEditProduct, 
    handleDeleteSuccess,
    handleImportSuccess,
    handleExportToExcel 
  } = useProductOperations(refetch);

  // Product filtering
  const { 
    searchQuery, 
    setSearchQuery, 
    stockFilter, 
    setStockFilter, 
    filterProducts 
  } = useProductFilters();

  const filteredProducts = filterProducts(products);

  const handleEditProductSelection = (product) => {
    setSelectedProduct(product);
    setEditDialogOpen(true);
  };

  const handleDeleteProductSelection = (product) => {
    setSelectedProduct(product);
    setDeleteDialogOpen(true);
  };

  return (
    <div className="flex min-h-screen bg-muted/40">
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={closeSidebar} 
        collapsed={sidebarCollapsed} 
        onToggleCollapse={toggleCollapse}
      />
      
      <div className={cn(
        "flex flex-1 flex-col transition-all duration-300 ease-in-out",
        sidebarCollapsed ? "md:ml-16" : "md:ml-64"
      )} ref={mainContentRef}>
        <Navbar 
          toggleSidebar={toggleSidebar} 
          isSidebarCollapsed={sidebarCollapsed}
        />
        
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <InventoryHeader 
            onAddProduct={() => setAddDialogOpen(true)}
            onExportToExcel={() => handleExportToExcel(products || [])}
            onImportExcel={() => setImportDialogOpen(true)}
          />
          
          <SearchAndFilters 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            stockFilter={stockFilter}
            setStockFilter={setStockFilter}
          />
          
          <ProductListing 
            isLoading={isLoading}
            error={error}
            filteredProducts={filteredProducts}
            onAddProduct={() => setAddDialogOpen(true)}
            onEditProduct={handleEditProductSelection}
            onDeleteProduct={handleDeleteProductSelection}
          />
          
          <InventoryDialogs 
            addDialogOpen={addDialogOpen}
            setAddDialogOpen={setAddDialogOpen}
            editDialogOpen={editDialogOpen}
            setEditDialogOpen={setEditDialogOpen}
            deleteDialogOpen={deleteDialogOpen}
            setDeleteDialogOpen={setDeleteDialogOpen}
            importDialogOpen={importDialogOpen}
            setImportDialogOpen={setImportDialogOpen}
            selectedProduct={selectedProduct}
            handleAddProduct={handleAddProduct}
            handleEditProduct={handleEditProduct}
            handleDeleteSuccess={handleDeleteSuccess}
            handleImportSuccess={handleImportSuccess}
          />
        </main>
      </div>
    </div>
  );
};

export default Inventory;
