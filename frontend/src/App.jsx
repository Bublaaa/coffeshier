// Library
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore.js";
import { useEffect, lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
// Pages
import SignUpPage from "./pages/SignUpPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import EmailVerificationPage from "./pages/EmailVerificationPage.jsx";
import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx";
import ResetPasswordPage from "./pages/ResetPasswordPage.jsx";
import TestPage from "./pages/TestPage.jsx";
// Components
import LoadingSpinner from "./components/LoadingSpinner.jsx";
import MenuPageSkeleton from "./pages/skeleton/MenuPageSkeleton.jsx";

const OwnerDashboard = lazy(() => import("./pages/OwnerDashboard.jsx"));
const ManagerDashboard = lazy(() => import("./pages/ManagerDashboard.jsx"));
const Dashboard = lazy(() => import("./pages/Dashboard.jsx"));
const MenuPage = lazy(() => import("./pages/MenuPage.jsx"));

// Protect routes that require authentication
const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (!user.isVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  if (requiredRole && user.position !== requiredRole) {
    // Redirect if the user doesn't have the required role
    if (user.position === "employee") return <Navigate to={"/"} replace />;
    if (user.position === "manager")
      return <Navigate to={"/manager"} replace />;
    if (user.position === "owner") return <Navigate to={"/owner"} replace />;
  }
  return children;
};

// Redirect to user page based on user position
const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user.isVerified) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  const { isCheckingAuth, checkAuth } = useAuthStore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) return <LoadingSpinner />;

  return (
    <div className="h-screen w-full bg-white-shadow flex  overflow-hidden">
      <Routes>
        <Route
          path="/owner"
          element={
            <ProtectedRoute requiredRole="owner">
              <Suspense>
                <OwnerDashboard />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager"
          element={
            <ProtectedRoute requiredRole="manager">
              <Suspense>
                <ManagerDashboard />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute requiredRole="employee">
              <Suspense>
                <Dashboard />
              </Suspense>
            </ProtectedRoute>
          }
        >
          {/* <Route path="/" element={<Navigate to="/menu" replace />} /> */}
          <Route index element={<Navigate to="/menu" replace />} />
          <Route
            exact
            path="menu"
            element={
              <Suspense>
                <MenuPageSkeleton />
                {/* <MenuPage /> */}
              </Suspense>
            }
          />
          <Route path="profile" element={<TestPage />} />
        </Route>

        <Route
          path="/signup"
          element={
            <RedirectAuthenticatedUser>
              <SignUpPage />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path="/login"
          element={
            <RedirectAuthenticatedUser>
              <LoginPage />
            </RedirectAuthenticatedUser>
          }
        />
        <Route path="/verify-email" element={<EmailVerificationPage />} />
        <Route
          path="/forgot-password"
          element={
            <RedirectAuthenticatedUser>
              <ForgotPasswordPage />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path="/reset-password/:token"
          element={
            <RedirectAuthenticatedUser>
              <ResetPasswordPage />
            </RedirectAuthenticatedUser>
          }
        />
        {/* catch all routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
