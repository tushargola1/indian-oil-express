import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Home from "./Pages/Home";
import Footer from "./components/Footer";
import Login from "./authentication/Login";
import ForgetPassword from "./authentication/ForgetPassword";
import ProtectedRoute from "./authentication/ProtectedRoute";
import PublicRoute from "./authentication/PublicRoute";
import NewsDetails from "./innerPage/NewsDetails";
import CategoriesWrapper from "./components/CategoriesWrapper";
import CategoryCard from "./innerSections/CategoryCards";



function AppContent() {
  const location = useLocation();
  const hideLayout = ["/login", "/forgetPassword"].includes(location.pathname);

  return (
    <>
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

        <Route
          path="/"
          element={
            // <ProtectedRoute>
            <Home />
            // </ProtectedRoute>
          }
        />

        <Route
          path="/news-detail"
          element={
            // <ProtectedRoute>
            <NewsDetails />
            
            // </ProtectedRoute>
          }
        />

        <Route path="/categories" element={<CategoriesWrapper />} />

      </Routes>


      {!hideLayout && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
