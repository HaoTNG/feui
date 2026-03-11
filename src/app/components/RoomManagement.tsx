import { useState } from "react";
import { Plus, Pencil, Trash2, X, Home, HardDrive, Cpu, Thermometer, Droplets, Sun, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { useApp } from "../contexts/AppContext";

type Room = {
  id: string;
  name: string;
  hubCount: number;
  moduleCount: number;
  temperature?: number;
  humidity?: number;
  lightLevel?: number;
  offlineModules: number;
};

export function RoomManagement() {
  const navigate = useNavigate();
  const { rooms: contextRooms, hubs, modules, isDarkMode, selectedHomeId } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editRoom, setEditRoom] = useState<Room | null>(null);
  const [deleteRoom, setDeleteRoom] = useState<Room | null>(null);

  // Filter by selected home
  const currentHomeRooms = contextRooms.filter(r => r.homeId === selectedHomeId);
  const currentHomeHubs = hubs.filter(h => h.homeId === selectedHomeId);
  const currentHomeModules = modules.filter(m => m.homeId === selectedHomeId);

  // Convert context rooms to include hub and module counts
  const rooms = currentHomeRooms.map((room) => {
    const roomHubs = currentHomeHubs.filter(h => h.room === room.name);
    const roomModules = currentHomeModules.filter(m => m.room === room.name);
    const offlineModules = roomModules.filter(m => m.status === "offline").length;
    
    // Get environmental data from modules
    const tempModule = roomModules.find(m => m.type === "temperature");
    const humidityModule = roomModules.find(m => m.type === "humidity");
    const lightModule = roomModules.find(m => m.type === "light-sensor");

    return {
      id: room.id,
      name: room.name,
      hubCount: roomHubs.length,
      moduleCount: roomModules.length,
      temperature: tempModule?.temperature,
      humidity: humidityModule?.humidity,
      lightLevel: lightModule?.lux,
      offlineModules,
    };
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
            Room Management
          </h1>
          <p className={isDarkMode ? "text-gray-400 mt-1" : "text-gray-600 mt-1"}>
            Create and manage rooms
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
        >
          <Plus className="w-5 h-5" />
          Add Room
        </button>
      </div>

      {/* Room Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {rooms.map((room) => (
          <RoomCard
            key={room.id}
            room={room}
            onEdit={() => setEditRoom(room)}
            onDelete={() => setDeleteRoom(room)}
            onClick={() => navigate(`/room-management/${room.id}`)}
          />
        ))}
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddRoomModal onClose={() => setShowAddModal(false)} />
      )}
      
      {editRoom && (
        <EditRoomModal room={editRoom} onClose={() => setEditRoom(null)} />
      )}
      
      {deleteRoom && (
        <DeleteRoomModal room={deleteRoom} onClose={() => setDeleteRoom(null)} />
      )}
    </div>
  );
}

function RoomCard({ room, onEdit, onDelete, onClick }: {
  room: Room;
  onEdit: () => void;
  onDelete: () => void;
  onClick: () => void;
}) {
  const { isDarkMode, hubs, modules } = useApp();
  
  // Get hubs in this room
  const roomHubs = hubs.filter(h => h.room === room.name);

  return (
    <div
      onClick={onClick}
      className={`rounded-xl shadow-sm border p-5 group transition-all cursor-pointer ${
        isDarkMode
          ? "bg-gray-800 border-gray-700 hover:bg-gray-700 hover:shadow-lg"
          : "bg-white border-gray-200 hover:shadow-md"
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
          isDarkMode ? "bg-blue-900/30" : "bg-blue-50"
        }`}>
          <Home className="w-6 h-6 text-blue-600" />
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className={`p-1.5 rounded transition-colors ${
              isDarkMode
                ? "text-gray-400 hover:text-blue-400 hover:bg-gray-600"
                : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
            }`}
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className={`p-1.5 rounded transition-colors ${
              isDarkMode
                ? "text-gray-400 hover:text-red-400 hover:bg-gray-600"
                : "text-gray-600 hover:text-red-600 hover:bg-red-50"
            }`}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <h3 className={`text-lg font-semibold mb-1 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
        {room.name}
      </h3>
      <p className={`text-sm mb-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
        {room.hubCount} hubs • {room.moduleCount} modules
      </p>

      {/* Hubs List */}
      {roomHubs.length > 0 && (
        <div className={`mb-3 p-3 rounded-lg ${isDarkMode ? "bg-gray-700/50" : "bg-gray-50"}`}>
          <div className={`text-xs font-semibold mb-2 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            HUBS:
          </div>
          <div className="space-y-1">
            {roomHubs.map(hub => (
              <div key={hub.id} className="flex items-center gap-2 text-sm">
                <div className={`w-2 h-2 rounded-full ${
                  hub.status === "online" ? "bg-green-500" : "bg-gray-400"
                }`}></div>
                <span className={isDarkMode ? "text-gray-300" : "text-gray-700"}>
                  {hub.name}
                </span>
                <span className={`text-xs ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>
                  ({hub.status})
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Environment Stats */}
      {(room.temperature || room.humidity || room.lightLevel) && (
        <div className={`mb-3 p-3 rounded-lg ${isDarkMode ? "bg-gray-700/50" : "bg-gray-50"}`}>
          <div className={`text-xs font-semibold mb-2 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            ENVIRONMENT:
          </div>
          <div className="flex items-center gap-4 text-sm">
            {room.temperature && (
              <div className="flex items-center gap-1">
                <Thermometer className="w-4 h-4 text-orange-500" />
                <span className={isDarkMode ? "text-gray-300" : "text-gray-700"}>
                  {room.temperature}°C
                </span>
              </div>
            )}
            {room.humidity && (
              <div className="flex items-center gap-1">
                <Droplets className="w-4 h-4 text-blue-500" />
                <span className={isDarkMode ? "text-gray-300" : "text-gray-700"}>
                  {room.humidity}%
                </span>
              </div>
            )}
            {room.lightLevel && (
              <div className="flex items-center gap-1">
                <Sun className="w-4 h-4 text-yellow-500" />
                <span className={isDarkMode ? "text-gray-300" : "text-gray-700"}>
                  {room.lightLevel} lux
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Alerts */}
      {room.offlineModules > 0 && (
        <div className={`flex items-center gap-2 text-xs ${
          isDarkMode ? "text-yellow-400" : "text-yellow-600"
        }`}>
          <AlertTriangle className="w-4 h-4" />
          <span>ALERTS: {room.offlineModules} module offline</span>
        </div>
      )}

      {/* Action Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        className={`w-full mt-4 py-2 rounded-lg font-medium transition-colors ${
          isDarkMode
            ? "bg-blue-900/30 text-blue-400 hover:bg-blue-900/50"
            : "bg-blue-50 text-blue-600 hover:bg-blue-100"
        }`}
      >
        Manage Room
      </button>
    </div>
  );
}

function AddRoomModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const { isDarkMode } = useApp();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onClose();
    toast.success("Room created", {
      description: `${name} has been added to your home`,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className={`rounded-xl shadow-2xl max-w-md w-full p-6 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>Add Room</h2>
          <button onClick={onClose} className={isDarkMode ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-700"}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Room Name</label>
            <input
              type="text"
              placeholder="e.g. Living Room"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                isDarkMode 
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" 
                  : "bg-white border-gray-300 text-gray-900"
              }`}
              required
            />
          </div>

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
              Create Room
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function EditRoomModal({ room, onClose }: { room: Room; onClose: () => void }) {
  const [name, setName] = useState(room.name);
  const { isDarkMode } = useApp();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onClose();
    toast.success("Room updated", {
      description: `Room name changed to ${name}`,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className={`rounded-xl shadow-2xl max-w-md w-full p-6 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>Edit Room</h2>
          <button onClick={onClose} className={isDarkMode ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-700"}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Room Name</label>
            <input
              type="text"
              placeholder="e.g. Living Room"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                isDarkMode 
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" 
                  : "bg-white border-gray-300 text-gray-900"
              }`}
              required
            />
          </div>

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
              Update Room
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DeleteRoomModal({ room, onClose }: { room: Room; onClose: () => void }) {
  const [moveDevicesTo, setMoveDevicesTo] = useState("unassigned");
  const { isDarkMode } = useApp();

  const handleConfirm = () => {
    onClose();
    toast.success("Room deleted", {
      description: `${room.name} has been removed`,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className={`rounded-xl shadow-2xl max-w-md w-full p-6 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
            <Trash2 className="w-6 h-6 text-yellow-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Delete Room</h2>
        </div>

        {room.moduleCount > 0 ? (
          <>
            <p className="text-gray-700 mb-4">
              This room has <strong>{room.moduleCount} modules</strong>. What would you like to do
              with them?
            </p>

            <div className="space-y-3 mb-6">
              <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="moveDevices"
                  value="unassigned"
                  checked={moveDevicesTo === "unassigned"}
                  onChange={(e) => setMoveDevicesTo(e.target.value)}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm font-medium text-gray-900">Move to unassigned</span>
              </label>

              <label className="flex items-start gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="moveDevices"
                  value="another"
                  checked={moveDevicesTo === "another"}
                  onChange={(e) => setMoveDevicesTo(e.target.value)}
                  className="w-4 h-4 text-blue-600 mt-0.5"
                />
                <div className="flex-1">
                  <span className="text-sm font-medium text-gray-900 block mb-2">
                    Move to another room
                  </span>
                  {moveDevicesTo === "another" && (
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm">
                      <option>Living Room</option>
                      <option>Bedroom</option>
                      <option>Kitchen</option>
                    </select>
                  )}
                </div>
              </label>
            </div>
          </>
        ) : (
          <p className="text-gray-700 mb-6">
            Are you sure you want to delete <strong>{room.name}</strong>?
          </p>
        )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
          >
            Delete Room
          </button>
        </div>
      </div>
    </div>
  );
}