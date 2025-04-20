import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import { formatCurrency } from "@/utils/format";
import { ProductCombobox } from "./ProductCombobox"; // Import the new component
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
  onSubtotalChange: (index: number, value: number) => void; // New prop for handling subtotal change
}

export const OrderItemManager = ({
  items,
  currentItem,
  products = [],
  productsLoading,
  onAddItem,
  onRemoveItem,
  onItemChange,
  calculateTotal,
  onSubtotalChange,
}: OrderItemManagerProps) => {
  return (
    <div className="border p-4 rounded-md">
      <h3 className="font-medium mb-2">Order Items</h3>

      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <div className="flex-grow space-y-2">
          <Label htmlFor="product">Product</Label>
          <ProductCombobox
            value={currentItem.product_id}
            onChange={(val) => onItemChange("product_id", val)}
            products={products}
            productsLoading={productsLoading}
          />
        </div>

        <div className="w-full md:w-24 space-y-2">
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            id="quantity"
            type="number"
            min="1"
            step="1"
            value={currentItem.quantity}
            onChange={(e) =>
              onItemChange("quantity", parseInt(e.target.value) || 1)
            }
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
        <OrderItemsTable
          items={items}
          onRemoveItem={onRemoveItem}
          calculateTotal={calculateTotal}
          onSubtotalChange={onSubtotalChange} // Pass the new handler for subtotal
        />
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
  onSubtotalChange: (index: number, value: number) => void; // New prop for handling subtotal change
}

export const OrderItemsTable = ({
  items,
  onRemoveItem,
  calculateTotal,
  onSubtotalChange,
}: OrderItemsTableProps) => {
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
              <td className="py-2 text-right">
                {formatCurrency(item.price)}
              </td>
              <td className="py-2 text-right">{item.quantity}</td>
              <td className="py-2 text-right">
                <Input
                  type="number"
                  value={item.subtotal}
                  onChange={(e) => {
                    const newSubtotal = parseFloat(e.target.value);
                    if (!isNaN(newSubtotal)) {
                      onSubtotalChange(index, newSubtotal); // Update subtotal
                    }
                  }}
                  step="0.01"
                  min="0"
                  className="w-full"
                />
              </td>
              <td className="py-2 text-right">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onRemoveItem(index)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={3} className="py-2 text-right font-medium">
              Total:
            </td>
            <td className="py-2 text-right font-medium">
              {formatCurrency(calculateTotal())}
            </td>
            <td></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};
