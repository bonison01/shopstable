
import * as XLSX from 'xlsx';
import { supabase } from "@/integrations/supabase/client";

export interface ExcelRow {
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

export const createSampleTemplate = () => {
  // Create a sample template with headers
  const worksheet = XLSX.utils.aoa_to_sheet([
    [
      'name', 'sku', 'category_type', 'price', 'wholesale_price', 
      'retail_price', 'trainer_price', 'purchased_price', 'stock', 
      'threshold', 'description', 'image_url'
    ],
    [
      'Sample Product', 'PROD001', 'Accessories', 1000, 800,
      1200, 900, 700, 50, 10, 'This is a sample product description', 
      'https://example.com/image.jpg'
    ],
    [
      'Another Product', 'PROD002', 'Electronics', 2000, 1500,
      2500, 1800, 1200, 25, 5, 'Another product description', 
      ''
    ]
  ]);
  
  // Create workbook and add the worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');
  
  // Generate the file and trigger download
  XLSX.writeFile(workbook, 'inventory_import_template.xlsx');
};

export const processExcelData = async (
  file: File, 
  setIsImporting: (isImporting: boolean) => void,
  onSuccess: () => void,
  onOpenChange: (open: boolean) => void,
  toast: any
): Promise<void> => {
  setIsImporting(true);
  console.log("Starting import process...");

  try {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        console.log("File read successfully");
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as ExcelRow[];
        console.log("Parsed data:", jsonData);
        
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
            
            console.log("Processing product:", product);
            
            if (!product.name || !product.sku) {
              throw new Error(`Missing required fields for product: ${product.name || 'Unknown'}`);
            }
            
            const { data: existingProduct } = await supabase
              .from('products')
              .select('id')
              .eq('sku', product.sku)
              .maybeSingle();
            
            if (existingProduct) {
              console.log("Updating existing product with ID:", existingProduct.id);
              const { error } = await supabase
                .from('products')
                .update(product)
                .eq('id', existingProduct.id);
              
              if (error) {
                console.error("Error updating product:", error);
                throw error;
              }
            } else {
              console.log("Inserting new product");
              const { error } = await supabase
                .from('products')
                .insert(product);
              
              if (error) {
                console.error("Error inserting product:", error);
                throw error;
              }
            }
            
            successes++;
          } catch (itemError) {
            console.error("Error processing item:", item, itemError);
            failures++;
          }
        }
        
        console.log(`Import completed: ${successes} successes, ${failures} failures`);
        
        if (successes > 0) {
          toast({
            title: "Import Successful",
            description: `Successfully processed ${successes} products. ${failures > 0 ? `Failed to process ${failures} products.` : ''}`,
          });
          
          // Explicitly call onSuccess to refresh the inventory list
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
      } catch (parseError) {
        console.error("Error parsing Excel file:", parseError);
        toast({
          variant: "destructive",
          title: "Import Failed",
          description: "Failed to parse the Excel file. Please check the file format.",
        });
      } finally {
        onOpenChange(false);
        setIsImporting(false);
      }
    };
    
    reader.onerror = (error) => {
      console.error("Error reading file:", error);
      toast({
        variant: "destructive",
        title: "Import Failed",
        description: "Failed to read the file",
      });
      setIsImporting(false);
    };
    
    reader.readAsArrayBuffer(file);
  } catch (err: any) {
    console.error("Unhandled error during import:", err);
    toast({
      variant: "destructive",
      title: "Import Failed",
      description: err.message || "Failed to import inventory",
    });
    setIsImporting(false);
  }
};
