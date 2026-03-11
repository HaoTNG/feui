import { Plus, Power, Settings, Trash2, QrCode, X, AlertCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useApp, type Device } from "../contexts/AppContext";

export function DeviceManagement() {
  const { devices, deleteDevice, isDarkMode, addDevice, rooms } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteDeviceId, setDeleteDeviceId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "unassigned">("all");

  const handleAddDevice = () => {
    toast.success("Device added successfully", {
      description: "New device has been added to your home",
    });
    setShowAddModal(false);
  };

  const handleDeleteDevice = (deviceId: string) => {
    deleteDevice(deviceId);
    toast.success("Device deleted", {
      description: `Device with ID ${deviceId} has been removed`,
    });
    setDeleteDeviceId(null);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
            Device Management
          </h1>
          <p className={`mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            Add, edit, and remove devices
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
        >
          <Plus className="w-5 h-5" />
          Add Device
        </button>
      </div>

      {/* Tabs */}
      <div className={`flex gap-2 border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
        <button
          onClick={() => setActiveTab("all")}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === "all"
              ? "border-blue-600 text-blue-600"
              : isDarkMode
              ? "border-transparent text-gray-400 hover:text-gray-300"
              : "border-transparent text-gray-600 hover:text-gray-900"
          }`}
        >
          All Devices
        </button>
        <button
          onClick={() => setActiveTab("unassigned")}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === "unassigned"
              ? "border-blue-600 text-blue-600"
              : isDarkMode
              ? "border-transparent text-gray-400 hover:text-gray-300"
              : "border-transparent text-gray-600 hover:text-gray-900"
          }`}
        >
          Unassigned Devices
        </button>
      </div>

      {/* Device Table */}
      <div className={`rounded-xl shadow-sm border overflow-hidden ${
        isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={`border-b ${isDarkMode ? "bg-gray-900 border-gray-700" : "bg-gray-50 border-gray-200"}`}>
              <tr>
                <th className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}>
                  Device Name
                </th>
                <th className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}>
                  Type
                </th>
                <th className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}>
                  Room
                </th>
                <th className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}>
                  Status
                </th>
                <th className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}>
                  Added Date
                </th>
                <th className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDarkMode ? "divide-gray-700" : "divide-gray-200"}`}>
              {devices.map((device) => (
                <tr key={device.id} className={isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"}>
                  <td className={`px-6 py-4 text-sm font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                    {device.name}
                  </td>
                  <td className={`px-6 py-4 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    {device.type}
                  </td>
                  <td className={`px-6 py-4 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    {device.room}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        device.status === "online"
                          ? isDarkMode
                            ? "bg-green-900/30 text-green-400"
                            : "bg-green-50 text-green-700"
                          : isDarkMode
                          ? "bg-gray-700 text-gray-400"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${
                          device.status === "online" ? "bg-green-500" : isDarkMode ? "bg-gray-500" : "bg-gray-400"
                        }`}
                      ></div>
                      {device.status}
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Today
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className={`p-1.5 rounded transition-colors ${
                        isDarkMode
                          ? "text-gray-400 hover:text-blue-400 hover:bg-gray-700"
                          : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                      }`}>
                        <Settings className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteDeviceId(device.id)}
                        className={`p-1.5 rounded transition-colors ${
                          isDarkMode
                            ? "text-gray-400 hover:text-red-400 hover:bg-gray-700"
                            : "text-gray-600 hover:text-red-600 hover:bg-red-50"
                        }`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Device Modal */}
      {showAddModal && <AddDeviceModal onClose={() => setShowAddModal(false)} onAdd={handleAddDevice} />}

      {/* Delete Confirmation Modal */}
      {deleteDeviceId && (
        <DeleteDeviceModal
          deviceId={deleteDeviceId}
          onClose={() => setDeleteDeviceId(null)}
          onConfirm={() => handleDeleteDevice(deleteDeviceId)}
        />
      )}
    </div>
  );
}

function AddDeviceModal({ onClose, onAdd }: { onClose: () => void; onAdd: () => void }) {
  const { addDevice, rooms, isDarkMode } = useApp();
  const [activeTab, setActiveTab] = useState<"qr" | "manual">("qr");
  const [formData, setFormData] = useState({
    deviceId: "",
    type: "light" as Device["type"],
    room: "Living Room",
    assignLater: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate device name based on room and type
    const deviceName = formData.assignLater 
      ? `${formData.type.charAt(0).toUpperCase() + formData.type.slice(1)}`
      : `${formData.room} ${formData.type.charAt(0).toUpperCase() + formData.type.slice(1)}`;
    
    // Create new device
    const newDevice: Device = {
      id: formData.deviceId || `${formData.type}-${Date.now()}`,
      name: deviceName,
      type: formData.type,
      room: formData.assignLater ? "Unassigned" : formData.room,
      status: "online",
      isOn: false,
    };
    
    // Add type-specific properties
    if (formData.type === "light" || formData.type === "rgb-light") {
      newDevice.brightness = 0;
    }
    if (formData.type === "fan") {
      newDevice.speed = 0;
    }
    if (formData.type === "rgb-light") {
      newDevice.color = "#FFFFFF";
    }
    
    addDevice(newDevice);
    toast.success(`${deviceName} added successfully`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className={`rounded-xl shadow-2xl max-w-md w-full ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
        <div className={`flex items-center justify-between p-6 border-b ${
          isDarkMode ? "border-gray-700" : "border-gray-200"
        }`}>
          <h2 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
            Add New Device
          </h2>
          <button onClick={onClose} className={isDarkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-500 hover:text-gray-700"}>
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className={`flex border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
          <button
            onClick={() => setActiveTab("qr")}
            className={`flex-1 px-4 py-3 font-medium border-b-2 transition-colors ${
              activeTab === "qr"
                ? "border-blue-600 text-blue-600"
                : isDarkMode
                ? "border-transparent text-gray-400 hover:text-gray-300"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            QR Code
          </button>
          <button
            onClick={() => setActiveTab("manual")}
            className={`flex-1 px-4 py-3 font-medium border-b-2 transition-colors ${
              activeTab === "manual"
                ? "border-blue-600 text-blue-600"
                : isDarkMode
                ? "border-transparent text-gray-400 hover:text-gray-300"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            Manual Entry
          </button>
        </div>

        <div className="p-6">
          {activeTab === "qr" ? (
            <div className="space-y-4">
              <div className={`aspect-square rounded-lg flex items-center justify-center ${
                isDarkMode ? "bg-gray-700" : "bg-gray-100"
              }`}>
                <div className="text-center">
                  <QrCode className={`w-16 h-16 mx-auto mb-2 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`} />
                  <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>Position QR code in frame</p>
                </div>
              </div>
              <p className={`text-sm text-center ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                Alternatively, you can enter Device ID manually
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Device ID
                </label>
                <input
                  type="text"
                  placeholder="Enter device ID"
                  value={formData.deviceId}
                  onChange={(e) => setFormData({ ...formData, deviceId: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Device Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as Device["type"] })}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                >
                  <option value="light">Light</option>
                  <option value="fan">Fan</option>
                  <option value="temperature">Temperature Sensor</option>
                  <option value="humidity">Humidity Sensor</option>
                  <option value="light-sensor">Light Sensor</option>
                  <option value="rgb-light">RGB Light</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Room
                </label>
                <select
                  value={formData.room}
                  onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                  disabled={formData.assignLater}
                >
                  {rooms.map(room => (
                    <option key={room.id} value={room.name}>{room.name}</option>
                  ))}
                  <option value="Unassigned">Assign to room later</option>
                </select>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.assignLater}
                  onChange={(e) => setFormData({ ...formData, assignLater: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-600"
                />
                <span className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Assign to room later
                </span>
              </label>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className={`flex-1 px-4 py-2 border rounded-lg font-medium ${
                    isDarkMode
                      ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  Add Device
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function DeleteDeviceModal({
  deviceId,
  onClose,
  onConfirm,
}: {
  deviceId: string;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const { isDarkMode } = useApp();

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className={`rounded-xl shadow-2xl max-w-md w-full p-6 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
            isDarkMode ? "bg-red-900/30" : "bg-red-100"
          }`}>
            <Trash2 className={`w-6 h-6 ${isDarkMode ? "text-red-400" : "text-red-600"}`} />
          </div>
          <h2 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
            Delete Device
          </h2>
        </div>

        <p className={`mb-6 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
          Are you sure you want to delete <strong>Device with ID {deviceId}</strong>? This action cannot be
          undone.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className={`flex-1 px-4 py-2 border rounded-lg font-medium ${
              isDarkMode
                ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                : "border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
