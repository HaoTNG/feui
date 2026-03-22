import { useState, useEffect } from "react";
import { Plus, ChevronLeft, Trash2, Pencil, Loader2, Users, Mail, X } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { useApp } from "../contexts/AppContext";
import { homeService } from "../api/services/homeService";
import { roomService } from "../api/services/roomService";
import { memberService } from "../api/services/memberService";
import { toast } from "sonner";

export function HomeDetail() {
  const { isDarkMode, userRole } = useApp();
  const navigate = useNavigate();
  const { homeId } = useParams<{ homeId: string }>();

  const [home, setHome] = useState<any>(null);
  const [rooms, setRooms] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"rooms" | "members">("rooms");
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [creatingRoom, setCreatingRoom] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [showDeleteRoomConfirm, setShowDeleteRoomConfirm] = useState(false);
  const [showEditHomeModal, setShowEditHomeModal] = useState(false);
  const [editHomeName, setEditHomeName] = useState("");
  const [updatingHome, setUpdatingHome] = useState(false);
  const [showDeleteHomeConfirm, setShowDeleteHomeConfirm] = useState(false);
  const [deletingHome, setDeletingHome] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [addingMember, setAddingMember] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [showRemoveMemberConfirm, setShowRemoveMemberConfirm] = useState(false);
  const [removingMember, setRemovingMember] = useState(false);

  useEffect(() => {
    if (homeId) {
      fetchHomeDetails();
    }
  }, [homeId]);

  const fetchHomeDetails = async () => {
    if (!homeId) return;
    try {
      setLoading(true);
      const [homeData, roomsData, membersData] = await Promise.all([
        homeService.getHome(homeId),
        roomService.getRoomsByHome(homeId),
        memberService.getMembers(homeId),
      ]);
      setHome(homeData);
      setEditHomeName(homeData.name);
      setRooms(roomsData || []);
      setMembers(membersData || []);
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
      setShowDeleteRoomConfirm(false);
      setSelectedRoomId(null);
      toast.success("Room deleted successfully");
    } catch (error) {
      console.error("Failed to delete room:", error);
      toast.error("Failed to delete room");
    }
  };

  const handleUpdateHome = async () => {
    if (!homeId || !editHomeName.trim()) {
      toast.error("Home name cannot be empty");
      return;
    }

    setUpdatingHome(true);
    try {
      const updatedHome = await homeService.updateHome(homeId, editHomeName.trim());
      setHome(updatedHome);
      setShowEditHomeModal(false);
      toast.success("Home updated successfully");
    } catch (error) {
      console.error("Failed to update home:", error);
      toast.error("Failed to update home");
    } finally {
      setUpdatingHome(false);
    }
  };

  const handleDeleteHome = async () => {
    if (!homeId) return;

    setDeletingHome(true);
    try {
      await homeService.deleteHome(homeId);
      toast.success("Home deleted successfully");
      navigate("/homes");
    } catch (error) {
      console.error("Failed to delete home:", error);
      toast.error("Failed to delete home");
    } finally {
      setDeletingHome(false);
    }
  };

  const handleAddMember = async () => {
    if (!homeId || !newMemberEmail.trim()) {
      toast.error("Email cannot be empty");
      return;
    }

    setAddingMember(true);
    try {
      const newMember = await memberService.addMember(homeId, newMemberEmail.trim());
      setMembers([...members, newMember]);
      setNewMemberEmail("");
      setShowAddMemberModal(false);
      toast.success("Member added successfully");
    } catch (error) {
      console.error("Failed to add member:", error);
      toast.error("Failed to add member");
    } finally {
      setAddingMember(false);
    }
  };

  const handleRemoveMember = async () => {
    if (!homeId || !selectedMemberId) return;

    setRemovingMember(true);
    try {
      await memberService.removeMember(homeId, selectedMemberId);
      setMembers(members.filter(m => m.userId !== selectedMemberId));
      setShowRemoveMemberConfirm(false);
      setSelectedMemberId(null);
      toast.success("Member removed successfully");
    } catch (error) {
      console.error("Failed to remove member:", error);
      toast.error("Failed to remove member");
    } finally {
      setRemovingMember(false);
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
        <div className="flex items-center gap-3">
          {isOwner && (
            <>
              <button
                onClick={() => {
                  setShowEditHomeModal(true);
                  setEditHomeName(home.name);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Pencil className="w-5 h-5" />
                Edit
              </button>
              <button
                onClick={() => setShowDeleteHomeConfirm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
                Delete
              </button>
            </>
          )}
          <button
            onClick={() => setShowCreateRoom(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create Room
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className={`flex gap-4 border-b-2 ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
        <button
          onClick={() => setActiveTab("rooms")}
          className={`px-4 py-3 font-medium transition-colors ${
            activeTab === "rooms"
              ? `border-b-2 ${isDarkMode ? "border-blue-500 text-blue-400" : "border-blue-600 text-blue-600"}`
              : isDarkMode
              ? "text-gray-400 hover:text-gray-300"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Rooms ({rooms.length})
        </button>
        <button
          onClick={() => setActiveTab("members")}
          className={`px-4 py-3 font-medium transition-colors flex items-center gap-2 ${
            activeTab === "members"
              ? `border-b-2 ${isDarkMode ? "border-blue-500 text-blue-400" : "border-blue-600 text-blue-600"}`
              : isDarkMode
              ? "text-gray-400 hover:text-gray-300"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <Users className="w-4 h-4" />
          Members ({members.length})
        </button>
      </div>

      {/* Rooms Tab */}
      {activeTab === "rooms" && (
      <>
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
                      setShowDeleteRoomConfirm(true);
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
      </>
      )}

      {/* Members Tab */}
      {activeTab === "members" && (
      <>
      {members.length === 0 ? (
        <div className={`rounded-xl p-12 text-center ${isDarkMode ? "bg-gray-800 border border-gray-700" : "bg-gray-50 border border-gray-200"}`}>
          <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className={`text-lg font-medium mb-4 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
            No members yet
          </p>
          <p className={`mb-6 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            Only you in this home
          </p>
          {isOwner && (
            <button
              onClick={() => setShowAddMemberModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Member
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {members.map((member) => (
            <div
              key={member.userId}
              className={`rounded-xl p-4 flex items-center justify-between border ${
                isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
              }`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                    {(member.name || member.email || "?").charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                      {member.name || member.email}
                    </p>
                    <p className={`text-sm flex items-center gap-1 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                      <Mail className="w-4 h-4" />
                      {member.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    member.role === "OWNER"
                      ? isDarkMode ? "bg-amber-900/50 text-amber-300" : "bg-amber-100 text-amber-800"
                      : isDarkMode ? "bg-blue-900/50 text-blue-300" : "bg-blue-100 text-blue-800"
                  }`}>
                    {member.role}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    isDarkMode ? "bg-green-900/50 text-green-300" : "bg-green-100 text-green-800"
                  }`}>
                    {member.status}
                  </span>
                </div>
                <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  Joined {new Date(member.joinedAt).toLocaleDateString()}
                </p>
              </div>
              {isOwner && member.role !== "OWNER" && (
                <button
                  onClick={() => {
                    setSelectedMemberId(member.userId);
                    setShowRemoveMemberConfirm(true);
                  }}
                  className="ml-4 p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {isOwner && (
        <div className="mt-6">
          <button
            onClick={() => setShowAddMemberModal(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Member
          </button>
        </div>
      )}
      </>
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
      {showDeleteRoomConfirm && (
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
                  setShowDeleteRoomConfirm(false);
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

      {/* Edit Home Modal */}
      {showEditHomeModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`max-w-sm w-full rounded-xl shadow-2xl p-6 ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          }`}>
            <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              Edit Home Name
            </h3>
            <input
              type="text"
              value={editHomeName}
              onChange={(e) => setEditHomeName(e.target.value)}
              placeholder="Home name"
              className={`w-full px-4 py-2 rounded-lg border-2 mb-6 focus:outline-none focus:border-blue-500 transition-colors ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
              }`}
            />

            <div className="flex gap-3">
              <button
                onClick={() => setShowEditHomeModal(false)}
                disabled={updatingHome}
                className={`flex-1 px-4 py-2 rounded-lg font-medium border-2 transition-colors ${
                  isDarkMode
                    ? "border-gray-600 text-gray-300 hover:bg-gray-700 disabled:border-gray-700"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50 disabled:border-gray-200"
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateHome}
                disabled={updatingHome}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
              >
                {updatingHome ? "Updating..." : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Home Confirmation Modal */}
      {showDeleteHomeConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`max-w-sm w-full rounded-xl shadow-2xl p-6 ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          }`}>
            <h3 className={`text-xl font-semibold mb-3 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              Delete Home?
            </h3>
            <p className={`mb-6 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              This action cannot be undone. All rooms and devices will be permanently deleted.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteHomeConfirm(false)}
                disabled={deletingHome}
                className={`flex-1 px-4 py-2 rounded-lg font-medium border-2 transition-colors ${
                  isDarkMode
                    ? "border-gray-600 text-gray-300 hover:bg-gray-700 disabled:border-gray-700"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50 disabled:border-gray-200"
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteHome}
                disabled={deletingHome}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 transition-colors"
              >
                {deletingHome ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {showAddMemberModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`max-w-md w-full rounded-xl shadow-2xl p-6 ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-xl font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                Add Member
              </h3>
              <button
                onClick={() => setShowAddMemberModal(false)}
                className={`p-1 rounded transition-colors ${
                  isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <input
              type="email"
              value={newMemberEmail}
              onChange={(e) => setNewMemberEmail(e.target.value)}
              placeholder="member@example.com"
              className={`w-full px-4 py-2 rounded-lg border-2 mb-6 focus:outline-none focus:border-blue-500 transition-colors ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
              }`}
            />

            <div className="flex gap-3">
              <button
                onClick={() => setShowAddMemberModal(false)}
                disabled={addingMember}
                className={`flex-1 px-4 py-2 rounded-lg font-medium border-2 transition-colors ${
                  isDarkMode
                    ? "border-gray-600 text-gray-300 hover:bg-gray-700 disabled:border-gray-700"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50 disabled:border-gray-200"
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleAddMember}
                disabled={addingMember}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
              >
                {addingMember ? "Adding..." : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Remove Member Confirmation Modal */}
      {showRemoveMemberConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`max-w-sm w-full rounded-xl shadow-2xl p-6 ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          }`}>
            <h3 className={`text-xl font-semibold mb-3 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              Remove Member?
            </h3>
            <p className={`mb-6 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              This member will lose access to this home and all its devices.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowRemoveMemberConfirm(false)}
                disabled={removingMember}
                className={`flex-1 px-4 py-2 rounded-lg font-medium border-2 transition-colors ${
                  isDarkMode
                    ? "border-gray-600 text-gray-300 hover:bg-gray-700 disabled:border-gray-700"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50 disabled:border-gray-200"
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleRemoveMember}
                disabled={removingMember}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 transition-colors"
              >
                {removingMember ? "Removing..." : "Remove"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
