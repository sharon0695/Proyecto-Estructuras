import { Navigate, Route } from "react-router-dom";
import { ProtectedRoute } from "../components/shared/ProtectedRoute";
import ProductsPage from "../pages/Products/ProductsPage";
import ProductDetail from "../pages/ProductDetail/ProductDetail";
import { Cart } from "../pages/cart/Cart";
import { Checkout } from "../pages/cart/Checkout";
import { OrderConfirmation } from "../pages/cart/OrderConfirmation";

export const userRoutes = [
  <Route key="user-home" path="/Home" element={<ProtectedRoute><ProductsPage /></ProtectedRoute>} />,
  <Route key="user-detail" path="/producto/:id" element={<ProtectedRoute><ProductDetail /></ProtectedRoute>} />,
  <Route key="user-cart" path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />,
  <Route key="user-checkout" path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />,
  <Route key="user-confirmation" path="/order-confirmation" element={<ProtectedRoute><OrderConfirmation /></ProtectedRoute>} />,
  <Route key="user-redirect" path="*" element={<Navigate to="/" replace />} />,
];

export default userRoutes;