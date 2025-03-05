
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { calculateDiscountedPrice } from "@/utils/format";
import { useAuth } from "@/contexts/auth/useAuth";

export const useProductForm = (onSuccess?: () => void) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [product, setProduct] = useState({
    name: "",
    category_type: "",
    price: "",
    wholesale_discount: "10",
    retail_discount: "0",
    trainer_discount: "20",
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

  // Calculate discounted prices when base price or discount percentages change
  useEffect(() => {
    const basePrice = parseFloat(product.price);
    if (!isNaN(basePrice)) {
      const wholesaleDiscount = parseFloat(product.wholesale_discount);
      const retailDiscount = parseFloat(product.retail_discount);
      const trainerDiscount = parseFloat(product.trainer_discount);
      
      setProduct(prev => ({
        ...prev,
        wholesale_price: calculateDiscountedPrice(basePrice, wholesaleDiscount).toFixed(2),
        retail_price: calculateDiscountedPrice(basePrice, retailDiscount).toFixed(2),
        trainer_price: calculateDiscountedPrice(basePrice, trainerDiscount).toFixed(2)
      }));
    }
  }, [product.price, product.wholesale_discount, product.retail_discount, product.trainer_discount]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleDiscountChange = (name: string, value: string) => {
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Simple validation
      if (!product.name || !product.price || !product.sku) {
        throw new Error("Please fill in all required fields");
      }

      if (!user) {
        throw new Error("You must be logged in to add a product");
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
          category: 'Default',  // Using a default value since category is removed
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
          image_url: product.image_url || null,
          user_id: user.id // Set user_id to current authenticated user
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
        category_type: "",
        price: "",
        wholesale_discount: "10",
        retail_discount: "0",
        trainer_discount: "20",
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

  return {
    product,
    isSubmitting,
    error,
    handleChange,
    handleSelectChange,
    handleDiscountChange,
    handleSubmit
  };
};
