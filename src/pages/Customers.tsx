
import { useState } from "react";
import { 
  UserRound, 
  Plus, 
  UserPlus, 
  Mail, 
  Phone, 
  Calendar, 
  DollarSign,
  ShoppingBag
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchFilter } from "@/components/ui/SearchFilter";
import { DataTable } from "@/components/ui/DataTable";
import { CustomerCard } from "@/components/CustomerCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { customers } from "@/data/mockData";
import { formatCurrency, formatDate, getStatusColor } from "@/utils/format";

const Customers = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };
  
  const handleFilter = (value: string) => {
    setFilter(value);
  };
  
  const filterCustomers = () => {
    let filtered = customers;
    
    if (searchQuery) {
      filtered = filtered.filter(
        (customer) =>
          customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          customer.phone.includes(searchQuery)
      );
    }
    
    if (filter !== "all") {
      filtered = filtered.filter((customer) => customer.status === filter);
    }
    
    return filtered;
  };
  
  const filteredCustomers = filterCustomers();
  
  const customerColumns = [
    {
      header: "Name",
      accessorKey: "name",
      cell: (customer) => (
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <UserRound className="h-4 w-4 text-primary" />
          </div>
          <span className="font-medium">{customer.name}</span>
        </div>
      ),
    },
    {
      header: "Email",
      accessorKey: "email",
    },
    {
      header: "Phone",
      accessorKey: "phone",
    },
    {
      header: "Orders",
      accessorKey: "totalOrders",
    },
    {
      header: "Total Spent",
      accessorKey: "totalSpent",
      cell: (customer) => formatCurrency(customer.totalSpent),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (customer) => (
        <div className="flex justify-center">
          <Badge variant={customer.status === "active" ? "default" : "secondary"}>
            {customer.status}
          </Badge>
        </div>
      ),
    },
  ];
  
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
            
            <Dialog>
              <DialogTrigger asChild>
                <Button className="mt-4 sm:mt-0">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Customer
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Customer</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  {/* Form fields would go here */}
                  <p className="text-muted-foreground text-center py-4">
                    Customer creation form would be implemented here
                  </p>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="mb-8">
            <SearchFilter
              onSearch={handleSearch}
              onFilter={handleFilter}
              filterOptions={[
                { label: "All", value: "all" },
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inactive" },
              ]}
              placeholder="Search customers..."
            />
          </div>
          
          <Tabs defaultValue="table" className="animate-fade-in">
            <TabsList className="mb-6">
              <TabsTrigger value="table">Table View</TabsTrigger>
              <TabsTrigger value="grid">Grid View</TabsTrigger>
            </TabsList>
            
            <TabsContent value="table">
              <DataTable
                data={filteredCustomers}
                columns={customerColumns}
                rowKey="id"
                onRowClick={(customer) => setSelectedCustomer(customer)}
              />
            </TabsContent>
            
            <TabsContent value="grid">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCustomers.map((customer) => (
                  <CustomerCard
                    key={customer.id}
                    customer={customer}
                    onClick={() => setSelectedCustomer(customer)}
                  />
                ))}
              </div>
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
                        <span>Customer since {formatDate(selectedCustomer.joinDate)}</span>
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
                          <span>{selectedCustomer.phone}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <div>
                            <div className="font-medium">Account Created</div>
                            <div className="text-sm text-muted-foreground">
                              {formatDate(selectedCustomer.joinDate)}
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
                              {selectedCustomer.totalOrders} orders placed
                            </div>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <div>
                            <div className="font-medium">Total Spent</div>
                            <div className="text-sm text-muted-foreground">
                              {formatCurrency(selectedCustomer.totalSpent)}
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
