
import React from "react";
import ProductCard from "@/components/inventory/ProductCard";
import EmptyInventory from "@/components/inventory/EmptyInventory";

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

interface ProductListingProps {
  isLoading: boolean;
  error: Error | null;
  filteredProducts: Product[] | undefined;
  onAddProduct: () => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (product: Product) => void;
}

const ProductListing: React.FC<ProductListingProps> = ({
  isLoading,
  error,
  filteredProducts,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse">Loading inventory...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        Error loading inventory. Please try again.
      </div>
    );
  }

  if (filteredProducts?.length === 0) {
    return <EmptyInventory onAddProduct={onAddProduct} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredProducts?.map((product: Product) => (
        <ProductCard
          key={product.id}
          product={product}
          onEdit={() => onEditProduct(product)}
          onDelete={() => onDeleteProduct(product)}
        />
      ))}
    </div>
  );
};

export default ProductListing;
