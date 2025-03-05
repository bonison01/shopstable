
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCurrency, formatDate, getStatusColor } from "@/utils/format";
import { Edit, Eye, Loader2, Save, X } from "lucide-react";

interface EditableOrderData {
  id: string;
  status: string;
  payment_status: string;
}

interface OrdersTableProps {
  orders: any[];
  isLoading: boolean;
  onAddOrder: () => void;
  editingOrder: EditableOrderData | null;
  startEditing: (order: any) => void;
  cancelEditing: () => void;
  updateOrder: () => Promise<void>;
  isUpdating: boolean;
  handleStatusChange: (value: string) => void;
  handlePaymentStatusChange: (value: string) => void;
  openOrderDetails: (orderId: string) => void;
}

export const OrdersTable = ({ 
  orders, 
  isLoading, 
  onAddOrder,
  editingOrder,
  startEditing,
  cancelEditing,
  updateOrder,
  isUpdating,
  handleStatusChange,
  handlePaymentStatusChange,
  openOrderDetails
}: OrdersTableProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse flex items-center">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          Loading orders...
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 border rounded-lg bg-card">
        <div className="text-center">
          <p className="text-muted-foreground mb-2">No orders found</p>
          <Button variant="outline" size="sm" onClick={onAddOrder}>
            <Plus className="h-4 w-4 mr-2" />
            Create New Order
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="data-table-container fade-in">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b text-left bg-muted/50">
            <th className="py-3 px-4 font-medium">Order ID</th>
            <th className="py-3 px-4 font-medium">Customer</th>
            <th className="py-3 px-4 font-medium">Date</th>
            <th className="py-3 px-4 font-medium">Status</th>
            <th className="py-3 px-4 font-medium">Items</th>
            <th className="py-3 px-4 font-medium">Payment</th>
            <th className="py-3 px-4 font-medium text-right">Total</th>
            <th className="py-3 px-4 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b hover:bg-muted/40 transition-colors">
              <td className="py-3 px-4 font-medium">{order.id.substring(0, 8)}</td>
              <td className="py-3 px-4">{order.customers?.name || 'Unknown'}</td>
              <td className="py-3 px-4">{formatDate(order.date)}</td>
              <td className="py-3 px-4">
                {editingOrder && editingOrder.id === order.id ? (
                  <Select 
                    value={editingOrder.status} 
                    onValueChange={handleStatusChange}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Badge className={`${getStatusColor(order.status)} text-white`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                )}
              </td>
              <td className="py-3 px-4">{order.order_items?.length || 0}</td>
              <td className="py-3 px-4">
                {editingOrder && editingOrder.id === order.id ? (
                  <Select 
                    value={editingOrder.payment_status} 
                    onValueChange={handlePaymentStatusChange}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select payment status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="refunded">Refunded</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Badge 
                    variant={order.payment_status === 'paid' ? 'default' : 
                            order.payment_status === 'pending' ? 'secondary' : 
                            'destructive'}
                  >
                    {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                  </Badge>
                )}
              </td>
              <td className="py-3 px-4 text-right font-medium">{formatCurrency(order.total)}</td>
              <td className="py-3 px-4">
                {editingOrder && editingOrder.id === order.id ? (
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={updateOrder}
                      disabled={isUpdating}
                    >
                      {isUpdating ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4" />
                      )}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={cancelEditing}
                      disabled={isUpdating}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => openOrderDetails(order.id)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => startEditing(order)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Missing import for Plus icon
import { Plus } from "lucide-react";
