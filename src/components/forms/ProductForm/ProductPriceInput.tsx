
import { useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { calculateDiscountedPrice } from "@/utils/format";

interface ProductPriceInputProps {
  basePrice: string | number;
  discountPercent: string | number;
  discountedPrice: string | number;
  discountName: string;
  priceName: string;
  readOnly?: boolean;
  onDiscountChange: (value: string) => void;
}

const ProductPriceInput = ({
  basePrice,
  discountPercent,
  discountedPrice,
  discountName,
  priceName,
  readOnly = false,
  onDiscountChange,
}: ProductPriceInputProps) => {
  const basePriceNum = typeof basePrice === 'string' ? parseFloat(basePrice) : basePrice;
  const discountPercentNum = typeof discountPercent === 'string' ? parseFloat(discountPercent) : discountPercent;

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor={discountName}>{discountName} Discount (%)</Label>
        <Input
          id={discountName}
          name={discountName}
          type="number"
          min="0"
          max="100"
          step="1"
          value={discountPercent}
          onChange={(e) => onDiscountChange(e.target.value)}
          placeholder={readOnly ? "Calculated" : "0"}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={priceName}>{priceName} Price (₹)</Label>
        <Input
          id={priceName}
          name={priceName}
          type="number"
          min="0.01"
          step="0.01"
          value={discountedPrice}
          readOnly
          className="bg-gray-100"
          placeholder="Calculated from discount"
        />
      </div>
    </>
  );
};

export default ProductPriceInput;
