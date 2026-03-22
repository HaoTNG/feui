import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Edit2, Trash2, Share2, Power, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useApp } from "../contexts/AppContext";
import { deviceService } from "../api/services/deviceService";

export function DeviceDetail() {
  const { deviceId } = useParams<{ deviceId: string }>();
  const navigate = useNavigate();
  const { isDarkMode } = useApp();
  
  const [device, setDevice] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    if (deviceId) {
      fetchDeviceDetails();
    }
  }, [deviceId]);

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
            <p className={`mt-2 text-lg font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              {device.roomName || "Unassigned"}
            </p>
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

      {/* Actions */}
      <div className="flex gap-3">
        <button
          className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
            isDarkMode
              ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <Power className="w-5 h-5" />
          Control Device
        </button>
        <button
          className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
            isDarkMode
              ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <Share2 className="w-5 h-5" />
          Share Device
        </button>
      </div>
    </div>
  );
}
