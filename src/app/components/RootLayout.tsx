import { Outlet } from "react-router";
import { AppProvider } from "../contexts/AppContext";
import { ToastProvider } from "../contexts/ToastContext";

export function RootLayout() {
  return (
    <AppProvider>
      <ToastProvider>
        <Outlet />
      </ToastProvider>
    </AppProvider>
  );
}
