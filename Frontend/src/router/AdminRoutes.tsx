import { Route } from "react-router-dom";
import { ProtectedRoute } from "../components/shared/ProtectedRoute";
import AdminDashboard from "../pages/admin/AdminDashboard";

export const adminRoutes = [
  <Route key="admin-dashboard" path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />,
];

export default adminRoutes;