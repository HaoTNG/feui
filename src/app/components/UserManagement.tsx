import { useState } from "react";
import { Plus, Trash2, X, Mail } from "lucide-react";
import { toast } from "sonner";
import { useApp } from "../contexts/AppContext";

type User = {
  id: string;
  name: string;
  email: string;
  role: "owner" | "family" | "guest";
  status: "active" | "pending";
  avatar: string;
};

const mockUsers: User[] = [
  {
    id: "1",
    name: "John Smith",
    email: "owner@example.com",
    role: "owner",
    status: "active",
    avatar: "JS",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "family@example.com",
    role: "family",
    status: "active",
    avatar: "SJ",
  },
  {
    id: "3",
    name: "Michael Brown",
    email: "guest@example.com",
    role: "guest",
    status: "active",
    avatar: "MB",
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily@example.com",
    role: "family",
    status: "pending",
    avatar: "ED",
  },
];

export function UserManagement() {
  const { isDarkMode } = useApp();
  const [users, setUsers] = useState(mockUsers);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [removeUser, setRemoveUser] = useState<User | null>(null);

  const handleInvite = (email: string, role: "owner" | "family" | "guest") => {
    setUsers([
      ...users,
      {
        id: Date.now().toString(),
        name: email.split("@")[0],
        email,
        role,
        status: "active",
        avatar: email.slice(0, 2).toUpperCase(),
      },
    ]);
    setShowInviteModal(false);
    toast.success("Invitation sent", {
      description: `Invite sent to ${email}`,
    });
  };

  const handleRemove = (user: User) => {
    setUsers(users.filter((u) => u.id !== user.id));
    toast.success("Member removed", {
      description: `${user.name} has been removed`,
    });
    setRemoveUser(null);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
            User Management
          </h1>
          <p className={`mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            Invite and manage home members
          </p>
        </div>
        <button
          onClick={() => setShowInviteModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
        >
          <Plus className="w-5 h-5" />
          Invite Member
        </button>
      </div>

      {/* Members List */}
      <div className={`rounded-xl shadow-sm border ${
        isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      }`}>
        <div className={`divide-y ${isDarkMode ? "divide-gray-700" : "divide-gray-200"}`}>
          {users.map((user) => (
            <div key={user.id} className={`flex items-center gap-4 p-5 ${
              isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"
            }`}>
              {/* Avatar */}
              <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                {user.avatar}
              </div>

              {/* User Info */}
              <div className="flex-1 min-w-0">
                <div className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  {user.name}
                </div>
                <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                  {user.email}
                </div>
              </div>

              {/* Role Badge */}
              <div>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                    user.role === "owner"
                      ? isDarkMode
                        ? "bg-purple-900/30 text-purple-300"
                        : "bg-purple-100 text-purple-700"
                      : user.role === "family"
                      ? isDarkMode
                        ? "bg-blue-900/30 text-blue-300"
                        : "bg-blue-100 text-blue-700"
                      : isDarkMode
                      ? "bg-gray-700 text-gray-300"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {user.role}
                </span>
              </div>

              {/* Status Badge */}
              <div>
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                    user.status === "active"
                      ? isDarkMode
                        ? "bg-green-900/30 text-green-300"
                        : "bg-green-100 text-green-700"
                      : isDarkMode
                      ? "bg-yellow-900/30 text-yellow-300"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${
                      user.status === "active" ? "bg-green-500" : "bg-yellow-500"
                    }`}
                  ></div>
                  {user.status}
                </span>
              </div>

              {/* Actions */}
              <div>
                {user.role !== "owner" && (
                  <button
                    onClick={() => setRemoveUser(user)}
                    className={`p-2 rounded transition-colors ${
                      isDarkMode
                        ? "text-gray-400 hover:text-red-400 hover:bg-gray-700"
                        : "text-gray-600 hover:text-red-600 hover:bg-red-50"
                    }`}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <InviteModal
          onClose={() => setShowInviteModal(false)}
          onInvite={handleInvite}
        />
      )}

      {/* Remove User Modal */}
      {removeUser && (
        <RemoveUserModal
          user={removeUser}
          onClose={() => setRemoveUser(null)}
          onConfirm={() => handleRemove(removeUser)}
        />
      )}
    </div>
  );
}

function InviteModal({
  onClose,
  onInvite,
}: {
  onClose: () => void;
  onInvite: (email: string, role: "owner" | "family" | "guest") => void;
}) {
  const { isDarkMode } = useApp();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"owner" | "family" | "guest">("family");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onInvite(email, role);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className={`rounded-xl shadow-2xl max-w-md w-full p-6 ${
        isDarkMode ? "bg-gray-800" : "bg-white"
      }`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
            Invite Member
          </h2>
          <button onClick={onClose} className={isDarkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-500 hover:text-gray-700"}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDarkMode ? "text-gray-300" : "text-gray-700"
            }`}>
              Email Address
            </label>
            <input
              type="email"
              placeholder="colleague@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
              required
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDarkMode ? "text-gray-300" : "text-gray-700"
            }`}>
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as "owner" | "family" | "guest")}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
            >
              <option value="family">Family (default)</option>
              <option value="owner">Owner</option>
              <option value="guest">Guest</option>
            </select>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDarkMode ? "text-gray-300" : "text-gray-700"
            }`}>
              Optional Message
            </label>
            <textarea
              placeholder="Add a personal message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
            />
          </div>

          <div className={`border rounded-lg p-3 ${
            isDarkMode ? "bg-blue-900/20 border-blue-800" : "bg-blue-50 border-blue-200"
          }`}>
            <div className="flex gap-2">
              <Mail className={`w-5 h-5 flex-shrink-0 ${
                isDarkMode ? "text-blue-400" : "text-blue-600"
              }`} />
              <p className={`text-sm ${isDarkMode ? "text-blue-300" : "text-blue-900"}`}>
                An invitation email will be sent to this address
              </p>
            </div>
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
              Send Invitation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function RemoveUserModal({
  user,
  onClose,
  onConfirm,
}: {
  user: User;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const { isDarkMode } = useApp();

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className={`rounded-xl shadow-2xl max-w-md w-full p-6 ${
        isDarkMode ? "bg-gray-800" : "bg-white"
      }`}>
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
            isDarkMode ? "bg-red-900/30" : "bg-red-100"
          }`}>
            <Trash2 className={`w-6 h-6 ${isDarkMode ? "text-red-400" : "text-red-600"}`} />
          </div>
          <h2 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
            Remove Member
          </h2>
        </div>

        <p className={`mb-6 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
          Are you sure you want to remove <strong>{user.name}</strong> from your smart home? They
          will lose access to all devices and settings.
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
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
