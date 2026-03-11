import { useState } from "react";
import { Lightbulb, Fan, Thermometer, Droplets, Sun, Palette, HardDrive, Wifi, WifiOff, Cpu, Eye, Monitor } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useApp } from "../contexts/AppContext";
import { useToast } from "../contexts/ToastContext";
import type { Module, Hub } from "../contexts/AppContext";

type ViewMode = "group-by-hub" | "group-by-room" | "all-modules";

export function DeviceControl() {
  const [viewMode, setViewMode] = useState<ViewMode>("group-by-hub");
  const { isDarkMode, selectedHomeId, hubs, modules, rooms, getModulesByHub, getHubById, updateModule, addActivity } = useApp();

  // Filter data by selected home
  const currentHomeHubs = hubs.filter(h => h.homeId === selectedHomeId);
  const currentHomeModules = modules.filter(m => m.homeId === selectedHomeId);
  const currentHomeRooms = rooms.filter(r => r.homeId === selectedHomeId);

  if (currentHomeModules.length === 0) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className={`rounded-xl border ${
          isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        } p-12 text-center`}>
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
            <Cpu className="w-12 h-12 text-blue-600" />
          </div>
          <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
            No modules yet
          </h3>
          <p className={`mb-6 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            You haven't added any modules yet. Add a hub with modules to get started.
          </p>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
            Add Your First Hub
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
            Control
          </h1>
          <p className={isDarkMode ? "text-gray-400 mt-1" : "text-gray-600 mt-1"}>
            Manage and control all your modules
          </p>
        </div>

        {/* View Toggle */}
        <div className={`flex gap-1 rounded-lg p-1 ${
          isDarkMode ? "bg-gray-800 border border-gray-700" : "bg-gray-100 border border-gray-200"
        }`}>
          <ViewToggleButton
            label="Group by Hub"
            active={viewMode === "group-by-hub"}
            onClick={() => setViewMode("group-by-hub")}
          />
          <ViewToggleButton
            label="Group by Room"
            active={viewMode === "group-by-room"}
            onClick={() => setViewMode("group-by-room")}
          />
          <ViewToggleButton
            label="All Modules"
            active={viewMode === "all-modules"}
            onClick={() => setViewMode("all-modules")}
          />
        </div>
      </div>

      {/* Content based on view mode */}
      {viewMode === "group-by-hub" && (
        <GroupByHubView hubs={currentHomeHubs} getModulesByHub={getModulesByHub} />
      )}

      {viewMode === "group-by-room" && (
        <GroupByRoomView rooms={currentHomeRooms} modules={currentHomeModules} hubs={currentHomeHubs} getHubById={getHubById} />
      )}

      {viewMode === "all-modules" && (
        <AllModulesView modules={currentHomeModules} hubs={currentHomeHubs} getHubById={getHubById} />
      )}
    </div>
  );
}

function ViewToggleButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  const { isDarkMode } = useApp();

  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
        active
          ? "bg-blue-600 text-white"
          : isDarkMode
          ? "text-gray-400 hover:text-gray-200"
          : "text-gray-600 hover:text-gray-900"
      }`}
    >
      {label}
    </button>
  );
}

function GroupByHubView({ hubs, getModulesByHub }: { hubs: Hub[]; getModulesByHub: (hubId: string) => Module[] }) {
  const { isDarkMode, rooms } = useApp();

  // Group hubs by room
  const hubsByRoom = hubs.reduce((acc, hub) => {
    if (!acc[hub.room]) {
      acc[hub.room] = [];
    }
    acc[hub.room].push(hub);
    return acc;
  }, {} as Record<string, Hub[]>);

  return (
    <div className="space-y-8">
      {Object.entries(hubsByRoom).map(([roomName, roomHubs]) => (
        <div key={roomName}>
          <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
            {roomName}
          </h2>
          <div className="space-y-6">
            {roomHubs.map((hub) => {
              const hubModules = getModulesByHub(hub.id);
              return (
                <div
                  key={hub.id}
                  className={`rounded-xl shadow-sm border ${
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
                          <div className="flex items-center gap-4 text-sm">
                            <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
                              ID: {hub.id}
                            </span>
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
                          </div>
                        </div>
                      </div>
                      <div className="text-right text-sm">
                        <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
                          Firmware: {hub.firmwareVersion}
                        </p>
                        <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
                          IP: {hub.ipAddress || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Modules */}
                  <div className="p-5">
                    {hubModules.length === 0 ? (
                      <div className={`text-center py-8 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                        No modules configured
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {hubModules.map((module) => (
                          <ModuleCard key={module.id} module={module} hub={hub} />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function GroupByRoomView({ rooms, modules, hubs, getHubById }: { rooms: any[]; modules: Module[]; hubs: Hub[]; getHubById: (id: string) => Hub | undefined }) {
  const { isDarkMode } = useApp();

  return (
    <div className="space-y-8">
      {rooms.map((room) => {
        const roomModules = modules.filter(m => m.room === room.name);
        
        return (
          <div key={room.id}>
            <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              {room.name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {roomModules.map((module) => {
                const hub = getHubById(module.hubId);
                return hub ? <ModuleCard key={module.id} module={module} hub={hub} showHubInfo /> : null;
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function AllModulesView({ modules, hubs, getHubById }: { modules: Module[]; hubs: Hub[]; getHubById: (id: string) => Hub | undefined }) {
  const { isDarkMode } = useApp();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {modules.map((module) => {
        const hub = getHubById(module.hubId);
        return hub ? <ModuleCard key={module.id} module={module} hub={hub} showHubInfo showRoomInfo /> : null;
      })}
    </div>
  );
}

function ModuleCard({ module, hub, showHubInfo, showRoomInfo }: { module: Module; hub: Hub; showHubInfo?: boolean; showRoomInfo?: boolean }) {
  const { updateModule, addActivity, isDarkMode } = useApp();
  const { showToast } = useToast();

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

  const Icon = getModuleIcon(module.type);
  const isSensor = ["temperature", "humidity", "light-sensor", "pir-motion"].includes(module.type);
  const isActuator = ["fan", "led", "lcd-display"].includes(module.type);

  // Sensor Module
  if (isSensor) {
    let value = "";
    if (module.type === "temperature" && module.temperature !== undefined) {
      value = `${module.temperature}°C`;
    } else if (module.type === "humidity" && module.humidity !== undefined) {
      value = `${module.humidity}%`;
    } else if (module.type === "light-sensor" && module.lux !== undefined) {
      value = `${module.lux} lux`;
    } else if (module.type === "pir-motion") {
      value = module.motion ? "Motion Detected" : "No Motion";
    }

    return (
      <div className={`rounded-xl shadow-sm border p-5 ${
        isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      }`}>
        <div className="flex items-start justify-between mb-3">
          <Icon className={`w-6 h-6 ${
            module.type === "temperature" ? "text-orange-500" :
            module.type === "humidity" ? "text-blue-500" :
            module.type === "light-sensor" ? "text-yellow-500" :
            "text-purple-500"
          }`} />
          {showRoomInfo && (
            <span className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
              {module.room}
            </span>
          )}
        </div>

        <h3 className={`text-lg font-semibold mb-1 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
          {module.name}
        </h3>
        
        <div className="flex items-center gap-2 mb-4">
          <span className={`text-xs px-2 py-0.5 rounded ${
            isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"
          }`}>
            {module.feed}
          </span>
          <div className={`w-2 h-2 rounded-full ${
            module.status === "online" ? "bg-green-500" : "bg-gray-400"
          }`}></div>
        </div>

        {showHubInfo && (
          <div className={`text-xs mb-3 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
            via {hub.name}
          </div>
        )}

        <div className={`text-center py-6 rounded-lg ${
          isDarkMode ? "bg-gray-700/50" : "bg-gray-50"
        }`}>
          <div className={`text-3xl font-bold mb-1 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
            {value}
          </div>
          <div className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
            Current Value
          </div>
        </div>
      </div>
    );
  }

  // Actuator Module - Fan
  if (module.type === "fan") {
    const handleToggle = (isOn: boolean) => {
      updateModule(module.id, { isOn, speed: isOn && (module.speed === 0 || module.speed === undefined) ? 1 : module.speed });
      addActivity({
        type: "user",
        action: `You turned ${isOn ? "on" : "off"} ${module.name}`,
        detail: `via ${hub.name}`,
        success: true,
      });
      showToast(`${module.name} turned ${isOn ? "on" : "off"}`, "success");
    };

    const handleSpeedChange = (speed: number) => {
      updateModule(module.id, { speed, isOn: speed > 0 });
      addActivity({
        type: "user",
        action: `You set ${module.name} speed to ${speed}`,
        detail: `via ${hub.name}`,
        success: true,
      });
    };

    return (
      <div className={`rounded-xl shadow-sm border p-5 ${
        isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      }`}>
        <div className="flex items-start justify-between mb-3">
          <Fan className="w-6 h-6 text-blue-500" />
          {showRoomInfo && (
            <span className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
              {module.room}
            </span>
          )}
        </div>

        <h3 className={`text-lg font-semibold mb-1 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
          {module.name}
        </h3>
        
        <div className="flex items-center gap-2 mb-4">
          <span className={`text-xs px-2 py-0.5 rounded ${
            isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"
          }`}>
            {module.feed}
          </span>
          <div className={`w-2 h-2 rounded-full ${
            module.status === "online" ? "bg-green-500" : "bg-gray-400"
          }`}></div>
        </div>

        {showHubInfo && (
          <div className={`text-xs mb-3 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
            via {hub.name}
          </div>
        )}

        {module.status === "online" ? (
          <>
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Speed</span>
                <span className={`text-sm font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  {module.speed === 0 ? "Off" : module.speed === 1 ? "Low" : module.speed === 2 ? "Medium" : "High"}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="3"
                value={module.speed || 0}
                onChange={(e) => handleSpeedChange(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                disabled={!module.isOn}
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleToggle(true)}
                className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                  module.isOn
                    ? "bg-blue-600 text-white"
                    : isDarkMode
                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                On
              </button>
              <button
                onClick={() => handleToggle(false)}
                className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                  !module.isOn
                    ? isDarkMode
                      ? "bg-gray-700 text-white"
                      : "bg-gray-200 text-gray-900"
                    : isDarkMode
                    ? "bg-transparent text-gray-400 border border-gray-600 hover:bg-gray-700"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                Off
              </button>
            </div>
          </>
        ) : (
          <div className={`text-sm py-4 text-center rounded-lg ${
            isDarkMode ? "bg-gray-700 text-gray-400" : "bg-gray-50 text-gray-500"
          }`}>
            Module not responding
          </div>
        )}
      </div>
    );
  }

  // Actuator Module - LED
  if (module.type === "led") {
    const handleToggle = (isOn: boolean) => {
      updateModule(module.id, { isOn });
      addActivity({
        type: "user",
        action: `You turned ${isOn ? "on" : "off"} ${module.name}`,
        detail: `via ${hub.name}`,
        success: true,
      });
      showToast(`${module.name} turned ${isOn ? "on" : "off"}`, "success");
    };

    const handleColorChange = (color: string) => {
      updateModule(module.id, { color });
      addActivity({
        type: "user",
        action: `You changed ${module.name} color`,
        detail: `via ${hub.name}`,
        success: true,
      });
    };

    return (
      <div className={`rounded-xl shadow-sm border p-5 ${
        isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      }`}>
        <div className="flex items-start justify-between mb-3">
          <Lightbulb className="w-6 h-6 text-yellow-500" />
          {showRoomInfo && (
            <span className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
              {module.room}
            </span>
          )}
        </div>

        <h3 className={`text-lg font-semibold mb-1 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
          {module.name}
        </h3>
        
        <div className="flex items-center gap-2 mb-4">
          <span className={`text-xs px-2 py-0.5 rounded ${
            isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"
          }`}>
            {module.feed}
          </span>
          <div className={`w-2 h-2 rounded-full ${
            module.status === "online" ? "bg-green-500" : "bg-gray-400"
          }`}></div>
        </div>

        {showHubInfo && (
          <div className={`text-xs mb-3 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
            via {hub.name}
          </div>
        )}

        {module.status === "online" ? (
          <>
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Color</span>
                <div
                  className="w-6 h-6 rounded border"
                  style={{ backgroundColor: module.color || "#8B5CF6" }}
                ></div>
              </div>
              <input
                type="color"
                value={module.color || "#8B5CF6"}
                onChange={(e) => handleColorChange(e.target.value)}
                className="w-full h-10 rounded cursor-pointer"
                disabled={!module.isOn}
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleToggle(true)}
                className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                  module.isOn
                    ? "bg-blue-600 text-white"
                    : isDarkMode
                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                On
              </button>
              <button
                onClick={() => handleToggle(false)}
                className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                  !module.isOn
                    ? isDarkMode
                      ? "bg-gray-700 text-white"
                      : "bg-gray-200 text-gray-900"
                    : isDarkMode
                    ? "bg-transparent text-gray-400 border border-gray-600 hover:bg-gray-700"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                Off
              </button>
            </div>
          </>
        ) : (
          <div className={`text-sm py-4 text-center rounded-lg ${
            isDarkMode ? "bg-gray-700 text-gray-400" : "bg-gray-50 text-gray-500"
          }`}>
            Module not responding
          </div>
        )}
      </div>
    );
  }

  // Default fallback
  return (
    <div className={`rounded-xl shadow-sm border p-5 ${
      isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
    }`}>
      <Icon className="w-6 h-6 text-gray-500 mb-3" />
      <h3 className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
        {module.name}
      </h3>
      <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
        {module.type}
      </p>
    </div>
  );
}
