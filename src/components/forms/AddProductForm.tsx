
import { useProductForm } from "./ProductForm/useProductForm";
import ProductBasicInfo from "./ProductForm/ProductBasicInfo";
import ProductPricingSection from "./ProductForm/ProductPricingSection";
import ProductInventoryFields from "./ProductForm/ProductInventoryFields";
import ProductAdditionalInfo from "./ProductForm/ProductAdditionalInfo";
import ProductFormError from "./ProductForm/ProductFormError";
import ProductFormActions from "./ProductForm/ProductFormActions";

const AddProductForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const {
    product,
    isSubmitting,
    error,
    handleChange,
    handleSelectChange,
    handleDiscountChange,
    handleSubmit
  } = useProductForm(onSuccess);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <ProductFormError error={error} />
      
      <ProductBasicInfo
        name={product.name}
        sku={product.sku}
        categoryType={product.category_type}
        price={product.price}
        handleChange={handleChange}
        handleSelectChange={handleSelectChange}
      />
      
      <ProductPricingSection
        basePrice={product.price}
        purchasedPrice={product.purchased_price}
        wholesaleDiscount={product.wholesale_discount}
        retailDiscount={product.retail_discount}
        trainerDiscount={product.trainer_discount}
        wholesalePrice={product.wholesale_price}
        retailPrice={product.retail_price}
        trainerPrice={product.trainer_price}
        handleChange={handleChange}
        handleDiscountChange={handleDiscountChange}
      />
      
      <ProductInventoryFields
        stock={product.stock}
        threshold={product.threshold}
        handleChange={handleChange}
      />
      
      <div className="space-y-4">
        <ProductAdditionalInfo
          imageUrl={product.image_url}
          description={product.description}
          handleChange={handleChange}
        />
      </div>
      
      <ProductFormActions 
        isSubmitting={isSubmitting}
        onCancel={() => {
          if (onSuccess) onSuccess();
        }}
      />
    </form>
  );
};

export default AddProductForm;
