import { Bot, Plus, Pencil, Trash2, Lock, Clock, Calendar, HardDrive, Cpu, Play } from "lucide-react";
import { useState } from "react";
import { useApp, type AutomationRule } from "../contexts/AppContext";
import { useToast } from "../contexts/ToastContext";
import { CreateRuleModal } from "./CreateRuleModal";
import { DeleteRuleModal } from "./DeleteRuleModal";

type FilterType = "all" | "active" | "inactive";

export function Automation() {
  const { automationRules, toggleAutomationRule, isDarkMode, userRole, canCreateAutomation, getCurrentTemperature, temperatureSimulation, hubs, modules } = useApp();
  const { showToast } = useToast();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingRule, setEditingRule] = useState<AutomationRule | null>(null);
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; ruleId: string; ruleName: string }>({
    isOpen: false,
    ruleId: "",
    ruleName: "",
  });

  // Filter rules based on selected filter
  const filteredRules = automationRules.filter(rule => {
    if (filterType === "all") return true;
    if (filterType === "active") return rule.enabled;
    if (filterType === "inactive") return !rule.enabled;
    return true;
  });

  // DEMO-SIMULATION-REMOVE-LATER: Check if temperature-based rules should be triggered
  const checkRuleTriggered = (rule: AutomationRule): boolean => {
    if (!rule.enabled) return false;
    
    if (rule.conditionType === "temperature") {
      const currentTemp = getCurrentTemperature();
      const threshold = Number(rule.conditionValue);
      
      if (rule.conditionOperator === ">") {
        return currentTemp > threshold;
      } else if (rule.conditionOperator === "<") {
        return currentTemp < threshold;
      }
    }
    
    return false;
  };

  const handleToggle = (id: string, currentState: boolean) => {
    if (!canCreateAutomation) {
      showToast("Only owners can enable/disable automations", "error");
      return;
    }
    toggleAutomationRule(id);
    showToast(
      `Rule status updated`,
      "success"
    );
  };

  const handleAddRule = () => {
    if (!canCreateAutomation) {
      showToast("Only owners can create new automation rules", "error");
      return;
    }
    setShowCreateModal(true);
  };

  const handleEdit = (rule: AutomationRule) => {
    if (!canCreateAutomation) {
      showToast("Only owners can edit automation rules", "error");
      return;
    }
    setEditingRule(rule);
    setShowCreateModal(true);
  };

  const handleDelete = (ruleId: string, ruleName: string) => {
    if (!canCreateAutomation) {
      showToast("Only owners can delete automation rules", "error");
      return;
    }
    setDeleteModal({ isOpen: true, ruleId, ruleName });
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setEditingRule(null);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModal({ isOpen: false, ruleId: "", ruleName: "" });
  };

  // Calculate stats for each rule (mock data for now)
  const getRuleStats = (rule: AutomationRule) => {
    // Count affected hubs and modules based on rule
    const affectedHubs = 1; // Mock
    const affectedModules = 2; // Mock
    const lastRun = "Yesterday"; // Mock
    
    return { affectedHubs, affectedModules, lastRun };
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
        {canCreateAutomation && (
          <button 
            onClick={handleAddRule}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            <Plus className="w-4 h-4" />
            Create Rule
          </button>
        )}
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

      {/* Rules List */}
      {filteredRules.length === 0 ? (
        <div className={`rounded-xl border ${
          isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        } p-12 text-center`}>
          <Bot className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? "text-gray-600" : "text-gray-400"}`} />
          <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
            {filterType === "all" ? "No automation rules yet" : `No ${filterType} rules`}
          </h3>
          <p className={`mb-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            {filterType === "all" 
              ? "Create your first automation rule to get started"
              : `You don't have any ${filterType} rules`}
          </p>
          {canCreateAutomation && filterType === "all" && (
            <button
              onClick={handleAddRule}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Create Your First Rule
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRules.map((rule) => {
            const stats = getRuleStats(rule);
            const isTriggered = checkRuleTriggered(rule);
            
            return (
              <RuleCard
                key={rule.id}
                rule={rule}
                stats={stats}
                isTriggered={isTriggered}
                onToggle={handleToggle}
                onEdit={handleEdit}
                onDelete={handleDelete}
                canEdit={canCreateAutomation}
              />
            );
          })}
        </div>
      )}

      {/* Modals */}
      {showCreateModal && (
        <CreateRuleModal
          isOpen={showCreateModal}
          onClose={handleCloseModal}
          editingRule={editingRule}
        />
      )}

      {deleteModal.isOpen && (
        <DeleteRuleModal
          isOpen={deleteModal.isOpen}
          onClose={handleCloseDeleteModal}
          ruleId={deleteModal.ruleId}
          ruleName={deleteModal.ruleName}
        />
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

function RuleCard({
  rule,
  stats,
  isTriggered,
  onToggle,
  onEdit,
  onDelete,
  canEdit,
}: {
  rule: AutomationRule;
  stats: { affectedHubs: number; affectedModules: number; lastRun: string };
  isTriggered: boolean;
  onToggle: (id: string, currentState: boolean) => void;
  onEdit: (rule: AutomationRule) => void;
  onDelete: (id: string, name: string) => void;
  canEdit: boolean;
}) {
  const { isDarkMode } = useApp();

  return (
    <div className={`rounded-xl shadow-sm border ${
      isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
    }`}>
      {/* Header */}
      <div className={`p-5 border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bot className={`w-6 h-6 ${rule.enabled ? "text-blue-600" : "text-gray-400"}`} />
            <div>
              <h3 className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                {rule.name}
              </h3>
              {isTriggered && rule.enabled && (
                <div className="flex items-center gap-1 mt-1">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-xs text-green-600">Currently triggered</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggle(rule.id, rule.enabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                rule.enabled ? "bg-blue-600" : isDarkMode ? "bg-gray-700" : "bg-gray-200"
              } ${!canEdit ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={!canEdit}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  rule.enabled ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-5">
        {/* Condition and Action */}
        <div className="space-y-3 mb-4">
          <div>
            <div className={`text-xs font-medium mb-1 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
              IF:
            </div>
            <div className={`text-sm ${isDarkMode ? "text-gray-200" : "text-gray-900"}`}>
              {rule.condition}
            </div>
          </div>
          {rule.schedule && (
            <div>
              <div className={`text-xs font-medium mb-1 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                AND:
              </div>
              <div className={`text-sm ${isDarkMode ? "text-gray-200" : "text-gray-900"}`}>
                {rule.schedule.days && `Active on ${rule.schedule.days.join(", ")}`}
                {rule.schedule.startTime && rule.schedule.endTime && ` from ${rule.schedule.startTime} to ${rule.schedule.endTime}`}
              </div>
            </div>
          )}
          <div>
            <div className={`text-xs font-medium mb-1 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
              THEN:
            </div>
            <div className={`text-sm ${isDarkMode ? "text-gray-200" : "text-gray-900"}`}>
              {rule.action}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className={`flex items-center gap-4 text-xs py-3 border-t ${isDarkMode ? "border-gray-700 text-gray-400" : "border-gray-200 text-gray-600"}`}>
          <div className="flex items-center gap-1">
            <HardDrive className="w-3 h-3" />
            <span>Affects: {stats.affectedHubs} hubs</span>
          </div>
          <div className="flex items-center gap-1">
            <Cpu className="w-3 h-3" />
            <span>{stats.affectedModules} modules</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>Last run: {stats.lastRun}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-4">
          {canEdit && (
            <>
              <button
                onClick={() => onEdit(rule)}
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
                onClick={() => onDelete(rule.id, rule.name)}
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