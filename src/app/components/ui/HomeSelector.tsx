import { Home, ChevronDown, Settings, Plus, Check } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { useApp } from "../../contexts/AppContext";

export function HomeSelector() {
  const { homes, selectedHomeId, setSelectedHomeId, getCurrentHome, isDarkMode } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const currentHome = getCurrentHome();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const handleHomeSelect = (homeId: string) => {
    setSelectedHomeId(homeId);
    setIsOpen(false);
  };

  const handleManageHomes = () => {
    setIsOpen(false);
    navigate("/homes");
  };

  return (
    <div className="relative px-5 mb-4" ref={dropdownRef}>
      {/* Selector Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full h-12 px-3 rounded-lg flex items-center gap-3 transition-all ${
          isDarkMode
            ? "bg-white/10 hover:bg-white/15 text-white"
            : "bg-gray-900/10 hover:bg-gray-900/15 text-gray-900"
        }`}
      >
        <Home className="w-4 h-4 flex-shrink-0" />
        <span className="flex-1 text-left text-sm font-medium truncate">
          {currentHome?.name || "Select Home"}
        </span>
        <ChevronDown
          className={`w-4 h-4 flex-shrink-0 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={`absolute left-5 right-5 mt-2 rounded-lg shadow-lg border overflow-hidden z-50 ${
            isDarkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          {/* Homes List */}
          <div className="max-h-64 overflow-y-auto">
            {homes.map((home) => (
              <button
                key={home.id}
                onClick={() => handleHomeSelect(home.id)}
                className={`w-full px-4 py-3 flex items-center gap-3 transition-colors ${
                  isDarkMode
                    ? "hover:bg-gray-700 text-white"
                    : "hover:bg-gray-50 text-gray-900"
                }`}
              >
                <Home className="w-4 h-4 flex-shrink-0" />
                <div className="flex-1 text-left min-w-0">
                  <div className="text-sm font-medium truncate">{home.name}</div>
                  <div className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                    {home.roomCount} {home.roomCount === 1 ? "room" : "rooms"}
                  </div>
                </div>
                {selectedHomeId === home.id && (
                  <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
                )}
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className={`border-t ${isDarkMode ? "border-gray-700" : "border-gray-200"}`} />

          {/* Actions */}
          <div className="p-2">
            <button
              onClick={handleManageHomes}
              className={`w-full px-3 py-2 rounded-md flex items-center gap-3 transition-colors ${
                isDarkMode
                  ? "hover:bg-gray-700 text-gray-300"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              <Settings className="w-4 h-4" />
              <span className="text-sm font-medium">Manage Homes</span>
            </button>
            <button
              onClick={handleManageHomes}
              className={`w-full px-3 py-2 rounded-md flex items-center gap-3 transition-colors ${
                isDarkMode
                  ? "hover:bg-gray-700 text-blue-400"
                  : "hover:bg-gray-100 text-blue-600"
              }`}
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm font-medium">Add New Home</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
