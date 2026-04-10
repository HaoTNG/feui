import { useState } from "react";
import { Plus, ChevronLeft, Trash2, Pencil, Loader2, Wifi, WifiOff, HardDrive } from "lucide-react";
import { useNavigate } from "react-router";
import { useApp } from "../contexts/AppContext";
import { deviceService } from "../api/services/deviceService";
import { toast } from "sonner";
import { convertDTOToDevice } from "../utils/converters";

export function DevicesList() {
  const { isDarkMode, userRole, selectedHomeId, devices, rooms, devicesLoading, roomsLoading, addDevice, deleteDevice } = useApp();
  const navigate = useNavigate();

  const [showAddDeviceModal, setShowAddDeviceModal] = useState(false);
  const [newDeviceName, setNewDeviceName] = useState("");
  const [newDeviceFirmwareId, setNewDeviceFirmwareId] = useState("");
  const [newDeviceRoomId, setNewDeviceRoomId] = useState<string | null>(null);
  const [addingDevice, setAddingDevice] = useState(false);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [showDeleteDeviceConfirm, setShowDeleteDeviceConfirm] = useState(false);
  const [deletingDevice, setDeletingDevice] = useState(false);

  const isOwner = userRole === "owner";
  const loading = devicesLoading || roomsLoading;

  const handleAddDevice = async () => {
    if (!selectedHomeId || !newDeviceName.trim() || !newDeviceFirmwareId.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setAddingDevice(true);
    try {
      const newDeviceDTO = await deviceService.createDevice(selectedHomeId, {
        name: newDeviceName.trim(),
        firmwareId: newDeviceFirmwareId.trim(),
        roomId: newDeviceRoomId,
      });
      // Convert DTO to Device model
      const newDevice = convertDTOToDevice(newDeviceDTO);
      addDevice(newDevice);
      setNewDeviceName("");
      setNewDeviceFirmwareId("");
      setNewDeviceRoomId(null);
      setShowAddDeviceModal(false);
      toast.success("Device added successfully");
    } catch (error) {
      console.error("Failed to add device:", error);
      toast.error("Failed to add device");
    } finally {
      setAddingDevice(false);
    }
  };

  const handleDeleteDevice = async () => {
    if (!selectedDeviceId) return;

    setDeletingDevice(true);
    try {
      await deviceService.deleteDevice(selectedDeviceId);
      deleteDevice(selectedDeviceId);
      setShowDeleteDeviceConfirm(false);
      setSelectedDeviceId(null);
      toast.success("Device deleted successfully");
    } catch (error) {
      console.error("Failed to delete device:", error);
      toast.error("Failed to delete device");
    } finally {
      setDeletingDevice(false);
    }
  };

  if (!selectedHomeId) {
    return (
      <div className={`max-w-7xl mx-auto flex items-center justify-center min-h-screen ${
        isDarkMode ? "bg-gray-900" : "bg-gray-50"
      }`}>
        <div className={`rounded-xl p-8 text-center ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
          <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>Please select a home first</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`max-w-7xl mx-auto flex items-center justify-center min-h-screen ${
        isDarkMode ? "bg-gray-900" : "bg-gray-50"
      }`}>
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>Loading devices...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`max-w-7xl mx-auto space-y-6`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
            Devices
          </h1>
          <p className={`mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            Manage all devices in this home
          </p>
        </div>
        {isOwner && (
          <button
            onClick={() => setShowAddDeviceModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            Add Device
          </button>
        )}
      </div>

      {/* Devices Grid */}
      {devices.length === 0 ? (
        <div className={`rounded-xl p-12 text-center ${isDarkMode ? "bg-gray-800 border border-gray-700" : "bg-gray-50 border border-gray-200"}`}>
          <HardDrive className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className={`text-lg font-medium mb-4 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
            No devices yet
          </p>
          <p className={`mb-6 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            Start by adding your first device
          </p>
          {isOwner && (
            <button
              onClick={() => setShowAddDeviceModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Device
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {devices.map((device) => (
            <div
              key={device.id}
              onClick={() => navigate(`/devices/${device.id}`)}
              className={`rounded-xl shadow-sm border p-6 hover:shadow-md transition-all group cursor-pointer ${
                isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
              }`}
            >
              {/* Device Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                    {device.name}
                  </h3>
                  <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    {device.roomName}
                  </p>
                </div>
                <Wifi className="w-5 h-5 text-green-500" />
              </div>

              {/* Device Info */}
              <div className="space-y-2 mb-4">
                <div>
                  <p className={`text-xs uppercase font-semibold ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>
                    Firmware ID
                  </p>
                  <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    {device.firmwareId}
                  </p>
                </div>
                <div>
                  <p className={`text-xs uppercase font-semibold ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>
                    Added
                  </p>
                  <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    {new Date(device.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Actions */}
              {isOwner && (
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/devices/${device.id}`)}
                    className="flex-1 px-3 py-2 text-sm font-medium rounded-lg border-2 transition-colors"
                    style={{
                      borderColor: isDarkMode ? "#4b5563" : "#e5e7eb",
                      color: isDarkMode ? "#d1d5db" : "#374151",
                    }}
                  >
                    <Pencil className="w-4 h-4 inline mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setSelectedDeviceId(device.id);
                      setShowDeleteDeviceConfirm(true);
                    }}
                    className="flex-1 px-3 py-2 text-sm font-medium text-red-600 rounded-lg border-2 border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 inline mr-1" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add Device Modal */}
      {showAddDeviceModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`max-w-md w-full rounded-xl shadow-2xl p-6 ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          }`}>
            <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              Add New Device
            </h3>

            <div className="space-y-4 mb-6">
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Device Name *
                </label>
                <input
                  type="text"
                  value={newDeviceName}
                  onChange={(e) => setNewDeviceName(e.target.value)}
                  placeholder="e.g., Living Room Light"
                  className={`w-full px-4 py-2 rounded-lg border-2 focus:outline-none focus:border-blue-500 transition-colors ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                  }`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Firmware ID *
                </label>
                <input
                  type="text"
                  value={newDeviceFirmwareId}
                  onChange={(e) => setNewDeviceFirmwareId(e.target.value)}
                  placeholder="e.g., fe45nkhiz"
                  className={`w-full px-4 py-2 rounded-lg border-2 focus:outline-none focus:border-blue-500 transition-colors ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                  }`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Room (Optional)
                </label>
                <select
                  value={newDeviceRoomId || ""}
                  onChange={(e) => setNewDeviceRoomId(e.target.value || null)}
                  className={`w-full px-4 py-2 rounded-lg border-2 focus:outline-none focus:border-blue-500 transition-colors ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                >
                  <option value="">Unassigned</option>
                  {rooms.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowAddDeviceModal(false)}
                disabled={addingDevice}
                className={`flex-1 px-4 py-2 rounded-lg font-medium border-2 transition-colors ${
                  isDarkMode
                    ? "border-gray-600 text-gray-300 hover:bg-gray-700 disabled:border-gray-700"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50 disabled:border-gray-200"
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleAddDevice}
                disabled={addingDevice}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors font-medium"
              >
                {addingDevice ? "Adding..." : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Device Confirmation Modal */}
      {showDeleteDeviceConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`max-w-sm w-full rounded-xl shadow-2xl p-6 ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          }`}>
            <h3 className={`text-xl font-semibold mb-3 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              Delete Device?
            </h3>
            <p className={`mb-6 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              This action cannot be undone. The device will be permanently removed.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteDeviceConfirm(false)}
                disabled={deletingDevice}
                className={`flex-1 px-4 py-2 rounded-lg font-medium border-2 transition-colors ${
                  isDarkMode
                    ? "border-gray-600 text-gray-300 hover:bg-gray-700 disabled:border-gray-700"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50 disabled:border-gray-200"
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteDevice}
                disabled={deletingDevice}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 transition-colors font-medium"
              >
                {deletingDevice ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
