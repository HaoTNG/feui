import { useState } from "react";
import { Bell, Moon, Globe, Shield, Zap, Database, UserCircle } from "lucide-react";
import { toast } from "sonner";
import { useApp, type UserRole } from "../contexts/AppContext";

export function Settings() {
  const { theme, setTheme, isDarkMode, userRole, setUserRole } = useApp();
  const [settings, setSettings] = useState({
    notifications: {
      deviceAlerts: true,
      motionDetection: true,
      temperatureAlerts: true,
      systemUpdates: false,
    },
    appearance: {
      compactMode: false,
    },
    automation: {
      enableRules: true,
      morningRoutine: true,
      eveningRoutine: true,
    },
    privacy: {
      shareAnalytics: false,
      activityTracking: true,
    },
  });

  const handleNotificationChange = (key: string, value: boolean) => {
    setSettings({
      ...settings,
      notifications: { ...settings.notifications, [key]: value },
    });
    toast.success("Settings updated");
  };

  const handleAppearanceChange = (key: string, value: any) => {
    setSettings({
      ...settings,
      appearance: { ...settings.appearance, [key]: value },
    });
    toast.success("Settings updated");
  };

  const handleThemeChange = (newTheme: "light" | "dark" | "auto") => {
    setTheme(newTheme);
    toast.success(`Theme changed to ${newTheme}`);
  };

  const handleAutomationChange = (key: string, value: boolean) => {
    setSettings({
      ...settings,
      automation: { ...settings.automation, [key]: value },
    });
    toast.success("Settings updated");
  };

  const handlePrivacyChange = (key: string, value: boolean) => {
    setSettings({
      ...settings,
      privacy: { ...settings.privacy, [key]: value },
    });
    toast.success("Settings updated");
  };

  const handleUserRoleChange = (newRole: UserRole) => {
    setUserRole(newRole);
    toast.success(`User role changed to ${newRole}`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
          Settings
        </h1>
        <p className={isDarkMode ? "text-gray-400 mt-1" : "text-gray-600 mt-1"}>
          Manage your app preferences
        </p>
      </div>

      {/* Notifications */}
      <div className={`rounded-xl shadow-sm border p-6 ${
        isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      }`}>
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            isDarkMode ? "bg-blue-900/30" : "bg-blue-50"
          }`}>
            <Bell className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              Notifications
            </h2>
            <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              Manage notification preferences
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <SettingToggle
            label="Device Alerts"
            description="Get notified when devices go offline or need attention"
            checked={settings.notifications.deviceAlerts}
            onChange={(value) => handleNotificationChange("deviceAlerts", value)}
          />
          <SettingToggle
            label="Motion Detection"
            description="Receive alerts for motion sensor triggers"
            checked={settings.notifications.motionDetection}
            onChange={(value) => handleNotificationChange("motionDetection", value)}
          />
          <SettingToggle
            label="Temperature Alerts"
            description="Notifications when temperature exceeds thresholds"
            checked={settings.notifications.temperatureAlerts}
            onChange={(value) => handleNotificationChange("temperatureAlerts", value)}
          />
          <SettingToggle
            label="System Updates"
            description="Updates about new features and improvements"
            checked={settings.notifications.systemUpdates}
            onChange={(value) => handleNotificationChange("systemUpdates", value)}
          />
        </div>
      </div>

      {/* Appearance */}
      <div className={`rounded-xl shadow-sm border p-6 ${
        isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      }`}>
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            isDarkMode ? "bg-purple-900/30" : "bg-purple-50"
          }`}>
            <Moon className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h2 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              Appearance
            </h2>
            <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              Customize the look and feel
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDarkMode ? "text-gray-300" : "text-gray-700"
            }`}>
              Theme
            </label>
            <div className="flex gap-3">
              <button
                onClick={() => handleThemeChange("light")}
                className={`flex-1 py-3 px-4 rounded-lg border-2 font-medium transition-colors ${
                  theme === "light"
                    ? "border-blue-600 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                    : isDarkMode
                    ? "border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600"
                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Light
              </button>
              <button
                onClick={() => handleThemeChange("dark")}
                className={`flex-1 py-3 px-4 rounded-lg border-2 font-medium transition-colors ${
                  theme === "dark"
                    ? "border-blue-600 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                    : isDarkMode
                    ? "border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600"
                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Dark
              </button>
              <button
                onClick={() => handleThemeChange("auto")}
                className={`flex-1 py-3 px-4 rounded-lg border-2 font-medium transition-colors ${
                  theme === "auto"
                    ? "border-blue-600 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                    : isDarkMode
                    ? "border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600"
                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Auto
              </button>
            </div>
            {theme === "auto" && (
              <p className={`text-xs mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                Note: In this prototype, Auto mode defaults to light. In the real app, it would follow your device settings.
              </p>
            )}
          </div>

          <SettingToggle
            label="Compact Mode"
            description="Use a denser layout to fit more content"
            checked={settings.appearance.compactMode}
            onChange={(value) => handleAppearanceChange("compactMode", value)}
          />
        </div>
      </div>

      {/* Automation */}
      <div className={`rounded-xl shadow-sm border p-6 ${
        isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      }`}>
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            isDarkMode ? "bg-green-900/30" : "bg-green-50"
          }`}>
            <Zap className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h2 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              Automation
            </h2>
            <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              Configure automated routines
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <SettingToggle
            label="Enable Automation Rules"
            description="Allow devices to be controlled by automated rules"
            checked={settings.automation.enableRules}
            onChange={(value) => handleAutomationChange("enableRules", value)}
          />
          <SettingToggle
            label="Morning Routine"
            description="Turn on lights and adjust temperature at 7 AM"
            checked={settings.automation.morningRoutine}
            onChange={(value) => handleAutomationChange("morningRoutine", value)}
          />
          <SettingToggle
            label="Evening Routine"
            description="Dim lights and activate night mode at 10 PM"
            checked={settings.automation.eveningRoutine}
            onChange={(value) => handleAutomationChange("eveningRoutine", value)}
          />
        </div>
      </div>

      {/* Privacy & Security */}
      <div className={`rounded-xl shadow-sm border p-6 ${
        isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      }`}>
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            isDarkMode ? "bg-red-900/30" : "bg-red-50"
          }`}>
            <Shield className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h2 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              Privacy & Security
            </h2>
            <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              Control your data and privacy
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <SettingToggle
            label="Share Analytics"
            description="Help improve the app by sharing anonymous usage data"
            checked={settings.privacy.shareAnalytics}
            onChange={(value) => handlePrivacyChange("shareAnalytics", value)}
          />
          <SettingToggle
            label="Activity Tracking"
            description="Keep a log of device activities and changes"
            checked={settings.privacy.activityTracking}
            onChange={(value) => handlePrivacyChange("activityTracking", value)}
          />
        </div>
      </div>

      {/* Data Management */}
      <div className={`rounded-xl shadow-sm border p-6 ${
        isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      }`}>
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            isDarkMode ? "bg-gray-700" : "bg-gray-100"
          }`}>
            <Database className={`w-5 h-5 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`} />
          </div>
          <div>
            <h2 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              Data Management
            </h2>
            <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              Manage your stored data
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <button className={`w-full text-left px-4 py-3 border rounded-lg font-medium transition-colors ${
            isDarkMode
              ? "border-gray-600 text-white hover:bg-gray-700"
              : "border-gray-300 text-gray-900 hover:bg-gray-50"
          }`}>
            Export Activity History
          </button>
          <button className={`w-full text-left px-4 py-3 border rounded-lg font-medium transition-colors ${
            isDarkMode
              ? "border-gray-600 text-white hover:bg-gray-700"
              : "border-gray-300 text-gray-900 hover:bg-gray-50"
          }`}>
            Download Device Data
          </button>
          <button className={`w-full text-left px-4 py-3 border rounded-lg font-medium transition-colors ${
            isDarkMode
              ? "border-red-600 text-red-400 hover:bg-red-900/20"
              : "border-red-300 text-red-600 hover:bg-red-50"
          }`}>
            Clear All Activity Logs
          </button>
        </div>
      </div>

      {/* User Role (Demo Only) */}
      <div className={`rounded-xl shadow-sm border p-6 ${
        isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      }`}>
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            isDarkMode ? "bg-yellow-900/30" : "bg-yellow-50"
          }`}>
            <UserCircle className="w-5 h-5 text-yellow-600" />
          </div>
          <div>
            <h2 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              User Role (Demo Mode)
            </h2>
            <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              Switch between different user roles to test permissions
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDarkMode ? "text-gray-300" : "text-gray-700"
            }`}>
              Current Role: <span className="font-bold capitalize">{userRole}</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => handleUserRoleChange("owner")}
                className={`py-3 px-4 rounded-lg border-2 font-medium transition-colors ${
                  userRole === "owner"
                    ? "border-blue-600 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                    : isDarkMode
                    ? "border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600"
                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Owner
              </button>
              <button
                onClick={() => handleUserRoleChange("family")}
                className={`py-3 px-4 rounded-lg border-2 font-medium transition-colors ${
                  userRole === "family"
                    ? "border-blue-600 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                    : isDarkMode
                    ? "border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600"
                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Family
              </button>
              <button
                onClick={() => handleUserRoleChange("guest")}
                className={`py-3 px-4 rounded-lg border-2 font-medium transition-colors ${
                  userRole === "guest"
                    ? "border-blue-600 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                    : isDarkMode
                    ? "border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600"
                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Guest
              </button>
            </div>
            <div className={`mt-3 p-3 rounded-lg ${
              isDarkMode ? "bg-yellow-900/20 text-yellow-400" : "bg-yellow-50 text-yellow-800"
            }`}>
              <p className="text-xs">
                <strong>Owner:</strong> Full access • <strong>Family:</strong> Limited management • <strong>Guest:</strong> Basic control only
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingToggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  const { isDarkMode } = useApp();
  
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex-1">
        <div className={`font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>{label}</div>
        <div className={`text-sm mt-0.5 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
          {description}
        </div>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${
          checked ? "bg-blue-600" : isDarkMode ? "bg-gray-600" : "bg-gray-300"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}