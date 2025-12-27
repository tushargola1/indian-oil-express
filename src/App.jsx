// ===================== React & Router =====================
import { Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

// ===================== Pages / Components =====================
import Search from "./innerPage/Search";

// ===================== Lazy Loaded Components =====================
const Header = lazy(() => import("./components/Header"));
const Footer = lazy(() => import("./components/Footer"));
const Home = lazy(() => import("./Pages/Home"));

const Login = lazy(() => import("./authentication/Login"));
const ForgetPassword = lazy(() => import("./authentication/ForgetPassword"));

const NewsDetails = lazy(() => import("./Pages/NewsDetails"));
const NewsListing = lazy(() => import("./Pages/NewsListing"));

const WeekendXpress_NewsListing = lazy(() => import("./Pages/weekendXpress/WeekendXpress_NewsListing"));
const Expresslisting = lazy(() => import("./Pages/Expresslisting"));

const WeekendDetails = lazy(() => import("./Pages/weekendXpress/WeekendDetails"));

const ProtectedRoute = lazy(() => import("./authentication/ProtectedRoute"));
const PublicRoute = lazy(() => import("./authentication/PublicRoute"));

const ScrollToTop = lazy(() => import("./components/ScrollToTop"));
const SearchPage = lazy(() => import("./innerPage/SearchPage"));

const Announcements = lazy(() => import("./detail-page/Announcements"));

// ===================== App Content =====================
function AppContent() {
  const location = useLocation();
  const hideLayout = ["/login", "/forgetPassword"].includes(location.pathname);

  return (
    <>
      {/* Scroll to Top */}
      <Suspense fallback={null}>
        <ScrollToTop />
      </Suspense>

      {/* Header */}
      {!hideLayout && (
        <Suspense fallback={null}>
          <Header />
        </Suspense>
      )}

      {/* Routes */}
      <Suspense fallback={null}>
        <Routes>
          {/* ===================== Public Routes ===================== */}
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

          {/* ===================== Protected Routes ===================== */}
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
            path="/WeekendDetails/:newsId"
            element={
              <ProtectedRoute>
                <WeekendDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path="/search"
            element={
              <ProtectedRoute>
                {/* <SearchPage /> */}
                <Search />
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
                <WeekendXpress_NewsListing />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>

      {/* Footer */}
      {!hideLayout && (
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      )}
    </>
  );
}

// ===================== App Wrapper =====================
export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
