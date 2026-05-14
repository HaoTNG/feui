import { Thermometer, Droplets, Sun, Lightbulb, Fan, AlertTriangle, Home, Wifi, WifiOff, HardDrive, Cpu, ExternalLink } from "lucide-react";
import { useNavigate, Link } from "react-router";
import { useApp } from "../contexts/AppContext";
import { TimeDisplay } from "./TimeDisplay";
import { EnvironmentStats } from "./ui/EnvironmentStats";
import { SensorOverview } from "./SensorCards";
import { useLatestSensorReadings } from "../hooks/useLatestSensorReadings";

export function Dashboard() {
  const { devices, rooms, isDarkMode, userProfile, websocketConnected, websocketStatus } = useApp();
  const latestReadings = useLatestSensorReadings();
  const navigate = useNavigate();
  
  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12 ? "Good morning" : currentHour < 18 ? "Good afternoon" : "Good evening";
  const userName = userProfile.name || "User";
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Filter data for current home (devices and modules are already filtered by AppContext based on selectedHomeId)
  const currentHomeRooms = rooms || [];
  const currentHomeDevices = devices || [];
  
  // Calculate stats from devices with nested modules
  const totalDevices = currentHomeDevices.length;
  const totalModules = currentHomeDevices.reduce((sum, device) => sum + (device.modules?.length || 0), 0);
  const onlineDevices = currentHomeDevices.filter(d => d.status === "online").length;
  const onlineModules = currentHomeDevices.reduce((sum, device) => 
    sum + (device.modules?.filter(m => m.status === "online").length || 0), 0);
  const offlineModules = totalModules - onlineModules;

  // Function to get module icon
  const getModuleIcon = (type: string) => {
    switch (type) {
      case "TEMPERATURE":
        return Thermometer;
      case "HUMIDITY":
        return Droplets;
      case "LIGHT_SENSOR":
        return Sun;
      case "FAN":
        return Fan;
      case "LIGHT":
        return Lightbulb;
      case "MOTION":
        return AlertTriangle;
      default:
        return Cpu;
    }
  };

  return (
    <div className={`max-w-7xl mx-auto space-y-6`}>
      {/* Header with Time Display */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
            {greeting}, {userName}
          </h1>
          <p className={isDarkMode ? "text-gray-400 mt-1" : "text-gray-600 mt-1"}>{today}</p>
        </div>
        <div className="flex items-center gap-4">
          {/* WebSocket Status Indicator */}
          <div className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${
            websocketConnected
              ? isDarkMode ? "bg-green-900/30 text-green-400" : "bg-green-50 text-green-700"
              : websocketStatus === 'connecting'
              ? isDarkMode ? "bg-yellow-900/30 text-yellow-400" : "bg-yellow-50 text-yellow-700"
              : isDarkMode ? "bg-red-900/30 text-red-400" : "bg-red-50 text-red-700"
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              websocketConnected
                ? "bg-green-500 animate-pulse"
                : websocketStatus === 'connecting'
                ? "bg-yellow-500 animate-pulse"
                : "bg-red-500"
            }`} />
            <span>{websocketConnected ? "Real-time Connected" : websocketStatus === 'connecting' ? "Connecting..." : "Disconnected"}</span>
          </div>
          <TimeDisplay />
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          icon={HardDrive}
          label="Total Devices"
          value={`${totalDevices} Devices`}
          iconColor="text-blue-600"
          bgColor={isDarkMode ? "bg-blue-900/30" : "bg-blue-50"}
        />
        <StatCard
          icon={Cpu}
          label="Total Modules"
          value={`${totalModules} Modules`}
          iconColor="text-purple-600"
          bgColor={isDarkMode ? "bg-purple-900/30" : "bg-purple-50"}
        />
        <StatCard
          icon={Wifi}
          label="Online Status"
          value={`${onlineModules} Online • ${offlineModules} Offline`}
          iconColor="text-green-600"
          bgColor={isDarkMode ? "bg-green-900/30" : "bg-green-50"}
        />
      </div>

      {/* Real-time Sensor Cards - Display latest WebSocket readings */}
      {(latestReadings.temperature || latestReadings.humidity || latestReadings.light || latestReadings.motion) && (
        <div className="space-y-3">
          <h2 className={`text-lg font-semibold flex items-center gap-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
            <Thermometer className="w-5 h-5" />
            Live Sensor Readings
          </h2>
          <SensorOverview
            tempValue={latestReadings.temperature?.value}
            humidityValue={latestReadings.humidity?.value}
            lightValue={latestReadings.light?.value}
            motionValue={latestReadings.motion?.value}
            isDarkMode={isDarkMode}
          />
        </div>
      )}

      {/* Homes Quick Link */}
      <div className={`rounded-xl shadow-sm border p-6 ${
        isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              Manage Homes
            </h2>
            <p className={`text-sm mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              View and manage all your smart homes
            </p>
          </div>
          <button
            onClick={() => navigate("/homes")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Homes
          </button>
        </div>
      </div>

      {/* Real-time Sensor Data Table */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Cpu className={`w-6 h-6 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`} />
          <h2 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
            Real-time Sensor Readings
          </h2>
        </div>
        <div className={`rounded-xl shadow-sm border overflow-hidden ${
          isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={isDarkMode ? "bg-gray-700" : "bg-gray-50"}>
                <tr>
                  <th className={`px-6 py-3 text-left text-sm font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-900"}`}>Device</th>
                  <th className={`px-6 py-3 text-left text-sm font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-900"}`}>Room</th>
                  <th className={`px-6 py-3 text-left text-sm font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-900"}`}>Sensor Type</th>
                  <th className={`px-6 py-3 text-left text-sm font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-900"}`}>Value</th>
                  <th className={`px-6 py-3 text-left text-sm font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-900"}`}>Unit</th>
                  <th className={`px-6 py-3 text-left text-sm font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-900"}`}>Status</th>
                  <th className={`px-6 py-3 text-left text-sm font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-900"}`}>Actions</th>
                </tr>
              </thead>
              <tbody className={isDarkMode ? "divide-gray-700" : "divide-gray-200"}>
                {currentHomeDevices.length === 0 ? (
                  <tr>
                    <td colSpan={7} className={`px-6 py-8 text-center text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                      No devices found
                    </td>
                  </tr>
                ) : (
                  currentHomeDevices.flatMap((device) =>
                    device.modules?.map((module, index) => {
                      const roomName = device.roomName || currentHomeRooms.find((r) => r.id === device.roomId)?.name || "Unknown";
                      let unit = "";
                      let displayValue = module.value;

                      switch (module.type) {
                        case "TEMPERATURE":
                          unit = "°C";
                          displayValue = module.value;
                          break;
                        case "HUMIDITY":
                          unit = "%";
                          displayValue = module.value;
                          break;
                        case "LIGHT_SENSOR":
                          unit = "lux";
                          displayValue = module.value;
                          break;
                        case "MOTION":
                          unit = "status";
                          displayValue = module.value ? "Detected" : "No motion";
                          break;
                        default:
                          unit = "";
                          break;
                      }

                      const Icon = getModuleIcon(module.type);

                      return (
                        <tr
                          key={`${device.id}-${module.id}`}
                          className={`border-b ${isDarkMode ? "border-gray-700 hover:bg-gray-700/50" : "border-gray-200 hover:bg-gray-50"}`}
                        >
                          <td className={`px-6 py-4 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-900"}`}>
                            <div className="flex items-center gap-2">
                              <Icon className="w-4 h-4 text-blue-500" />
                              {device.name}
                            </div>
                          </td>
                          <td className={`px-6 py-4 text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                            {roomName}
                          </td>
                          <td className={`px-6 py-4 text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              module.type === "TEMPERATURE"
                                ? isDarkMode ? "bg-orange-900/30 text-orange-300" : "bg-orange-100 text-orange-800"
                                : module.type === "HUMIDITY"
                                ? isDarkMode ? "bg-blue-900/30 text-blue-300" : "bg-blue-100 text-blue-800"
                                : module.type === "LIGHT_SENSOR"
                                ? isDarkMode ? "bg-yellow-900/30 text-yellow-300" : "bg-yellow-100 text-yellow-800"
                                : isDarkMode ? "bg-purple-900/30 text-purple-300" : "bg-purple-100 text-purple-800"
                            }`}>
                              {module.type}
                            </span>
                          </td>
                          <td className={`px-6 py-4 text-sm font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                            {typeof displayValue === "number" ? displayValue.toFixed(1) : displayValue}
                          </td>
                          <td className={`px-6 py-4 text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                            {unit}
                          </td>
                          <td className={`px-6 py-4 text-sm`}>
                            {module.status === "online" ? (
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-green-600">Online</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-gray-500" />
                                <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>Offline</span>
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <Link
                              to={`/modules/${module.id}`}
                              className={`inline-flex items-center gap-1 text-sm font-medium transition-colors ${
                                isDarkMode
                                  ? "text-blue-400 hover:text-blue-300"
                                  : "text-blue-600 hover:text-blue-700"
                              }`}
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              Details
                            </Link>
                          </td>
                        </tr>
                      );
                    }) || []
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Active Rooms with Devices */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Home className={`w-6 h-6 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`} />
          <h2 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
            Active Rooms
          </h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {currentHomeRooms.map((room) => {
            const roomDevices = currentHomeDevices.filter((d) => d.roomId === room.id);
            const roomModules = roomDevices.flatMap(d => d.modules || []);
            const offlineModulesCount = roomModules.filter(m => m.status === "offline").length;
            
            return (
              <RoomCardWithDevices
                key={room.id}
                name={room.name}
                devices={roomDevices}
                modules={roomModules}
                getModuleIcon={getModuleIcon}
                offlineModulesCount={offlineModulesCount}
                onClick={() => navigate(`/rooms/${room.id}`, { state: { room } })}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  iconColor,
  bgColor,
}: {
  icon: any;
  label: string;
  value: string;
  iconColor: string;
  bgColor: string;
}) {
  const { isDarkMode } = useApp();
  
  return (
    <div className={`rounded-xl shadow-sm border p-5 ${
      isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
    }`}>
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 rounded-lg ${bgColor} flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
        <div>
          <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>{label}</p>
          <p className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>{value}</p>
        </div>
      </div>
    </div>
  );
}

function RoomCardWithDevices({
  name,
  devices,
  modules,
  getModuleIcon,
  offlineModulesCount,
  onClick,
}: {
  name: string;
  devices: any[];
  modules: any[];
  getModuleIcon: (type: string) => any;
  offlineModulesCount: number;
  onClick: () => void;
}) {
  const { isDarkMode } = useApp();
  
  // Get environment data from modules
  const tempModule = modules.find(m => m.type === "temperature");
  const humidityModule = modules.find(m => m.type === "humidity");
  const luxModule = modules.find(m => m.type === "light-sensor");
  
  return (
    <button
      onClick={onClick}
      className={`rounded-xl shadow-sm border p-5 text-left transition-all hover:shadow-md w-full ${
        isDarkMode 
          ? "bg-gray-800 border-gray-700 hover:border-blue-600" 
          : "bg-white border-gray-200 hover:border-blue-400"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            isDarkMode ? "bg-blue-900/30" : "bg-blue-50"
          }`}>
            <Home className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              {name}
            </h3>
            <p className={`text-xs ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>
              {devices.length} devices • {modules.length} modules
            </p>
          </div>
        </div>
      </div>

      {/* Environmental stats */}
      <div className="flex items-center gap-4 text-xs mb-3 pb-3 border-b" style={{borderColor: isDarkMode ? "#374151" : "#e5e7eb"}}>
        {tempModule && (
          <div className="flex items-center gap-1">
            <Thermometer className="w-3 h-3 text-orange-500" />
            <span className={isDarkMode ? "text-gray-300" : "text-gray-700"}>
              {tempModule.temperature}°C
            </span>
          </div>
        )}
        {humidityModule && (
          <div className="flex items-center gap-1">
            <Droplets className="w-3 h-3 text-blue-500" />
            <span className={isDarkMode ? "text-gray-300" : "text-gray-700"}>
              {humidityModule.humidity}%
            </span>
          </div>
        )}
        {luxModule && (
          <div className="flex items-center gap-1">
            <Sun className="w-3 h-3 text-yellow-500" />
            <span className={isDarkMode ? "text-gray-300" : "text-gray-700"}>
              {luxModule.lux} lux
            </span>
          </div>
        )}
      </div>

      {/* Devices in this room */}
      <div className="space-y-2 mb-3">
        {devices.map((device) => (
          <div
            key={device.id}
            className={`flex items-center justify-between rounded-lg p-2 text-xs ${
              isDarkMode ? "bg-gray-700/50" : "bg-gray-50"
            }`}
          >
            <div className="flex items-center gap-2">
              <HardDrive className="w-3 h-3 text-blue-500" />
              <span className={isDarkMode ? "text-gray-200" : "text-gray-900"}>
                {device.name}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {device.status === "online" ? (
                <>
                  <Wifi className="w-3 h-3 text-green-500" />
                  <span className="text-green-600">Online</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3 h-3 text-gray-500" />
                  <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>Offline</span>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Warning for offline modules */}
      {offlineModulesCount > 0 && (
        <div className={`pt-2 border-t flex items-center gap-2 text-xs ${
          isDarkMode ? "border-gray-700 text-yellow-400" : "border-gray-200 text-yellow-600"
        }`}>
          <AlertTriangle className="w-4 h-4" />
          <span>{offlineModulesCount} modules offline</span>
        </div>
      )}
    </button>
  );
}
