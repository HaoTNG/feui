import { Lightbulb, Fan, Thermometer, Droplets, Sun, Eye, Cpu, Clock, HardDrive } from "lucide-react";
import { useApp } from "../contexts/AppContext";
import { useToast } from "../contexts/ToastContext";
import { RoleSwitcher } from "./ui/RoleSwitcher";

export function GuestDashboard() {
  const { modules, hubs, rooms, guestAccess, updateModule, addActivity, isDarkMode, getHubById } = useApp();
  const { showToast } = useToast();

  // Filter modules based on guest allowed rooms
  const allowedModules = modules.filter((module) =>
    guestAccess.allowedRooms.some((roomId) =>
      rooms.find(r => r.id === roomId)?.name === module.room
    )
  );

  // Group modules by room
  const modulesByRoom = allowedModules.reduce((acc, module) => {
    if (!acc[module.room]) {
      acc[module.room] = [];
    }
    acc[module.room].push(module);
    return acc;
  }, {} as Record<string, typeof modules>);

  const handleToggleModule = (moduleId: string, currentState: boolean | undefined) => {
    const module = modules.find((m) => m.id === moduleId);
    if (!module || module.status === "offline") {
      showToast("Module is offline", "error");
      return;
    }

    updateModule(moduleId, { isOn: !currentState });
    addActivity({
      type: "user",
      action: `You turned ${!currentState ? "on" : "off"} ${module.name}`,
      detail: "via Guest Dashboard",
      success: true,
    });
    showToast(`${module.name} turned ${!currentState ? "on" : "off"}`, "success");
  };

  const handleSpeedChange = (moduleId: string, speed: number) => {
    const module = modules.find((m) => m.id === moduleId);
    if (!module || module.status === "offline") {
      showToast("Module is offline", "error");
      return;
    }

    updateModule(moduleId, { speed, isOn: speed > 0 });
    addActivity({
      type: "user",
      action: `You set ${module.name} speed to ${speed}`,
      detail: "via Guest Dashboard",
      success: true,
    });
  };

  const getModuleIcon = (type: string) => {
    switch (type) {
      case "temperature":
        return Thermometer;
      case "humidity":
        return Droplets;
      case "light-sensor":
        return Sun;
      case "fan":
        return Fan;
      case "led":
        return Lightbulb;
      case "pir-motion":
        return Eye;
      default:
        return Cpu;
    }
  };

  const getModuleValue = (module: any) => {
    if (module.type === "temperature" && module.temperature !== undefined) {
      return `${module.temperature}°C`;
    } else if (module.type === "humidity" && module.humidity !== undefined) {
      return `${module.humidity}%`;
    } else if (module.type === "light-sensor" && module.lux !== undefined) {
      return `${module.lux} lux`;
    } else if (module.type === "pir-motion") {
      return module.motion ? "Motion Detected" : "No Motion";
    } else if (module.type === "fan") {
      return module.isOn ? `Speed ${module.speed}` : "Off";
    } else if (module.type === "led") {
      return module.isOn ? "On" : "Off";
    }
    return "N/A";
  };

  const formatExpiryTime = () => {
    if (!guestAccess.expiresAt) return "No expiration";
    const now = new Date();
    const expiry = new Date(guestAccess.expiresAt);
    const diffMs = expiry.getTime() - now.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (diffMs < 0) {
      return "Expired";
    } else if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? "s" : ""} remaining`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} remaining`;
    } else {
      return "Expires soon";
    }
  };

  const isExpired = guestAccess.expiresAt && new Date(guestAccess.expiresAt) < new Date();
  const expiresWithin24h = guestAccess.expiresAt &&
    new Date(guestAccess.expiresAt).getTime() - new Date().getTime() < 24 * 60 * 60 * 1000;

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      <RoleSwitcher />

      <div className="max-w-4xl mx-auto p-4 lg:p-6">
        {/* Header */}
        <div className={`mb-6 p-6 rounded-xl shadow-sm border ${
          isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}>
          <h1 className={`text-2xl font-bold mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
            Guest Access
          </h1>
          <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            You have limited access to control modules in allowed rooms
          </p>

          {/* Allowed Rooms badges */}
          <div className="flex flex-wrap gap-2 mt-4">
            {guestAccess.allowedRooms.map((roomId) => {
              const room = rooms.find(r => r.id === roomId);
              return room ? (
                <span
                  key={roomId}
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    isDarkMode ? "bg-blue-900/30 text-blue-400" : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {room.name}
                </span>
              ) : null;
            })}
          </div>

          {/* Access expiry warning */}
          {isExpired && (
            <div className={`mt-4 flex items-center gap-2 px-3 py-2 rounded-lg ${
              isDarkMode ? "bg-red-900/20 text-red-400 border border-red-700" : "bg-red-50 text-red-600 border border-red-200"
            }`}>
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">Access expired - Please contact the owner</span>
            </div>
          )}

          {expiresWithin24h && !isExpired && (
            <div className={`mt-4 flex items-center gap-2 px-3 py-2 rounded-lg ${
              isDarkMode ? "bg-yellow-900/20 text-yellow-400 border border-yellow-700" : "bg-yellow-50 text-yellow-600 border border-yellow-200"
            }`}>
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">Your guest access expires in {formatExpiryTime()}</span>
            </div>
          )}

          {guestAccess.expiresAt && !isExpired && !expiresWithin24h && (
            <div className={`mt-4 flex items-center gap-2 px-3 py-2 rounded-lg ${
              isDarkMode ? "bg-blue-900/20 text-blue-400" : "bg-blue-50 text-blue-600"
            }`}>
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">{formatExpiryTime()}</span>
            </div>
          )}
        </div>

        {/* Module Controls by Room */}
        {Object.keys(modulesByRoom).length === 0 ? (
          <div className={`p-8 text-center rounded-xl shadow-sm border ${
            isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          }`}>
            <Cpu className={`w-12 h-12 mx-auto mb-3 ${
              isDarkMode ? "text-gray-600" : "text-gray-400"
            }`} />
            <h3 className={`text-lg font-semibold mb-1 ${
              isDarkMode ? "text-gray-300" : "text-gray-700"
            }`}>
              No modules available
            </h3>
            <p className={`text-sm ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>
              You don't have access to any rooms or modules yet
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(modulesByRoom).map(([roomName, roomModules]) => (
              <div key={roomName}>
                <h2 className={`text-lg font-semibold mb-3 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}>
                  {roomName}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {roomModules.map((module) => {
                    const Icon = getModuleIcon(module.type);
                    const isSensor = ["temperature", "humidity", "light-sensor", "pir-motion"].includes(module.type);
                    const isActuator = ["fan", "led"].includes(module.type);
                    const parentHub = getHubById(module.hubId);
                    const isOffline = module.status === "offline" || isExpired;

                    return (
                      <div
                        key={module.id}
                        className={`p-5 rounded-xl shadow-sm border transition-all ${
                          isDarkMode
                            ? "bg-gray-800 border-gray-700"
                            : "bg-white border-gray-200"
                        }`}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className={`p-2.5 rounded-lg ${
                              module.isOn && isActuator
                                ? "bg-blue-600 text-white"
                                : isDarkMode
                                ? "bg-gray-700 text-gray-400"
                                : "bg-gray-100 text-gray-600"
                            }`}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <div>
                              <h3 className={`font-semibold ${
                                isDarkMode ? "text-white" : "text-gray-900"
                              }`}>
                                {module.name}
                              </h3>
                              <div className="flex items-center gap-2 mt-1">
                                <span className={`w-2 h-2 rounded-full ${
                                  module.status === "online" ? "bg-green-500" : "bg-red-500"
                                }`} />
                                <span className={`text-xs ${
                                  isDarkMode ? "text-gray-400" : "text-gray-500"
                                }`}>
                                  {module.status}
                                </span>
                              </div>
                              <div className={`text-xs mt-1 ${
                                isDarkMode ? "text-gray-500" : "text-gray-400"
                              }`}>
                                via {parentHub?.name || "Unknown Hub"}
                              </div>
                            </div>
                          </div>

                          {isActuator && !isOffline && (
                            <button
                              onClick={() => handleToggleModule(module.id, module.isOn)}
                              disabled={isOffline}
                              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                                module.isOn
                                  ? "bg-blue-600 text-white hover:bg-blue-700"
                                  : isDarkMode
                                  ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                              } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                              {module.isOn ? "ON" : "OFF"}
                            </button>
                          )}
                        </div>

                        {/* Fan Speed Control */}
                        {module.type === "fan" && module.speed !== undefined && !isOffline && (
                          <div className="mt-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className={`text-sm font-medium ${
                                isDarkMode ? "text-gray-300" : "text-gray-700"
                              }`}>
                                Speed
                              </span>
                              <span className={`text-sm font-semibold ${
                                isDarkMode ? "text-blue-400" : "text-blue-600"
                              }`}>
                                {module.speed}
                              </span>
                            </div>
                            <div className="flex gap-2">
                              {[0, 1, 2, 3].map((speed) => (
                                <button
                                  key={speed}
                                  onClick={() => handleSpeedChange(module.id, speed)}
                                  disabled={isOffline}
                                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    module.speed === speed
                                      ? "bg-blue-600 text-white"
                                      : isDarkMode
                                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                                >
                                  {speed}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Sensor Readings */}
                        {isSensor && (
                          <div className="mt-4">
                            <span className={`text-2xl font-bold ${
                              isDarkMode ? "text-blue-400" : "text-blue-600"
                            }`}>
                              {getModuleValue(module)}
                            </span>
                            <div className={`text-xs mt-1 ${
                              isDarkMode ? "text-gray-400" : "text-gray-500"
                            }`}>
                              Last updated: {module.lastSeen ? new Date(module.lastSeen).toLocaleTimeString() : "N/A"}
                            </div>
                          </div>
                        )}

                        {/* LED indicator for LED modules */}
                        {module.type === "led" && module.isOn && (
                          <div className="mt-4 flex items-center gap-2">
                            <div
                              className="w-6 h-6 rounded border-2"
                              style={{ backgroundColor: module.color || "#8B5CF6", borderColor: module.color || "#8B5CF6" }}
                            ></div>
                            <span className={`text-sm ${
                              isDarkMode ? "text-gray-400" : "text-gray-600"
                            }`}>
                              Current color
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
