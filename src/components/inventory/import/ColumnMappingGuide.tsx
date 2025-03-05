
import React from "react";
import { Info } from "lucide-react";

const ColumnMappingGuide = () => {
  return (
    <div className="text-sm space-y-2">
      <div className="flex items-center text-primary">
        <Info className="h-4 w-4 mr-1" />
        <span className="font-semibold">Column Mapping Guide</span>
      </div>
      
      <div className="border rounded-md p-3 space-y-3">
        <div>
          <p className="font-medium mb-1">Required Columns:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><span className="font-semibold">1. name</span> or <span className="font-semibold">Name</span>: Product name</li>
            <li><span className="font-semibold">2. sku</span> or <span className="font-semibold">SKU</span>: Unique product code</li>
          </ul>
        </div>
        
        <div>
          <p className="font-medium mb-1">Optional Columns:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><span className="font-semibold">3. category_type</span> or <span className="font-semibold">Category_type</span>: Type of product category</li>
            <li><span className="font-semibold">4. price</span> or <span className="font-semibold">Price</span>: Base price in INR</li>
            <li><span className="font-semibold">5. wholesale_price</span>: Wholesale price in INR</li>
            <li><span className="font-semibold">6. retail_price</span>: Retail price in INR</li>
            <li><span className="font-semibold">7. trainer_price</span>: Trainer price in INR</li>
            <li><span className="font-semibold">8. purchased_price</span>: Purchase cost in INR</li>
            <li><span className="font-semibold">9. stock</span> or <span className="font-semibold">Stock</span>: Current inventory quantity</li>
            <li><span className="font-semibold">10. threshold</span> or <span className="font-semibold">Threshold</span>: Low stock alert level</li>
            <li><span className="font-semibold">11. description</span> or <span className="font-semibold">Description</span>: Product details</li>
            <li><span className="font-semibold">12. image_url</span>: URL to product image</li>
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
  );
};

export default ColumnMappingGuide;
