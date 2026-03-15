import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router";
import {
  ArrowLeft,
  Pencil,
  Trash2,
} from "lucide-react";
import { useApp } from "../contexts/AppContext";
import { roomService } from "../api/services/roomService";
import { toast } from "sonner";

export function RoomDetail() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode, userRole } = useApp();

  // Get room data from location state (passed from HomeDetail)
  const initialRoom = (location.state as any)?.room;

  const [room, setRoom] = useState<any>(initialRoom || null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editRoomName, setEditRoomName] = useState(initialRoom?.name || "");
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (initialRoom) {
      setRoom(initialRoom);
      setEditRoomName(initialRoom.name);
    }
  }, [initialRoom]);

  const handleUpdateRoom = async () => {
    if (!editRoomName.trim()) {
      toast.error("Please enter a room name");
      return;
    }

    if (editRoomName === room.name) {
      setShowEditModal(false);
      return;
    }

    setUpdating(true);
    try {
      const updatedRoom = await roomService.updateRoom(roomId!, editRoomName);
      setRoom(updatedRoom);
      setShowEditModal(false);
      toast.success("Room updated successfully");
    } catch (error) {
      console.error("Failed to update room:", error);
      toast.error("Failed to update room");
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteRoom = async () => {
    setDeleting(true);
    try {
      await roomService.deleteRoom(roomId!);
      toast.success("Room deleted successfully");
      // Navigate back based on where user came from
      navigate(-1);
    } catch (error) {
      console.error("Failed to delete room:", error);
      toast.error("Failed to delete room");
    } finally {
      setDeleting(false);
    }
  };

  const isOwner = userRole === "owner";

  if (!room) {
    return (
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Go Back
        </button>
        <div className={`rounded-xl p-8 text-center ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
          <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
            Room not found
          </h3>
          <p className={`mb-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            The room you're looking for doesn't exist. Please navigate from the home detail page.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  console.log('[RoomDetail] userRole:', userRole, 'isOwner:', isOwner);

  return (
    <div className={`max-w-7xl mx-auto space-y-6`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"
            }`}
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              {room.name}
            </h1>
            <p className={`mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              Created: {new Date(room.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setEditRoomName(room.name);
              setShowEditModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Pencil className="w-4 h-4" />
            Edit
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>

      {/* Room Info Card */}
      <div className={`rounded-xl border p-6 ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className={`text-sm font-medium mb-1 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              Room ID
            </p>
            <p className={`text-lg font-mono ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
              {room.id}
            </p>
          </div>
          <div>
            <p className={`text-sm font-medium mb-1 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              Home ID
            </p>
            <p className={`text-lg font-mono ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
              {room.homeId}
            </p>
          </div>
          <div>
            <p className={`text-sm font-medium mb-1 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              Last Updated
            </p>
            <p className={`text-lg ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
              {new Date(room.updatedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`max-w-md w-full rounded-xl shadow-2xl p-6 ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          }`}>
            <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              Edit Room
            </h3>

            <input
              type="text"
              value={editRoomName}
              onChange={(e) => setEditRoomName(e.target.value)}
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
                  setShowEditModal(false);
                  setEditRoomName(room.name);
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
                onClick={handleUpdateRoom}
                disabled={updating}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
              >
                {updating ? "Updating..." : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`max-w-sm w-full rounded-xl shadow-2xl p-6 ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          }`}>
            <h3 className={`text-xl font-semibold mb-3 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              Delete Room?
            </h3>
            <p className={`mb-6 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              Are you sure you want to delete this room? Devices in this room will be moved to unassigned.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
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
                disabled={deleting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 transition-colors"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}