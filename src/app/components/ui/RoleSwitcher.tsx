import { UserCircle, X } from "lucide-react";
import { useState } from "react";
import { useApp, type UserRole } from "../../contexts/AppContext";
import { toast } from "sonner";
import { useNavigate } from "react-router";

export function RoleSwitcher() {
  const { userRole, setUserRole, isDarkMode } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const roles: { value: UserRole; label: string; description: string }[] = [
    { value: "owner", label: "Owner", description: "Full access to all features" },
    { value: "family", label: "Family", description: "Control devices, view-only automation" },
    { value: "guest", label: "Guest", description: "Limited access to allowed rooms" },
  ];

  const handleRoleChange = (newRole: UserRole) => {
    setUserRole(newRole);
    setIsOpen(false);
    toast.success(`Switched to ${newRole} perspective`);
    
    // Navigate to appropriate page
    if (newRole === "guest") {
      navigate("/guest");
    } else {
      navigate("/");
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-lg transition-all hover:scale-110 ${
          isDarkMode
            ? "bg-blue-600 hover:bg-blue-700 text-white"
            : "bg-blue-600 hover:bg-blue-700 text-white"
        }`}
        title="Switch User Role (Demo)"
      >
        <UserCircle className="w-6 h-6" />
      </button>

      {/* Modal */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-[100]"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal Content */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
            <div
              className={`w-full max-w-md rounded-xl shadow-2xl ${
                isDarkMode ? "bg-gray-800" : "bg-white"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className={`flex items-center justify-between p-6 border-b ${
                isDarkMode ? "border-gray-700" : "border-gray-200"
              }`}>
                <div>
                  <h2 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                    Switch User Role
                  </h2>
                  <p className={`text-sm mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Demo feature - Test different perspectives
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className={`p-2 rounded-lg transition-colors ${
                    isDarkMode
                      ? "hover:bg-gray-700 text-gray-400"
                      : "hover:bg-gray-100 text-gray-500"
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Role Options */}
              <div className="p-6 space-y-3">
                {roles.map((role) => (
                  <button
                    key={role.value}
                    onClick={() => handleRoleChange(role.value)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      userRole === role.value
                        ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                        : isDarkMode
                        ? "border-gray-700 hover:border-gray-600 bg-gray-700/50"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className={`font-semibold ${
                          userRole === role.value
                            ? "text-blue-600 dark:text-blue-400"
                            : isDarkMode
                            ? "text-white"
                            : "text-gray-900"
                        }`}>
                          {role.label}
                        </div>
                        <div className={`text-sm mt-1 ${
                          isDarkMode ? "text-gray-400" : "text-gray-600"
                        }`}>
                          {role.description}
                        </div>
                      </div>
                      {userRole === role.value && (
                        <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-white" />
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {/* Footer */}
              <div className={`px-6 py-4 border-t ${
                isDarkMode ? "border-gray-700 bg-gray-900/50" : "border-gray-200 bg-gray-50"
              }`}>
                <p className={`text-xs ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>
                  💡 This is a demo feature to test different user perspectives. In production, roles would be set by authentication.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
