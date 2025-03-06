
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Auth from "./pages/Auth";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Index";
import Staff from "./pages/Staff";
import Customers from "./pages/Customers";
import Products from "./pages/Inventory";
import Orders from "./pages/Orders";
import Settings from "./pages/Settings";
import CompanyDetails from "./pages/CompanyDetails";
import Companies from "./pages/Companies";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/products" element={<Products />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/staff" element={<Staff />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/companies/:companyId" element={<CompanyDetails />} />
        </Route>
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
