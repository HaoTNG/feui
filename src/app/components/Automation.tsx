import { Bot, Plus, Pencil, Trash2, Clock, HardDrive, Cpu, Play, RefreshCw, AlertCircle } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useApp } from "../contexts/AppContext";
import { useToast } from "../contexts/ToastContext";
import { CreateAutomationModal } from "./CreateAutomationModal";
import { automationService } from "../api/services/automationService";
import type { AutomationDTO, TriggerTreeNode } from "../types/api";

type FilterType = "all" | "active" | "inactive";

export function Automation() {
  const { isDarkMode, userRole, canCreateAutomation, rooms } = useApp();
  const { showToast } = useToast();
  
  // API-driven state
  const [automations, setAutomations] = useState<AutomationDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingAutomation, setEditingAutomation] = useState<AutomationDTO | null>(null);
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string; name: string }>({
    isOpen: false,
    id: "",
    name: "",
  });
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch automations from API
  const fetchAutomations = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await automationService.getAllAutomations();
      setAutomations(data);
    } catch (err: any) {
      setError(err.message || "Failed to load automations");
      console.error("Failed to fetch automations:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAutomations();
  }, [fetchAutomations]);

  // Filter automations based on selected filter
  const filteredAutomations = automations.filter(automation => {
    if (filterType === "all") return true;
    if (filterType === "active") return automation.enabled;
    if (filterType === "inactive") return !automation.enabled;
    return true;
  });

  const handleToggle = async (id: string, currentState: boolean) => {
    if (!canCreateAutomation) {
      showToast("Only owners can enable/disable automations", "error");
      return;
    }
    
    try {
      await automationService.updateAutomation(id, { enabled: !currentState });
      setAutomations(prev => 
        prev.map(a => a.id === id ? { ...a, enabled: !currentState } : a)
      );
      showToast("Automation status updated", "success");
    } catch (err: any) {
      showToast(err.message || "Failed to update automation", "error");
    }
  };

  const handleAddRule = () => {
    if (!canCreateAutomation) {
      showToast("Only owners can create new automations", "error");
      return;
    }
    setEditingAutomation(null);
    setShowCreateModal(true);
  };

  const handleEdit = (automation: AutomationDTO) => {
    if (!canCreateAutomation) {
      showToast("Only owners can edit automations", "error");
      return;
    }
    setEditingAutomation(automation);
    setShowCreateModal(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (!canCreateAutomation) {
      showToast("Only owners can delete automations", "error");
      return;
    }
    setDeleteModal({ isOpen: true, id, name });
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      await automationService.deleteAutomation(deleteModal.id);
      setAutomations(prev => prev.filter(a => a.id !== deleteModal.id));
      showToast("Automation deleted successfully", "success");
      setDeleteModal({ isOpen: false, id: "", name: "" });
    } catch (err: any) {
      showToast(err.message || "Failed to delete automation", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setEditingAutomation(null);
  };

  const handleSuccess = () => {
    fetchAutomations();
    showToast(editingAutomation ? "Automation updated successfully" : "Automation created successfully", "success");
  };

  const handleCloseDeleteModal = () => {
    setDeleteModal({ isOpen: false, id: "", name: "" });
  };

  // Get room name helper
  const getRoomName = (roomId: string) => {
    return rooms.find(r => r.id === roomId)?.name || "Unknown Room";
  };

  // Count conditions in trigger tree
  const countConditions = (node: TriggerTreeNode): number => {
    if (node.type === "CONDITION") return 1;
    return (node.children || []).reduce((sum, child) => sum + countConditions(child), 0);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
            Automation Rules
          </h1>
          <p className={isDarkMode ? "text-gray-400 mt-1" : "text-gray-600 mt-1"}>
            {userRole === "owner" 
              ? "Automate your smart home with custom rules"
              : "View and use existing automation rules"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchAutomations}
            disabled={isLoading}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode ? "hover:bg-gray-700 text-gray-400" : "hover:bg-gray-100 text-gray-600"
            }`}
            title="Refresh"
          >
            <RefreshCw className={`w-5 h-5 ${isLoading ? "animate-spin" : ""}`} />
          </button>
          {canCreateAutomation && (
            <button 
              onClick={handleAddRule}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              <Plus className="w-4 h-4" />
              Create Automation
            </button>
          )}
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        <FilterButton
          label="All Rules"
          active={filterType === "all"}
          onClick={() => setFilterType("all")}
        />
        <FilterButton
          label="Active"
          active={filterType === "active"}
          onClick={() => setFilterType("active")}
        />
        <FilterButton
          label="Inactive"
          active={filterType === "inactive"}
          onClick={() => setFilterType("inactive")}
        />
      </div>

      {/* Error State */}
      {error && (
        <div className={`rounded-xl border p-4 flex items-center gap-3 ${
          isDarkMode ? "bg-red-900/20 border-red-800 text-red-400" : "bg-red-50 border-red-200 text-red-600"
        }`}>
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
          <button
            onClick={fetchAutomations}
            className="ml-auto px-3 py-1 rounded-lg bg-red-600 text-white text-sm hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading State */}
      {isLoading && !error && (
        <div className={`rounded-xl border ${
          isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        } p-12 text-center`}>
          <RefreshCw className={`w-12 h-12 mx-auto mb-4 animate-spin ${isDarkMode ? "text-gray-600" : "text-gray-400"}`} />
          <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>Loading automations...</p>
        </div>
      )}

      {/* Automations List */}
      {!isLoading && !error && filteredAutomations.length === 0 ? (
        <div className={`rounded-xl border ${
          isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        } p-12 text-center`}>
          <Bot className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? "text-gray-600" : "text-gray-400"}`} />
          <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
            {filterType === "all" ? "No automations yet" : `No ${filterType} automations`}
          </h3>
          <p className={`mb-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            {filterType === "all" 
              ? "Create your first automation to get started"
              : `You don't have any ${filterType} automations`}
          </p>
          {canCreateAutomation && filterType === "all" && (
            <button
              onClick={handleAddRule}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Create Your First Automation
            </button>
          )}
        </div>
      ) : !isLoading && !error && (
        <div className="space-y-4">
          {filteredAutomations.map((automation) => (
            <AutomationCard
              key={automation.id}
              automation={automation}
              roomName={getRoomName(automation.roomId)}
              conditionCount={countConditions(automation.triggerTree)}
              onToggle={handleToggle}
              onEdit={handleEdit}
              onDelete={handleDelete}
              canEdit={canCreateAutomation}
              isDarkMode={isDarkMode}
            />
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <CreateAutomationModal
        isOpen={showCreateModal}
        onClose={handleCloseModal}
        onSuccess={handleSuccess}
        editAutomation={editingAutomation}
      />

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className={`w-full max-w-md rounded-xl shadow-2xl p-6 ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          }`}>
            <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              Delete Automation
            </h3>
            <p className={`mb-6 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              Are you sure you want to delete "{deleteModal.name}"? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleCloseDeleteModal}
                disabled={isDeleting}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  isDarkMode
                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FilterButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  const { isDarkMode } = useApp();

  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
        active
          ? "bg-blue-600 text-white"
          : isDarkMode
          ? "bg-gray-700 text-gray-300 border border-gray-600 hover:bg-gray-600"
          : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
      }`}
    >
      {label}
    </button>
  );
}

function AutomationCard({
  automation,
  roomName,
  conditionCount,
  onToggle,
  onEdit,
  onDelete,
  canEdit,
  isDarkMode,
}: {
  automation: AutomationDTO;
  roomName: string;
  conditionCount: number;
  onToggle: (id: string, currentState: boolean) => void;
  onEdit: (automation: AutomationDTO) => void;
  onDelete: (id: string, name: string) => void;
  canEdit: boolean;
  isDarkMode: boolean;
}) {
  return (
    <div className={`rounded-xl shadow-sm border ${
      isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
    }`}>
      {/* Header */}
      <div className={`p-5 border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bot className={`w-6 h-6 ${automation.enabled ? "text-blue-600" : "text-gray-400"}`} />
            <div>
              <h3 className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                {automation.name}
              </h3>
              <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                {roomName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${
              automation.enabled
                ? "bg-green-100 text-green-700"
                : isDarkMode
                ? "bg-gray-700 text-gray-400"
                : "bg-gray-200 text-gray-600"
            }`}>
              {automation.enabled ? "Active" : "Inactive"}
            </span>
            <button
              onClick={() => onToggle(automation.id, automation.enabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                automation.enabled ? "bg-blue-600" : isDarkMode ? "bg-gray-700" : "bg-gray-200"
              } ${!canEdit ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={!canEdit}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  automation.enabled ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-5">
        {/* Description */}
        {automation.description && (
          <p className={`text-sm mb-4 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
            {automation.description}
          </p>
        )}

        {/* Trigger Tree Summary */}
        <div className="mb-4">
          <div className={`text-xs font-medium mb-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
            TRIGGER CONDITIONS:
          </div>
          <TriggerTreeSummary node={automation.triggerTree} isDarkMode={isDarkMode} />
        </div>

        {/* Stats */}
        <div className={`flex items-center gap-4 text-xs py-3 border-t ${isDarkMode ? "border-gray-700 text-gray-400" : "border-gray-200 text-gray-600"}`}>
          <div className="flex items-center gap-1">
            <Cpu className="w-3 h-3" />
            <span>{conditionCount} condition{conditionCount !== 1 ? "s" : ""}</span>
          </div>
          <div className="flex items-center gap-1">
            <HardDrive className="w-3 h-3" />
            <span>Room: {roomName}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>Updated: {new Date(automation.updatedAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-4">
          {canEdit && (
            <>
              <button
                onClick={() => onEdit(automation)}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-medium transition-colors ${
                  isDarkMode
                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Pencil className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={() => onDelete(automation.id, automation.name)}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-medium transition-colors ${
                  isDarkMode
                    ? "bg-red-900/30 text-red-400 hover:bg-red-900/50"
                    : "bg-red-50 text-red-600 hover:bg-red-100"
                }`}
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </>
          )}
          <button
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              isDarkMode
                ? "bg-blue-900/30 text-blue-400 hover:bg-blue-900/50"
                : "bg-blue-50 text-blue-600 hover:bg-blue-100"
            }`}
          >
            <Play className="w-4 h-4" />
            Run Now
          </button>
        </div>
      </div>
    </div>
  );
}

// Simple trigger tree summary display
function TriggerTreeSummary({ node, isDarkMode, depth = 0 }: { node: TriggerTreeNode; isDarkMode: boolean; depth?: number }) {
  const OPERATOR_LABELS: Record<string, string> = {
    GREATER_THAN: ">",
    GREATER_THAN_OR_EQUAL: ">=",
    LESS_THAN: "<",
    LESS_THAN_OR_EQUAL: "<=",
    EQUAL: "=",
    NOT_EQUAL: "!=",
  };

  if (node.type === "CONDITION") {
    return (
      <div className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`} style={{ marginLeft: depth * 16 }}>
        <span className="font-mono bg-gray-100 dark:bg-gray-700 px-1 rounded text-xs">
          Module {node.moduleId?.slice(0, 8)}...
        </span>{" "}
        <span className="text-blue-600 font-medium">{OPERATOR_LABELS[node.operator || ""] || node.operator}</span>{" "}
        <span className="font-medium">{node.value}</span>
      </div>
    );
  }

  return (
    <div style={{ marginLeft: depth * 16 }}>
      <span className={`text-xs font-bold px-2 py-0.5 rounded ${
        node.type === "AND" 
          ? "bg-purple-100 text-purple-700" 
          : "bg-orange-100 text-orange-700"
      }`}>
        {node.type}
      </span>
      <div className="mt-1 space-y-1 border-l-2 border-dashed border-gray-300 dark:border-gray-600 ml-2 pl-2">
        {node.children?.map((child, idx) => (
          <TriggerTreeSummary key={idx} node={child} isDarkMode={isDarkMode} depth={0} />
        ))}
      </div>
    </div>
  );
}