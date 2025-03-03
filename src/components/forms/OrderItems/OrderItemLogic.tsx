
import { type Product, type OrderItem, type CurrentItemState } from "@/hooks/use-order-form";

export const addOrderItem = (
  currentItem: CurrentItemState,
  order: { items: OrderItem[] },
  products?: Product[],
  onError?: (message: string) => void
) => {
  if (!currentItem.product_id || currentItem.quantity <= 0) {
    if (onError) onError("Please select a product and enter a valid quantity");
    return null;
  }

  const product = products?.find(p => p.id === currentItem.product_id);
  if (!product) return null;

  if (currentItem.quantity > product.stock) {
    if (onError) onError(`Only ${product.stock} units available`);
    return null;
  }

  const existingItemIndex = order.items.findIndex(
    item => item.product_id === currentItem.product_id
  );

  if (existingItemIndex >= 0) {
    const updatedItems = [...order.items];
    const newQuantity = updatedItems[existingItemIndex].quantity + currentItem.quantity;
    
    if (newQuantity > product.stock) {
      if (onError) onError(`You already have ${updatedItems[existingItemIndex].quantity} in your order. Only ${product.stock} units available in total.`);
      return null;
    }
    
    updatedItems[existingItemIndex] = {
      ...updatedItems[existingItemIndex],
      quantity: newQuantity,
      subtotal: product.price * newQuantity,
    };
    
    return updatedItems;
  } else {
    const newItem: OrderItem = {
      product_id: product.id,
      product_name: product.name,
      price: product.price,
      quantity: currentItem.quantity,
      subtotal: product.price * currentItem.quantity,
    };
    
    return [...order.items, newItem];
  }
};

export const removeOrderItem = (items: OrderItem[], index: number) => {
  const updatedItems = [...items];
  updatedItems.splice(index, 1);
  return updatedItems;
};
