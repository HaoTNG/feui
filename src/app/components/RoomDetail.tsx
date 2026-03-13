import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router";
import {
  ArrowLeft,
  Pencil,
  Plus,
  Lightbulb,
  Fan,
  Thermometer,
  Droplets,
  Sun,
  HardDrive,
  Cpu,
  Eye,
  Monitor,
  Wifi,
  WifiOff,
} from "lucide-react";
import { useApp } from "../contexts/AppContext";
import { useToast } from "../contexts/ToastContext";

export function RoomDetail() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { hubs, modules, rooms, isDarkMode, updateModule, getModulesByHub, getHubById } = useApp();
  const { showToast } = useToast();
  const [showEditModal, setShowEditModal] = useState(false);

  const room = rooms.find((r) => r.id === roomId);

  if (!room) {
    return (
      <div className="max-w-7xl mx-auto">
        <div
          className={`rounded-xl border p-12 text-center ${
            isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          }`}
        >
          <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
            Room not found
          </h3>
          <button
            onClick={() => navigate("/room-management")}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Room Management
          </button>
        </div>
      </div>
    );
  }

  // Get hubs and modules in this room
  const roomHubs = hubs.filter((h) => h.room === room.name);
  const roomModules = modules.filter((m) => m.room === room.name);
  const modulesFromOtherHubs = roomModules.filter(
    (m) => !roomHubs.find((h) => h.id === m.hubId)
  );
  const onlineModules = roomModules.filter((m) => m.status === "online").length;

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
      case "lcd-display":
        return Monitor;
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

  const handleQuickToggle = (moduleId: string, currentState: boolean | undefined) => {
    const module = modules.find((m) => m.id === moduleId);
    if (!module || module.status === "offline") {
      showToast("Module is offline", "error");
      return;
    }

    updateModule(moduleId, { isOn: !currentState });
    showToast(`${module.name} turned ${!currentState ? "on" : "off"}`, "success");
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/room-management")}
          className={`p-2 rounded-lg transition-colors ${
            isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
          }`}
        >
          <ArrowLeft className={`w-6 h-6 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`} />
        </button>
        <div className="flex-1">
          <h1 className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
            {room.name}
          </h1>
          <p className={isDarkMode ? "text-gray-400 mt-1" : "text-gray-600 mt-1"}>
            Hubs and modules in this room
          </p>
        </div>
        <button
          onClick={() => setShowEditModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
        >
          <Pencil className="w-4 h-4" />
          Edit Room
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          className={`rounded-xl border p-5 ${
            isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
              <HardDrive className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                {roomHubs.length}
              </p>
              <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                Total Hubs
              </p>
            </div>
          </div>
        </div>

        <div
          className={`rounded-xl border p-5 ${
            isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center">
              <Cpu className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                {roomModules.length}
              </p>
              <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Total Modules</p>
            </div>
          </div>
        </div>

        <div
          className={`rounded-xl border p-5 ${
            isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-green-50 dark:bg-green-900/30 flex items-center justify-center">
              <Cpu className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                {onlineModules}
              </p>
              <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Online Modules</p>
            </div>
          </div>
        </div>
      </div>

      {/* Empty state when no hubs */}
      {roomHubs.length === 0 ? (
        <div
          className={`rounded-xl border p-12 text-center ${
            isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          }`}
        >
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
            <HardDrive className={`w-12 h-12 ${isDarkMode ? "text-blue-500" : "text-blue-600"}`} />
          </div>
          <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
            No hubs in this room
          </h3>
          <p className={`mb-6 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            Add a YoloBit hub to this room to start controlling devices
          </p>
          <button
            onClick={() => navigate("/hub-management")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Add Hub
          </button>
        </div>
      ) : (
        <>
          {/* Hubs and their modules */}
          <div className="space-y-6">
            {roomHubs.map((hub) => {
              const hubModules = getModulesByHub(hub.id).filter(m => m.room === room.name);

              return (
                <div
                  key={hub.id}
                  className={`rounded-xl border ${
                    isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
                  }`}
                >
                  {/* Hub Header */}
                  <div className={`p-5 border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          isDarkMode ? "bg-blue-900/30" : "bg-blue-50"
                        }`}>
                          <HardDrive className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                            {hub.name}
                          </h3>
                          <div className="flex items-center gap-3 text-sm mt-1">
                            <div className="flex items-center gap-1">
                              {hub.status === "online" ? (
                                <>
                                  <Wifi className="w-3 h-3 text-green-500" />
                                  <span className="text-green-600">
                                    {hub.wifiSignal && hub.wifiSignal > 70 ? "Strong" : hub.wifiSignal && hub.wifiSignal > 40 ? "Medium" : "Weak"}
                                  </span>
                                </>
                              ) : (
                                <>
                                  <WifiOff className="w-3 h-3 text-gray-500" />
                                  <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>Offline</span>
                                </>
                              )}
                            </div>
                            <span className={isDarkMode ? "text-gray-500" : "text-gray-400"}>•</span>
                            <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
                              {hubModules.length} modules
                            </span>
                          </div>
                        </div>
                      </div>
                      <Link
                        to={`/hub-management/${hub.id}`}
                        className={`text-sm font-medium ${
                          isDarkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-700"
                        }`}
                      >
                        View Hub →
                      </Link>
                    </div>
                  </div>

                  {/* Hub's Modules */}
                  <div className="p-5">
                    {hubModules.length === 0 ? (
                      <div className={`text-center py-8 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                        <Cpu className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No modules configured for this hub</p>
                        <Link
                          to={`/hub-management/${hub.id}`}
                          className={`text-sm mt-2 inline-block ${
                            isDarkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-700"
                          }`}
                        >
                          Configure Modules
                        </Link>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {hubModules.map((module) => {
                          const Icon = getModuleIcon(module.type);
                          const canToggle = module.type === "fan" || module.type === "led";

                          return (
                            <div
                              key={module.id}
                              className={`p-4 rounded-lg border ${
                                isDarkMode ? "bg-gray-700/50 border-gray-600" : "bg-gray-50 border-gray-200"
                              }`}
                            >
                              <div className="flex items-start justify-between mb-3">
                                <Icon className={`w-5 h-5 ${
                                  module.type === "temperature" ? "text-orange-500" :
                                  module.type === "humidity" ? "text-blue-500" :
                                  module.type === "light-sensor" ? "text-yellow-500" :
                                  module.type === "fan" ? "text-blue-500" :
                                  module.type === "led" ? "text-yellow-500" :
                                  "text-purple-500"
                                }`} />
                                <div className={`w-2 h-2 rounded-full ${
                                  module.status === "online" ? "bg-green-500" : "bg-gray-400"
                                }`}></div>
                              </div>

                              <h4 className={`font-semibold mb-1 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                                {module.name}
                              </h4>

                              <div className={`text-xs mb-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                                {module.feed}
                              </div>

                              <div className={`text-lg font-bold mb-3 ${isDarkMode ? "text-gray-200" : "text-gray-900"}`}>
                                {getModuleValue(module)}
                              </div>

                              {canToggle && module.status === "online" && (
                                <button
                                  onClick={() => handleQuickToggle(module.id, module.isOn)}
                                  className={`w-full py-2 rounded-lg font-medium transition-colors ${
                                    module.isOn
                                      ? "bg-blue-600 text-white hover:bg-blue-700"
                                      : isDarkMode
                                      ? "bg-gray-600 text-gray-300 hover:bg-gray-500"
                                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                  }`}
                                >
                                  {module.isOn ? "Turn Off" : "Turn On"}
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Modules from Other Hubs */}
          {modulesFromOtherHubs.length > 0 && (
            <div
              className={`rounded-xl border ${
                isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
              }`}
            >
              <div className={`p-5 border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
                <h3 className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  Modules from Other Hubs
                </h3>
                <p className={`text-sm mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                  These modules are assigned to this room but belong to hubs in other rooms
                </p>
              </div>
              <div className="p-5">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {modulesFromOtherHubs.map((module) => {
                    const Icon = getModuleIcon(module.type);
                    const parentHub = getHubById(module.hubId);
                    const canToggle = module.type === "fan" || module.type === "led";

                    return (
                      <div
                        key={module.id}
                        className={`p-4 rounded-lg border ${
                          isDarkMode ? "bg-gray-700/50 border-gray-600" : "bg-gray-50 border-gray-200"
                        }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <Icon className={`w-5 h-5 ${
                            module.type === "temperature" ? "text-orange-500" :
                            module.type === "humidity" ? "text-blue-500" :
                            module.type === "light-sensor" ? "text-yellow-500" :
                            module.type === "fan" ? "text-blue-500" :
                            module.type === "led" ? "text-yellow-500" :
                            "text-purple-500"
                          }`} />
                          <div className={`w-2 h-2 rounded-full ${
                            module.status === "online" ? "bg-green-500" : "bg-gray-400"
                          }`}></div>
                        </div>

                        <h4 className={`font-semibold mb-1 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                          {module.name}
                        </h4>

                        <div className={`text-xs mb-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                          via {parentHub?.name || "Unknown Hub"}
                        </div>

                        <div className={`text-lg font-bold mb-3 ${isDarkMode ? "text-gray-200" : "text-gray-900"}`}>
                          {getModuleValue(module)}
                        </div>

                        {canToggle && module.status === "online" && (
                          <button
                            onClick={() => handleQuickToggle(module.id, module.isOn)}
                            className={`w-full py-2 rounded-lg font-medium transition-colors ${
                              module.isOn
                                ? "bg-blue-600 text-white hover:bg-blue-700"
                                : isDarkMode
                                ? "bg-gray-600 text-gray-300 hover:bg-gray-500"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                          >
                            {module.isOn ? "Turn Off" : "Turn On"}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}