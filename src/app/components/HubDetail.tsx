import { useParams, useNavigate } from "react-router";
import { useApp } from "../contexts/AppContext";
import {
  ArrowLeft,
  Server,
  Wifi,
  WifiOff,
  Edit2,
  Trash2,
  Settings,
  Copy,
  MoreVertical,
  Thermometer,
  Droplets,
  Sun,
  Fan,
  Lightbulb,
  Eye,
  Monitor,
} from "lucide-react";
import { useState } from "react";

export function HubDetail() {
  const { hubId } = useParams<{ hubId: string }>();
  const navigate = useNavigate();
  const { getHubById, getModulesByHub, updateHub, deleteHub, updateModule, modules } = useApp();
  const [showConfigModal, setShowConfigModal] = useState(false);

  const hub = hubId ? getHubById(hubId) : undefined;
  const hubModules = hubId ? getModulesByHub(hubId) : [];

  if (!hub) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <Server className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Hub not found</h3>
          <button
            onClick={() => navigate("/hub-management")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Hub Management
          </button>
        </div>
      </div>
    );
  }

  const handleDeleteHub = () => {
    if (
      confirm(
        `Delete ${hub.name}? All modules will also be removed. This cannot be undone.`
      )
    ) {
      deleteHub(hub.id);
      navigate("/hub-management");
    }
  };

  const getModuleIcon = (type: string) => {
    switch (type) {
      case "temperature":
        return <Thermometer className="w-5 h-5" />;
      case "humidity":
        return <Droplets className="w-5 h-5" />;
      case "light-sensor":
        return <Sun className="w-5 h-5" />;
      case "fan":
        return <Fan className="w-5 h-5" />;
      case "led":
        return <Lightbulb className="w-5 h-5" />;
      case "pir-motion":
        return <Eye className="w-5 h-5" />;
      case "lcd-display":
        return <Monitor className="w-5 h-5" />;
      default:
        return <Server className="w-5 h-5" />;
    }
  };

  const getModuleValue = (module: any) => {
    if (module.temperature !== undefined) return `${module.temperature}°C`;
    if (module.humidity !== undefined) return `${module.humidity}%`;
    if (module.lux !== undefined) return `${module.lux} lux`;
    if (module.motion !== undefined) return module.motion ? "Motion detected" : "No motion";
    if (module.isOn !== undefined) {
      if (module.type === "fan") return module.isOn ? `ON (Speed ${module.speed})` : "OFF";
      if (module.type === "led")
        return module.isOn ? `ON (${module.brightness}%)` : "OFF";
      return module.isOn ? "ON" : "OFF";
    }
    return "—";
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate("/hub-management")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Hub Management
        </button>

        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
              <Server className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-gray-900 mb-1">{hub.name}</h1>
              <div className="flex items-center gap-3">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm ${
                    hub.status === "online"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full ${
                      hub.status === "online" ? "bg-green-500" : "bg-gray-400"
                    }`}
                  />
                  {hub.status === "online" ? "Online" : "Offline"}
                </span>
              </div>
            </div>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <Edit2 className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Hub Information Card */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Hub Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500 mb-1">Hub ID</p>
            <div className="flex items-center gap-2">
              <p className="text-gray-900 font-mono">{hub.id}</p>
              <button
                onClick={() => copyToClipboard(hub.id)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <Copy className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Firmware Version</p>
            <p className="text-gray-900">{hub.firmwareVersion}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">IP Address</p>
            <div className="flex items-center gap-2">
              <p className="text-gray-900 font-mono">{hub.ipAddress}</p>
              {hub.ipAddress && (
                <button
                  onClick={() => copyToClipboard(hub.ipAddress!)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <Copy className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">MAC Address</p>
            <div className="flex items-center gap-2">
              <p className="text-gray-900 font-mono">{hub.macAddress}</p>
              {hub.macAddress && (
                <button
                  onClick={() => copyToClipboard(hub.macAddress!)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <Copy className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">WiFi Signal</p>
            <div className="flex items-center gap-2">
              {hub.status === "online" ? (
                <>
                  <Wifi className="w-4 h-4 text-green-600" />
                  <p className="text-gray-900">
                    {hub.wifiSignal}% (
                    {hub.wifiSignal && hub.wifiSignal >= 80
                      ? "Strong"
                      : hub.wifiSignal && hub.wifiSignal >= 50
                      ? "Good"
                      : "Weak"}
                    )
                  </p>
                </>
              ) : (
                <>
                  <WifiOff className="w-4 h-4 text-gray-400" />
                  <p className="text-gray-500">Disconnected</p>
                </>
              )}
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Connected Since</p>
            <p className="text-gray-900">
              {hub.connectedSince
                ? new Date(hub.connectedSince).toLocaleString()
                : "—"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Room Assignment</p>
            <p className="text-gray-900">{hub.room}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Added Date</p>
            <p className="text-gray-900">
              {new Date(hub.addedDate).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Modules Section */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Connected Modules</h2>
          <button
            onClick={() => setShowConfigModal(true)}
            className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Settings className="w-4 h-4" />
            Configure Modules
          </button>
        </div>

        {hubModules.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No modules configured for this hub</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {hubModules.map((module) => (
              <div
                key={module.id}
                className="border border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                      {getModuleIcon(module.type)}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{module.name}</h3>
                      <p className="text-xs text-gray-500 capitalize">
                        {module.type.replace("-", " ")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        module.status === "online" ? "bg-green-500" : "bg-gray-400"
                      }`}
                    />
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <MoreVertical className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Feed:</span>
                    <div className="flex items-center gap-1">
                      <span className="font-mono text-gray-900">{module.feed}</span>
                      <button
                        onClick={() => copyToClipboard(module.feed)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <Copy className="w-3 h-3 text-gray-400" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Current Value:</span>
                    <span className="font-medium text-gray-900">
                      {getModuleValue(module)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Room:</span>
                    <span className="text-gray-900">{module.room}</span>
                  </div>
                </div>

                {/* Control for actuators */}
                {(module.type === "fan" || module.type === "led") && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    {module.type === "fan" && (
                      <div className="flex items-center gap-3">
                        <label className="relative inline-block w-11 h-6">
                          <input
                            type="checkbox"
                            checked={module.isOn}
                            onChange={(e) =>
                              updateModule(module.id, { isOn: e.target.checked })
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-blue-600 transition-colors" />
                          <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5" />
                        </label>
                        {module.isOn && (
                          <input
                            type="range"
                            min="1"
                            max="3"
                            value={module.speed || 1}
                            onChange={(e) =>
                              updateModule(module.id, {
                                speed: parseInt(e.target.value),
                              })
                            }
                            className="flex-1"
                          />
                        )}
                      </div>
                    )}
                    {module.type === "led" && (
                      <div className="flex items-center gap-3">
                        <label className="relative inline-block w-11 h-6">
                          <input
                            type="checkbox"
                            checked={module.isOn}
                            onChange={(e) =>
                              updateModule(module.id, { isOn: e.target.checked })
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-blue-600 transition-colors" />
                          <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5" />
                        </label>
                        {module.isOn && (
                          <>
                            <div
                              className="w-6 h-6 rounded-full border border-gray-300"
                              style={{ backgroundColor: module.color }}
                            />
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={module.brightness || 0}
                              onChange={(e) =>
                                updateModule(module.id, {
                                  brightness: parseInt(e.target.value),
                                })
                              }
                              className="flex-1"
                            />
                          </>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {[
            {
              type: "module",
              message: "Temperature changed: 24°C → 25°C",
              time: "5 minutes ago",
            },
            {
              type: "automation",
              message: "Fan turned ON by automation",
              time: "1 hour ago",
            },
            {
              type: "alert",
              message: "Module offline: PIR Sensor",
              time: "2 hours ago",
            },
            {
              type: "system",
              message: "Hub connected to WiFi",
              time: "1 day ago",
            },
          ].map((activity, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
            >
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2" />
              <div className="flex-1">
                <p className="text-sm text-gray-900">{activity.message}</p>
                <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delete Hub Section */}
      <div className="bg-white rounded-2xl p-6 border border-red-200">
        <h2 className="text-lg font-semibold text-red-600 mb-2">Danger Zone</h2>
        <p className="text-sm text-gray-600 mb-4">
          Deleting this hub will also remove all connected modules. This action cannot
          be undone.
        </p>
        <button
          onClick={handleDeleteHub}
          className="flex items-center gap-2 px-4 py-2 border-2 border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Delete Hub
        </button>
      </div>
    </div>
  );
}
