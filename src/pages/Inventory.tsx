
import { useState } from "react";
import { 
  Box, 
  Plus, 
  Package, 
  BarChart, 
  Tag, 
  History,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchFilter } from "@/components/ui/SearchFilter";
import { DataTable } from "@/components/ui/DataTable";
import { ProductCard } from "@/components/ProductCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { products } from "@/data/mockData";
import { formatCurrency, formatDate } from "@/utils/format";

const Inventory = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };
  
  const handleFilter = (value: string) => {
    setFilter(value);
  };
  
  const filterProducts = () => {
    let filtered = products;
    
    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.sku.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (filter !== "all") {
      if (filter === "low_stock") {
        filtered = filtered.filter((product) => product.stock <= product.threshold);
      } else {
        filtered = filtered.filter((product) => product.category === filter);
      }
    }
    
    return filtered;
  };
  
  const filteredProducts = filterProducts();
  
  const productColumns = [
    {
      header: "Product",
      accessorKey: "name",
      cell: (product) => (
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center">
            <Package className="h-4 w-4 text-primary" />
          </div>
          <span className="font-medium">{product.name}</span>
        </div>
      ),
    },
    {
      header: "Category",
      accessorKey: "category",
    },
    {
      header: "Price",
      accessorKey: "price",
      cell: (product) => formatCurrency(product.price),
    },
    {
      header: "Stock",
      accessorKey: "stock",
      cell: (product) => (
        <div className={`font-medium ${product.stock <= product.threshold ? "text-destructive" : ""}`}>
          {product.stock} units
        </div>
      ),
    },
    {
      header: "SKU",
      accessorKey: "sku",
    },
    {
      header: "Status",
      accessorKey: "stock",
      cell: (product) => {
        const isLowStock = product.stock <= product.threshold;
        return (
          <Badge variant={isLowStock ? "destructive" : "default"}>
            {isLowStock ? "Low Stock" : "In Stock"}
          </Badge>
        );
      },
    },
  ];
  
  return (
    <div className="flex min-h-screen bg-muted/40">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex flex-1 flex-col">
        <Navbar toggleSidebar={toggleSidebar} />
        
        <main className="flex-1 px-4 py-8 md:px-6 lg:px-8 animate-fade-in">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-1">Inventory</h1>
              <p className="text-muted-foreground">
                Manage products, stock levels, and categories
              </p>
            </div>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button className="mt-4 sm:mt-0">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Product</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  {/* Form fields would go here */}
                  <p className="text-muted-foreground text-center py-4">
                    Product creation form would be implemented here
                  </p>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="mb-8">
            <SearchFilter
              onSearch={handleSearch}
              onFilter={handleFilter}
              filterOptions={[
                { label: "All Products", value: "all" },
                { label: "Low Stock", value: "low_stock" },
                { label: "Electronics", value: "Electronics" },
                { label: "Accessories", value: "Accessories" },
              ]}
              placeholder="Search products..."
            />
          </div>
          
          <Tabs defaultValue="table" className="animate-fade-in">
            <TabsList className="mb-6">
              <TabsTrigger value="table">Table View</TabsTrigger>
              <TabsTrigger value="grid">Grid View</TabsTrigger>
            </TabsList>
            
            <TabsContent value="table">
              <DataTable
                data={filteredProducts}
                columns={productColumns}
                rowKey="id"
                onRowClick={(product) => setSelectedProduct(product)}
              />
            </TabsContent>
            
            <TabsContent value="grid">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onClick={() => setSelectedProduct(product)}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
          
          {selectedProduct && (
            <Dialog open={Boolean(selectedProduct)} onOpenChange={() => setSelectedProduct(null)}>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Product Details</DialogTitle>
                </DialogHeader>
                <div className="grid gap-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="h-16 w-16 rounded-md bg-primary/10 flex items-center justify-center">
                      <Package className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{selectedProduct.name}</h3>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Badge>{selectedProduct.category}</Badge>
                        <span>•</span>
                        <span>SKU: {selectedProduct.sku}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Product Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-start gap-2">
                          <Tag className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <div>
                            <div className="font-medium">Price</div>
                            <div className="text-sm text-muted-foreground">
                              {formatCurrency(selectedProduct.price)}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <History className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <div>
                            <div className="font-medium">Last Updated</div>
                            <div className="text-sm text-muted-foreground">
                              {formatDate(selectedProduct.lastUpdated)}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Box className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <div>
                            <div className="font-medium">Description</div>
                            <div className="text-sm text-muted-foreground">
                              {selectedProduct.description}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Inventory Status</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-start gap-2">
                          <Box className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <div>
                            <div className="font-medium">Current Stock</div>
                            <div className={`text-sm ${selectedProduct.stock <= selectedProduct.threshold ? "text-destructive" : "text-muted-foreground"}`}>
                              {selectedProduct.stock} units
                              {selectedProduct.stock <= selectedProduct.threshold && (
                                <div className="flex items-center gap-1 text-destructive mt-1">
                                  <AlertCircle className="h-3 w-3" />
                                  Low stock alert
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <BarChart className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <div>
                            <div className="font-medium">Stock Threshold</div>
                            <div className="text-sm text-muted-foreground">
                              {selectedProduct.threshold} units
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-2">
                          <div className="text-sm font-medium mb-1">Stock Level</div>
                          <div className="h-2 w-full bg-muted rounded-full">
                            <div 
                              className={`h-2 rounded-full ${
                                selectedProduct.stock <= selectedProduct.threshold 
                                  ? "bg-destructive" 
                                  : "bg-primary"
                              }`}
                              style={{ 
                                width: `${Math.min(
                                  (selectedProduct.stock / (selectedProduct.threshold * 4)) * 100, 
                                  100
                                )}%` 
                              }}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setSelectedProduct(null)}>
                      Close
                    </Button>
                    <Button>Edit Product</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </main>
      </div>
    </div>
  );
};

export default Inventory;
