import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  ArrowLeft,
  Pencil,
  Plus,
  Lightbulb,
  Fan,
  Palette,
  Power,
  Thermometer,
  Droplets,
  Sun,
} from "lucide-react";
import { useApp } from "../contexts/AppContext";
import { useToast } from "../contexts/ToastContext";

export function RoomDetail() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { devices, rooms, isDarkMode, updateDevice } = useApp();
  const { showToast } = useToast();
  const [showEditModal, setShowEditModal] = useState(false);

  const room = rooms.find((r) => r.id === roomId);
  const roomDevices = devices.filter((d) => d.room === room?.name);

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

  const onlineDevices = roomDevices.filter((d) => d.status === "online").length;
  const offlineDevices = roomDevices.filter((d) => d.status === "offline").length;

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case "light":
        return Lightbulb;
      case "fan":
        return Fan;
      case "rgb-light":
        return Palette;
      case "temperature":
        return Thermometer;
      case "humidity":
        return Droplets;
      case "light-sensor":
        return Sun;
      default:
        return Power;
    }
  };

  const getDeviceTypeLabel = (type: string) => {
    switch (type) {
      case "light":
        return "Light";
      case "fan":
        return "Fan";
      case "rgb-light":
        return "RGB Light";
      case "temperature":
        return "Temperature Sensor";
      case "humidity":
        return "Humidity Sensor";
      case "light-sensor":
        return "Light Sensor";
      default:
        return "Device";
    }
  };

  const handleQuickToggle = (deviceId: string, currentState: boolean | undefined) => {
    const device = devices.find((d) => d.id === deviceId);
    if (!device || device.status === "offline") {
      showToast("Device is offline", "error");
      return;
    }

    updateDevice(deviceId, { isOn: !currentState });
    showToast(`${device.name} turned ${!currentState ? "on" : "off"}`, "success");
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
            Room devices and details
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
              <Power className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                {roomDevices.length}
              </p>
              <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                Total Devices
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
            <div className="w-12 h-12 rounded-lg bg-green-50 dark:bg-green-900/30 flex items-center justify-center">
              <Power className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                {onlineDevices}
              </p>
              <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Online</p>
            </div>
          </div>
        </div>

        <div
          className={`rounded-xl border p-5 ${
            isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-red-50 dark:bg-red-900/30 flex items-center justify-center">
              <Power className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                {offlineDevices}
              </p>
              <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Offline</p>
            </div>
          </div>
        </div>
      </div>

      {/* Devices in This Room */}
      <div
        className={`rounded-xl border p-6 ${
          isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
            Devices in This Room
          </h2>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
            <Plus className="w-4 h-4" />
            Add Device
          </button>
        </div>

        {roomDevices.length === 0 ? (
          <div className="py-12 text-center">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center">
              <Power className={`w-12 h-12 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`} />
            </div>
            <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              This room has no devices yet
            </h3>
            <p className={`mb-6 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              Add devices to this room to get started
            </p>
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Add Device
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {roomDevices.map((device) => {
              const Icon = getDeviceIcon(device.type);
              const canToggle = device.type === "light" || device.type === "fan" || device.type === "rgb-light";

              return (
                <div
                  key={device.id}
                  className={`p-4 rounded-lg border flex items-center gap-4 transition-all ${
                    device.isOn && canToggle
                      ? device.type === "light" || device.type === "rgb-light"
                        ? isDarkMode
                          ? "bg-amber-900/20 border-amber-700/50 shadow-lg shadow-amber-500/10"
                          : "bg-amber-50 border-amber-200 shadow-lg shadow-amber-500/20"
                        : device.type === "fan"
                        ? isDarkMode
                          ? "bg-blue-900/20 border-blue-700/50 shadow-lg shadow-blue-500/10"
                          : "bg-blue-50 border-blue-200 shadow-lg shadow-blue-500/20"
                        : isDarkMode
                        ? "bg-gray-700 border-gray-600"
                        : "bg-gray-50 border-gray-200"
                      : isDarkMode
                      ? "bg-gray-700 border-gray-600 hover:bg-gray-650"
                      : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      device.status === "offline"
                        ? isDarkMode
                          ? "bg-gray-600"
                          : "bg-gray-200"
                        : isDarkMode
                        ? "bg-blue-900/30"
                        : "bg-blue-50"
                    }`}
                  >
                    <Icon
                      className={`w-6 h-6 ${
                        device.status === "offline"
                          ? "text-gray-400"
                          : device.type === "light" || device.type === "rgb-light"
                          ? "text-yellow-500"
                          : device.type === "fan"
                          ? "text-blue-500"
                          : "text-green-500"
                      }`}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3
                      className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}
                    >
                      {device.name}
                    </h3>
                    <div className="flex items-center gap-4 mt-1">
                      <span className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                        {getDeviceTypeLabel(device.type)}
                      </span>
                      <div className="flex items-center gap-1">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            device.status === "online" ? "bg-green-500" : "bg-gray-400"
                          }`}
                        ></div>
                        <span
                          className={`text-sm ${
                            device.status === "online"
                              ? "text-green-600"
                              : isDarkMode
                              ? "text-gray-400"
                              : "text-gray-500"
                          }`}
                        >
                          {device.status === "online"
                            ? canToggle
                              ? device.isOn
                                ? "On"
                                : "Off"
                              : device.type === "temperature"
                              ? `${device.temperature}°C`
                              : device.type === "humidity"
                              ? `${device.humidity}%`
                              : device.type === "light-sensor"
                              ? `${device.lux} lux`
                              : "Online"
                            : "Offline"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {canToggle && device.status === "online" && (
                    <button
                      onClick={() => handleQuickToggle(device.id, device.isOn)}
                      className={`relative inline-flex h-7 w-14 items-center rounded-full transition-all duration-200 ${
                        device.isOn 
                          ? "bg-blue-600 shadow-lg shadow-blue-500/50" 
                          : isDarkMode
                          ? "bg-gray-600"
                          : "bg-gray-300"
                      }`}
                      title={device.isOn ? "Turn off" : "Turn on"}
                    >
                      <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-200 ${
                          device.isOn ? "translate-x-8" : "translate-x-1"
                        }`}
                      />
                    </button>
                  )}

                  {device.status === "offline" && (
                    <div
                      className={`px-4 py-2 rounded-lg text-sm ${
                        isDarkMode ? "bg-gray-600 text-gray-400" : "bg-gray-200 text-gray-500"
                      }`}
                      title="Device offline"
                    >
                      Offline
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
