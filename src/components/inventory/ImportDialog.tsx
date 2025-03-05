
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Info, Upload } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import * as XLSX from 'xlsx';

interface ImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

interface ExcelRow {
  [key: string]: any;
  name?: string;
  Name?: string;
  sku?: string;
  SKU?: string;
  category_type?: string;
  Category_type?: string;
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

const ImportDialog = ({ open, onOpenChange, onSuccess }: ImportDialogProps) => {
  const [importFile, setImportFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImportFile(e.target.files[0]);
    }
  };

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
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as ExcelRow[];
        
        let successes = 0;
        let failures = 0;
        
        for (const item of jsonData) {
          try {
            const product = {
              name: item.name || item.Name || '',
              sku: item.sku || item.SKU || '',
              category: 'Default', // Using default category
              category_type: item.category_type || item.Category_type || null,
              price: parseFloat(String(item.price || item.Price || 0)),
              wholesale_price: item.wholesale_price ? parseFloat(String(item.wholesale_price)) : null,
              retail_price: item.retail_price ? parseFloat(String(item.retail_price)) : null,
              trainer_price: item.trainer_price ? parseFloat(String(item.trainer_price)) : null,
              purchased_price: item.purchased_price ? parseFloat(String(item.purchased_price)) : null,
              stock: parseInt(String(item.stock || item.Stock || 0)),
              threshold: parseInt(String(item.threshold || item.Threshold || 5)),
              description: item.description || item.Description || null,
              image_url: item.image_url || null
            };
            
            if (!product.name || !product.sku) {
              throw new Error(`Missing required fields for product: ${product.name || 'Unknown'}`);
            }
            
            const { data: existingProduct } = await supabase
              .from('products')
              .select('id')
              .eq('sku', product.sku)
              .maybeSingle();
            
            if (existingProduct) {
              const { error } = await supabase
                .from('products')
                .update(product)
                .eq('id', existingProduct.id);
              
              if (error) throw error;
            } else {
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
        
        if (successes > 0) {
          toast({
            title: "Import Results",
            description: `Successfully processed ${successes} products. ${failures > 0 ? `Failed to process ${failures} products.` : ''}`,
          });
          
          onSuccess();
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
        
        onOpenChange(false);
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import Inventory from Excel</DialogTitle>
          <DialogDescription>
            Upload an Excel file to import or update products. The file should contain the columns described below.
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
          
          <div className="text-sm space-y-2">
            <div className="flex items-center text-primary">
              <Info className="h-4 w-4 mr-1" />
              <span className="font-semibold">Column Mapping Guide</span>
            </div>
            
            <div className="border rounded-md p-3 space-y-3">
              <div>
                <p className="font-medium mb-1">Required Columns:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><span className="font-semibold">name</span> or <span className="font-semibold">Name</span>: Product name</li>
                  <li><span className="font-semibold">sku</span> or <span className="font-semibold">SKU</span>: Unique product code</li>
                </ul>
              </div>
              
              <div>
                <p className="font-medium mb-1">Optional Columns:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><span className="font-semibold">category_type</span> or <span className="font-semibold">Category_type</span>: Type of product category</li>
                  <li><span className="font-semibold">price</span> or <span className="font-semibold">Price</span>: Base price in INR</li>
                  <li><span className="font-semibold">wholesale_price</span>: Wholesale price in INR</li>
                  <li><span className="font-semibold">retail_price</span>: Retail price in INR</li>
                  <li><span className="font-semibold">trainer_price</span>: Trainer price in INR</li>
                  <li><span className="font-semibold">purchased_price</span>: Purchase cost in INR</li>
                  <li><span className="font-semibold">stock</span> or <span className="font-semibold">Stock</span>: Current inventory quantity</li>
                  <li><span className="font-semibold">threshold</span> or <span className="font-semibold">Threshold</span>: Low stock alert level</li>
                  <li><span className="font-semibold">description</span> or <span className="font-semibold">Description</span>: Product details</li>
                  <li><span className="font-semibold">image_url</span>: URL to product image</li>
                </ul>
              </div>
              
              <div>
                <p className="font-medium mb-1">Data Processing:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Products are matched by SKU - existing products will be updated</li>
                  <li>New products (with unique SKUs) will be created</li>
                  <li>Price fields must contain numeric values</li>
                  <li>Stock and threshold must be whole numbers</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleImportFromExcel} disabled={!importFile || isImporting}>
            {isImporting ? "Importing..." : "Import"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImportDialog;
