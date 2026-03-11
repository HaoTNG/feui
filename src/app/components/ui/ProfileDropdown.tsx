import { User, Settings, Bell, HelpCircle, LogOut, Sun, Moon, ChevronRight } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useApp } from "../../contexts/AppContext";
import { useEffect, useRef } from "react";

interface ProfileDropdownProps {
  onClose: () => void;
}

export function ProfileDropdown({ onClose }: ProfileDropdownProps) {
  const { userProfile, userRole, isDarkMode, setTheme, theme } = useApp();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleLogout = () => {
    onClose();
    navigate("/auth/login");
  };

  const toggleDarkMode = () => {
    setTheme(isDarkMode ? "light" : "dark");
  };

  // Role badge config
  const getRoleBadge = () => {
    switch (userRole) {
      case "owner":
        return { text: "Owner", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" };
      case "family":
        return { text: "Family", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" };
      case "guest":
        return { text: "Guest", color: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400" };
      default:
        return { text: "User", color: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400" };
    }
  };

  const roleBadge = getRoleBadge();

  return (
    <div
      ref={dropdownRef}
      className={`absolute right-0 top-full mt-2 w-72 rounded-xl shadow-lg border transition-colors duration-200 ${
        isDarkMode
          ? "bg-gray-800 border-white/10 shadow-black/30"
          : "bg-white border-gray-200 shadow-black/10"
      }`}
      style={{ boxShadow: isDarkMode ? "0 4px 12px rgba(0, 0, 0, 0.3)" : "0 4px 12px rgba(0, 0, 0, 0.1)" }}
    >
      {/* User Info */}
      <div className={`p-4 border-b ${isDarkMode ? "border-white/10" : "border-gray-200"}`}>
        <div className="flex items-center gap-3">
          {/* Profile Picture */}
          <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold border-2 border-gray-200 dark:border-white/20">
            {userProfile.avatar}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className={`font-semibold truncate ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              {userProfile.fullName}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${roleBadge.color}`}>
                {roleBadge.text}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="p-2">
        <Link
          to="/profile"
          onClick={onClose}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${
            isDarkMode
              ? "text-gray-300 hover:bg-white/5"
              : "text-gray-700 hover:bg-gray-50"
          }`}
        >
          <User className="w-4 h-4" />
          <span className="flex-1 text-sm font-medium">View Profile</span>
          <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>

        <Link
          to="/settings"
          onClick={onClose}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${
            isDarkMode
              ? "text-gray-300 hover:bg-white/5"
              : "text-gray-700 hover:bg-gray-50"
          }`}
        >
          <Settings className="w-4 h-4" />
          <span className="flex-1 text-sm font-medium">Account Settings</span>
          <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>

        <button
          onClick={onClose}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${
            isDarkMode
              ? "text-gray-300 hover:bg-white/5"
              : "text-gray-700 hover:bg-gray-50"
          }`}
        >
          <Bell className="w-4 h-4" />
          <span className="flex-1 text-left text-sm font-medium">Notification Preferences</span>
          <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
            isDarkMode
              ? "text-gray-300 hover:bg-white/5"
              : "text-gray-700 hover:bg-gray-50"
          }`}
        >
          {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          <span className="flex-1 text-left text-sm font-medium">Dark Mode</span>
          <div className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
            isDarkMode ? "bg-blue-600" : "bg-gray-300"
          }`}>
            <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
              isDarkMode ? "translate-x-5" : "translate-x-1"
            }`} />
          </div>
        </button>
      </div>

      {/* Bottom Section */}
      <div className={`p-2 border-t ${isDarkMode ? "border-white/10" : "border-gray-200"}`}>
        <Link
          to="/help"
          onClick={onClose}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${
            isDarkMode
              ? "text-gray-300 hover:bg-white/5"
              : "text-gray-700 hover:bg-gray-50"
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span className="flex-1 text-sm font-medium">Help & Support</span>
          <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>

        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
            isDarkMode
              ? "text-red-400 hover:bg-red-900/20"
              : "text-red-600 hover:bg-red-50"
          }`}
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
}
