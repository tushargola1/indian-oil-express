import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import { Suspense, lazy } from "react";

// Lazy Loaded Components
const Header = lazy(() => import("./components/Header"));
const Footer = lazy(() => import("./components/Footer"));
const Home = lazy(() => import("./Pages/Home"));
const Login = lazy(() => import("./authentication/Login"));
const ForgetPassword = lazy(() => import("./authentication/ForgetPassword"));
const NewsDetails = lazy(() => import("./Pages/NewsDetails"));
const NewsListing = lazy(() => import("./Pages/NewsListing"));
const Expresslisting = lazy(() => import("./Pages/Expresslisting"));
const ProtectedRoute = lazy(() => import("./authentication/ProtectedRoute"));
const PublicRoute = lazy(() => import("./authentication/PublicRoute"));
const ScrollToTop = lazy(() => import("./components/ScrollToTop"));
const SearchPage = lazy(() => import("./innerPage/SearchPage"));
const Announcements = lazy(() => import("./detail-page/Announcements"));

function AppContent() {
  const location = useLocation();
  const hideLayout = ["/login", "/forgetPassword"].includes(location.pathname);

  return (
    <>
      <Suspense fallback={null}>
        <ScrollToTop />
      </Suspense>

      {!hideLayout && (
        <Suspense fallback={null}>
          <Header />
        </Suspense>
      )}

      <Suspense fallback={null}>
        <Routes>
          {/* Public Routes */}
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

          {/* Protected Routes */}
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
            path="/search"
            element={
              <ProtectedRoute>
                <SearchPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/announcement/:announcementId"
            element={
              <ProtectedRoute>
                <Announcements />
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
         <Route
          <Route
            path="/Expresslisting/"
            element={
              <ProtectedRoute>
                <Expresslisting />
              </ProtectedRoute>
            }
          />
 

          <Route
            path="WeekendXpress/news-listing/:newsId"
            element={
              <ProtectedRoute>
                <NewsListing />
              </ProtectedRoute>
            }
          />
 
        </Routes>
      </Suspense>

      {!hideLayout && (
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      )}
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
