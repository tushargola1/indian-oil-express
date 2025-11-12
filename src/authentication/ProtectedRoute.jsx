import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

const ProtectedRoute = ({ children }) => {
  const accessToken = Cookies.get("accessToken");
  const refreshToken = Cookies.get("refreshToken");

  // ✅ User is authenticated only if both tokens exist
  const isAuthenticated = Boolean(accessToken && refreshToken);

  // ✅ Redirect to login if not authenticated
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
