import {
  LayoutDashboard,
  Radio,
  History,
  Home,
  Settings,
  Bell,
  Menu,
  X,
  ChevronDown,
  User,
  LogOut,
  Users,
  Power,
  Bot,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Building2,
  Server,
  Cpu,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link, Outlet } from "react-router";
import { useApp } from "../contexts/AppContext";
import { NotificationDropdown } from "./ui/NotificationDropdown";
import { RoleSwitcher } from "./ui/RoleSwitcher";
import { ProfileDropdown } from "./ui/ProfileDropdown";
import { TestModeIndicator } from "./ui/TestModeIndicator";
import { HomeSelector } from "./ui/HomeSelector";

const navigation = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard, roles: ["owner", "family"] },
  { name: "Control", path: "/devices", icon: Radio, roles: ["owner", "family"] },
  { name: "History", path: "/history", icon: History, roles: ["owner", "family"] },
  { name: "Homes", path: "/homes", icon: Building2, roles: ["owner"] },
  { name: "Automation", path: "/automation", icon: Bot, roles: ["owner", "family"] },
  { name: "Help", path: "/help", icon: HelpCircle, roles: ["owner", "family", "guest"] },
  { name: "Settings", path: "/settings", icon: Settings, roles: ["owner", "family"] },
];

const adminNavigation = [
  { name: "Hub Management", path: "/hub-management", icon: Server, roles: ["owner"] },
  { name: "Modules", path: "/modules", icon: Cpu, roles: ["owner"] },
  { name: "Room Management", path: "/room-management", icon: Home, roles: ["owner"] },
  { name: "User Management", path: "/user-management", icon: Users, roles: ["owner"] },
];

export function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const { unreadNotificationCount, userRole, isDarkMode, sidebarCollapsed, toggleSidebar, userProfile, user: userData, logout } = useApp();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!userData?.isAuthenticated) {
      navigate("/auth/login");
      return;
    }

    // Redirect guests to their simplified dashboard
    if (userRole === "guest" && location.pathname !== "/guest") {
      navigate("/guest");
    }
  }, [userData, navigate, userRole, location.pathname]);

  // Don't render anything until authenticated
  if (!userData?.isAuthenticated) {
    return null;
  }

  // If user is guest, don't render the full layout
  if (userRole === "guest") {
    return <Outlet />;
  }

  // User data from auth context
  const user = {
    name: userData?.name || (userData?.role === "owner" ? "John Smith" : "Jane Doe"),
    email: userData?.email || (userData?.role === "owner" ? "john@example.com" : "jane@example.com"),
    avatar: userData?.name ? userData.name.split(' ').map(n => n[0]).join('') : (userData?.role === "owner" ? "JS" : "JD"),
    role: userData?.role,
    unreadNotifications: unreadNotificationCount,
  };

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    navigate("/auth/login");
  };

  // Filter navigation based on user role
  const filteredNavigation = navigation.filter((item) =>
    item.roles.includes(userRole)
  );

  const filteredAdminNavigation = adminNavigation.filter((item) =>
    item.roles.includes(userRole)
  );

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 ${
          sidebarCollapsed ? "w-20" : "w-64"
        } ${
          isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        } border-r transform transition-all duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className={`flex items-center gap-2 ${sidebarCollapsed ? "px-4 justify-center" : "px-6"} py-5 border-b ${
            isDarkMode ? "border-gray-700" : "border-gray-200"
          }`}>
            {!sidebarCollapsed ? (
              <>
                <Home className="w-8 h-8 text-blue-600" />
                <span className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>Smart Home</span>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className={`ml-auto lg:hidden ${isDarkMode ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-700"}`}
                >
                  <X className="w-6 h-6" />
                </button>
              </>
            ) : (
              <Home className="w-8 h-8 text-blue-600" />
            )}
          </div>

          {/* Toggle Button */}
          <div className={`${sidebarCollapsed ? "px-4" : "px-6"} py-3 hidden lg:block`}>
            <button
              onClick={toggleSidebar}
              className={`flex items-center gap-2 ${sidebarCollapsed ? "justify-center w-full" : ""} px-3 py-2 rounded-lg transition-colors ${
                isDarkMode
                  ? "text-gray-400 hover:text-gray-200 hover:bg-gray-700"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              }`}
              title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {sidebarCollapsed ? (
                <ChevronRight className="w-5 h-5" />
              ) : (
                <>
                  <ChevronLeft className="w-5 h-5" />
                  <span className="text-sm font-medium">Collapse</span>
                </>
              )}
            </button>
          </div>

          {/* Home Selector - Always show for owners, adapt display for collapsed state */}
          {userRole === "owner" && <HomeSelector />}

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 overflow-y-auto">
            <div className="space-y-1">
              {filteredNavigation.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center ${sidebarCollapsed ? "justify-center px-2" : "gap-3 px-3"} py-2.5 rounded-lg transition-colors group relative ${
                      active
                        ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                        : isDarkMode
                        ? "text-gray-300 hover:bg-gray-700"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                    title={sidebarCollapsed ? item.name : undefined}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {!sidebarCollapsed && <span className="font-medium">{item.name}</span>}
                    
                    {/* Tooltip for collapsed state */}
                    {sidebarCollapsed && (
                      <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-sm rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                        {item.name}
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>

            {user.role === "owner" && filteredAdminNavigation.length > 0 && (
              <>
                {!sidebarCollapsed && (
                  <div className={`mt-6 mb-2 px-3 text-xs font-semibold uppercase tracking-wider ${
                    isDarkMode ? "text-gray-500" : "text-gray-500"
                  }`}>
                    Owner
                  </div>
                )}
                {sidebarCollapsed && <div className="mt-4 mb-2 border-t border-gray-700"></div>}
                <div className="space-y-1">
                  {filteredAdminNavigation.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center ${sidebarCollapsed ? "justify-center px-2" : "gap-3 px-3"} py-2.5 rounded-lg transition-colors group relative ${
                          active
                            ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                            : isDarkMode
                            ? "text-gray-300 hover:bg-gray-700"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                        title={sidebarCollapsed ? item.name : undefined}
                      >
                        <Icon className="w-5 h-5 flex-shrink-0" />
                        {!sidebarCollapsed && <span className="font-medium">{item.name}</span>}
                        
                        {/* Tooltip for collapsed state */}
                        {sidebarCollapsed && (
                          <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-sm rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                            {item.name}
                          </div>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </>
            )}
          </nav>

          {/* User Menu */}
          <div className={`border-t ${isDarkMode ? "border-gray-700" : "border-gray-200"} p-3`}>
            {!sidebarCollapsed ? (
              <>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg transition-colors ${
                    isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                    {user.avatar}
                  </div>
                  <div className="flex-1 text-left">
                    <div className={`font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>{user.name}</div>
                    <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>{user.email}</div>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 transition-transform ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    } ${userMenuOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {userMenuOpen && (
                  <div className="mt-2 space-y-1">
                    <Link
                      to="/profile"
                      onClick={() => {
                        setUserMenuOpen(false);
                        setSidebarOpen(false);
                      }}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                        isDarkMode
                          ? "text-gray-300 hover:bg-gray-700"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <User className="w-5 h-5" />
                      <span>Profile</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg transition-colors ${
                        isDarkMode
                          ? "text-red-400 hover:bg-red-900/20"
                          : "text-red-600 hover:bg-red-50"
                      }`}
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Link
                  to="/profile"
                  className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold hover:bg-blue-700 transition-colors"
                  title="Profile"
                >
                  {user.avatar}
                </Link>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarCollapsed ? "lg:pl-20" : "lg:pl-64"}`}>
        {/* Top Header */}
        <header className={`sticky top-0 z-[60] ${ 
          isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        } border-b`}>
          <div className="flex items-center justify-between px-4 lg:px-6 py-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className={`lg:hidden ${isDarkMode ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-700"}`}
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="lg:hidden"></div>

            <div className="flex items-center gap-4">
              {/* Test Mode Indicator */}
              <TestModeIndicator />
              
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className={`relative p-2 rounded-lg transition-colors ${
                    isDarkMode
                      ? "text-gray-400 hover:text-gray-200 hover:bg-gray-700"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Bell className="w-6 h-6" />
                  {user.unreadNotifications > 0 && (
                    <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {user.unreadNotifications}
                    </span>
                  )}
                </button>

                {notificationsOpen && (
                  <NotificationDropdown onClose={() => setNotificationsOpen(false)} />
                )}
              </div>

              {/* User Avatar (desktop) */}
              <Link 
                to="/profile"
                className="hidden lg:flex w-10 h-10 rounded-full bg-blue-600 items-center justify-center text-white font-semibold cursor-pointer hover:bg-blue-700 transition-colors"
              >
                {user.avatar}
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-6">
          <RoleSwitcher />
          <Outlet />
        </main>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}