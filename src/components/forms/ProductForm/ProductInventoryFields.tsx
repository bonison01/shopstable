
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ProductInventoryFieldsProps {
  stock: string | number;
  threshold: string | number;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProductInventoryFields = ({
  stock,
  threshold,
  handleChange,
}: ProductInventoryFieldsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="stock">Stock Quantity</Label>
        <Input
          id="stock"
          name="stock"
          type="number"
          min="0"
          step="1"
          value={stock}
          onChange={handleChange}
          placeholder="0"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="threshold">Low Stock Threshold</Label>
        <Input
          id="threshold"
          name="threshold"
          type="number"
          min="1"
          step="1"
          value={threshold}
          onChange={handleChange}
          placeholder="5"
        />
      </div>
    </div>
  );
};

export default ProductInventoryFields;
