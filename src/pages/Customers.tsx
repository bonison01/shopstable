
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/hooks/use-sidebar";
import { useCustomers } from "@/hooks/use-customers";
import { CustomerDetailsDialog } from "@/components/customers/CustomerDetailsDialog";
import { CustomersHeader } from "@/components/customers/CustomersHeader";
import { CustomersToolbar } from "@/components/customers/CustomersToolbar";
import { CustomersList } from "@/components/customers/CustomersList";
import { DeleteCustomersDialog } from "@/components/customers/DeleteCustomersDialog";

// Define customer type
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  customer_type: string;
  status: "active" | "inactive";
  total_orders: number;
  total_spent: number;
  created_at: string;
  join_date: string;
}

const Customers = () => {
  const { isOpen, toggle, close, collapsed, toggleCollapse } = useSidebar();
  const {
    customers,
    isLoading,
    searchQuery,
    setSearchQuery,
    selectedCustomers,
    setSelectedCustomers,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    selectedCustomerId,
    isDetailsDialogOpen,
    refetch,
    toggleCustomerSelection,
    toggleSelectAll,
    handleDeleteCustomers,
    openCustomerDetails,
    handleDetailsDialogClose,
  } = useCustomers();

  return (
    <div className="flex min-h-screen bg-muted/40">
      <Sidebar 
        isOpen={isOpen} 
        onClose={close} 
        collapsed={collapsed}
        onToggleCollapse={toggleCollapse}
      />
      
      <div className={cn(
        "flex flex-1 flex-col transition-all duration-300 ease-in-out",
        collapsed ? "md:ml-16" : "md:ml-64"
      )}>
        <Navbar 
          toggleSidebar={toggle} 
          isSidebarCollapsed={collapsed}
        />
        
        <main className="flex-1 p-4 md:p-6">
          <CustomersHeader onAddCustomer={refetch} />

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Customer Management</CardTitle>
              <CardDescription>
                View and manage all your customers in one place
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CustomersToolbar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedCustomers={selectedCustomers}
                onDeleteSelected={() => setIsDeleteDialogOpen(true)}
              />

              <CustomersList
                customers={customers}
                isLoading={isLoading}
                selectedCustomers={selectedCustomers}
                toggleCustomerSelection={toggleCustomerSelection}
                toggleSelectAll={toggleSelectAll}
                openCustomerDetails={openCustomerDetails}
                setSelectedCustomers={setSelectedCustomers}
                setIsDeleteDialogOpen={setIsDeleteDialogOpen}
              />
            </CardContent>
          </Card>

          {/* Delete Confirmation Dialog */}
          <DeleteCustomersDialog
            isOpen={isDeleteDialogOpen}
            onClose={() => setIsDeleteDialogOpen(false)}
            onDelete={handleDeleteCustomers}
            count={selectedCustomers.length}
          />

          {/* Customer Details Dialog */}
          <CustomerDetailsDialog
            customerId={selectedCustomerId}
            isOpen={isDetailsDialogOpen}
            onClose={handleDetailsDialogClose}
            onCustomerUpdated={refetch}
          />
        </main>
      </div>
    </div>
  );
};

export default Customers;
