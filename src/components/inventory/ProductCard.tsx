
import { useState } from "react";
import { formatCurrency } from "@/utils/format";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash, CheckCircle, AlertTriangle, XCircle } from "lucide-react";

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

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

const ProductCard = ({ product, onEdit, onDelete }: ProductCardProps) => {
  const getStockStatus = (product: Product) => {
    if (product.stock === 0) {
      return { label: "Out of Stock", variant: "destructive", icon: XCircle };
    } else if (product.stock <= product.threshold) {
      return { label: "Low Stock", variant: "warning", icon: AlertTriangle };
    } else {
      return { label: "In Stock", variant: "success", icon: CheckCircle };
    }
  };

  const stockStatus = getStockStatus(product);

  return (
    <Card key={product.id} className="overflow-hidden">
      <div className="h-3 bg-primary w-full"></div>
      <CardHeader className="p-4 pb-0">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="line-clamp-1" title={product.name}>
              {product.name}
            </CardTitle>
            <CardDescription>
              SKU: {product.sku}
            </CardDescription>
          </div>
          <Badge variant={
            stockStatus.variant === "success" ? "default" : 
            stockStatus.variant === "warning" ? "secondary" : 
            "destructive"
          }>
            <stockStatus.icon className="h-3 w-3 mr-1" /> 
            {stockStatus.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex flex-col gap-2 text-sm">
          {product.category_type && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Type:</span>
              <span className="font-medium">{product.category_type}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-muted-foreground">Price:</span>
            <span className="font-medium">{formatCurrency(product.price)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Stock:</span>
            <span className="font-medium">{product.stock} units</span>
          </div>
        </div>
        
        <div className="flex gap-2 mt-4">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => onEdit(product)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 text-red-500 hover:text-red-600"
            onClick={() => onDelete(product)}
          >
            <Trash className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
