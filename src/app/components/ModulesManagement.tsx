import { useState } from "react";
import { useApp } from "../contexts/AppContext";
import {
  Search,
  Filter,
  Copy,
  Edit2,
  Trash2,
  Thermometer,
  Droplets,
  Sun,
  Fan,
  Lightbulb,
  Eye,
  Monitor,
  Server,
  X,
} from "lucide-react";
import { Link } from "react-router";

export function ModulesManagement() {
  const { modules, selectedHomeId, hubs, deleteModule, updateModule, rooms } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedModule, setSelectedModule] = useState<any>(null);

  const homeModules = modules.filter((m) => m.homeId === selectedHomeId);

  const filteredModules = homeModules.filter((module) => {
    const matchesSearch = module.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || module.type === filterType;
    return matchesSearch && matchesType;
  });

  const getModuleIcon = (type: string) => {
    switch (type) {
      case "temperature":
        return { icon: <Thermometer className="w-5 h-5" />, color: "text-orange-600" };
      case "humidity":
        return { icon: <Droplets className="w-5 h-5" />, color: "text-blue-600" };
      case "light-sensor":
        return { icon: <Sun className="w-5 h-5" />, color: "text-yellow-600" };
      case "fan":
        return { icon: <Fan className="w-5 h-5" />, color: "text-cyan-600" };
      case "led":
        return { icon: <Lightbulb className="w-5 h-5" />, color: "text-purple-600" };
      case "pir-motion":
        return { icon: <Eye className="w-5 h-5" />, color: "text-green-600" };
      case "lcd-display":
        return { icon: <Monitor className="w-5 h-5" />, color: "text-gray-600" };
      default:
        return { icon: <Server className="w-5 h-5" />, color: "text-gray-600" };
    }
  };

  const getModuleTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      temperature: "bg-orange-100 text-orange-700",
      humidity: "bg-blue-100 text-blue-700",
      "light-sensor": "bg-yellow-100 text-yellow-700",
      fan: "bg-cyan-100 text-cyan-700",
      led: "bg-purple-100 text-purple-700",
      "pir-motion": "bg-green-100 text-green-700",
      "lcd-display": "bg-gray-100 text-gray-700",
    };
    return colors[type] || "bg-gray-100 text-gray-700";
  };

  const getModuleValue = (module: any) => {
    if (module.temperature !== undefined) return `${module.temperature}°C`;
    if (module.humidity !== undefined) return `${module.humidity}%`;
    if (module.lux !== undefined) return `${module.lux} lux`;
    if (module.motion !== undefined) return module.motion ? "Motion" : "No motion";
    if (module.isOn !== undefined) {
      if (module.type === "fan") return module.isOn ? `Speed ${module.speed}` : "OFF";
      if (module.type === "led") return module.isOn ? `${module.brightness}%` : "OFF";
      return module.isOn ? "ON" : "OFF";
    }
    return "—";
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleEditModule = (module: any) => {
    setSelectedModule(module);
    setShowEditModal(true);
  };

  const handleSaveModule = () => {
    if (selectedModule) {
      updateModule(selectedModule.id, selectedModule);
      setShowEditModal(false);
      setSelectedModule(null);
    }
  };

  const handleDeleteModule = (moduleId: string) => {
    if (confirm("Delete this module? This cannot be undone.")) {
      deleteModule(moduleId);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">All Modules</h1>
            <p className="text-gray-600">
              Manage all sensors and actuators across all hubs
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search modules..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            <option value="temperature">Temperature</option>
            <option value="humidity">Humidity</option>
            <option value="light-sensor">Light Sensor</option>
            <option value="fan">Fan</option>
            <option value="led">LED</option>
            <option value="pir-motion">Motion</option>
            <option value="lcd-display">LCD Display</option>
          </select>
        </div>
      </div>

      {/* Modules Table */}
      {filteredModules.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Server className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Modules Found</h3>
          <p className="text-gray-600">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">
                  Module Name
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">
                  Type
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">
                  Parent Hub
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">
                  Feed
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">
                  Room
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">
                  Status
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">
                  Current Value
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredModules.map((module) => {
                const { icon, color } = getModuleIcon(module.type);
                const hub = hubs.find((h) => h.id === module.hubId);

                return (
                  <tr key={module.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center ${color}`}
                        >
                          {icon}
                        </div>
                        <span className="font-medium text-gray-900">{module.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getModuleTypeBadge(
                          module.type
                        )}`}
                      >
                        {module.type.replace("-", " ").toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {hub ? (
                        <Link
                          to={`/hub-management/${hub.id}`}
                          className="text-blue-600 hover:text-blue-700 hover:underline"
                        >
                          {hub.name}
                        </Link>
                      ) : (
                        <span className="text-gray-400">Unknown</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm text-gray-900">
                          {module.feed}
                        </span>
                        <button
                          onClick={() => copyToClipboard(module.feed)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <Copy className="w-3 h-3 text-gray-400" />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{module.room}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            module.status === "online" ? "bg-green-500" : "bg-gray-400"
                          }`}
                        />
                        <span
                          className={`text-sm ${
                            module.status === "online"
                              ? "text-green-600"
                              : "text-gray-500"
                          }`}
                        >
                          {module.status === "online" ? "Online" : "Offline"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {getModuleValue(module)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditModule(module)}
                          className="p-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                          title="Edit module"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteModule(module.id)}
                          className="p-1 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded"
                          title="Delete module"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Module Modal */}
      {showEditModal && selectedModule && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Edit Module</h2>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedModule(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Module Name
                </label>
                <input
                  type="text"
                  value={selectedModule.name}
                  onChange={(e) =>
                    setSelectedModule({ ...selectedModule, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type
                </label>
                <input
                  type="text"
                  value={selectedModule.type.replace("-", " ")}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Parent Hub
                </label>
                <input
                  type="text"
                  value={hubs.find((h) => h.id === selectedModule.hubId)?.name || "Unknown"}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Feed
                </label>
                <input
                  type="text"
                  value={selectedModule.feed}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Room Assignment
                </label>
                <select
                  value={selectedModule.room}
                  onChange={(e) =>
                    setSelectedModule({ ...selectedModule, room: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {rooms.map((room) => (
                    <option key={room.id} value={room.name}>
                      {room.name}
                    </option>
                  ))}
                </select>
              </div>

              {(selectedModule.type === "temperature" ||
                selectedModule.type === "humidity" ||
                selectedModule.type === "light-sensor") && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Calibration Offset
                  </label>
                  <input
                    type="number"
                    value={selectedModule.calibrationOffset || 0}
                    onChange={(e) =>
                      setSelectedModule({
                        ...selectedModule,
                        calibrationOffset: parseFloat(e.target.value),
                      })
                    }
                    step="0.1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSaveModule}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedModule(null);
                  }}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    handleDeleteModule(selectedModule.id);
                    setShowEditModal(false);
                    setSelectedModule(null);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 border-2 border-red-600 text-red-600 rounded-lg hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Module
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
