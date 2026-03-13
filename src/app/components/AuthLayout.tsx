import { Outlet } from "react-router";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useApp } from "../contexts/AppContext";

export function AuthLayout() {
  const { user } = useApp();
  const navigate = useNavigate();

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (user?.isAuthenticated) {
      navigate("/");
    }
  }, [user, navigate]);

  // Don't render auth pages if already authenticated
  if (user?.isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4">
      <Outlet />
    </div>
  );
}