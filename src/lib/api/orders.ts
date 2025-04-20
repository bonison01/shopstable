import { supabase } from "@/integrations/supabase/client";

/**
 * Deletes an order by ID from the Supabase database.
 * @param orderId - The ID of the order to delete
 */
export async function deleteOrderById(orderId: string) {
  const { error } = await supabase
    .from("orders") // table name
    .delete()
    .eq("id", orderId);

  if (error) {
    console.error("Supabase delete error:", error);
    throw new Error("Failed to delete order.");
  }

  return { message: "Order deleted successfully" };
}
