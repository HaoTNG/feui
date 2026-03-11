import { Outlet } from "react-router";
import { AppProvider } from "../contexts/AppContext";
import { ToastProvider } from "../contexts/ToastContext";
import { Toaster } from "./ui/sonner";

export function RootLayout() {
  return (
    <AppProvider>
      <ToastProvider>
        <Outlet />
        <Toaster />
      </ToastProvider>
    </AppProvider>
  );
}
