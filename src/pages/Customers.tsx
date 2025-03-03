
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { 
  UserRound, 
  Plus, 
  Mail, 
  Phone, 
  Calendar, 
  DollarSign,
  ShoppingBag,
  Search,
  UserPlus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogTrigger 
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { formatCurrency, formatDate, getStatusColor } from "@/utils/format";
import { useToast } from "@/hooks/use-toast";
import AddCustomerForm from "@/components/forms/AddCustomerForm";

const Customers = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const { data: customers, isLoading, error, refetch } = useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('name');
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching customers",
          description: error.message,
        });
        throw error;
      }
      
      return data || [];
    },
  });
  
  const filterCustomers = () => {
    if (!customers) return [];
    
    let filtered = customers;
    
    if (searchQuery) {
      filtered = filtered.filter(
        (customer) =>
          customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (customer.email && customer.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (customer.phone && customer.phone.includes(searchQuery))
      );
    }
    
    if (filter !== "all") {
      filtered = filtered.filter((customer) => customer.status === filter);
    }
    
    return filtered;
  };
  
  const filteredCustomers = filterCustomers();

  const handleAddCustomer = () => {
    setAddDialogOpen(false);
    refetch();
  };
  
  return (
    <div className="flex min-h-screen bg-muted/40">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex flex-1 flex-col">
        <Navbar toggleSidebar={toggleSidebar} />
        
        <main className="flex-1 px-4 py-8 md:px-6 lg:px-8 animate-fade-in">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-1">Customers</h1>
              <p className="text-muted-foreground">
                Manage customer information and transactions
              </p>
            </div>
            
            <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="mt-4 sm:mt-0">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Customer
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Add New Customer</DialogTitle>
                  <DialogDescription>
                    Fill in the details to add a new customer to your database.
                  </DialogDescription>
                </DialogHeader>
                <AddCustomerForm onSuccess={handleAddCustomer} />
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="mb-8 flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search customers..."
                className="pl-8 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="w-full md:w-48">
              <select 
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Customers</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          
          <Tabs defaultValue="table" className="animate-fade-in">
            <TabsList className="mb-6">
              <TabsTrigger value="table">Table View</TabsTrigger>
              <TabsTrigger value="grid">Grid View</TabsTrigger>
            </TabsList>
            
            <TabsContent value="table">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-pulse">Loading customers...</div>
                </div>
              ) : error ? (
                <div className="text-center text-red-500">
                  Error loading customers. Please try again.
                </div>
              ) : filteredCustomers.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 border rounded-lg bg-card">
                  <UserRound className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-2">No customers found</p>
                  <Button onClick={() => setAddDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Customer
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b text-left">
                        <th className="py-3 px-4 font-medium">Name</th>
                        <th className="py-3 px-4 font-medium">Email</th>
                        <th className="py-3 px-4 font-medium">Phone</th>
                        <th className="py-3 px-4 font-medium">Orders</th>
                        <th className="py-3 px-4 font-medium">Total Spent</th>
                        <th className="py-3 px-4 font-medium">Status</th>
                        <th className="py-3 px-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCustomers.map((customer) => (
                        <tr key={customer.id} className="border-b hover:bg-muted/50 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <UserRound className="h-4 w-4 text-primary" />
                              </div>
                              <span className="font-medium">{customer.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">{customer.email}</td>
                          <td className="py-3 px-4">{customer.phone || "—"}</td>
                          <td className="py-3 px-4">{customer.total_orders || 0}</td>
                          <td className="py-3 px-4">{formatCurrency(customer.total_spent || 0)}</td>
                          <td className="py-3 px-4">
                            <Badge variant={customer.status === "active" ? "default" : "secondary"}>
                              {customer.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <Button variant="ghost" size="sm" onClick={() => setSelectedCustomer(customer)}>View</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="grid">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-pulse">Loading customers...</div>
                </div>
              ) : error ? (
                <div className="text-center text-red-500">
                  Error loading customers. Please try again.
                </div>
              ) : filteredCustomers.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 border rounded-lg bg-card">
                  <UserRound className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-2">No customers found</p>
                  <Button onClick={() => setAddDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Customer
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCustomers.map((customer) => (
                    <Card key={customer.id} className="overflow-hidden">
                      <div className="h-2 bg-primary w-full"></div>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between">
                          <div className="flex gap-3">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <UserRound className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <CardTitle className="text-base">{customer.name}</CardTitle>
                              <p className="text-sm text-muted-foreground">{customer.email}</p>
                            </div>
                          </div>
                          <Badge variant={customer.status === "active" ? "default" : "secondary"}>
                            {customer.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-4">
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <p className="text-muted-foreground">Phone</p>
                            <p className="font-medium">{customer.phone || "—"}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Customer since</p>
                            <p className="font-medium">{formatDate(customer.join_date)}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Orders</p>
                            <p className="font-medium">{customer.total_orders || 0}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Total Spent</p>
                            <p className="font-medium">{formatCurrency(customer.total_spent || 0)}</p>
                          </div>
                        </div>
                        <Button 
                          className="w-full mt-4" 
                          variant="outline"
                          onClick={() => setSelectedCustomer(customer)}
                        >
                          View Details
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
          
          {selectedCustomer && (
            <Dialog open={Boolean(selectedCustomer)} onOpenChange={() => setSelectedCustomer(null)}>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Customer Details</DialogTitle>
                </DialogHeader>
                <div className="grid gap-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <UserRound className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{selectedCustomer.name}</h3>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Badge variant={selectedCustomer.status === "active" ? "default" : "secondary"}>
                          {selectedCustomer.status}
                        </Badge>
                        <span>•</span>
                        <span>Customer since {formatDate(selectedCustomer.join_date)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Contact Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span>{selectedCustomer.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{selectedCustomer.phone || "—"}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <div>
                            <div className="font-medium">Account Created</div>
                            <div className="text-sm text-muted-foreground">
                              {formatDate(selectedCustomer.join_date)}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Order Summary</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-start gap-2">
                          <ShoppingBag className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <div>
                            <div className="font-medium">Total Orders</div>
                            <div className="text-sm text-muted-foreground">
                              {selectedCustomer.total_orders || 0} orders placed
                            </div>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <div>
                            <div className="font-medium">Total Spent</div>
                            <div className="text-sm text-muted-foreground">
                              {formatCurrency(selectedCustomer.total_spent || 0)}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setSelectedCustomer(null)}>
                      Close
                    </Button>
                    <Button>Edit Customer</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </main>
      </div>
    </div>
  );
};

export default Customers;
