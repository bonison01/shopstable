
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { type Product } from "@/data/mockData";
import { formatCurrency } from "@/utils/format";

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  const isLowStock = product.stock <= product.threshold;

  return (
    <Card 
      className="hover:shadow-elevation transition-all-300 hover-lift cursor-pointer animate-fade-in"
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <p className="text-lg font-medium leading-none">{product.name}</p>
          <Badge 
            variant={isLowStock ? "destructive" : "default"}
            className="ml-2"
          >
            {isLowStock ? "Low Stock" : "In Stock"}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{product.category}</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div>
            <p className="text-sm text-muted-foreground">Price</p>
            <p className="text-lg font-medium">{formatCurrency(product.price)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Stock</p>
            <p className={`text-lg font-medium ${isLowStock ? "text-destructive" : ""}`}>
              {product.stock} units
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">SKU</p>
            <p className="text-base">{product.sku}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Updated</p>
            <p className="text-base">{new Date(product.lastUpdated).toLocaleDateString()}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
