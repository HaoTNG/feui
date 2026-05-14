import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import {
  ArrowLeft,
  Thermometer,
  Droplets,
  Sun,
  Fan,
  Lightbulb,
  Eye,
  Monitor,
  Cpu,
  Clock,
  User,
  Bot,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  Filter,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { useApp } from "../contexts/AppContext";
import { moduleService } from "../api/services/moduleService";
import type { ModuleDTO, CommandExecutionDTO, CommandSource, CommandStatus } from "../types/api";

type SourceFilter = "all" | "USER" | "AUTOMATION";
type StatusFilter = "all" | "SUCCESS" | "FAILED" | "PENDING";

export function ModuleDetail() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();
  const { isDarkMode } = useApp();

  const [module, setModule] = useState<ModuleDTO | null>(null);
  const [executions, setExecutions] = useState<CommandExecutionDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [executionsLoading, setExecutionsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  useEffect(() => {
    if (moduleId) {
      fetchModuleDetails();
      fetchCommandExecutions();
    }
  }, [moduleId]);

  const fetchModuleDetails = async () => {
    try {
      setLoading(true);
      const data = await moduleService.getModule(moduleId!);
      setModule(data);
    } catch (error) {
      console.error("Error fetching module details:", error);
      toast.error("Failed to load module details");
    } finally {
      setLoading(false);
    }
  };

  const fetchCommandExecutions = async () => {
    try {
      setExecutionsLoading(true);
      const data = await moduleService.getCommandExecutions(moduleId!);
      setExecutions(data);
    } catch (error) {
      console.error("Error fetching command executions:", error);
      toast.error("Failed to load command history");
    } finally {
      setExecutionsLoading(false);
    }
  };

  const getModuleIcon = (type: string) => {
    switch (type?.toUpperCase()) {
      case "TEMPERATURE":
        return { icon: Thermometer, color: "text-orange-500", bg: "bg-orange-100 dark:bg-orange-900/30" };
      case "HUMIDITY":
        return { icon: Droplets, color: "text-blue-500", bg: "bg-blue-100 dark:bg-blue-900/30" };
      case "LIGHT_SENSOR":
      case "LIGHT":
        return { icon: Sun, color: "text-yellow-500", bg: "bg-yellow-100 dark:bg-yellow-900/30" };
      case "FAN":
        return { icon: Fan, color: "text-cyan-500", bg: "bg-cyan-100 dark:bg-cyan-900/30" };
      case "LED":
        return { icon: Lightbulb, color: "text-purple-500", bg: "bg-purple-100 dark:bg-purple-900/30" };
      case "MOTION":
        return { icon: Eye, color: "text-green-500", bg: "bg-green-100 dark:bg-green-900/30" };
      case "LCD":
        return { icon: Monitor, color: "text-gray-500", bg: "bg-gray-100 dark:bg-gray-700" };
      default:
        return { icon: Cpu, color: "text-gray-500", bg: "bg-gray-100 dark:bg-gray-700" };
    }
  };

  const getStatusBadge = (status: CommandStatus) => {
    switch (status) {
      case "SUCCESS":
        return {
          icon: CheckCircle,
          text: "Success",
          className: isDarkMode
            ? "bg-green-900/30 text-green-400"
            : "bg-green-100 text-green-700",
        };
      case "FAILED":
        return {
          icon: XCircle,
          text: "Failed",
          className: isDarkMode
            ? "bg-red-900/30 text-red-400"
            : "bg-red-100 text-red-700",
        };
      case "PENDING":
        return {
          icon: AlertCircle,
          text: "Pending",
          className: isDarkMode
            ? "bg-yellow-900/30 text-yellow-400"
            : "bg-yellow-100 text-yellow-700",
        };
      default:
        return {
          icon: AlertCircle,
          text: status,
          className: isDarkMode
            ? "bg-gray-700 text-gray-400"
            : "bg-gray-100 text-gray-700",
        };
    }
  };

  const getSourceBadge = (source: CommandSource) => {
    if (source === "USER") {
      return {
        icon: User,
        text: "User",
        className: isDarkMode
          ? "bg-blue-900/30 text-blue-400"
          : "bg-blue-100 text-blue-700",
      };
    }
    return {
      icon: Bot,
      text: "Automation",
      className: isDarkMode
        ? "bg-purple-900/30 text-purple-400"
        : "bg-purple-100 text-purple-700",
    };
  };

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const filteredExecutions = executions.filter((exec) => {
    if (sourceFilter !== "all" && exec.source !== sourceFilter) return false;
    if (statusFilter !== "all" && exec.status !== statusFilter) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        exec.payload?.toLowerCase().includes(query) ||
        exec.errorMessage?.toLowerCase().includes(query)
      );
    }
    return true;
  });

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className={`rounded-xl border p-12 text-center ${
          isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}>
          <RefreshCw className={`w-12 h-12 mx-auto mb-4 animate-spin ${
            isDarkMode ? "text-gray-400" : "text-gray-500"
          }`} />
          <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
            Loading module details...
          </p>
        </div>
      </div>
    );
  }

  if (!module) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className={`rounded-xl border p-12 text-center ${
          isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}>
          <AlertCircle className={`w-12 h-12 mx-auto mb-4 ${
            isDarkMode ? "text-red-400" : "text-red-500"
          }`} />
          <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
            Module not found
          </h3>
          <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
            The module you're looking for doesn't exist or you don't have access.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const moduleIcon = getModuleIcon(module.type);
  const IconComponent = moduleIcon.icon;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className={`flex items-center gap-2 text-sm font-medium ${
          isDarkMode ? "text-gray-400 hover:text-gray-200" : "text-gray-600 hover:text-gray-900"
        }`}
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      {/* Module Info Card */}
      <div className={`rounded-xl shadow-sm border p-6 ${
        isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      }`}>
        <div className="flex items-start gap-4">
          <div className={`w-16 h-16 rounded-xl ${moduleIcon.bg} flex items-center justify-center`}>
            <IconComponent className={`w-8 h-8 ${moduleIcon.color}`} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                {module.name}
              </h1>
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                module.status === "ONLINE"
                  ? isDarkMode ? "bg-green-900/30 text-green-400" : "bg-green-100 text-green-700"
                  : isDarkMode ? "bg-gray-700 text-gray-400" : "bg-gray-100 text-gray-600"
              }`}>
                {module.status}
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div>
                <p className={`text-xs font-medium ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>Type</p>
                <p className={`text-sm font-semibold ${isDarkMode ? "text-gray-200" : "text-gray-900"}`}>
                  {module.type}
                </p>
              </div>
              <div>
                <p className={`text-xs font-medium ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>Current State</p>
                <p className={`text-sm font-semibold ${isDarkMode ? "text-gray-200" : "text-gray-900"}`}>
                  {module.state || "—"}
                </p>
              </div>
              <div>
                <p className={`text-xs font-medium ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>Device Channel ID</p>
                <p className={`text-xs font-mono ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                  {module.deviceChannelId || "—"}
                </p>
              </div>
              <div>
                <p className={`text-xs font-medium ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>Created At</p>
                <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  {formatDateTime(module.createdAt)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Command Execution History */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
            Command History
          </h2>
          <button
            onClick={fetchCommandExecutions}
            disabled={executionsLoading}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              isDarkMode
                ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${executionsLoading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {/* Filters */}
        <div className={`rounded-xl shadow-sm border p-4 ${
          isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px] relative">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
                isDarkMode ? "text-gray-500" : "text-gray-400"
              }`} />
              <input
                type="text"
                placeholder="Search by payload or error..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                }`}
              />
            </div>
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value as SourceFilter)}
              className={`px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
            >
              <option value="all">All Sources</option>
              <option value="USER">User</option>
              <option value="AUTOMATION">Automation</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              className={`px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
            >
              <option value="all">All Status</option>
              <option value="SUCCESS">Success</option>
              <option value="FAILED">Failed</option>
              <option value="PENDING">Pending</option>
            </select>
          </div>
        </div>

        {/* History Table */}
        {executionsLoading ? (
          <div className={`rounded-xl border p-8 text-center ${
            isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          }`}>
            <RefreshCw className={`w-8 h-8 mx-auto mb-3 animate-spin ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`} />
            <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
              Loading command history...
            </p>
          </div>
        ) : filteredExecutions.length === 0 ? (
          <div className={`rounded-xl border p-8 text-center ${
            isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          }`}>
            <Clock className={`w-12 h-12 mx-auto mb-4 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`} />
            <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              No command history
            </h3>
            <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
              {searchQuery || sourceFilter !== "all" || statusFilter !== "all"
                ? "No commands match your filters"
                : "No commands have been executed for this module yet"}
            </p>
          </div>
        ) : (
          <div className={`rounded-xl shadow-sm border overflow-hidden ${
            isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          }`}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={isDarkMode ? "bg-gray-700" : "bg-gray-50"}>
                  <tr>
                    <th className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    }`}>Time</th>
                    <th className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    }`}>Source</th>
                    <th className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    }`}>Payload</th>
                    <th className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    }`}>Status</th>
                    <th className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    }`}>Error</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDarkMode ? "divide-gray-700" : "divide-gray-200"}`}>
                  {filteredExecutions.map((exec) => {
                    const statusBadge = getStatusBadge(exec.status);
                    const sourceBadge = getSourceBadge(exec.source);
                    const StatusIcon = statusBadge.icon;
                    const SourceIcon = sourceBadge.icon;

                    return (
                      <tr key={exec.id} className={isDarkMode ? "hover:bg-gray-700/50" : "hover:bg-gray-50"}>
                        <td className={`px-6 py-4 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-900"}`}>
                          <div>
                            <div className="font-medium">{formatDateTime(exec.executedAt || exec.createdAt)}</div>
                            {exec.executedAt && exec.createdAt !== exec.executedAt && (
                              <div className={`text-xs ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>
                                Created: {formatDateTime(exec.createdAt)}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${sourceBadge.className}`}>
                            <SourceIcon className="w-3.5 h-3.5" />
                            {sourceBadge.text}
                          </span>
                        </td>
                        <td className={`px-6 py-4 text-sm font-mono ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                          <code className={`px-2 py-1 rounded text-xs ${
                            isDarkMode ? "bg-gray-700" : "bg-gray-100"
                          }`}>
                            {exec.payload || "—"}
                          </code>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusBadge.className}`}>
                            <StatusIcon className="w-3.5 h-3.5" />
                            {statusBadge.text}
                          </span>
                        </td>
                        <td className={`px-6 py-4 text-sm ${
                          exec.errorMessage
                            ? isDarkMode ? "text-red-400" : "text-red-600"
                            : isDarkMode ? "text-gray-500" : "text-gray-400"
                        }`}>
                          {exec.errorMessage || "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
