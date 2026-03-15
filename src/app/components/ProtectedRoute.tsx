import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router";
import { useApp } from "../contexts/AppContext";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: ("owner" | "family" | "guest")[];
}

export function ProtectedRoute({ children, allowedRoles = ["owner", "family", "guest"] }: ProtectedRouteProps) {
  const { user, authLoading } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    // Wait for auth to be initialized
    if (authLoading) {
      return;
    }
    
    if (!user?.isAuthenticated) {
      navigate("/auth/login");
      return;
    }
    
    if (user.role === "guest" && !allowedRoles.includes("guest")) {
      navigate("/guest");
    }
    else if (!allowedRoles.includes(user.role)) {
      navigate("/");
    }
  }, [user, authLoading, allowedRoles, navigate]);

  // Show loading while auth is being initialized
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user?.isAuthenticated || !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}
