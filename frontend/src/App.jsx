import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import TableLogin from "./pages/TableLogin";
import Dashboard from "./pages/Dashboard";
import AddDish from "./pages/AddDish";
import EditDish from "./pages/EditDish";
import Orders from "./pages/Orders";
import OrderHistory from "./pages/OrderHistory";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/table-login" element={<TableLogin />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/add-dish" element={<AddDish />} />
            <Route path="/edit-dish/:id" element={<EditDish />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/order-history" element={<OrderHistory />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
