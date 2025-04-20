// src/lib/api/orders.ts

export async function deleteOrderById(orderId: string) {
    const res = await fetch(`/api/orders/${orderId}`, {
      method: "DELETE",
    });
  
    if (!res.ok) {
      throw new Error("Failed to delete order");
    }
  
    return await res.json();
  }
  