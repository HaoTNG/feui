import { useState } from "react";
import { useApp } from "../contexts/AppContext";
import { Plus, Grid3x3, List, Wifi, WifiOff, Server, ChevronRight, Edit2, Trash2, Settings } from "lucide-react";
import { AddHubModal } from "./AddHubModal";
import { Link } from "react-router";

export function HubManagement() {
  const { hubs, selectedHomeId, getHubsByHome, deleteHub } = useApp();
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [showAddModal, setShowAddModal] = useState(false);
  const [hubToDelete, setHubToDelete] = useState<string | null>(null);

  const homeHubs = selectedHomeId ? getHubsByHome(selectedHomeId) : [];

  const handleDeleteHub = (hubId: string) => {
    if (confirm("Delete this hub? All modules will also be removed. This cannot be undone.")) {
      deleteHub(hubId);
      setHubToDelete(null);
    }
  };

  const getSignalStrength = (signal?: number) => {
    if (!signal) return 0;
    if (signal >= 80) return 3;
    if (signal >= 50) return 2;
    return 1;
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between mb-2">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Server className="w-6 h-6 text-blue-600" />
              <h1 className="text-2xl font-semibold text-gray-900">Hub Management</h1>
            </div>
            <p className="text-gray-600">Manage all YoloBit hubs in your home</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add New Hub
          </button>
        </div>

        {/* View Toggle */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => setViewMode("grid")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              viewMode === "grid"
                ? "bg-blue-100 text-blue-600"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <Grid3x3 className="w-4 h-4" />
            Grid View
          </button>
          <button
            onClick={() => setViewMode("table")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              viewMode === "table"
                ? "bg-blue-100 text-blue-600"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <List className="w-4 h-4" />
            Table View
          </button>
        </div>
      </div>

      {/* Content */}
      {homeHubs.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Server className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Hubs Yet</h3>
          <p className="text-gray-600 mb-4">Add your first YoloBit hub to get started</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add New Hub
          </button>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {homeHubs.map((hub) => (
            <Link
              key={hub.id}
              to={`/hub-management/${hub.id}`}
              className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
            >
              {/* Top Row */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Server className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          hub.status === "online" ? "bg-green-500" : "bg-gray-400"
                        }`}
                      />
                      {hub.status === "online" ? (
                        <Wifi className="w-4 h-4 text-green-600" />
                      ) : (
                        <WifiOff className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                    {hub.status === "online" && hub.wifiSignal && (
                      <div className="flex gap-0.5 mt-1">
                        {[...Array(3)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-1 ${
                              i < getSignalStrength(hub.wifiSignal)
                                ? "bg-green-600"
                                : "bg-gray-300"
                            }`}
                            style={{ height: `${(i + 1) * 4}px` }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Hub Info */}
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{hub.name}</h3>
              <p className="text-sm text-gray-500 mb-3">ID: {hub.id}</p>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                <span>📍</span>
                <span>{hub.room}</span>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 text-sm mb-4">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-600 rounded-full" />
                  <span className="text-gray-600">
                    {hub.moduleCount} modules
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-gray-600">
                    {hub.onlineModuleCount} online
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full" />
                  <span className="text-gray-600">
                    {hub.moduleCount - hub.onlineModuleCount} offline
                  </span>
                </div>
              </div>

              {/* Last Seen */}
              <p className="text-xs text-gray-500 mb-4">
                {hub.status === "online"
                  ? "Online now"
                  : `Last seen ${new Date(hub.lastSeen).toLocaleString()}`}
              </p>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    // Edit hub
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleDeleteHub(hub.id);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    // View modules - will navigate to detail
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  Modules
                </button>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">Hub Name</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">Hub ID</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">Room</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">Status</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">Modules</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">Last Seen</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {homeHubs.map((hub) => (
                <tr key={hub.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Server className="w-5 h-5 text-blue-600" />
                      </div>
                      <span className="font-medium text-gray-900">{hub.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{hub.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{hub.room}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          hub.status === "online" ? "bg-green-500" : "bg-gray-400"
                        }`}
                      />
                      <span
                        className={`text-sm ${
                          hub.status === "online" ? "text-green-600" : "text-gray-500"
                        }`}
                      >
                        {hub.status === "online" ? "Online" : "Offline"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {hub.moduleCount} total, {hub.onlineModuleCount} online
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {hub.status === "online"
                      ? "Online now"
                      : new Date(hub.lastSeen).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          // Edit hub
                        }}
                        className="p-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteHub(hub.id)}
                        className="p-1 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <Link
                        to={`/hub-management/${hub.id}`}
                        className="p-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Hub Modal */}
      {showAddModal && <AddHubModal onClose={() => setShowAddModal(false)} />}
    </div>
  );
}
