import { useState, useEffect, useCallback } from "react";
import { X, ChevronRight, ChevronLeft, Plus, Trash2, GitBranch, Zap, Clock, Timer } from "lucide-react";
import { useApp } from "../contexts/AppContext";
import type {
  TriggerTreeNode,
  TriggerNodeType,
  TriggerOperator,
  CreateAutomationRequest,
  AutomationDTO,
  Module,
} from "../types/api";
import { automationService } from "../api/services/automationService";

interface CreateAutomationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  editAutomation?: AutomationDTO | null;
}

const OPERATORS: { value: TriggerOperator; label: string }[] = [
  { value: "GREATER_THAN", label: "Greater than (>)" },
  { value: "GREATER_THAN_OR_EQUAL", label: "Greater or equal (>=)" },
  { value: "LESS_THAN", label: "Less than (<)" },
  { value: "LESS_THAN_OR_EQUAL", label: "Less or equal (<=)" },
  { value: "EQUAL", label: "Equal (=)" },
  { value: "NOT_EQUAL", label: "Not equal (!=)" },
];

const generateId = () => Math.random().toString(36).substr(2, 9);

interface TreeNodeWithId extends TriggerTreeNode {
  _id: string;
  children?: TreeNodeWithId[];
}

const addIdsToTree = (node: TriggerTreeNode): TreeNodeWithId => ({
  ...node,
  _id: generateId(),
  children: node.children?.map(addIdsToTree),
});

const removeIdsFromTree = (node: TreeNodeWithId): TriggerTreeNode => {
  const { _id, ...rest } = node;
  return {
    ...rest,
    children: node.children?.map(removeIdsFromTree),
  };
};

const createDefaultCondition = (): TreeNodeWithId => ({
  _id: generateId(),
  type: "CONDITION",
  moduleId: "",
  operator: "EQUAL",
  value: "",
});

const createDefaultGroup = (type: TriggerNodeType = "AND"): TreeNodeWithId => ({
  _id: generateId(),
  type,
  children: [createDefaultCondition()],
});

export function CreateAutomationModal({
  isOpen,
  onClose,
  onSuccess,
  editAutomation,
}: CreateAutomationModalProps) {
  const { rooms, devices, isDarkMode } = useApp();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Step 1: Basic Info
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [roomId, setRoomId] = useState("");
  const [enabled, setEnabled] = useState(true);
  const [scheduleType, setScheduleType] = useState<"NONE" | "CRON" | "INTERVAL">("NONE");
  const [cronExpression, setCronExpression] = useState("");
  const [intervalSeconds, setIntervalSeconds] = useState<number | "">("");

  // Step 2: Trigger Tree
  const [triggerTree, setTriggerTree] = useState<TreeNodeWithId>(createDefaultGroup("OR"));

  // Flatten modules from all devices
  const allModules: (Module & { deviceName: string; roomId: string | null })[] = devices.flatMap(
    (device) =>
      (device.modules || []).map((m) => ({
        ...m,
        deviceName: device.name,
        roomId: device.roomId,
      }))
  );

  // Filter modules by selected room (optional)
  const availableModules = roomId
    ? allModules.filter((m) => m.roomId === roomId)
    : allModules;

  // Reset form when modal opens/closes or edit changes
  useEffect(() => {
    if (isOpen) {
      if (editAutomation) {
        setName(editAutomation.name);
        setDescription(editAutomation.description);
        setRoomId(editAutomation.roomId);
        setEnabled(editAutomation.enabled);
        setScheduleType(editAutomation.scheduleType || "NONE");
        setCronExpression(editAutomation.cron || "");
        setIntervalSeconds(editAutomation.interval ?? "");
        setTriggerTree(addIdsToTree(editAutomation.triggerTree));
      } else {
        setName("");
        setDescription("");
        setRoomId("");
        setEnabled(true);
        setScheduleType("NONE");
        setCronExpression("");
        setIntervalSeconds("");
        setTriggerTree(createDefaultGroup("OR"));
      }
      setStep(1);
      setError(null);
    }
  }, [isOpen, editAutomation]);

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const updateNodeInTree = useCallback(
    (
      tree: TreeNodeWithId,
      nodeId: string,
      updater: (node: TreeNodeWithId) => TreeNodeWithId
    ): TreeNodeWithId => {
      if (tree._id === nodeId) {
        return updater(tree);
      }
      if (tree.children) {
        return {
          ...tree,
          children: tree.children.map((child) => updateNodeInTree(child, nodeId, updater)),
        };
      }
      return tree;
    },
    []
  );

  const deleteNodeFromTree = useCallback(
    (tree: TreeNodeWithId, nodeId: string): TreeNodeWithId | null => {
      if (tree._id === nodeId) {
        return null;
      }
      if (tree.children) {
        const newChildren = tree.children
          .map((child) => deleteNodeFromTree(child, nodeId))
          .filter((child): child is TreeNodeWithId => child !== null);
        return { ...tree, children: newChildren };
      }
      return tree;
    },
    []
  );

  const handleAddCondition = (parentId: string) => {
    setTriggerTree((prev) =>
      updateNodeInTree(prev, parentId, (node) => ({
        ...node,
        children: [...(node.children || []), createDefaultCondition()],
      }))
    );
  };

  const handleAddGroup = (parentId: string) => {
    setTriggerTree((prev) =>
      updateNodeInTree(prev, parentId, (node) => ({
        ...node,
        children: [...(node.children || []), createDefaultGroup("AND")],
      }))
    );
  };

  const handleDeleteNode = (nodeId: string) => {
    setTriggerTree((prev) => {
      const result = deleteNodeFromTree(prev, nodeId);
      return result || createDefaultGroup("OR");
    });
  };

  const handleUpdateNode = (nodeId: string, updates: Partial<TreeNodeWithId>) => {
    setTriggerTree((prev) =>
      updateNodeInTree(prev, nodeId, (node) => ({ ...node, ...updates }))
    );
  };

  const handleToggleGroupType = (nodeId: string) => {
    setTriggerTree((prev) =>
      updateNodeInTree(prev, nodeId, (node) => ({
        ...node,
        type: node.type === "AND" ? "OR" : "AND",
      }))
    );
  };

  const handleSave = async () => {
    setError(null);
    setIsSubmitting(true);

    try {
      const request: CreateAutomationRequest = {
        roomId,
        name,
        description,
        scheduleType,
        cron: scheduleType === "CRON" ? cronExpression : undefined,
        interval: scheduleType === "INTERVAL" && intervalSeconds !== "" ? Number(intervalSeconds) : undefined,
        triggerTree: removeIdsFromTree(triggerTree),
        enabled,
      };

      if (editAutomation) {
        await automationService.updateAutomation(editAutomation.id, request);
      } else {
        await automationService.createAutomation(request);
      }

      onSuccess?.();
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to save automation");
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceedStep1 = name.trim() && roomId;
  const canProceedStep2 = validateTriggerTree(triggerTree);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div
        className={`w-full max-w-3xl rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        {/* Header */}
        <div
          className={`sticky top-0 z-10 px-6 py-4 border-b flex items-center justify-between ${
            isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          }`}
        >
          <div>
            <h2 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              {editAutomation ? "Edit Automation" : "Create Automation"}
            </h2>
            <p className={`text-sm mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              Step {step} of 3
            </p>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode ? "hover:bg-gray-700 text-gray-400" : "hover:bg-gray-100 text-gray-600"
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="px-6 pt-4">
          <div className={`h-2 rounded-full ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6">
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  Basic Information
                </h3>
                <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                  Set up the basic details for your automation
                </p>
              </div>

              {/* Room Selection */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Room *
                </label>
                <select
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                >
                  <option value="">Select a room</option>
                  {rooms.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Name */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Turn on fan when hot"
                  className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                />
              </div>

              {/* Description */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what this automation does..."
                  rows={3}
                  className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                />
              </div>

              {/* Enabled Toggle */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setEnabled(!enabled)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    enabled ? "bg-blue-600" : isDarkMode ? "bg-gray-600" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      enabled ? "translate-x-7" : "translate-x-1"
                    }`}
                  />
                </button>
                <span className={isDarkMode ? "text-gray-300" : "text-gray-700"}>
                  {enabled ? "Enabled" : "Disabled"}
                </span>
              </div>

              {/* Schedule Type - Card Selection */}
              <div>
                <label className={`block text-sm font-medium mb-3 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Khi nào chạy automation?
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {/* Event-driven Option */}
                  <button
                    type="button"
                    onClick={() => setScheduleType("NONE")}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      scheduleType === "NONE"
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : isDarkMode
                        ? "border-gray-600 bg-gray-700 hover:border-gray-500"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${
                        scheduleType === "NONE" 
                          ? "bg-blue-100 text-blue-600 dark:bg-blue-800 dark:text-blue-300" 
                          : isDarkMode ? "bg-gray-600 text-gray-300" : "bg-gray-100 text-gray-500"
                      }`}>
                        <Zap className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className={`font-medium ${
                          scheduleType === "NONE" 
                            ? "text-blue-700 dark:text-blue-300" 
                            : isDarkMode ? "text-white" : "text-gray-900"
                        }`}>
                          Tự động theo điều kiện
                        </div>
                        <div className={`text-sm mt-0.5 ${
                          scheduleType === "NONE" 
                            ? "text-blue-600 dark:text-blue-400" 
                            : isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}>
                          Chạy ngay khi cảm biến thỏa điều kiện (khuyến nghị)
                        </div>
                      </div>
                      {scheduleType === "NONE" && (
                        <div className="text-blue-500">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </button>

                  {/* Cron Schedule Option */}
                  <button
                    type="button"
                    onClick={() => setScheduleType("CRON")}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      scheduleType === "CRON"
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : isDarkMode
                        ? "border-gray-600 bg-gray-700 hover:border-gray-500"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${
                        scheduleType === "CRON" 
                          ? "bg-blue-100 text-blue-600 dark:bg-blue-800 dark:text-blue-300" 
                          : isDarkMode ? "bg-gray-600 text-gray-300" : "bg-gray-100 text-gray-500"
                      }`}>
                        <Clock className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className={`font-medium ${
                          scheduleType === "CRON" 
                            ? "text-blue-700 dark:text-blue-300" 
                            : isDarkMode ? "text-white" : "text-gray-900"
                        }`}>
                          Theo lịch cố định
                        </div>
                        <div className={`text-sm mt-0.5 ${
                          scheduleType === "CRON" 
                            ? "text-blue-600 dark:text-blue-400" 
                            : isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}>
                          Ví dụ: Mỗi ngày lúc 6h sáng, mỗi thứ 2 lúc 8h...
                        </div>
                      </div>
                      {scheduleType === "CRON" && (
                        <div className="text-blue-500">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </button>

                  {/* Interval Option */}
                  <button
                    type="button"
                    onClick={() => setScheduleType("INTERVAL")}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      scheduleType === "INTERVAL"
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : isDarkMode
                        ? "border-gray-600 bg-gray-700 hover:border-gray-500"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${
                        scheduleType === "INTERVAL" 
                          ? "bg-blue-100 text-blue-600 dark:bg-blue-800 dark:text-blue-300" 
                          : isDarkMode ? "bg-gray-600 text-gray-300" : "bg-gray-100 text-gray-500"
                      }`}>
                        <Timer className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className={`font-medium ${
                          scheduleType === "INTERVAL" 
                            ? "text-blue-700 dark:text-blue-300" 
                            : isDarkMode ? "text-white" : "text-gray-900"
                        }`}>
                          Lặp lại định kỳ
                        </div>
                        <div className={`text-sm mt-0.5 ${
                          scheduleType === "INTERVAL" 
                            ? "text-blue-600 dark:text-blue-400" 
                            : isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}>
                          Ví dụ: Mỗi 30 giây, mỗi 5 phút...
                        </div>
                      </div>
                      {scheduleType === "INTERVAL" && (
                        <div className="text-blue-500">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </button>
                </div>
              </div>

              {/* Cron Expression (when CRON selected) */}
              {scheduleType === "CRON" && (
                <div className={`p-4 rounded-xl border ${isDarkMode ? "border-gray-600 bg-gray-700/50" : "border-blue-100 bg-blue-50/50"}`}>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Biểu thức Cron
                  </label>
                  <input
                    type="text"
                    value={cronExpression}
                    onChange={(e) => setCronExpression(e.target.value)}
                    placeholder="0 0 6 * * ?"
                    className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                  />
                  <div className={`mt-3 space-y-1 text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                    <p className="font-medium">Ví dụ:</p>
                    <p><code className="px-1 py-0.5 rounded bg-gray-200 dark:bg-gray-600">0 0 6 * * ?</code> = Mỗi ngày lúc 6:00 sáng</p>
                    <p><code className="px-1 py-0.5 rounded bg-gray-200 dark:bg-gray-600">0 0 */2 * * ?</code> = Mỗi 2 giờ</p>
                    <p><code className="px-1 py-0.5 rounded bg-gray-200 dark:bg-gray-600">0 0 8 * * MON</code> = Thứ Hai lúc 8:00</p>
                  </div>
                </div>
              )}

              {/* Interval Seconds (when INTERVAL selected) */}
              {scheduleType === "INTERVAL" && (
                <div className={`p-4 rounded-xl border ${isDarkMode ? "border-gray-600 bg-gray-700/50" : "border-blue-100 bg-blue-50/50"}`}>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Chạy mỗi bao nhiêu giây?
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min="1"
                      value={intervalSeconds}
                      onChange={(e) => setIntervalSeconds(e.target.value === "" ? "" : Number(e.target.value))}
                      placeholder="60"
                      className={`w-32 px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        isDarkMode
                          ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                    />
                    <span className={isDarkMode ? "text-gray-300" : "text-gray-600"}>giây</span>
                  </div>
                  <div className={`mt-3 space-y-1 text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                    <p className="font-medium">Gợi ý:</p>
                    <p>30 giây = kiểm tra thường xuyên</p>
                    <p>300 giây (5 phút) = kiểm tra vừa phải</p>
                    <p>3600 giây (1 giờ) = kiểm tra ít</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Trigger Tree Builder */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  Trigger Conditions
                </h3>
                <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                  Build conditions that trigger this automation. Use AND/OR groups to combine multiple conditions.
                </p>
              </div>

              <TriggerTreeBuilder
                node={triggerTree}
                modules={availableModules}
                isDarkMode={isDarkMode}
                isRoot
                onAddCondition={handleAddCondition}
                onAddGroup={handleAddGroup}
                onDelete={handleDeleteNode}
                onUpdate={handleUpdateNode}
                onToggleType={handleToggleGroupType}
              />
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  Review & Save
                </h3>
                <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                  Review your automation before saving
                </p>
              </div>

              {error && (
                <div className="p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg">
                  {error}
                </div>
              )}

              <div
                className={`p-6 rounded-xl border ${
                  isDarkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-200"
                }`}
              >
                <h4 className={`text-xl font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  {name || "Untitled Automation"}
                </h4>

                <div className="space-y-3">
                  <div>
                    <span className={`text-sm font-medium ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                      Room:
                    </span>
                    <span className={`ml-2 ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>
                      {rooms.find((r) => r.id === roomId)?.name || "Not selected"}
                    </span>
                  </div>

                  {description && (
                    <div>
                      <span className={`text-sm font-medium ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                        Description:
                      </span>
                      <span className={`ml-2 ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>
                        {description}
                      </span>
                    </div>
                  )}

                  <div>
                    <span className={`text-sm font-medium ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                      Status:
                    </span>
                    <span
                      className={`ml-2 px-2 py-0.5 rounded text-sm ${
                        enabled
                          ? "bg-green-100 text-green-700"
                          : isDarkMode
                          ? "bg-gray-600 text-gray-300"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {enabled ? "Enabled" : "Disabled"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                      Lịch chạy:
                    </span>
                    <span className={`inline-flex items-center gap-1.5 ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>
                      {scheduleType === "NONE" && (
                        <>
                          <Zap className="w-4 h-4 text-blue-500" />
                          Tự động theo điều kiện
                        </>
                      )}
                      {scheduleType === "CRON" && (
                        <>
                          <Clock className="w-4 h-4 text-blue-500" />
                          {cronExpression || "(chưa đặt)"}
                        </>
                      )}
                      {scheduleType === "INTERVAL" && (
                        <>
                          <Timer className="w-4 h-4 text-blue-500" />
                          Mỗi {intervalSeconds || "?"} giây
                        </>
                      )}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-300 dark:border-gray-600">
                  <span className={`text-sm font-medium ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                    Trigger Tree:
                  </span>
                  <div className="mt-2">
                    <TriggerTreePreview node={triggerTree} modules={allModules} isDarkMode={isDarkMode} />
                  </div>
                </div>

                {/* JSON Preview (collapsible) */}
                <details className="mt-4">
                  <summary
                    className={`cursor-pointer text-sm font-medium ${
                      isDarkMode ? "text-blue-400" : "text-blue-600"
                    }`}
                  >
                    View JSON payload
                  </summary>
                  <pre
                    className={`mt-2 p-3 rounded-lg text-xs overflow-auto max-h-48 ${
                      isDarkMode ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {JSON.stringify(
                      {
                        roomId,
                        name,
                        description,
                        scheduleType,
                        cron: scheduleType === "CRON" ? cronExpression : undefined,
                        interval: scheduleType === "INTERVAL" && intervalSeconds !== "" ? Number(intervalSeconds) : undefined,
                        triggerTree: removeIdsFromTree(triggerTree),
                        enabled,
                      },
                      null,
                      2
                    )}
                  </pre>
                </details>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className={`sticky bottom-0 px-6 py-4 border-t flex items-center justify-between ${
            isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          }`}
        >
          <button
            onClick={handleBack}
            disabled={step === 1}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              step === 1
                ? isDarkMode
                  ? "text-gray-600 cursor-not-allowed"
                  : "text-gray-400 cursor-not-allowed"
                : isDarkMode
                ? "text-gray-300 hover:bg-gray-700"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </button>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                isDarkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Cancel
            </button>
            {step < 3 ? (
              <button
                onClick={handleNext}
                disabled={(step === 1 && !canProceedStep1) || (step === 2 && !canProceedStep2)}
                className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors ${
                  (step === 1 && !canProceedStep1) || (step === 2 && !canProceedStep2)
                    ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                Next
                <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleSave}
                disabled={isSubmitting}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50"
              >
                {isSubmitting ? "Saving..." : editAutomation ? "Update" : "Create"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Validation helper
function validateTriggerTree(node: TreeNodeWithId): boolean {
  if (node.type === "CONDITION") {
    return !!(node.moduleId && node.operator && node.value);
  }
  if (node.children && node.children.length > 0) {
    return node.children.every(validateTriggerTree);
  }
  return false;
}

// Trigger Tree Builder Component
interface TriggerTreeBuilderProps {
  node: TreeNodeWithId;
  modules: (Module & { deviceName: string })[];
  isDarkMode: boolean;
  isRoot?: boolean;
  onAddCondition: (parentId: string) => void;
  onAddGroup: (parentId: string) => void;
  onDelete: (nodeId: string) => void;
  onUpdate: (nodeId: string, updates: Partial<TreeNodeWithId>) => void;
  onToggleType: (nodeId: string) => void;
}

function TriggerTreeBuilder({
  node,
  modules,
  isDarkMode,
  isRoot = false,
  onAddCondition,
  onAddGroup,
  onDelete,
  onUpdate,
  onToggleType,
}: TriggerTreeBuilderProps) {
  if (node.type === "CONDITION") {
    return (
      <div
        className={`p-4 rounded-lg border ${
          isDarkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-200"
        }`}
      >
        <div className="flex items-start gap-3">
          <div className="flex-1 grid grid-cols-3 gap-3">
            {/* Module Select */}
            <select
              value={node.moduleId || ""}
              onChange={(e) => onUpdate(node._id, { moduleId: e.target.value })}
              className={`px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isDarkMode
                  ? "bg-gray-600 border-gray-500 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
            >
              <option value="">Select module</option>
              {modules.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.deviceName})
                </option>
              ))}
            </select>

            {/* Operator Select */}
            <select
              value={node.operator || "EQUAL"}
              onChange={(e) => onUpdate(node._id, { operator: e.target.value as TriggerOperator })}
              className={`px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isDarkMode
                  ? "bg-gray-600 border-gray-500 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
            >
              {OPERATORS.map((op) => (
                <option key={op.value} value={op.value}>
                  {op.label}
                </option>
              ))}
            </select>

            {/* Value Input */}
            <input
              type="text"
              value={node.value || ""}
              onChange={(e) => onUpdate(node._id, { value: e.target.value })}
              placeholder="Value"
              className={`px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isDarkMode
                  ? "bg-gray-600 border-gray-500 text-white placeholder-gray-400"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
            />
          </div>

          <button
            onClick={() => onDelete(node._id)}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode ? "hover:bg-gray-600 text-red-400" : "hover:bg-gray-100 text-red-500"
            }`}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // AND/OR Group
  return (
    <div
      className={`p-4 rounded-lg border-2 ${
        isRoot
          ? isDarkMode
            ? "border-blue-500 bg-gray-750"
            : "border-blue-400 bg-blue-50"
          : isDarkMode
          ? "border-gray-600 bg-gray-700"
          : "border-gray-300 bg-gray-50"
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <GitBranch className={`w-4 h-4 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`} />
          <button
            onClick={() => onToggleType(node._id)}
            className={`px-3 py-1 rounded-full text-sm font-semibold transition-colors ${
              node.type === "AND"
                ? "bg-purple-100 text-purple-700 hover:bg-purple-200"
                : "bg-orange-100 text-orange-700 hover:bg-orange-200"
            }`}
          >
            {node.type}
          </button>
          <span className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
            (click to toggle)
          </span>
        </div>

        {!isRoot && (
          <button
            onClick={() => onDelete(node._id)}
            className={`p-1.5 rounded-lg transition-colors ${
              isDarkMode ? "hover:bg-gray-600 text-red-400" : "hover:bg-gray-200 text-red-500"
            }`}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="space-y-3 ml-4 border-l-2 border-dashed pl-4 border-gray-400">
        {node.children?.map((child) => (
          <TriggerTreeBuilder
            key={child._id}
            node={child}
            modules={modules}
            isDarkMode={isDarkMode}
            onAddCondition={onAddCondition}
            onAddGroup={onAddGroup}
            onDelete={onDelete}
            onUpdate={onUpdate}
            onToggleType={onToggleType}
          />
        ))}
      </div>

      <div className="flex gap-2 mt-3 ml-4">
        <button
          onClick={() => onAddCondition(node._id)}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            isDarkMode
              ? "bg-gray-600 text-gray-200 hover:bg-gray-500"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          <Plus className="w-4 h-4" />
          Add Condition
        </button>
        <button
          onClick={() => onAddGroup(node._id)}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            isDarkMode
              ? "bg-gray-600 text-gray-200 hover:bg-gray-500"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          <GitBranch className="w-4 h-4" />
          Add Group
        </button>
      </div>
    </div>
  );
}

// Trigger Tree Preview (read-only for Step 3)
interface TriggerTreePreviewProps {
  node: TreeNodeWithId;
  modules: (Module & { deviceName: string })[];
  isDarkMode: boolean;
  depth?: number;
}

function TriggerTreePreview({ node, modules, isDarkMode, depth = 0 }: TriggerTreePreviewProps) {
  const indent = depth * 16;

  if (node.type === "CONDITION") {
    const module = modules.find((m) => m.id === node.moduleId);
    const operatorLabel = OPERATORS.find((o) => o.value === node.operator)?.label || node.operator;

    return (
      <div style={{ marginLeft: indent }} className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
        <span className="font-medium">{module?.name || "Unknown module"}</span>{" "}
        <span className="text-gray-500">{operatorLabel}</span>{" "}
        <span className="font-medium">{node.value}</span>
      </div>
    );
  }

  return (
    <div style={{ marginLeft: indent }}>
      <div
        className={`text-sm font-semibold ${
          node.type === "AND" ? "text-purple-600" : "text-orange-600"
        }`}
      >
        {node.type}:
      </div>
      <div className="mt-1 space-y-1">
        {node.children?.map((child) => (
          <TriggerTreePreview
            key={child._id}
            node={child}
            modules={modules}
            isDarkMode={isDarkMode}
            depth={depth + 1}
          />
        ))}
      </div>
    </div>
  );
}
