import { useState, useEffect } from "react";
import { Plus, ChevronLeft, Trash2, Edit2, Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { useApp } from "../contexts/AppContext";
import { homeService } from "../api/services/homeService";
import { roomService } from "../api/services/roomService";
import { toast } from "sonner";

export function HomeDetail() {
  const { isDarkMode, userRole } = useApp();
  const navigate = useNavigate();
  const { homeId } = useParams<{ homeId: string }>();

  const [home, setHome] = useState<any>(null);
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [creatingRoom, setCreatingRoom] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (homeId) {
      fetchHomeDetails();
    }
  }, [homeId]);

  const fetchHomeDetails = async () => {
    if (!homeId) return;
    try {
      setLoading(true);
      const [homeData, roomsData] = await Promise.all([
        homeService.getHome(homeId),
        roomService.getRoomsByHome(homeId),
      ]);
      setHome(homeData);
      setRooms(roomsData || []);
    } catch (error) {
      console.error("Failed to fetch home details:", error);
      toast.error("Failed to load home details");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRoom = async () => {
    if (!newRoomName.trim() || !homeId) {
      toast.error("Please enter a room name");
      return;
    }

    setCreatingRoom(true);
    try {
      const newRoom = await roomService.createRoom(homeId, newRoomName);
      setRooms([...rooms, newRoom]);
      setNewRoomName("");
      setShowCreateRoom(false);
      toast.success("Room created successfully");
    } catch (error) {
      console.error("Failed to create room:", error);
      toast.error("Failed to create room");
    } finally {
      setCreatingRoom(false);
    }
  };

  const handleDeleteRoom = async () => {
    if (!selectedRoomId) return;

    try {
      await roomService.deleteRoom(selectedRoomId);
      setRooms(rooms.filter(r => r.id !== selectedRoomId));
      setShowDeleteConfirm(false);
      setSelectedRoomId(null);
      toast.success("Room deleted successfully");
    } catch (error) {
      console.error("Failed to delete room:", error);
      toast.error("Failed to delete room");
    }
  };

  const isOwner = userRole === "owner";

  if (loading) {
    return (
      <div className={`max-w-7xl mx-auto flex items-center justify-center min-h-screen ${
        isDarkMode ? "bg-gray-900" : "bg-gray-50"
      }`}>
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>Loading home details...</p>
        </div>
      </div>
    );
  }

  if (!home) {
    return (
      <div className={`max-w-7xl mx-auto space-y-6`}>
        <button
          onClick={() => navigate("/homes")}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to Homes
        </button>
        <div className={`rounded-xl p-8 text-center ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
          <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>Home not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`max-w-7xl mx-auto space-y-6`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/homes")}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"
            }`}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              {home.name}
            </h1>
            <p className={`mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              {rooms.length} {rooms.length === 1 ? "room" : "rooms"}
            </p>
          </div>
        </div>
        {isOwner && (
          <button
            onClick={() => setShowCreateRoom(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create Room
          </button>
        )}
      </div>

      {/* Rooms Grid */}
      {rooms.length === 0 ? (
        <div className={`rounded-xl p-12 text-center ${isDarkMode ? "bg-gray-800 border border-gray-700" : "bg-gray-50 border border-gray-200"}`}>
          <p className={`text-lg font-medium mb-4 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
            No rooms yet
          </p>
          <p className={`mb-6 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            Create your first room to organize devices
          </p>
          {isOwner && (
            <button
              onClick={() => setShowCreateRoom(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Create Room
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <div
              key={room.id}
              className={`rounded-xl shadow-sm border p-6 hover:shadow-md transition-all group cursor-pointer ${
                isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
              }`}
              onClick={() => navigate(`/rooms/${room.id}`, { state: { room } })}
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  {room.name}
                </h3>
                {isOwner && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedRoomId(room.id);
                      setShowDeleteConfirm(true);
                    }}
                    className={`p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity ${
                      isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                    }`}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                )}
              </div>

              <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                Created: {new Date(room.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Create Room Modal */}
      {showCreateRoom && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`max-w-md w-full rounded-xl shadow-2xl p-6 ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          }`}>
            <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              Create New Room
            </h3>

            <input
              type="text"
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
              placeholder="Enter room name"
              className={`w-full px-4 py-3 rounded-lg border mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
              autoFocus
            />

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowCreateRoom(false);
                  setNewRoomName("");
                }}
                className={`flex-1 px-4 py-2 rounded-lg font-medium border-2 transition-colors ${
                  isDarkMode
                    ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateRoom}
                disabled={creatingRoom}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
              >
                {creatingRoom ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Room Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`max-w-sm w-full rounded-xl shadow-2xl p-6 ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          }`}>
            <h3 className={`text-xl font-semibold mb-3 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              Delete Room?
            </h3>
            <p className={`mb-6 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              This action cannot be undone. All devices in this room will be moved to unassigned.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setSelectedRoomId(null);
                }}
                className={`flex-1 px-4 py-2 rounded-lg font-medium border-2 transition-colors ${
                  isDarkMode
                    ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteRoom}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
