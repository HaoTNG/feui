import { TestTube } from "lucide-react";
import { useApp } from "../../contexts/AppContext";

export function TestModeIndicator() {
  const { temperatureSimulation, isDarkMode } = useApp();

  if (!temperatureSimulation.enabled) {
    return null;
  }

  // DEMO-SIMULATION-REMOVE-LATER: This entire component
  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
      isDarkMode ? "bg-purple-900/30 text-purple-400" : "bg-purple-100 text-purple-700"
    }`}>
      <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
      <TestTube className="w-3 h-3" />
      <span>Test Mode Active</span>
    </div>
  );
}