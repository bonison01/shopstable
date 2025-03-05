
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import ProductPriceInput from "./ProductPriceInput";

interface ProductPricingSectionProps {
  basePrice: string | number;
  purchasedPrice: string | number;
  wholesaleDiscount: string | number;
  retailDiscount: string | number;
  trainerDiscount: string | number;
  wholesalePrice: string | number;
  retailPrice: string | number;
  trainerPrice: string | number;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDiscountChange: (name: string, value: string) => void;
}

const ProductPricingSection = ({
  basePrice,
  purchasedPrice,
  wholesaleDiscount,
  retailDiscount,
  trainerDiscount,
  wholesalePrice,
  retailPrice,
  trainerPrice,
  handleChange,
  handleDiscountChange,
}: ProductPricingSectionProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="purchased_price">Purchased Price (₹)</Label>
          <Input
            id="purchased_price"
            name="purchased_price"
            type="number"
            min="0.01"
            step="0.01"
            value={purchasedPrice}
            onChange={handleChange}
            placeholder="0.00"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ProductPriceInput
          basePrice={basePrice}
          discountPercent={wholesaleDiscount}
          discountedPrice={wholesalePrice}
          discountName="wholesale_discount"
          priceName="Wholesale"
          onDiscountChange={(value) => handleDiscountChange("wholesale_discount", value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ProductPriceInput
          basePrice={basePrice}
          discountPercent={retailDiscount}
          discountedPrice={retailPrice}
          discountName="retail_discount"
          priceName="Retail"
          onDiscountChange={(value) => handleDiscountChange("retail_discount", value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ProductPriceInput
          basePrice={basePrice}
          discountPercent={trainerDiscount}
          discountedPrice={trainerPrice}
          discountName="trainer_discount"
          priceName="Trainer"
          onDiscountChange={(value) => handleDiscountChange("trainer_discount", value)}
        />
      </div>
    </div>
  );
};

export default ProductPricingSection;
