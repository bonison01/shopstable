import React, { useState, useEffect } from "react";
import { OrderItem } from "../types";

type OrderItemsTableProps = {
    items: OrderItem[];
    onItemsChange?: (updatedItems: OrderItem[]) => void;
};

const OrderItemsTable: React.FC<OrderItemsTableProps> = ({ items, onItemsChange }) => {
    const [editedItems, setEditedItems] = useState<OrderItem[]>([]);
    const [editMode, setEditMode] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
        setEditedItems(items);
    }, [items]);

    const handlePriceChange = (id: string, newPrice: string) => {
        const updatedItems = editedItems.map((item) => {
            if (item.id === id) {
                const updatedPrice = parseFloat(newPrice) || 0;
                return {
                    ...item,
                    price: updatedPrice,
                    subtotal: updatedPrice * item.quantity,
                };
            }
            return item;
        });
        setEditedItems(updatedItems);
        if (onItemsChange) onItemsChange(updatedItems);
    };

    const toggleEdit = (id: string) => {
        setEditMode((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    return (
        <table>
            <thead>
                <tr>
                    <th>Product Name</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Subtotal</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {editedItems.map((item) => (
                    <tr key={item.id}>
                        <td>{item.product_name}</td>
                        <td>
                            {editMode[item.id] ? (
                                <input
                                    type="number"
                                    value={item.price}
                                    onChange={(e) => handlePriceChange(item.id, e.target.value)}
                                    step="0.01"
                                    style={{ width: "100px" }}
                                />
                            ) : (
                                item.price.toFixed(2)
                            )}
                        </td>
                        <td>{item.quantity}</td>
                        <td>{(item.price * item.quantity).toFixed(2)}</td>
                        <td>
                            <button onClick={() => toggleEdit(item.id)}>
                                {editMode[item.id] ? "Save" : "Edit"}
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default OrderItemsTable;
