import { AlertCircle, X } from "lucide-react";
import { useApp } from "../contexts/AppContext";

interface DeleteRuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  ruleId: string;
  ruleName: string;
}

export function DeleteRuleModal({ isOpen, onClose, ruleId, ruleName }: DeleteRuleModalProps) {
  const { deleteAutomationRule, isDarkMode } = useApp();

  if (!isOpen) return null;

  const handleDelete = () => {
    deleteAutomationRule(ruleId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className={`w-full max-w-md rounded-xl shadow-2xl ${
        isDarkMode ? "bg-gray-800" : "bg-white"
      }`}>
        {/* Header */}
        <div className={`px-6 py-4 border-b flex items-center justify-between ${
          isDarkMode ? "border-gray-700" : "border-gray-200"
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <h2 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              Delete Automation Rule
            </h2>
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

        {/* Content */}
        <div className="px-6 py-6">
          <p className={isDarkMode ? "text-gray-300" : "text-gray-700"}>
            Are you sure you want to delete <span className="font-semibold">'{ruleName}'</span>? 
            This action cannot be undone.
          </p>
        </div>

        {/* Footer */}
        <div className={`px-6 py-4 border-t flex items-center justify-end gap-3 ${
          isDarkMode ? "border-gray-700" : "border-gray-200"
        }`}>
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              isDarkMode
                ? "text-gray-300 hover:bg-gray-700"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
