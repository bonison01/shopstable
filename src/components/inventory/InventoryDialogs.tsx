
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import AddProductForm from "@/components/forms/AddProductForm";
import EditProductForm from "@/components/forms/EditProductForm";
import DeleteConfirmDialog from "@/components/inventory/DeleteConfirmDialog";
import ImportDialog from "@/components/inventory/ImportDialog";

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

interface InventoryDialogsProps {
  addDialogOpen: boolean;
  setAddDialogOpen: (open: boolean) => void;
  editDialogOpen: boolean;
  setEditDialogOpen: (open: boolean) => void;
  deleteDialogOpen: boolean;
  setDeleteDialogOpen: (open: boolean) => void;
  importDialogOpen: boolean;
  setImportDialogOpen: (open: boolean) => void;
  selectedProduct: Product | null;
  handleAddProduct: () => void;
  handleEditProduct: () => void;
  handleDeleteSuccess: () => void;
  handleImportSuccess: () => void;
}

const InventoryDialogs: React.FC<InventoryDialogsProps> = ({
  addDialogOpen,
  setAddDialogOpen,
  editDialogOpen,
  setEditDialogOpen,
  deleteDialogOpen,
  setDeleteDialogOpen,
  importDialogOpen,
  setImportDialogOpen,
  selectedProduct,
  handleAddProduct,
  handleEditProduct,
  handleDeleteSuccess,
  handleImportSuccess,
}) => {
  return (
    <>
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
        onSuccess={handleImportSuccess}
      />
    </>
  );
};

export default InventoryDialogs;
