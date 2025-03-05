import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DialogFooter } from "@/components/ui/dialog";
import { calculateDiscountedPrice } from "@/utils/format";

const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  sku: z.string().min(1, "SKU is required"),
  category_type: z.string().optional(),
  description: z.string().optional(),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  wholesale_discount: z.coerce.number().min(0).max(100).default(10),
  retail_discount: z.coerce.number().min(0).max(100).default(0),
  trainer_discount: z.coerce.number().min(0).max(100).default(20),
  wholesale_price: z.coerce.number().optional(),
  retail_price: z.coerce.number().optional(),
  trainer_price: z.coerce.number().optional(),
  purchased_price: z.coerce.number().optional(),
  stock: z.coerce.number().min(0, "Stock must be a positive number"),
  threshold: z.coerce.number().min(0, "Threshold must be a positive number"),
  image_url: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface EditProductFormProps {
  product: {
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
  };
  onSuccess: () => void;
  onCancel: () => void;
}

export default function EditProductForm({ product, onSuccess, onCancel }: EditProductFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const getInitialDiscounts = () => {
    const basePrice = product.price || 0;
    const wholesaleDiscount = product.wholesale_price 
      ? Math.round(((basePrice - (product.wholesale_price || 0)) / basePrice) * 100) 
      : 10;
    const retailDiscount = product.retail_price 
      ? Math.round(((basePrice - (product.retail_price || 0)) / basePrice) * 100) 
      : 0;
    const trainerDiscount = product.trainer_price 
      ? Math.round(((basePrice - (product.trainer_price || 0)) / basePrice) * 100) 
      : 20;
    
    return {
      wholesale_discount: wholesaleDiscount >= 0 ? wholesaleDiscount : 10,
      retail_discount: retailDiscount >= 0 ? retailDiscount : 0,
      trainer_discount: trainerDiscount >= 0 ? trainerDiscount : 20,
    };
  };

  const initialDiscounts = getInitialDiscounts();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product.name,
      sku: product.sku,
      category_type: product.category_type || "",
      description: product.description || "",
      price: product.price,
      wholesale_discount: initialDiscounts.wholesale_discount,
      retail_discount: initialDiscounts.retail_discount,
      trainer_discount: initialDiscounts.trainer_discount,
      wholesale_price: product.wholesale_price || undefined,
      retail_price: product.retail_price || undefined,
      trainer_price: product.trainer_price || undefined,
      purchased_price: product.purchased_price || undefined,
      stock: product.stock,
      threshold: product.threshold,
      image_url: product.image_url || "",
    },
  });

  useEffect(() => {
    const basePrice = form.watch('price');
    const wholesaleDiscount = form.watch('wholesale_discount');
    const retailDiscount = form.watch('retail_discount');
    const trainerDiscount = form.watch('trainer_discount');
    
    if (basePrice > 0) {
      form.setValue('wholesale_price', calculateDiscountedPrice(basePrice, wholesaleDiscount));
      form.setValue('retail_price', calculateDiscountedPrice(basePrice, retailDiscount));
      form.setValue('trainer_price', calculateDiscountedPrice(basePrice, trainerDiscount));
    }
  }, [form.watch('price'), form.watch('wholesale_discount'), form.watch('retail_discount'), form.watch('trainer_discount')]);

  async function onSubmit(values: ProductFormValues) {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("products")
        .update({
          ...values,
          category: product.category,
          last_updated: new Date().toISOString(),
        })
        .eq("id", product.id);

      if (error) throw error;

      toast({
        title: "Product updated",
        description: "The product has been successfully updated.",
      });
      onSuccess();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error updating product",
        description: error.message || "An error occurred while updating the product.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter product name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sku"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SKU</FormLabel>
                <FormControl>
                  <Input placeholder="Enter SKU" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category Type</FormLabel>
                <FormControl>
                  <Input placeholder="Enter category type (optional)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Base Price (₹)</FormLabel>
                <FormControl>
                  <Input type="number" min="0" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter product description (optional)"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="wholesale_discount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Wholesale Discount (%)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="0" 
                    max="100" 
                    step="1" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="wholesale_price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Wholesale Price (₹)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="0" 
                    step="0.01" 
                    readOnly
                    className="bg-gray-100" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="retail_discount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Retail Discount (%)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="0" 
                    max="100" 
                    step="1" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="retail_price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Retail Price (₹)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="0" 
                    step="0.01" 
                    readOnly
                    className="bg-gray-100" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="trainer_discount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Trainer Discount (%)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="0" 
                    max="100" 
                    step="1" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="trainer_price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Trainer Price (₹)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="0" 
                    step="0.01" 
                    readOnly
                    className="bg-gray-100" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="purchased_price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Purchased Price (₹)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="0" 
                    step="0.01" 
                    placeholder="Optional" 
                    {...field} 
                    value={field.value === undefined ? "" : field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="image_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image URL</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter image URL (optional)" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock</FormLabel>
                <FormControl>
                  <Input type="number" min="0" step="1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="threshold"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock Alert Threshold</FormLabel>
                <FormControl>
                  <Input type="number" min="0" step="1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Updating..." : "Update Product"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
