import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Edit2, Trash2, Share2, Power, AlertCircle, Home, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { useApp } from "../contexts/AppContext";
import { deviceService } from "../api/services/deviceService";
import { ModuleControl } from "./ModuleControl";
import type { ModuleDTO, ModuleType } from "../types/api";

// Mock modules for device control
const MOCK_DEVICE_MODULES: ModuleDTO[] = [
  {
    id: "module-light-1",
    name: "Main Light",
    type: "LIGHT",
    state: "0",
    deviceChannelId: "channel-1",
    status: "ONLINE",
    createdAt: new Date().toISOString(),
  },
  {
    id: "module-fan-1",
    name: "Ceiling Fan",
    type: "FAN",
    state: "0",
    deviceChannelId: "channel-2",
    status: "ONLINE",
    createdAt: new Date().toISOString(),
  },
  {
    id: "module-switch-1",
    name: "Power Switch",
    type: "SWITCH",
    state: "0",
    deviceChannelId: "channel-3",
    status: "ONLINE",
    createdAt: new Date().toISOString(),
  },
  {
    id: "module-led-1",
    name: "RGB LED",
    type: "LED",
    state: "0",
    deviceChannelId: "channel-4",
    status: "ONLINE",
    createdAt: new Date().toISOString(),
  },
  {
    id: "module-lcd-1",
    name: "LCD Display",
    type: "LCD",
    state: "0",
    deviceChannelId: "channel-5",
    status: "ONLINE",
    createdAt: new Date().toISOString(),
  },
];

export function DeviceDetail() {
  const { deviceId } = useParams<{ deviceId: string }>();
  const navigate = useNavigate();
  const { isDarkMode, rooms } = useApp();
  
  const [device, setDevice] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState("");
  const [movingRoom, setMovingRoom] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [modules, setModules] = useState<ModuleDTO[]>(MOCK_DEVICE_MODULES);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (deviceId) {
      fetchDeviceDetails();
    }
  }, [deviceId]);

  useEffect(() => {
    if (device && !movingRoom) {
      setSelectedRoomId(device.roomId || null);
    }
  }, [device, movingRoom]);

  const fetchDeviceDetails = async () => {
    try {
      setLoading(true);
      const device = await deviceService.getDevice(deviceId!);
      setDevice(device);
      setNewName(device.name);
    } catch (error) {
      console.error("Error fetching device details:", error);
      toast.error("Failed to load device details");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateName = async () => {
    if (!newName.trim()) {
      toast.error("Device name cannot be empty");
      return;
    }

    try {
      const updatedDevice = await deviceService.updateDeviceName(deviceId!, newName);
      setDevice(updatedDevice);
      setEditing(false);
      toast.success("Device name updated successfully");
    } catch (error) {
      console.error("Error updating device name:", error);
      toast.error("Failed to update device name");
    }
  };

  const handleMoveToRoom = async () => {
    if (selectedRoomId === device.roomId) {
      setMovingRoom(false);
      return;
    }

    try {
      setMovingRoom(true);
      const updatedDevice = await deviceService.moveDevice(deviceId!, selectedRoomId);
      setDevice(updatedDevice);
      toast.success(`Device moved to ${updatedDevice.roomName || "Unassigned"}`);
      setMovingRoom(false);
    } catch (error) {
      console.error("Error moving device:", error);
      toast.error("Failed to move device to room");
      setMovingRoom(false);
      setSelectedRoomId(device.roomId || null);
    }
  };

  const handleDeleteDevice = async () => {
    try {
      setDeleting(true);
      await deviceService.deleteDevice(deviceId!);
      toast.success("Device deleted successfully");
      setTimeout(() => navigate("/device-management"), 1000);
    } catch (error) {
      console.error("Error deleting device:", error);
      toast.error("Failed to delete device");
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className={`rounded-xl border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} p-8 text-center`}>
          <div className="inline-block">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
          <p className={`mt-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Loading device...</p>
        </div>
      </div>
    );
  }

  if (!device) {
    return (
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate("/devices")}
          className={`flex items-center gap-2 mb-6 px-4 py-2 rounded-lg font-medium transition-colors ${
            isDarkMode
              ? "text-gray-400 hover:text-white hover:bg-gray-800"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          }`}
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Devices
        </button>
        
        <div className={`rounded-xl border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} p-8 text-center`}>
          <AlertCircle className={`w-12 h-12 mx-auto mb-4 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`} />
          <h2 className={`text-xl font-semibold mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
            Device not found
          </h2>
          <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
            The device you're looking for doesn't exist or has been deleted.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <button
        onClick={() => navigate("/devices")}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
          isDarkMode
            ? "text-gray-400 hover:text-white hover:bg-gray-800"
            : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
        }`}
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Devices
      </button>

      {/* Main Card */}
      <div className={`rounded-xl border shadow-sm ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
        <div className={`p-6 border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              {editing ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                    placeholder="Enter device name"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleUpdateName}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditing(false);
                        setNewName(device.name);
                      }}
                      className={`px-4 py-2 border rounded-lg font-medium transition-colors ${
                        isDarkMode
                          ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                          : "border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <h1 className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                    {device.name}
                  </h1>
                  <p className={`mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Device ID: {device.id}
                  </p>
                </div>
              )}
            </div>

            {!editing && (
              <div className="flex gap-2">
                <button
                  onClick={() => setEditing(true)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    isDarkMode
                      ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Device Info Grid */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Firmware ID */}
          <div>
            <h3 className={`text-sm font-semibold uppercase tracking-wider ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}>
              Firmware ID
            </h3>
            <p className={`mt-2 text-lg font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              {device.firmwareId || "N/A"}
            </p>
          </div>

          {/* Room */}
          <div>
            <h3 className={`text-sm font-semibold uppercase tracking-wider ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}>
              Room
            </h3>
            {movingRoom ? (
              <div className="mt-2 space-y-3">
                <select
                  value={selectedRoomId || ""}
                  onChange={(e) => setSelectedRoomId(e.target.value || null)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                >
                  <option value="">Unassigned</option>
                  {rooms && rooms.map((room: any) => (
                    <option key={room.id} value={room.id}>
                      {room.name}
                    </option>
                  ))}
                </select>
                <div className="flex gap-2">
                  <button
                    onClick={handleMoveToRoom}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors text-sm"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setMovingRoom(false);
                      setSelectedRoomId(device.roomId || null);
                    }}
                    className={`px-3 py-2 border rounded-lg font-medium transition-colors text-sm ${
                      isDarkMode
                        ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-2 flex items-center justify-between">
                <p className={`text-lg font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  {device.roomName || "Unassigned"}
                </p>
                <button
                  onClick={() => setMovingRoom(true)}
                  className={`text-sm font-medium transition-colors ${
                    isDarkMode
                      ? "text-blue-400 hover:text-blue-300"
                      : "text-blue-600 hover:text-blue-700"
                  }`}
                >
                  Change
                </button>
              </div>
            )}
          </div>

          {/* Created Date */}
          <div>
            <h3 className={`text-sm font-semibold uppercase tracking-wider ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}>
              Created
            </h3>
            <p className={`mt-2 text-lg font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              {device.createdAt ? new Date(device.createdAt).toLocaleDateString() : "N/A"}
            </p>
          </div>

          {/* Updated Date */}
          <div>
            <h3 className={`text-sm font-semibold uppercase tracking-wider ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}>
              Last Updated
            </h3>
            <p className={`mt-2 text-lg font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              {device.updatedAt ? new Date(device.updatedAt).toLocaleDateString() : "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* Modules Section */}
      <div className={`rounded-xl border shadow-sm ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
        <div className={`p-6 border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
          <h2 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
            Device Controls
          </h2>
          <p className={`text-sm mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            Manage and control device modules
          </p>
        </div>

        <div className="p-6 space-y-4">
          {/* Modules List */}
          {modules && modules.length > 0 ? (
            <div className="space-y-4">
              {modules.map((module) => (
                <ModuleControl 
                  key={module.id}
                  module={module} 
                  isDarkMode={isDarkMode}
                  onStateChange={(newState) => {
                    // Update module state in local array
                    setModules(modules.map(m => m.id === module.id ? { ...m, state: newState } : m));
                  }}
                />
              ))}
            </div>
          ) : (
            <p className={`text-center py-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              No modules available
            </p>
          )}
        </div>
      </div>
      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={() => navigate("/device-management")}
          className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
            isDarkMode
              ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Devices
        </button>
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors flex items-center gap-2"
        >
          <Trash2 className="w-5 h-5" />
          <span className="hidden sm:inline">Delete Device</span>
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className={`rounded-xl border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} p-6 space-y-4`}>
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <h3 className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              Delete Device
            </h3>
          </div>
          <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
            Are you sure you want to delete this device? This action cannot be undone.
          </p>
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              disabled={deleting}
              className={`px-4 py-2 border rounded-lg font-medium transition-colors ${
                isDarkMode
                  ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteDevice}
              disabled={deleting}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors disabled:opacity-50"
            >
              {deleting ? "Deleting..." : "Delete Device"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
