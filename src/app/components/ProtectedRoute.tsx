import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router";
import { useApp } from "../contexts/AppContext";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: ("owner" | "family" | "guest")[];
}

export function ProtectedRoute({ children, allowedRoles = ["owner", "family", "guest"] }: ProtectedRouteProps) {
  const { user } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
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
  }, [user, allowedRoles, navigate]);

  if (!user?.isAuthenticated || !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}
