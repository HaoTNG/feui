import { Home, Plus, Trash2, ChevronRight, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useApp } from "../contexts/AppContext";
import { homeService } from "../api/services/homeService";
import { roomService } from "../api/services/roomService";
import { deviceService } from "../api/services/deviceService";
import { toast } from "sonner";

export function Homes() {
  const { isDarkMode, userRole } = useApp();
  const navigate = useNavigate();
  const [homes, setHomes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newHomeName, setNewHomeName] = useState("");
  const [creatingHome, setCreatingHome] = useState(false);
  const [selectedHomeId, setSelectedHomeId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    fetchHomes();
  }, []);

  const fetchHomes = async () => {
    try {
      setLoading(true);
      const homesData = await homeService.getHomes();
      
      // Fetch rooms and devices counts for each home
      const homesWithCounts = await Promise.all(
        (homesData || []).map(async (home) => {
          try {
            const [rooms, devices] = await Promise.all([
              roomService.getRoomsByHome(home.id),
              deviceService.getDevicesByHome(home.id),
            ]);
            return {
              ...home,
              roomCount: rooms?.length || 0,
              deviceCount: devices?.length || 0,
            };
          } catch (error) {
            console.error(`Failed to fetch counts for home ${home.id}:`, error);
            return {
              ...home,
              roomCount: 0,
              deviceCount: 0,
            };
          }
        })
      );
      
      setHomes(homesWithCounts);
    } catch (error) {
      console.error("Failed to fetch homes:", error);
      toast.error("Failed to load homes");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateHome = async () => {
    if (!newHomeName.trim()) {
      toast.error("Please enter a home name");
      return;
    }

    setCreatingHome(true);
    try {
      const newHome = await homeService.createHome(newHomeName);
      setHomes([...homes, newHome]);
      setNewHomeName("");
      setShowCreateModal(false);
      toast.success("Home created successfully");
    } catch (error) {
      console.error("Failed to create home:", error);
      toast.error("Failed to create home");
    } finally {
      setCreatingHome(false);
    }
  };

  const handleDeleteHome = async () => {
    if (!selectedHomeId) return;

    try {
      await homeService.deleteHome(selectedHomeId);
      setHomes(homes.filter(h => h.id !== selectedHomeId));
      setShowDeleteConfirm(false);
      setSelectedHomeId(null);
      toast.success("Home deleted successfully");
    } catch (error) {
      console.error("Failed to delete home:", error);
      toast.error("Failed to delete home");
    }
  };

  const isOwner = userRole === "owner";

  return (
    <div className={`max-w-7xl mx-auto space-y-6`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
            My Homes
          </h1>
          <p className={`mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            Manage your smart homes
          </p>
        </div>
        {isOwner && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create Home
          </button>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className={`rounded-xl p-8 text-center ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>Loading homes...</p>
        </div>
      )}

      {/* Homes Grid */}
      {!loading && (
        <>
          {homes.length === 0 ? (
            <div className={`rounded-xl p-12 text-center ${isDarkMode ? "bg-gray-800 border border-gray-700" : "bg-gray-50 border border-gray-200"}`}>
              <Home className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? "text-gray-600" : "text-gray-400"}`} />
              <p className={`text-lg font-medium mb-4 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                No homes yet
              </p>
              <p className={`mb-6 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                Create your first home to get started with smart home automation
              </p>
              {isOwner && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Create Home
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {homes.map((home) => (
                <div
                  key={home.id}
                  className={`rounded-xl shadow-sm border p-6 hover:shadow-md transition-all cursor-pointer group ${
                    isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
                  }`}
                  onClick={() => navigate(`/homes/${home.id}`)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-lg ${isDarkMode ? "bg-blue-900/30" : "bg-blue-50"}`}>
                      <Home className="w-6 h-6 text-blue-600" />
                    </div>
                    {isOwner && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedHomeId(home.id);
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

                  <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                    {home.name}
                  </h3>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex gap-4 text-sm">
                      <div>
                        <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>Rooms</p>
                        <p className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                          {home.roomCount || 0}
                        </p>
                      </div>
                      <div>
                        <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>Devices</p>
                        <p className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                          {home.deviceCount || 0}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className={`w-5 h-5 group-hover:translate-x-1 transition-transform ${
                      isDarkMode ? "text-gray-500" : "text-gray-400"
                    }`} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Create Home Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`max-w-md w-full rounded-xl shadow-2xl p-6 ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          }`}>
            <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              Create New Home
            </h3>

            <input
              type="text"
              value={newHomeName}
              onChange={(e) => setNewHomeName(e.target.value)}
              placeholder="Enter home name"
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
                  setShowCreateModal(false);
                  setNewHomeName("");
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
                onClick={handleCreateHome}
                disabled={creatingHome}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
              >
                {creatingHome ? "Creating..." : "Create"}
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
              Delete Home?
            </h3>
            <p className={`mb-6 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              This action cannot be undone. All rooms and devices in this home will be deleted.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setSelectedHomeId(null);
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
                onClick={handleDeleteHome}
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

function HomeCard({ home, stats, onEdit, onDelete }: {
  home: HomeType;
  stats: any;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { isDarkMode, setSelectedHomeId } = useApp();

  const getHomeIcon = (type: string) => {
    return Home;
  };

  const Icon = getHomeIcon(home.icon);

  const getTypeColor = (type: HomeTypeEnum) => {
    const colors = {
      apartment: isDarkMode ? "bg-blue-900/30 text-blue-400" : "bg-blue-100 text-blue-700",
      house: isDarkMode ? "bg-green-900/30 text-green-400" : "bg-green-100 text-green-700",
      condo: isDarkMode ? "bg-purple-900/30 text-purple-400" : "bg-purple-100 text-purple-700",
      townhouse: isDarkMode ? "bg-orange-900/30 text-orange-400" : "bg-orange-100 text-orange-700",
      other: isDarkMode ? "bg-gray-700 text-gray-400" : "bg-gray-100 text-gray-700",
    };
    return colors[type];
  };

  return (
    <div
      className={`rounded-2xl border p-6 transition-all ${ 
        isDarkMode
          ? "bg-gray-800 border-gray-700"
          : "bg-white border-gray-200"
      }`}
    >
      {/* Top Section */}
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getTypeColor(home.type)}`}>
          <Icon className="w-6 h-6" />
        </div>
        {home.isDefault && (
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            isDarkMode ? "bg-green-900/30 text-green-400" : "bg-green-100 text-green-700"
          }`}>
            Default
          </span>
        )}
      </div>

      {/* Home Info */}
      <h3 className={`text-lg font-semibold mb-1 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
        {home.name}
      </h3>
      {home.address && (
        <p className={`text-sm mb-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
          {home.address}
        </p>
      )}

      {/* Stats Section */}
      <div className={`mb-4 p-3 rounded-lg ${isDarkMode ? "bg-gray-700/50" : "bg-gray-50"}`}>
        <div className={`text-xs font-semibold mb-2 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
          📊 STATS
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-blue-500" />
              <span className={isDarkMode ? "text-gray-300" : "text-gray-700"}>
                {stats.totalHubs} Hubs
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <span className="text-green-600">{stats.onlineHubs} online</span>
              {stats.offlineHubs > 0 && (
                <>
                  <span className={isDarkMode ? "text-gray-500" : "text-gray-400"}>•</span>
                  <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>{stats.offlineHubs} offline</span>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-purple-500" />
              <span className={isDarkMode ? "text-gray-300" : "text-gray-700"}>
                {stats.totalModules} Modules
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <span className="text-green-600">{stats.onlineModules} online</span>
              {stats.offlineModules > 0 && (
                <>
                  <span className={isDarkMode ? "text-gray-500" : "text-gray-400"}>•</span>
                  <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>{stats.offlineModules} offline</span>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Home className="w-4 h-4 text-gray-500" />
            <span className={isDarkMode ? "text-gray-300" : "text-gray-700"}>
              {home.roomCount} Rooms
            </span>
          </div>
        </div>
      </div>

      {/* Active Alerts */}
      {stats.alerts.length > 0 && (
        <div className={`mb-4 p-3 rounded-lg ${
          isDarkMode ? "bg-yellow-900/20 border border-yellow-700/50" : "bg-yellow-50 border border-yellow-200"
        }`}>
          <div className={`text-xs font-semibold mb-2 flex items-center gap-1 ${
            isDarkMode ? "text-yellow-400" : "text-yellow-700"
          }`}>
            <AlertTriangle className="w-3 h-3" />
            ACTIVE ALERTS
          </div>
          <div className="space-y-1">
            {stats.alerts.map((alert: string, index: number) => (
              <div key={index} className={`text-xs ${isDarkMode ? "text-yellow-300" : "text-yellow-700"}`}>
                • {alert}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={() => setSelectedHomeId(home.id)}
          className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
            isDarkMode
              ? "bg-blue-900/30 text-blue-400 hover:bg-blue-900/50"
              : "bg-blue-50 text-blue-600 hover:bg-blue-100"
          }`}
        >
          View Details
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className={`px-3 py-2 rounded-lg transition-colors ${
            isDarkMode
              ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <Edit2 className="w-4 h-4" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className={`px-3 py-2 rounded-lg transition-colors ${
            isDarkMode
              ? "bg-red-900/30 text-red-400 hover:bg-red-900/50"
              : "bg-red-50 text-red-600 hover:bg-red-100"
          }`}
          disabled={home.isDefault}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function HomeModal({ home, onClose, onSave }: {
  home: HomeType | null;
  onClose: () => void;
  onSave: (home: any) => void;
}) {
  const { isDarkMode } = useApp();
  const [formData, setFormData] = useState({
    name: home?.name || "",
    type: home?.type || "apartment" as HomeTypeEnum,
    address: home?.address || "",
    icon: home?.icon || "apartment",
    isDefault: home?.isDefault || false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(home ? { ...home, ...formData } : formData);
  };

  const homeTypes: { value: HomeTypeEnum; label: string }[] = [
    { value: "apartment", label: "Apartment" },
    { value: "house", label: "House" },
    { value: "condo", label: "Condo" },
    { value: "townhouse", label: "Townhouse" },
    { value: "other", label: "Other" },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        className={`w-full max-w-lg rounded-2xl p-6 ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
          {home ? "Edit Home" : "Add New Home"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Home Name */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
              Home Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., My Apartment, Vacation Home"
              required
              className={`w-full px-4 py-2.5 rounded-lg border ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
              }`}
            />
          </div>

          {/* Home Type */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
              Home Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as HomeTypeEnum })}
              className={`w-full px-4 py-2.5 rounded-lg border ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
            >
              {homeTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Address */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
              Address (Optional)
            </label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Enter full address"
              rows={3}
              className={`w-full px-4 py-2.5 rounded-lg border resize-y ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
              }`}
            />
          </div>

          {/* Set as Default */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isDefault"
              checked={formData.isDefault}
              onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
              className="w-4 h-4 text-blue-600 rounded"
            />
            <label
              htmlFor="isDefault"
              className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
            >
              Set as my default home
            </label>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 px-4 py-2.5 rounded-lg border transition-colors ${
                isDarkMode
                  ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!formData.name}
              className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            >
              {home ? "Save Changes" : "Save Home"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DeleteConfirmModal({ homeName, onConfirm, onCancel }: {
  homeName: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const { isDarkMode } = useApp();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        className={`w-full max-w-md rounded-2xl p-6 ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
          Delete Home
        </h2>
        <p className={`mb-6 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
          Are you sure you want to delete <strong>{homeName}</strong>? All rooms and devices in this home will also be deleted.
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className={`flex-1 px-4 py-2.5 rounded-lg border transition-colors ${
              isDarkMode
                ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                : "border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}