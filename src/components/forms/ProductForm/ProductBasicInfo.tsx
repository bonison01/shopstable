
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const categoryTypes = [
  "Protein",
  "Gainer",
  "Creatine",
  "Glutamine",
  "Fish Oil",
  "Multi",
  "Others"
];

interface ProductBasicInfoProps {
  name: string;
  sku: string;
  categoryType: string;
  price: string | number;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  isFormControlled?: boolean;
}

const ProductBasicInfo = ({
  name,
  sku,
  categoryType,
  price,
  handleChange,
  handleSelectChange,
  isFormControlled = false,
}: ProductBasicInfoProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="name">Product Name *</Label>
        <Input
          id="name"
          name="name"
          value={name}
          onChange={handleChange}
          placeholder="Enter product name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category_type">Category Type</Label>
        <Select
          value={categoryType}
          onValueChange={(value) => handleSelectChange("category_type", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select category type" />
          </SelectTrigger>
          <SelectContent>
            {categoryTypes.map(type => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="price">Base Price (₹) *</Label>
        <Input
          id="price"
          name="price"
          type="number"
          min="0.01"
          step="0.01"
          value={price}
          onChange={handleChange}
          placeholder="0.00"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="sku">SKU *</Label>
        <Input
          id="sku"
          name="sku"
          value={sku}
          onChange={handleChange}
          placeholder="Unique product code"
          required
        />
      </div>
    </div>
  );
};

export default ProductBasicInfo;
