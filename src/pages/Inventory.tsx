
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/utils/format";
import { Label } from "@/components/ui/label";
import { 
  Package, 
  Plus, 
  Search, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Edit, 
  Trash, 
  FileSpreadsheet,
  Download,
  Upload
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import AddProductForm from "@/components/forms/AddProductForm";
import * as XLSX from 'xlsx';

// Define the Product interface to match our database schema
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

// Define Excel import row structure
interface ExcelRow {
  [key: string]: any;
  name?: string;
  Name?: string;
  sku?: string;
  SKU?: string;
  category?: string;
  Category?: string;
  category_type?: string;
  price?: number | string;
  Price?: number | string;
  wholesale_price?: number | string;
  retail_price?: number | string;
  trainer_price?: number | string;
  purchased_price?: number | string;
  stock?: number | string;
  Stock?: number | string;
  threshold?: number | string;
  Threshold?: number | string;
  description?: string;
  Description?: string;
  image_url?: string;
}

const Inventory = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const { toast } = useToast();
  
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

  // Get unique categories for the filter
  const categories = products ? 
    ["all", ...Array.from(new Set(products.map(product => product.category)))] : 
    ["all"];

  const filteredProducts = products?.filter(product => {
    // Apply search filter
    const matchesSearch = 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Apply category filter
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
    
    // Apply stock filter
    const matchesStock = 
      stockFilter === "all" || 
      (stockFilter === "in-stock" && product.stock > 0) ||
      (stockFilter === "low-stock" && product.stock <= product.threshold && product.stock > 0) ||
      (stockFilter === "out-of-stock" && product.stock === 0);
    
    return matchesSearch && matchesCategory && matchesStock;
  });

  const getStockStatus = (product: any) => {
    if (product.stock === 0) {
      return { label: "Out of Stock", variant: "destructive", icon: XCircle };
    } else if (product.stock <= product.threshold) {
      return { label: "Low Stock", variant: "warning", icon: AlertTriangle };
    } else {
      return { label: "In Stock", variant: "success", icon: CheckCircle };
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleAddProduct = () => {
    setAddDialogOpen(false);
    refetch();
  };

  const handleDeleteProduct = async () => {
    if (!selectedProduct) return;
    
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', selectedProduct.id);
      
      if (error) throw error;
      
      toast({
        title: "Product Deleted",
        description: `${selectedProduct.name} has been removed from inventory.`,
      });
      
      refetch();
      setDeleteDialogOpen(false);
      setSelectedProduct(null);
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Failed to delete product",
      });
    }
  };

  // Export inventory to Excel
  const handleExportToExcel = () => {
    try {
      // Create worksheet with all product data
      const worksheet = XLSX.utils.json_to_sheet(products || []);
      
      // Create workbook and add the worksheet
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory");
      
      // Generate Excel file and trigger download
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

  // Handle file selection for import
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImportFile(e.target.files[0]);
    }
  };

  // Import inventory from Excel
  const handleImportFromExcel = async () => {
    if (!importFile) {
      toast({
        variant: "destructive",
        title: "Import Failed",
        description: "Please select a file to import",
      });
      return;
    }

    setIsImporting(true);

    try {
      // Read the Excel file
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Get the first worksheet
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        
        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as ExcelRow[];
        
        // Process and validate each product
        let successes = 0;
        let failures = 0;
        
        for (const item of jsonData) {
          try {
            // Map Excel columns to database fields
            const product = {
              name: item.name || item.Name || '',
              sku: item.sku || item.SKU || '',
              category: item.category || item.Category || '',
              category_type: item.category_type || null,
              price: parseFloat(String(item.price || item.Price || 0)),
              wholesale_price: parseFloat(String(item.wholesale_price || 0)) || null,
              retail_price: parseFloat(String(item.retail_price || 0)) || null,
              trainer_price: parseFloat(String(item.trainer_price || 0)) || null,
              purchased_price: parseFloat(String(item.purchased_price || 0)) || null,
              stock: parseInt(String(item.stock || item.Stock || 0)),
              threshold: parseInt(String(item.threshold || item.Threshold || 5)),
              description: item.description || item.Description || null,
              image_url: item.image_url || null
            };
            
            // Validate required fields
            if (!product.name || !product.sku || !product.category) {
              throw new Error(`Missing required fields for product: ${product.name || 'Unknown'}`);
            }
            
            // Check if product exists by SKU
            const { data: existingProduct } = await supabase
              .from('products')
              .select('id')
              .eq('sku', product.sku)
              .maybeSingle();
            
            if (existingProduct) {
              // Update existing product
              const { error } = await supabase
                .from('products')
                .update(product)
                .eq('id', existingProduct.id);
              
              if (error) throw error;
            } else {
              // Insert new product
              const { error } = await supabase
                .from('products')
                .insert(product);
              
              if (error) throw error;
            }
            
            successes++;
          } catch (itemError) {
            console.error("Error processing item:", item, itemError);
            failures++;
          }
        }
        
        // Show results
        if (successes > 0) {
          toast({
            title: "Import Results",
            description: `Successfully processed ${successes} products. ${failures > 0 ? `Failed to process ${failures} products.` : ''}`,
          });
          
          // Refresh product list
          refetch();
        } else if (failures > 0) {
          toast({
            variant: "destructive",
            title: "Import Failed",
            description: `Failed to process ${failures} products. Please check the file format.`,
          });
        } else {
          toast({
            variant: "destructive",
            title: "Import Failed",
            description: "No products found in the uploaded file.",
          });
        }
        
        // Close dialog and reset state
        setImportDialogOpen(false);
        setImportFile(null);
        setIsImporting(false);
      };
      
      reader.onerror = () => {
        throw new Error("Failed to read the file");
      };
      
      reader.readAsArrayBuffer(importFile);
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Import Failed",
        description: err.message || "Failed to import inventory",
      });
      setIsImporting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-muted/40">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex flex-1 flex-col">
        <Navbar toggleSidebar={toggleSidebar} />
        
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-1">Inventory</h1>
              <p className="text-muted-foreground">Manage your product inventory</p>
            </div>
            <div className="flex flex-wrap gap-2 mt-4 sm:mt-0">
              <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Add New Product</DialogTitle>
                    <DialogDescription>
                      Fill in the details to add a new product to your inventory.
                    </DialogDescription>
                  </DialogHeader>
                  <AddProductForm onSuccess={handleAddProduct} />
                </DialogContent>
              </Dialog>
              
              <Button variant="outline" onClick={handleExportToExcel}>
                <Download className="h-4 w-4 mr-2" />
                Export Excel
              </Button>
              
              <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Import Excel
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Import Inventory from Excel</DialogTitle>
                    <DialogDescription>
                      Upload an Excel file to import or update products. The file should contain columns for product details.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="excel-file">Excel File</Label>
                      <Input 
                        id="excel-file" 
                        type="file" 
                        accept=".xlsx,.xls"
                        onChange={handleFileChange}
                      />
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p className="font-medium mb-1">Required columns:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>name (Product Name)</li>
                        <li>sku (SKU)</li>
                        <li>category (Category)</li>
                      </ul>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setImportDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleImportFromExcel} disabled={!importFile || isImporting}>
                      {isImporting ? "Importing..." : "Import"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-grow">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products by name or SKU..."
                  className="pl-8 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-full sm:w-48">
                <select 
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  {categories.filter(cat => cat !== "all").map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div className="w-full sm:w-48">
                <select 
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
                  value={stockFilter}
                  onChange={(e) => setStockFilter(e.target.value)}
                >
                  <option value="all">All Stock Status</option>
                  <option value="in-stock">In Stock</option>
                  <option value="low-stock">Low Stock</option>
                  <option value="out-of-stock">Out of Stock</option>
                </select>
              </div>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-pulse">Loading inventory...</div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500">
              Error loading inventory. Please try again.
            </div>
          ) : filteredProducts?.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 border rounded-lg bg-card">
              <Package className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-2">No products found</p>
              <Button onClick={() => setAddDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Product
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts?.map(product => {
                const stockStatus = getStockStatus(product);
                return (
                  <Card key={product.id} className="overflow-hidden">
                    <div className="h-3 bg-primary w-full"></div>
                    <CardHeader className="p-4 pb-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="line-clamp-1" title={product.name}>
                            {product.name}
                          </CardTitle>
                          <CardDescription>
                            SKU: {product.sku}
                          </CardDescription>
                        </div>
                        <Badge variant={
                          stockStatus.variant === "success" ? "default" : 
                          stockStatus.variant === "warning" ? "secondary" : 
                          "destructive"
                        }>
                          <stockStatus.icon className="h-3 w-3 mr-1" /> 
                          {stockStatus.label}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="flex flex-col gap-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Category:</span>
                          <span className="font-medium">{product.category}</span>
                        </div>
                        {product.category_type && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Type:</span>
                            <span className="font-medium">{product.category_type}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Price:</span>
                          <span className="font-medium">{formatCurrency(product.price)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Stock:</span>
                          <span className="font-medium">{product.stock} units</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 mt-4">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1 text-red-500 hover:text-red-600"
                          onClick={() => {
                            setSelectedProduct(product);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
          
          {/* Delete Confirmation Dialog */}
          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete {selectedProduct?.name}? 
                  This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button variant="destructive" onClick={handleDeleteProduct}>
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          {/* Import Dialog */}
          <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Import Inventory from Excel</DialogTitle>
                <DialogDescription>
                  Upload an Excel file to import or update products. The file should contain columns for product details.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="excel-file">Excel File</Label>
                  <Input 
                    id="excel-file" 
                    type="file" 
                    accept=".xlsx,.xls"
                    onChange={handleFileChange}
                  />
                </div>
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium mb-1">Required columns:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>name (Product Name)</li>
                    <li>sku (SKU)</li>
                    <li>category (Category)</li>
                  </ul>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setImportDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleImportFromExcel} disabled={!importFile || isImporting}>
                  {isImporting ? "Importing..." : "Import"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  );
};

export default Inventory;
