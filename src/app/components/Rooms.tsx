import { Home, Lightbulb, Fan, Thermometer, Droplets, ChevronRight, Sun } from "lucide-react";
import { Link } from "react-router";
import { useApp } from "../contexts/AppContext";

export function Rooms() {
  const { devices, isDarkMode } = useApp();

  // Group devices by room
  const devicesByRoom = devices.reduce((acc, device) => {
    if (!acc[device.room]) {
      acc[device.room] = [];
    }
    acc[device.room].push(device);
    return acc;
  }, {} as Record<string, typeof devices>);

  // Convert to array for rendering
  const rooms = Object.entries(devicesByRoom).map(([roomName, roomDevices]) => ({
    name: roomName,
    devices: roomDevices,
  }));

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
          Rooms
        </h1>
        <p className={isDarkMode ? "text-gray-400 mt-1" : "text-gray-600 mt-1"}>
          View all rooms and their devices
        </p>
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {rooms.map((room) => (
          <RoomCard key={room.name} room={room} />
        ))}
      </div>
    </div>
  );
}

function RoomCard({
  room,
}: {
  room: {
    name: string;
    devices: Array<{
      id: string;
      name: string;
      type: string;
      status: string;
      isOn?: boolean;
      brightness?: number;
      speed?: number;
      temperature?: number;
      humidity?: number;
      lux?: number;
      color?: string;
    }>;
  };
}) {
  const { isDarkMode } = useApp();
  
  const activeDevices = room.devices.filter(
    (d) => d.isOn || d.status === "online"
  ).length;

  return (
    <div className={`rounded-xl shadow-sm border p-6 transition-shadow hover:shadow-md ${
      isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
    }`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
            isDarkMode ? "bg-blue-900/30" : "bg-blue-50"
          }`}>
            <Home className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              {room.name}
            </h3>
            <p className={`text-sm ${isDarkMode ? "text-gray-500" : "text-gray-600"}`}>
              {activeDevices} of {room.devices.length} devices active
            </p>
          </div>
        </div>
        <Link
          to="/devices"
          className={`p-2 rounded-lg transition-colors ${
            isDarkMode 
              ? "text-gray-500 hover:text-blue-400 hover:bg-blue-900/30" 
              : "text-gray-400 hover:text-blue-600 hover:bg-blue-50"
          }`}
        >
          <ChevronRight className="w-5 h-5" />
        </Link>
      </div>

      <div className="space-y-3">
        {room.devices.map((device) => (
          <DeviceItem key={device.id} device={device} />
        ))}
      </div>
    </div>
  );
}

function DeviceItem({
  device,
}: {
  device: {
    name: string;
    type: string;
    status: string;
    isOn?: boolean;
    brightness?: number;
    speed?: number;
    temperature?: number;
    humidity?: number;
    lux?: number;
    color?: string;
  };
}) {
  const { isDarkMode } = useApp();
  
  const getIcon = () => {
    switch (device.type) {
      case "light":
      case "rgb-light":
        return Lightbulb;
      case "fan":
        return Fan;
      case "temperature":
        return Thermometer;
      case "humidity":
        return Droplets;
      case "light-sensor":
        return Sun;
      default:
        return Lightbulb;
    }
  };

  const Icon = getIcon();

  // Determine status text and if device is "active"
  let statusText = "";
  let detailText = "";
  let isActive = false;

  if (device.type === "temperature" && device.temperature !== undefined) {
    statusText = `${device.temperature}°C`;
    isActive = true;
  } else if (device.type === "humidity" && device.humidity !== undefined) {
    statusText = `${device.humidity}%`;
    isActive = true;
  } else if (device.type === "light-sensor" && device.lux !== undefined) {
    statusText = `${device.lux} lux`;
    isActive = true;
  } else if (device.isOn) {
    statusText = "On";
    isActive = true;
    
    if (device.brightness !== undefined && device.type !== "fan") {
      detailText = `${device.brightness}% brightness`;
    }
    if (device.speed !== undefined) {
      detailText = `Speed ${device.speed}`;
    }
    if (device.color && device.type === "rgb-light") {
      detailText = detailText ? `${detailText}, ${device.color}` : device.color;
    }
  } else {
    statusText = device.status === "offline" ? "Offline" : "Off";
    isActive = false;
    
    if (device.status === "offline") {
      detailText = "Device not responding";
    }
  }

  return (
    <div className={`flex items-center gap-3 p-3 rounded-lg ${
      isDarkMode ? "bg-gray-700/50" : "bg-gray-50"
    }`}>
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
        isActive
          ? "bg-green-600 text-white"
          : device.status === "offline"
          ? isDarkMode ? "bg-red-900/30 text-red-400" : "bg-red-50 text-red-600"
          : isDarkMode ? "bg-gray-600 text-gray-400" : "bg-gray-200 text-gray-500"
      }`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className={`font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>
          {device.name}
        </div>
        {detailText && (
          <div className={`text-sm ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>
            {detailText}
          </div>
        )}
      </div>
      <div className="flex-shrink-0">
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
            isActive
              ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
              : device.status === "offline"
              ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
              : "bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-400"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isActive
                ? "bg-green-600 dark:bg-green-400"
                : device.status === "offline"
                ? "bg-red-600 dark:bg-red-400"
                : "bg-gray-400"
            }`}
          />
          {statusText}
        </span>
      </div>
    </div>
  );
}
