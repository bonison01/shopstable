
import { cn } from "@/lib/utils";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { useSidebar } from "@/hooks/use-sidebar";
import { useOrders } from "@/hooks/use-orders";
import { OrdersHeader } from "@/components/orders/OrdersHeader";
import { OrdersTabs } from "@/components/orders/OrdersTabs";
import { OrderDetailsDialog } from "@/components/orders/OrderDetailsDialog";

const Orders = () => {
  const { 
    searchQuery, 
    setSearchQuery,
    addDialogOpen,
    setAddDialogOpen,
    handleAddOrder,
    filteredOrders,
    isLoading,
    editingOrder,
    startEditing,
    cancelEditing,
    updateOrder,
    isUpdating,
    handleStatusChange,
    handlePaymentStatusChange,
    handlePaymentAmountChange,
    getOrdersByStatus,
    selectedOrderId,
    isDetailsDialogOpen,
    openOrderDetails,
    handleDetailsDialogClose
  } = useOrders();
  
  const { isOpen, toggle, close, collapsed, toggleCollapse } = useSidebar();

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
        
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <OrdersHeader
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            addDialogOpen={addDialogOpen}
            setAddDialogOpen={setAddDialogOpen}
            handleAddOrder={handleAddOrder}
          />
          
          <OrdersTabs
            filteredOrders={filteredOrders}
            isLoading={isLoading}
            onAddOrder={() => setAddDialogOpen(true)}
            getOrdersByStatus={getOrdersByStatus}
            editingOrder={editingOrder}
            startEditing={startEditing}
            cancelEditing={cancelEditing}
            updateOrder={updateOrder}
            isUpdating={isUpdating}
            handleStatusChange={handleStatusChange}
            handlePaymentStatusChange={handlePaymentStatusChange}
            handlePaymentAmountChange={handlePaymentAmountChange}
            openOrderDetails={openOrderDetails}
          />

          <OrderDetailsDialog
            orderId={selectedOrderId}
            isOpen={isDetailsDialogOpen}
            onClose={handleDetailsDialogClose}
          />
        </main>
      </div>
    </div>
  );
};

export default Orders;
