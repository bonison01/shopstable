
import { useState } from "react";

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

export function useProductFilters() {
  const [searchQuery, setSearchQuery] = useState("");
  const [stockFilter, setStockFilter] = useState("all");

  const filterProducts = (products: Product[] | undefined) => {
    return products?.filter(product => {
      const matchesSearch = 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesStock = 
        stockFilter === "all" || 
        (stockFilter === "in-stock" && product.stock > 0) ||
        (stockFilter === "low-stock" && product.stock <= product.threshold && product.stock > 0) ||
        (stockFilter === "out-of-stock" && product.stock === 0);
      
      return matchesSearch && matchesStock;
    });
  };

  return {
    searchQuery,
    setSearchQuery,
    stockFilter,
    setStockFilter,
    filterProducts
  };
}
