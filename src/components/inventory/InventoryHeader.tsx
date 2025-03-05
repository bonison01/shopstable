
import { Button } from "@/components/ui/button";
import { Plus, Download, Upload } from "lucide-react";

interface InventoryHeaderProps {
  onAddProduct: () => void;
  onExportToExcel: () => void;
  onImportExcel: () => void;
}

const InventoryHeader = ({ 
  onAddProduct, 
  onExportToExcel, 
  onImportExcel 
}: InventoryHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-1">Inventory</h1>
        <p className="text-muted-foreground">Manage your product inventory</p>
      </div>
      <div className="flex flex-wrap gap-2 mt-4 sm:mt-0">
        <Button onClick={onAddProduct}>
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
        
        <Button variant="outline" onClick={onExportToExcel}>
          <Download className="h-4 w-4 mr-2" />
          Export Excel
        </Button>
        
        <Button variant="outline" onClick={onImportExcel}>
          <Upload className="h-4 w-4 mr-2" />
          Import Excel
        </Button>
      </div>
    </div>
  );
};

export default InventoryHeader;
