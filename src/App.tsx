import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Index from "./pages/Index";
import Orders from "./pages/Orders";
import Customers from "./pages/Customers";
import Inventory from "./pages/Inventory";
import Sales from "./pages/Sales";
import Analytics from "./pages/Analytics";
import CashFlow from "./pages/CashFlow";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import Staff from './pages/Staff';

const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <Index />,
      },
      {
        path: "/orders",
        element: <Orders />,
      },
      {
        path: "/customers",
        element: <Customers />,
      },
      {
        path: "/inventory",
        element: <Inventory />,
      },
      {
        path: "/sales",
        element: <Sales />,
      },
      {
        path: "/analytics",
        element: <Analytics />,
      },
      {
        path: "/cash-flow",
        element: <CashFlow />,
      },
      {
        path: "/staff",
        element: <Staff />,
      },
    ],
  },
  {
    path: "/auth",
    element: <Auth />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
