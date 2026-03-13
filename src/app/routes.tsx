import { createBrowserRouter, Navigate } from "react-router";
import { MainLayout } from "./components/MainLayout";
import { AuthLayout } from "./components/AuthLayout";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { ForgotPassword } from "./components/ForgotPassword";
import { ResetPassword } from "./components/ResetPassword";
import { Dashboard } from "./components/Dashboard";
import { DeviceControl } from "./components/DeviceControl";
import { ActivityLog } from "./components/ActivityLog";
import { DeviceManagement } from "./components/DeviceManagement";
import { HubManagement } from "./components/HubManagement";
import { HubDetail } from "./components/HubDetail";
import { ModulesManagement } from "./components/ModulesManagement";
import { RoomManagement } from "./components/RoomManagement";
import { RoomDetail } from "./components/RoomDetail";
import { UserManagement } from "./components/UserManagement";
import { Profile } from "./components/Profile";
import { Homes } from "./components/Homes";
import { Settings } from "./components/Settings";
import { Automation } from "./components/Automation";
import { GuestDashboard } from "./components/GuestDashboard";
import Help from "./components/Help";

export const router = createBrowserRouter([
  {
    path: "/auth",
    Component: AuthLayout,
    children: [
      { index: true, Component: Login },
      { path: "login", Component: Login },
      { path: "register", Component: Register },
      { path: "forgot-password", Component: ForgotPassword },
      { path: "reset-password", Component: ResetPassword },
    ],
  },
  {
    path: "/",
    Component: MainLayout,
    children: [
      { index: true, Component: Dashboard },
      { path: "devices", Component: DeviceControl },
      { path: "history", Component: ActivityLog },
      { path: "device-management", Component: DeviceManagement },
      { path: "hub-management", Component: HubManagement },
      { path: "hub-management/:hubId", Component: HubDetail },
      { path: "modules", Component: ModulesManagement },
      { path: "homes", Component: Homes },
      { path: "rooms", element: <Navigate to="/room-management" replace /> },
      { path: "room-management", Component: RoomManagement },
      { path: "room-management/:roomId", Component: RoomDetail },
      { path: "automation", Component: Automation },
      { path: "help", Component: Help },
      { path: "user-management", Component: UserManagement },
      { path: "profile", Component: Profile },
      { path: "settings", Component: Settings },
      { path: "guest", Component: GuestDashboard },
    ],
  },
]);