import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./Pages/Home";
import Login from "./authentication/Login";
import ForgetPassword from "./authentication/ForgetPassword";
import NewsDetails from "./Pages/NewsDetails";
import NewsListing from "./Pages/NewsListing";
import ProtectedRoute from "./authentication/ProtectedRoute";
import PublicRoute from "./authentication/PublicRoute";
import ScrollToTop from "./components/ScrollToTop";

function AppContent() {
  const location = useLocation();
  const hideLayout = ["/login", "/forgetPassword"].includes(location.pathname);

  return (
    <>
    <ScrollToTop/>
      {!hideLayout && <Header />}

      <Routes>
        {/* 🔓 Public Routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/forgetPassword"
          element={
            <PublicRoute>
              <ForgetPassword />
            </PublicRoute>
          }
        />

        {/* 🔒 Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/news-detail/:newsId"
          element={
            <ProtectedRoute>
              <NewsDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/news-listing/:newsId"
          element={
            <ProtectedRoute>
              <NewsListing />
            </ProtectedRoute>
          }
        />
      </Routes>

      {!hideLayout && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
