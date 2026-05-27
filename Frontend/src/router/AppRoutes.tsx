import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import Home from "../pages/Home/Home";
import ProductDetail from "../pages/ProductDetail/ProductDetail";
import ProductsPage from "../pages/Products/ProductsPage";
import CartPage from "../pages/Cart/CartPage";
import { ProtectedRoute } from "../components/shared/ProtectedRoute";
import AdminDashboard from "../pages/admin/AdminDashboard";
import ProfilePage from "../pages/Profile/ProfilePage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registro" element={<RegisterPage />} />
      <Route path="/" element={<Home />} />

      <Route path="/Home" element={<ProtectedRoute><ProductsPage /></ProtectedRoute>} />
      <Route path="/producto/:id" element={<ProtectedRoute><ProductDetail /></ProtectedRoute>} />
      <Route path="/carrito" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
      <Route path="/Carrito" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}