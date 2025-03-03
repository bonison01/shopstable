
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { formatCurrency } from "@/utils/format";
import { type OrderItem, type Product, type CurrentItemState } from "@/hooks/use-order-form";

interface OrderItemManagerProps {
  items: OrderItem[];
  currentItem: CurrentItemState;
  products?: Product[];
  productsLoading: boolean;
  onAddItem: () => void;
  onRemoveItem: (index: number) => void;
  onItemChange: (name: string, value: string | number) => void;
  calculateTotal: () => number;
}

export const OrderItemManager = ({
  items,
  currentItem,
  products,
  productsLoading,
  onAddItem,
  onRemoveItem,
  onItemChange,
  calculateTotal
}: OrderItemManagerProps) => {
  return (
    <div className="border p-4 rounded-md">
      <h3 className="font-medium mb-2">Order Items</h3>
      
      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <div className="flex-grow space-y-2">
          <Label htmlFor="product">Product</Label>
          <Select 
            value={currentItem.product_id} 
            onValueChange={(value) => onItemChange("product_id", value)}
            disabled={productsLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select product" />
            </SelectTrigger>
            <SelectContent>
              {products?.map(product => (
                <SelectItem key={product.id} value={product.id} disabled={product.stock <= 0}>
                  {product.name} - {formatCurrency(product.price)} {product.stock <= 0 ? "(Out of stock)" : `(${product.stock} in stock)`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="w-full md:w-24 space-y-2">
          <Label htmlFor="quantity">Quantity</Label>
          <Input 
            id="quantity" 
            type="number" 
            min="1" 
            step="1" 
            value={currentItem.quantity} 
            onChange={(e) => onItemChange("quantity", parseInt(e.target.value) || 1)} 
          />
        </div>
        
        <div className="flex items-end">
          <Button 
            type="button" 
            onClick={onAddItem}
            disabled={!currentItem.product_id}
          >
            <Plus className="h-4 w-4 mr-2" /> Add Item
          </Button>
        </div>
      </div>
      
      {items.length > 0 ? (
        <OrderItemsTable items={items} onRemoveItem={onRemoveItem} calculateTotal={calculateTotal} />
      ) : (
        <div className="text-center py-6 text-muted-foreground">
          No items added to this order yet.
        </div>
      )}
    </div>
  );
};

interface OrderItemsTableProps {
  items: OrderItem[];
  onRemoveItem: (index: number) => void;
  calculateTotal: () => number;
}

export const OrderItemsTable = ({ items, onRemoveItem, calculateTotal }: OrderItemsTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="py-2 text-left">Product</th>
            <th className="py-2 text-right">Price</th>
            <th className="py-2 text-right">Quantity</th>
            <th className="py-2 text-right">Subtotal</th>
            <th className="py-2 text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index} className="border-b">
              <td className="py-2">{item.product_name}</td>
              <td className="py-2 text-right">{formatCurrency(item.price)}</td>
              <td className="py-2 text-right">{item.quantity}</td>
              <td className="py-2 text-right">{formatCurrency(item.subtotal)}</td>
              <td className="py-2 text-right">
                <Button size="sm" variant="ghost" onClick={() => onRemoveItem(index)}>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={3} className="py-2 text-right font-medium">Total:</td>
            <td className="py-2 text-right font-medium">{formatCurrency(calculateTotal())}</td>
            <td></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};
