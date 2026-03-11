import { Outlet } from "react-router";

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4">
      <Outlet />
    </div>
  );
}
