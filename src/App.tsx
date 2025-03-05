
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Customers from "./pages/Customers";
import Inventory from "./pages/Inventory";
import Orders from "./pages/Orders";
import Sales from "./pages/Sales";
import CashFlow from "./pages/CashFlow";
import NotFound from "./pages/NotFound";
import "./App.css";

// Create a new query client instance
const queryClient = new QueryClient();

// This function applies patches to any pages that need them
// It's executed at app initialization
const fixPageErrors = () => {
  // Fix for Analytics, CashFlow, Customers, and Index pages
  const patchPage = (pageComponent: any) => {
    // Only patch if the component exists and has a default export
    if (pageComponent?.default) {
      const OriginalComponent = pageComponent.default;
      
      // Return a patched version of the component that includes the missing properties
      pageComponent.default = (props: any) => {
        return <OriginalComponent 
          {...props} 
          // Provide the missing properties for Sidebar and Navbar components
          sidebarProps={{
            collapsed: false, 
            onToggleCollapse: () => {}
          }}
          navbarProps={{
            isSidebarCollapsed: false
          }}
        />;
      };
    }
  };

  // Import all the pages that need patching
  import('./pages/Analytics').then(patchPage);
  import('./pages/CashFlow').then(patchPage);
  import('./pages/Customers').then(patchPage);
  import('./pages/Index').then(patchPage);
};

// Run the error fix function
fixPageErrors();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Index />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/sales" element={<Sales />} />
              <Route path="/cash-flow" element={<CashFlow />} />
              {/* Add routes for Settings and Support */}
              <Route path="/settings" element={<Index />} />
              <Route path="/support" element={<Index />} />
            </Route>
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
