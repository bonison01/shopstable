// src/types.ts

export type OrderItem = {
    id: string;
    order_id: string;
    product_id: string;
    product_name: string;
    price: number;
    quantity: number;
    subtotal: number;
};

export type Product = {
    id: string;
    name: string;
    price: number;
    stock: number;
};

export type Database = {
    order_items: OrderItem[];
    products: Product[];
};
