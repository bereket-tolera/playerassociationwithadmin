import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import Loader from "../components/common/Loader";
import { AuthService } from "../api/authService";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean; // Optional: require admin role
}

export default function ProtectedRoute({ children, requireAdmin = true }: ProtectedRouteProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          console.log("🔒 No token found, redirecting to login");
          setIsAuthenticated(false);
          return;
        }

        if (requireAdmin) {
          // For admin routes, verify token with backend
          console.log("🔐 Verifying admin token...");
          await AuthService.verifyToken();
          console.log("✅ Admin token verified");
        } else {
          // For regular protected routes, just check if token exists
          console.log("🔑 Checking token existence...");
        }
        
        setIsAuthenticated(true);
      } catch (error) {
        console.error("❌ Authentication error:", error);
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [requireAdmin, location.pathname]);

  // Show loader while checking authentication
  if (isLoading) {
    return <Loader />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    console.log("🚫 Not authenticated, redirecting to login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // User is authenticated, render children
  console.log("✅ User authenticated, rendering protected content");
  return <>{children}</>;
}