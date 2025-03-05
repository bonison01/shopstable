import { useState } from "react";

interface Product {
  id: string;
  name: string;
  sku: string;
  description?: string | null;
  stock: number;
  threshold: number;
  // other properties
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
