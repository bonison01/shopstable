import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Customer } from "@/pages/Customers";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save } from "lucide-react";
import { useAuth } from "@/contexts/auth/useAuth";

interface CustomerDetailsDialogProps {
  customerId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onCustomerUpdated: () => void;
}

interface Order {
  id: string;
  date: string;
  total: number;
  status: string;
  payment_status: string;
}

export function CustomerDetailsDialog({ 
  customerId, 
  isOpen, 
  onClose,
  onCustomerUpdated
}: CustomerDetailsDialogProps) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth(); // Get current authenticated user

  const { data: customerData, isLoading: isLoadingCustomer } = useQuery({
    queryKey: ["customer", customerId],
    queryFn: async () => {
      if (!customerId || !user) return null;
      
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .eq("id", customerId)
        .eq("user_id", user.id) // Only fetch customer if it belongs to current user
        .single();
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching customer",
          description: error.message,
        });
        throw error;
      }
      
      return data as Customer;
    },
    enabled: !!customerId && !!user && isOpen,
  });

  const { data: orders, isLoading: isLoadingOrders } = useQuery({
    queryKey: ["customer-orders", customerId],
    queryFn: async () => {
      if (!customerId || !user) return [];
      
      const { data, error } = await supabase
        .from("orders")
        .select("id, date, total, status, payment_status")
        .eq("customer_id", customerId)
        .eq("user_id", user.id) // Only fetch orders that belong to current user
        .order("date", { ascending: false });
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching orders",
          description: error.message,
        });
        throw error;
      }
      
      return data as Order[];
    },
    enabled: !!customerId && !!user && isOpen,
  });

  useEffect(() => {
    if (customerData) {
      setCustomer(customerData);
    }
  }, [customerData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomer(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleSaveCustomer = async () => {
    if (!customer || !user) return;
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from("customers")
        .update({
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          address: customer.address,
          customer_type: customer.customer_type,
          user_id: user.id, // Ensure user_id is preserved during update
        })
        .eq("id", customer.id)
        .eq("user_id", user.id); // Only update if the customer belongs to this user
      
      if (error) throw error;
      
      toast({
        title: "Customer updated",
        description: "Customer details have been successfully updated.",
      });
      
      setIsEditing(false);
      onCustomerUpdated();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error updating customer",
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStatusBadge = (status: string) => {
    const variant = status === "active" ? "success" : 
                   status === "inactive" ? "destructive" : "default";
    return <Badge variant={variant}>{status}</Badge>;
  };

  const renderPaymentStatusBadge = (status: string) => {
    const variant = status === "paid" ? "success" : 
                   status === "pending" ? "warning" : 
                   status === "overdue" ? "destructive" : "default";
    return <Badge variant={variant}>{status}</Badge>;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "MMM d, yyyy h:mm a");
    } catch (e) {
      return dateString;
    }
  };

  if (!customerId) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        onClose();
        setIsEditing(false);
      }
    }}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {isLoadingCustomer ? "Loading Customer..." : customer?.name}
          </DialogTitle>
        </DialogHeader>

        {isLoadingCustomer ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <Tabs defaultValue="details">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">Customer Details</TabsTrigger>
              <TabsTrigger value="orders">Order History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="pt-4">
              {isEditing ? (
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">Name</Label>
                    <Input 
                      id="name" 
                      name="name" 
                      value={customer?.name || ""} 
                      onChange={handleInputChange} 
                      className="col-span-3" 
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">Email</Label>
                    <Input 
                      id="email" 
                      name="email" 
                      type="email" 
                      value={customer?.email || ""} 
                      onChange={handleInputChange} 
                      className="col-span-3" 
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="phone" className="text-right">Phone</Label>
                    <Input 
                      id="phone" 
                      name="phone" 
                      value={customer?.phone || ""} 
                      onChange={handleInputChange} 
                      className="col-span-3" 
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="address" className="text-right">Address</Label>
                    <Input 
                      id="address" 
                      name="address" 
                      value={customer?.address || ""} 
                      onChange={handleInputChange} 
                      className="col-span-3" 
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="type" className="text-right">Customer Type</Label>
                    <Input 
                      id="type" 
                      name="customer_type" 
                      value={customer?.customer_type || ""} 
                      onChange={handleInputChange} 
                      className="col-span-3" 
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <Card>
                    <CardContent className="p-6">
                      <dl className="divide-y divide-gray-200">
                        <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                          <dt className="text-sm font-medium text-muted-foreground">Name</dt>
                          <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">{customer?.name}</dd>
                        </div>
                        <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                          <dt className="text-sm font-medium text-muted-foreground">Email</dt>
                          <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">{customer?.email}</dd>
                        </div>
                        <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                          <dt className="text-sm font-medium text-muted-foreground">Phone</dt>
                          <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">{customer?.phone || "N/A"}</dd>
                        </div>
                        <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                          <dt className="text-sm font-medium text-muted-foreground">Address</dt>
                          <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">{customer?.address || "N/A"}</dd>
                        </div>
                        <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                          <dt className="text-sm font-medium text-muted-foreground">Customer Type</dt>
                          <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">{customer?.customer_type || "retail"}</dd>
                        </div>
                        <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                          <dt className="text-sm font-medium text-muted-foreground">Status</dt>
                          <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
                            {renderStatusBadge(customer?.status || "active")}
                          </dd>
                        </div>
                        <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                          <dt className="text-sm font-medium text-muted-foreground">Total Orders</dt>
                          <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">{customer?.total_orders || 0}</dd>
                        </div>
                        <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                          <dt className="text-sm font-medium text-muted-foreground">Total Spent</dt>
                          <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
                            {formatCurrency(customer?.total_spent || 0)}
                          </dd>
                        </div>
                        <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                          <dt className="text-sm font-medium text-muted-foreground">Join Date</dt>
                          <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
                            {formatDate(customer?.join_date || "")}
                          </dd>
                        </div>
                      </dl>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="orders">
              {isLoadingOrders ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : orders && orders.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Payment</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.id.substring(0, 8)}...</TableCell>
                          <TableCell>{formatDate(order.date)}</TableCell>
                          <TableCell>{formatCurrency(order.total)}</TableCell>
                          <TableCell>
                            {renderStatusBadge(order.status)}
                          </TableCell>
                          <TableCell>
                            {renderPaymentStatusBadge(order.payment_status)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No orders found for this customer.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}

        <DialogFooter>
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button onClick={handleSaveCustomer} disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button onClick={() => setIsEditing(true)}>
                Edit Customer
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
