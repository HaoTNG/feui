import { RouterProvider, createBrowserRouter } from "react-router";
import { RootLayout } from "./components/RootLayout";
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
import { Rooms } from "./components/Rooms";
import { Settings } from "./components/Settings";
import { Automation } from "./components/Automation";
import { GuestDashboard } from "./components/GuestDashboard";
import { Homes } from "./components/Homes";
import Help from "./components/Help";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "auth",
        element: <AuthLayout />,
        children: [
          { index: true, element: <Login /> },
          { path: "login", element: <Login /> },
          { path: "register", element: <Register /> },
          { path: "forgot-password", element: <ForgotPassword /> },
          { path: "reset-password", element: <ResetPassword /> },
        ],
      },
      {
        path: "/",
        element: <MainLayout />,
        children: [
          { index: true, element: <Dashboard /> },
          { path: "devices", element: <DeviceControl /> },
          { path: "history", element: <ActivityLog /> },
          { path: "device-management", element: <DeviceManagement /> },
          { path: "hub-management", element: <HubManagement /> },
          { path: "hub-management/:hubId", element: <HubDetail /> },
          { path: "modules", element: <ModulesManagement /> },
          { path: "automation", element: <Automation /> },
          { path: "help", element: <Help /> },
          { path: "user-management", element: <UserManagement /> },
          { path: "profile", element: <Profile /> },
          { path: "settings", element: <Settings /> },
          { path: "guest", element: <GuestDashboard /> },
          { path: "homes", element: <Homes /> },
          { path: "rooms", element: <Rooms /> },
          { path: "room-management", element: <RoomManagement /> },
          { path: "room-management/:roomId", element: <RoomDetail /> },
        ],
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;