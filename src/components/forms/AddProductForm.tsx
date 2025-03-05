
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const productCategories = [
  "Electronics", 
  "Accessories", 
  "Furniture", 
  "Clothing", 
  "Office Supplies",
  "Hardware",
  "Software",
  "Services",
  "Other"
];

const categoryTypes = [
  "Protein",
  "Gainer",
  "Creatine",
  "Glutamine",
  "Fish Oil",
  "Multi",
  "Others"
];

const AddProductForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const [product, setProduct] = useState({
    name: "",
    category: "",
    category_type: "",
    price: "",
    wholesale_price: "",
    retail_price: "",
    trainer_price: "",
    purchased_price: "",
    stock: "0",
    threshold: "5",
    sku: "",
    description: "",
    image_url: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Simple validation
      if (!product.name || !product.category || !product.price || !product.sku) {
        throw new Error("Please fill in all required fields");
      }

      const numericPrice = parseFloat(product.price);
      if (isNaN(numericPrice) || numericPrice <= 0) {
        throw new Error("Price must be a positive number");
      }

      const numericStock = parseInt(product.stock);
      if (isNaN(numericStock) || numericStock < 0) {
        throw new Error("Stock must be a non-negative number");
      }

      // Process other price fields
      const wholesalePrice = product.wholesale_price ? parseFloat(product.wholesale_price) : null;
      const retailPrice = product.retail_price ? parseFloat(product.retail_price) : null;
      const trainerPrice = product.trainer_price ? parseFloat(product.trainer_price) : null;
      const purchasedPrice = product.purchased_price ? parseFloat(product.purchased_price) : null;

      // Insert to Supabase
      const { data, error } = await supabase
        .from('products')
        .insert({
          name: product.name,
          category: product.category,
          category_type: product.category_type || null,
          price: numericPrice,
          wholesale_price: wholesalePrice,
          retail_price: retailPrice,
          trainer_price: trainerPrice,
          purchased_price: purchasedPrice,
          stock: numericStock,
          threshold: parseInt(product.threshold),
          sku: product.sku,
          description: product.description || null,
          image_url: product.image_url || null
        })
        .select();

      if (error) throw error;

      toast({
        title: "Product Added",
        description: `${product.name} has been added to inventory.`,
      });

      // Reset form
      setProduct({
        name: "",
        category: "",
        category_type: "",
        price: "",
        wholesale_price: "",
        retail_price: "",
        trainer_price: "",
        purchased_price: "",
        stock: "0",
        threshold: "5",
        sku: "",
        description: "",
        image_url: ""
      });

      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || "An error occurred while adding the product");
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Failed to add product",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Product Name *</Label>
          <Input 
            id="name" 
            name="name" 
            value={product.name} 
            onChange={handleChange} 
            placeholder="Enter product name"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="category">Category *</Label>
          <Select 
            value={product.category} 
            onValueChange={(value) => handleSelectChange("category", value)}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {productCategories.map(category => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="category_type">Category Type</Label>
          <Select 
            value={product.category_type} 
            onValueChange={(value) => handleSelectChange("category_type", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category type" />
            </SelectTrigger>
            <SelectContent>
              {categoryTypes.map(type => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="price">Price ($) *</Label>
          <Input 
            id="price" 
            name="price" 
            type="number" 
            min="0.01" 
            step="0.01" 
            value={product.price} 
            onChange={handleChange} 
            placeholder="0.00"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="wholesale_price">Wholesale Price ($)</Label>
          <Input 
            id="wholesale_price" 
            name="wholesale_price" 
            type="number" 
            min="0.01" 
            step="0.01" 
            value={product.wholesale_price} 
            onChange={handleChange} 
            placeholder="0.00"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="retail_price">Retail Price ($)</Label>
          <Input 
            id="retail_price" 
            name="retail_price" 
            type="number" 
            min="0.01" 
            step="0.01" 
            value={product.retail_price} 
            onChange={handleChange} 
            placeholder="0.00"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="trainer_price">Trainer Price ($)</Label>
          <Input 
            id="trainer_price" 
            name="trainer_price" 
            type="number" 
            min="0.01" 
            step="0.01" 
            value={product.trainer_price} 
            onChange={handleChange} 
            placeholder="0.00"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="purchased_price">Purchased Price ($)</Label>
          <Input 
            id="purchased_price" 
            name="purchased_price" 
            type="number" 
            min="0.01" 
            step="0.01" 
            value={product.purchased_price} 
            onChange={handleChange} 
            placeholder="0.00"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="sku">SKU *</Label>
          <Input 
            id="sku" 
            name="sku" 
            value={product.sku} 
            onChange={handleChange} 
            placeholder="Unique product code"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="stock">Stock Quantity</Label>
          <Input 
            id="stock" 
            name="stock" 
            type="number" 
            min="0" 
            step="1" 
            value={product.stock} 
            onChange={handleChange} 
            placeholder="0"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="threshold">Low Stock Threshold</Label>
          <Input 
            id="threshold" 
            name="threshold" 
            type="number" 
            min="1" 
            step="1" 
            value={product.threshold} 
            onChange={handleChange} 
            placeholder="5"
          />
        </div>
        
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="image_url">Image URL</Label>
          <Input 
            id="image_url" 
            name="image_url" 
            value={product.image_url} 
            onChange={handleChange} 
            placeholder="https://example.com/image.jpg"
          />
        </div>
        
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea 
            id="description" 
            name="description" 
            value={product.description} 
            onChange={handleChange} 
            placeholder="Product description..."
            rows={4}
          />
        </div>
      </div>
      
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => {
          if (onSuccess) onSuccess();
        }}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Adding..." : "Add Product"}
        </Button>
      </div>
    </form>
  );
};

export default AddProductForm;
