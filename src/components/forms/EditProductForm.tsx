
import { useState } from "react";
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

const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  sku: z.string().min(1, "SKU is required"),
  category: z.string().min(1, "Category is required"),
  category_type: z.string().optional(),
  description: z.string().optional(),
  price: z.coerce.number().min(0, "Price must be a positive number"),
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
  product: ProductFormValues & { id: string };
  onSuccess: () => void;
  onCancel: () => void;
}

export default function EditProductForm({ product, onSuccess, onCancel }: EditProductFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product.name,
      sku: product.sku,
      category: product.category,
      category_type: product.category_type || "",
      description: product.description || "",
      price: product.price,
      wholesale_price: product.wholesale_price || undefined,
      retail_price: product.retail_price || undefined,
      trainer_price: product.trainer_price || undefined,
      purchased_price: product.purchased_price || undefined,
      stock: product.stock,
      threshold: product.threshold,
      image_url: product.image_url || "",
    },
  });

  async function onSubmit(values: ProductFormValues) {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("products")
        .update({
          ...values,
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
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Input placeholder="Enter category" {...field} />
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

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price (INR)</FormLabel>
                <FormControl>
                  <Input type="number" min="0" step="0.01" {...field} />
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
                <FormLabel>Wholesale Price (INR)</FormLabel>
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
            name="retail_price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Retail Price (INR)</FormLabel>
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
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <FormField
            control={form.control}
            name="trainer_price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Trainer Price (INR)</FormLabel>
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
            name="purchased_price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Purchased Price (INR)</FormLabel>
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
