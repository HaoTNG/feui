import { Lightbulb, Fan, Power, Thermometer, Clock, UserCircle } from "lucide-react";
import { useApp } from "../contexts/AppContext";
import { useToast } from "../contexts/ToastContext";
import { useState } from "react";
import { RoleSwitcher } from "./ui/RoleSwitcher";

export function GuestDashboard() {
  const { devices, rooms, guestAccess, updateDevice, addActivity, isDarkMode } = useApp();
  const { showToast } = useToast();

  // Filter devices based on guest allowed rooms
  const allowedDevices = devices.filter((device) =>
    guestAccess.allowedRooms.some((roomName) => 
      rooms.find(r => r.id === roomName)?.name === device.room
    )
  );

  // Group devices by room
  const devicesByRoom = allowedDevices.reduce((acc, device) => {
    if (!acc[device.room]) {
      acc[device.room] = [];
    }
    acc[device.room].push(device);
    return acc;
  }, {} as Record<string, typeof devices>);

  const handleToggleDevice = (deviceId: string, currentState: boolean) => {
    updateDevice(deviceId, { isOn: !currentState });
    const device = devices.find((d) => d.id === deviceId);
    if (device) {
      addActivity({
        type: "user",
        deviceId: device.id,
        deviceName: device.name,
        action: `You turned ${!currentState ? "on" : "off"} ${device.name}`,
        detail: "via Guest Dashboard",
        success: true,
      });
      showToast(
        `${device.name} turned ${!currentState ? "on" : "off"}`,
        "success"
      );
    }
  };

  const handleBrightnessChange = (deviceId: string, brightness: number) => {
    updateDevice(deviceId, { brightness, isOn: brightness > 0 });
    const device = devices.find((d) => d.id === deviceId);
    if (device) {
      addActivity({
        type: "user",
        deviceId: device.id,
        deviceName: device.name,
        action: `You set ${device.name} brightness to ${brightness}%`,
        detail: "via Guest Dashboard",
        success: true,
      });
    }
  };

  const handleSpeedChange = (deviceId: string, speed: number) => {
    updateDevice(deviceId, { speed, isOn: speed > 0 });
    const device = devices.find((d) => d.id === deviceId);
    if (device) {
      addActivity({
        type: "user",
        deviceId: device.id,
        deviceName: device.name,
        action: `You set ${device.name} speed to ${speed}`,
        detail: "via Guest Dashboard",
        success: true,
      });
    }
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case "light":
      case "rgb-light":
        return Lightbulb;
      case "fan":
        return Fan;
      case "temperature":
        return Thermometer;
      default:
        return Power;
    }
  };

  const formatExpiryTime = () => {
    if (!guestAccess.expiresAt) return "No expiration";
    const now = new Date();
    const expiry = new Date(guestAccess.expiresAt);
    const diffMs = expiry.getTime() - now.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? "s" : ""} remaining`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} remaining`;
    } else {
      return "Expires soon";
    }
  };

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
            You have limited access to control devices in allowed areas
          </p>
          
          {/* Access expiry info */}
          {guestAccess.expiresAt && (
            <div className={`mt-4 flex items-center gap-2 px-3 py-2 rounded-lg ${
              isDarkMode ? "bg-blue-900/20 text-blue-400" : "bg-blue-50 text-blue-600"
            }`}>
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">{formatExpiryTime()}</span>
            </div>
          )}
        </div>

        {/* Device Controls by Room */}
        {Object.keys(devicesByRoom).length === 0 ? (
          <div className={`p-8 text-center rounded-xl shadow-sm border ${
            isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          }`}>
            <Power className={`w-12 h-12 mx-auto mb-3 ${
              isDarkMode ? "text-gray-600" : "text-gray-400"
            }`} />
            <h3 className={`text-lg font-semibold mb-1 ${
              isDarkMode ? "text-gray-300" : "text-gray-700"
            }`}>
              No devices available
            </h3>
            <p className={`text-sm ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>
              You don't have access to any rooms or devices yet
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(devicesByRoom).map(([roomName, roomDevices]) => (
              <div key={roomName}>
                <h2 className={`text-lg font-semibold mb-3 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}>
                  {roomName}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {roomDevices.map((device) => {
                    const Icon = getDeviceIcon(device.type);
                    const isControllable = device.type === "light" || device.type === "rgb-light" || device.type === "fan";
                    
                    return (
                      <div
                        key={device.id}
                        className={`p-5 rounded-xl shadow-sm border transition-all ${
                          isDarkMode
                            ? "bg-gray-800 border-gray-700"
                            : "bg-white border-gray-200"
                        }`}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className={`p-2.5 rounded-lg ${
                              device.isOn
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
                                {device.name}
                              </h3>
                              <div className="flex items-center gap-2 mt-1">
                                <span className={`w-2 h-2 rounded-full ${
                                  device.status === "online" ? "bg-green-500" : "bg-red-500"
                                }`} />
                                <span className={`text-xs ${
                                  isDarkMode ? "text-gray-400" : "text-gray-500"
                                }`}>
                                  {device.status}
                                </span>
                              </div>
                            </div>
                          </div>

                          {isControllable && (
                            <button
                              onClick={() => handleToggleDevice(device.id, device.isOn || false)}
                              disabled={device.status === "offline"}
                              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                                device.isOn
                                  ? isDarkMode
                                    ? "bg-blue-600 text-white hover:bg-blue-700"
                                    : "bg-blue-600 text-white hover:bg-blue-700"
                                  : isDarkMode
                                  ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                              } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                              {device.isOn ? "ON" : "OFF"}
                            </button>
                          )}
                        </div>

                        {/* Brightness Control */}
                        {(device.type === "light" || device.type === "rgb-light") && device.brightness !== undefined && (
                          <div className="mt-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className={`text-sm font-medium ${
                                isDarkMode ? "text-gray-300" : "text-gray-700"
                              }`}>
                                Brightness
                              </span>
                              <span className={`text-sm font-semibold ${
                                isDarkMode ? "text-blue-400" : "text-blue-600"
                              }`}>
                                {device.brightness}%
                              </span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={device.brightness}
                              onChange={(e) => handleBrightnessChange(device.id, parseInt(e.target.value))}
                              disabled={device.status === "offline"}
                              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                            />
                          </div>
                        )}

                        {/* Fan Speed Control */}
                        {device.type === "fan" && device.speed !== undefined && (
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
                                {device.speed}
                              </span>
                            </div>
                            <div className="flex gap-2">
                              {[0, 1, 2, 3].map((speed) => (
                                <button
                                  key={speed}
                                  onClick={() => handleSpeedChange(device.id, speed)}
                                  disabled={device.status === "offline"}
                                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    device.speed === speed
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
                        {device.type === "temperature" && device.temperature !== undefined && (
                          <div className="mt-4">
                            <span className={`text-2xl font-bold ${
                              isDarkMode ? "text-blue-400" : "text-blue-600"
                            }`}>
                              {device.temperature}°C
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