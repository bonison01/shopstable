
import { type Product, type OrderItem, type CurrentItemState, type Customer } from "@/hooks/use-order-form";

export const getProductPrice = (
  product: Product,
  customers?: Customer[],
  customerId?: string
): number => {
  if (!customers || !customerId) {
    return product.price; // Default price
  }

  const customer = customers.find(c => c.id === customerId);
  if (!customer) {
    return product.price; // Customer not found, use default price
  }

  switch (customer.customer_type) {
    case 'wholesale':
      return product.wholesale_price !== null && product.wholesale_price !== undefined 
        ? product.wholesale_price 
        : product.price;
    case 'trainer':
      return product.trainer_price !== null && product.trainer_price !== undefined 
        ? product.trainer_price 
        : product.price;
    case 'retail':
      return product.retail_price !== null && product.retail_price !== undefined 
        ? product.retail_price 
        : product.price;
    default:
      return product.price;
  }
};

export const addOrderItem = (
  currentItem: CurrentItemState,
  order: { customer_id: string, items: OrderItem[] },
  products?: Product[],
  customers?: Customer[],
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

  // Get the appropriate price based on customer type
  const itemPrice = getProductPrice(product, customers, order.customer_id);

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
      subtotal: itemPrice * newQuantity,
    };
    
    return updatedItems;
  } else {
    const newItem: OrderItem = {
      product_id: product.id,
      product_name: product.name,
      price: itemPrice,
      quantity: currentItem.quantity,
      subtotal: itemPrice * currentItem.quantity,
    };
    
    return [...order.items, newItem];
  }
};

export const removeOrderItem = (items: OrderItem[], index: number) => {
  const updatedItems = [...items];
  updatedItems.splice(index, 1);
  return updatedItems;
};
