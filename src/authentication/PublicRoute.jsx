import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

const PublicRoute = ({ children }) => {
  const accessToken = Cookies.get("accessToken");
  const refreshToken = Cookies.get("refreshToken");

  const isAuthenticated = Boolean(accessToken && refreshToken);

  // ✅ If user is logged in, redirect to home page
  return isAuthenticated ? <Navigate to="/" replace /> : children;
};

export default PublicRoute;
