import { useRef, useEffect } from "react";
import { User, AlertTriangle, Power, Bot, Users } from "lucide-react";
import { useApp } from "../../contexts/AppContext";

interface NotificationDropdownProps {
  onClose: () => void;
}

export function NotificationDropdown({ onClose }: NotificationDropdownProps) {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useApp();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const getIcon = (type: string) => {
    switch (type) {
      case "motion":
        return User;
      case "temperature":
        return AlertTriangle;
      case "offline":
        return Power;
      case "automation":
        return Bot;
      case "member":
        return Users;
      default:
        return AlertTriangle;
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case "motion":
        return "bg-blue-50 text-blue-600";
      case "temperature":
        return "bg-yellow-50 text-yellow-600";
      case "offline":
        return "bg-gray-100 text-gray-600";
      case "automation":
        return "bg-purple-50 text-purple-600";
      case "member":
        return "bg-green-50 text-green-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div
      ref={dropdownRef}
      className="absolute left-0 top-12 w-[380px] bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-[70]"
    >
      {/* Arrow pointing to bell */}
      <div className="absolute -top-2 left-4 w-4 h-4 bg-white dark:bg-gray-800 border-l border-t border-gray-200 dark:border-gray-700 transform rotate-45"></div>
      
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
        <button
          onClick={markAllNotificationsAsRead}
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          Mark all as read
        </button>
      </div>

      {/* Notifications List */}
      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            <p>No notifications</p>
          </div>
        ) : (
          notifications.map((notification) => {
            const Icon = getIcon(notification.type);
            const iconColor = getIconColor(notification.type);

            return (
              <button
                key={notification.id}
                onClick={() => markNotificationAsRead(notification.id)}
                className={`w-full p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left ${
                  !notification.isRead ? "bg-blue-50 dark:bg-blue-900/20" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg ${iconColor} flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {notification.message}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {notification.timeAgo}
                    </p>
                  </div>
                  {!notification.isRead && (
                    <div className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0 mt-2"></div>
                  )}
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
        <button className="w-full text-center text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium">
          View all notifications
        </button>
      </div>
    </div>
  );
}