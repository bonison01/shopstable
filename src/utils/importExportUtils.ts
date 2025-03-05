
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

// Required fields that must be present in the Excel file
const REQUIRED_FIELDS = ['name', 'sku'];

// All supported fields including aliases
const SUPPORTED_FIELDS = [
  'name', 'Name',
  'sku', 'SKU',
  'category_type', 'Category_type',
  'price', 'Price',
  'wholesale_price',
  'retail_price',
  'trainer_price',
  'purchased_price',
  'stock', 'Stock',
  'threshold', 'Threshold',
  'description', 'Description',
  'image_url'
];

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

// Validates if the Excel data has the required structure
const validateExcelStructure = (jsonData: ExcelRow[]): { valid: boolean; missingFields: string[] } => {
  if (!jsonData || jsonData.length === 0) {
    return { valid: false, missingFields: ['No data found in Excel file'] };
  }

  // Check for required fields in the first row as sample
  const firstRow = jsonData[0];
  const missingFields: string[] = [];
  
  // Check for name field (required)
  if (!firstRow.name && !firstRow.Name) {
    missingFields.push('name or Name');
  }
  
  // Check for SKU field (required)
  if (!firstRow.sku && !firstRow.SKU) {
    missingFields.push('sku or SKU');
  }
  
  return { 
    valid: missingFields.length === 0,
    missingFields 
  };
};

// Returns true if at least one field in the Excel matches supported fields
const hasMatchingFields = (jsonData: ExcelRow[]): boolean => {
  if (!jsonData || jsonData.length === 0) return false;
  
  const firstRow = jsonData[0];
  return SUPPORTED_FIELDS.some(field => field in firstRow);
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
        
        // Validate the Excel structure
        const { valid, missingFields } = validateExcelStructure(jsonData);
        
        if (!valid) {
          throw new Error(`Invalid Excel structure. Missing required fields: ${missingFields.join(', ')}`);
        }
        
        // Check if there are any matching fields at all
        if (!hasMatchingFields(jsonData)) {
          throw new Error("The Excel file doesn't contain any of the supported fields. Please use the sample template as a reference.");
        }
        
        let successes = 0;
        let failures = 0;
        
        for (const item of jsonData) {
          try {
            // Extract the product name and SKU (required fields)
            const name = item.name || item.Name;
            const sku = item.sku || item.SKU;
            
            if (!name || !sku) {
              console.error("Missing required field (name or SKU):", item);
              failures++;
              continue;
            }
            
            // Prepare the product object with proper type conversions
            const product = {
              name: name,
              sku: sku,
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
            
            // Check if product with this SKU already exists
            const { data: existingProduct, error: queryError } = await supabase
              .from('products')
              .select('id')
              .eq('sku', product.sku)
              .maybeSingle();
            
            if (queryError) {
              console.error("Error querying existing product:", queryError);
              throw queryError;
            }
            
            let result;
            
            if (existingProduct) {
              console.log("Updating existing product with ID:", existingProduct.id);
              result = await supabase
                .from('products')
                .update(product)
                .eq('id', existingProduct.id);
            } else {
              console.log("Inserting new product");
              result = await supabase
                .from('products')
                .insert(product);
            }
            
            if (result.error) {
              console.error("Error processing product:", result.error);
              throw result.error;
            }
            
            successes++;
            console.log("Successfully processed product:", name);
          } catch (itemError) {
            console.error("Error processing item:", item, itemError);
            failures++;
          }
        }
        
        console.log(`Import completed: ${successes} successes, ${failures} failures`);
        
        if (successes > 0) {
          toast({
            title: "Import Successful",
            description: `Successfully imported ${successes} products. ${failures > 0 ? `Failed to process ${failures} products.` : ''}`,
          });
          
          // Call onSuccess to refresh the inventory list
          onSuccess();
        } else {
          toast({
            variant: "destructive",
            title: "Import Failed",
            description: `Failed to process all ${failures} products. Please check the file format.`,
          });
        }
      } catch (parseError: any) {
        console.error("Error parsing Excel file:", parseError);
        toast({
          variant: "destructive",
          title: "Import Failed",
          description: parseError.message || "Failed to parse the Excel file. Please check the file format.",
        });
      } finally {
        setIsImporting(false);
        onOpenChange(false);
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

// Update this to provide more detailed feedback about the expected format
export const getImportFormatHelp = (): string => {
  return `
    Required format:
    - Excel file (.xlsx or .xls)
    - Must contain 'name' and 'sku' columns (case insensitive)
    - Other supported columns: category_type, price, wholesale_price, retail_price, 
      trainer_price, purchased_price, stock, threshold, description, image_url
  `;
};
