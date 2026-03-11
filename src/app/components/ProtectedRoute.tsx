import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router";
import { useApp } from "../contexts/AppContext";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: ("owner" | "family" | "guest")[];
}

export function ProtectedRoute({ children, allowedRoles = ["owner", "family", "guest"] }: ProtectedRouteProps) {
  const { userRole } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is guest and trying to access non-guest routes, redirect to guest dashboard
    if (userRole === "guest" && !allowedRoles.includes("guest")) {
      navigate("/guest");
    }
    // If user is not allowed to access this route
    else if (!allowedRoles.includes(userRole)) {
      navigate("/");
    }
  }, [userRole, allowedRoles, navigate]);

  // If user doesn't have permission, don't render anything (redirect will happen)
  if (!allowedRoles.includes(userRole)) {
    return null;
  }

  return <>{children}</>;
}
