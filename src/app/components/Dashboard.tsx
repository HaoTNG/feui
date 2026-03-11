import { Thermometer, Droplets, Sun, Lightbulb, Fan, User, AlertTriangle, Check, Home, Wifi, WifiOff, HardDrive, Cpu } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useApp } from "../contexts/AppContext";
import { TimeDisplay } from "./TimeDisplay";
import { EnvironmentStats } from "./ui/EnvironmentStats";

export function Dashboard() {
  const { devices, activities, rooms, isDarkMode, selectedHomeId, hubs, modules, getModulesByRoom, getModulesByHub } = useApp();
  const navigate = useNavigate();
  
  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12 ? "Good morning" : currentHour < 18 ? "Good afternoon" : "Good evening";
  const userName = "John";
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Filter data by selected home
  const currentHomeRooms = rooms.filter(r => r.homeId === selectedHomeId);
  const currentHomeDevices = devices.filter(d => d.homeId === selectedHomeId);
  const currentHomeActivities = activities.filter(a => !a.homeId || a.homeId === selectedHomeId);
  const currentHomeHubs = hubs.filter(h => h.homeId === selectedHomeId);
  const currentHomeModules = modules.filter(m => m.homeId === selectedHomeId);

  // Calculate stats
  const totalHubs = currentHomeHubs.length;
  const totalModules = currentHomeModules.length;
  const onlineHubs = currentHomeHubs.filter(h => h.status === "online").length;
  const onlineModules = currentHomeModules.filter(m => m.status === "online").length;
  const offlineModules = totalModules - onlineModules;

  // Get recent activities (last 5)
  const recentActivities = [...currentHomeActivities]
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, 5);

  // Function to get module icon
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
        <TimeDisplay />
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          icon={HardDrive}
          label="Total Hubs"
          value={`${totalHubs} Hubs`}
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

      {/* Main Content - Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Active Rooms with Hub Integration */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <Home className={`w-6 h-6 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`} />
            <h2 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              Active Rooms
            </h2>
          </div>
          <div className="space-y-4">
            {currentHomeRooms.map((room) => {
              const roomHubs = currentHomeHubs.filter((h) => h.room === room.name);
              const roomModules = currentHomeModules.filter((m) => m.room === room.name);
              const offlineModulesCount = roomModules.filter(m => m.status === "offline").length;
              
              return (
                <RoomCardWithHubs
                  key={room.id}
                  name={room.name}
                  hubs={roomHubs}
                  modules={roomModules}
                  getModulesByHub={getModulesByHub}
                  getModuleIcon={getModuleIcon}
                  offlineModulesCount={offlineModulesCount}
                  onClick={() => navigate("/rooms")}
                />
              );
            })}
          </div>
        </div>

        {/* Right Column: Recent Activity */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              Recent Activity
            </h2>
            <Link 
              to="/history" 
              className={`text-sm font-medium ${isDarkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-700"}`}
            >
              View All
            </Link>
          </div>
          
          {/* Filter Chips */}
          <div className="flex gap-2 flex-wrap">
            <FilterChip label="All Events" active={true} />
            <FilterChip label="Hub Events" active={false} />
            <FilterChip label="Module Events" active={false} />
          </div>

          <div className={`rounded-xl shadow-sm border divide-y ${
            isDarkMode 
              ? "bg-gray-800 border-gray-700 divide-gray-700" 
              : "bg-white border-gray-200 divide-gray-200"
          }`}>
            {recentActivities.length === 0 ? (
              <div className="px-5 py-8 text-center">
                <p className={isDarkMode ? "text-gray-400" : "text-gray-500"}>No recent activity</p>
              </div>
            ) : (
              recentActivities.map((activity) => {
                // Determine if this is a hub or module event based on activity type
                const isHubEvent = activity.action.toLowerCase().includes("hub");
                const isModuleEvent = activity.action.toLowerCase().includes("temperature") || 
                                     activity.action.toLowerCase().includes("fan") ||
                                     activity.action.toLowerCase().includes("led");
                
                let Icon = User;
                let eventType: "hub" | "module" | "automation" | "user" = "user";
                
                if (isHubEvent) {
                  Icon = HardDrive;
                  eventType = "hub";
                } else if (isModuleEvent) {
                  Icon = Cpu;
                  eventType = "module";
                } else if (activity.type === "automation") {
                  Icon = Lightbulb;
                  eventType = "automation";
                }
                
                return (
                  <ActivityItem
                    key={activity.id}
                    icon={Icon}
                    action={activity.action}
                    time={activity.time}
                    type={eventType}
                    success={activity.success}
                  />
                );
              })
            )}
          </div>
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

function FilterChip({ label, active }: { label: string; active: boolean }) {
  const { isDarkMode } = useApp();
  
  return (
    <button
      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
        active
          ? isDarkMode
            ? "bg-blue-900/50 text-blue-300 border border-blue-700"
            : "bg-blue-100 text-blue-700 border border-blue-300"
          : isDarkMode
          ? "bg-gray-700 text-gray-400 border border-gray-600 hover:bg-gray-600"
          : "bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200"
      }`}
    >
      {label}
    </button>
  );
}

function RoomCardWithHubs({
  name,
  hubs,
  modules,
  getModulesByHub,
  getModuleIcon,
  offlineModulesCount,
  onClick,
}: {
  name: string;
  hubs: any[];
  modules: any[];
  getModulesByHub: (hubId: string) => any[];
  getModuleIcon: (type: string) => any;
  offlineModulesCount: number;
  onClick: () => void;
}) {
  const { isDarkMode } = useApp();
  
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
              {hubs.length} hubs • {modules.length} modules
            </p>
          </div>
        </div>
      </div>

      {/* Hubs in this room */}
      <div className="space-y-3">
        {hubs.map((hub) => {
          const hubModules = getModulesByHub(hub.id);
          const tempModule = hubModules.find(m => m.type === "temperature");
          const humidityModule = hubModules.find(m => m.type === "humidity");
          const luxModule = hubModules.find(m => m.type === "light-sensor");
          const fanModule = hubModules.find(m => m.type === "fan");
          const ledModule = hubModules.find(m => m.type === "led");
          
          return (
            <div
              key={hub.id}
              className={`rounded-lg border p-3 ${
                isDarkMode ? "bg-gray-700/50 border-gray-600" : "bg-gray-50 border-gray-200"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <HardDrive className="w-4 h-4 text-blue-500" />
                <span className={`text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-900"}`}>
                  {hub.name}
                </span>
              </div>
              
              {/* Environmental stats */}
              <div className="flex items-center gap-4 text-xs mb-2">
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

              {/* Module status */}
              <div className="flex items-center gap-4 text-xs mb-2">
                {fanModule && (
                  <div className="flex items-center gap-1">
                    <Fan className="w-3 h-3 text-gray-500" />
                    <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
                      Fan: {fanModule.isOn ? "ON" : "OFF"}
                    </span>
                  </div>
                )}
                {ledModule && (
                  <div className="flex items-center gap-1">
                    <Lightbulb className="w-3 h-3 text-gray-500" />
                    <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
                      LED: {ledModule.isOn ? "ON" : "OFF"}
                    </span>
                  </div>
                )}
              </div>

              {/* Hub status */}
              <div className="flex items-center gap-2 text-xs">
                {hub.status === "online" ? (
                  <>
                    <Wifi className="w-3 h-3 text-green-500" />
                    <span className="text-green-600">
                      {hub.wifiSignal && hub.wifiSignal > 70 ? "Strong" : hub.wifiSignal && hub.wifiSignal > 40 ? "Medium" : "Weak"} • Online
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
          );
        })}
      </div>

      {/* Warning for offline modules */}
      {offlineModulesCount > 0 && (
        <div className={`mt-3 pt-3 border-t flex items-center gap-2 text-xs ${
          isDarkMode ? "border-gray-700 text-yellow-400" : "border-gray-200 text-yellow-600"
        }`}>
          <AlertTriangle className="w-4 h-4" />
          <span>{offlineModulesCount} modules offline</span>
        </div>
      )}
    </button>
  );
}

function ActivityItem({
  icon: Icon,
  action,
  time,
  type,
  success,
}: {
  icon: any;
  action: string;
  time: string;
  type: "hub" | "module" | "automation" | "user";
  success: boolean;
}) {
  const { isDarkMode } = useApp();
  
  const iconColors = {
    hub: isDarkMode ? "bg-blue-900/30 text-blue-400" : "bg-blue-50 text-blue-600",
    module: isDarkMode ? "bg-purple-900/30 text-purple-400" : "bg-purple-50 text-purple-600",
    automation: isDarkMode ? "bg-green-900/30 text-green-400" : "bg-green-50 text-green-600",
    user: isDarkMode ? "bg-gray-700 text-gray-400" : "bg-gray-100 text-gray-600",
  };

  const typeLabels = {
    hub: "Hub",
    module: "Module",
    automation: "Automation",
    user: "User",
  };

  return (
    <div className="flex items-center gap-4 px-5 py-4">
      <div className={`w-10 h-10 rounded-lg ${iconColors[type]} flex items-center justify-center flex-shrink-0`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-xs font-medium px-2 py-0.5 rounded ${
            type === "hub" ? "bg-blue-100 text-blue-700" :
            type === "module" ? "bg-purple-100 text-purple-700" :
            type === "automation" ? "bg-green-100 text-green-700" :
            "bg-gray-100 text-gray-700"
          }`}>
            {typeLabels[type]}
          </span>
        </div>
        <p className={`font-medium text-sm ${isDarkMode ? "text-gray-200" : "text-gray-900"}`}>
          {action}
        </p>
        <p className={`text-xs ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>
          {time}
        </p>
      </div>
      {success && (
        <div className="flex-shrink-0">
          <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
          </div>
        </div>
      )}
    </div>
  );
}