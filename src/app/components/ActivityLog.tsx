import { useState } from "react";
import {
  Calendar,
  Filter,
  Search,
  User,
  Bot,
  AlertTriangle,
  CheckCircle,
  XCircle,
  X,
  HardDrive,
  Cpu,
  Settings,
} from "lucide-react";
import { useApp } from "../contexts/AppContext";

type ActionType = "all" | "hub" | "module" | "automation" | "alert" | "system";
type DateRange = "today" | "week" | "month" | "all";

export function ActivityLog() {
  const { activities, isDarkMode } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState<DateRange>("week");
  const [actionFilter, setActionFilter] = useState<ActionType>("all");

  const filteredActivities = activities.filter((activity) => {
    // Determine activity category based on content
    let activityType: ActionType = "system";
    if (activity.action.toLowerCase().includes("hub")) {
      activityType = "hub";
    } else if (
      activity.action.toLowerCase().includes("temperature") ||
      activity.action.toLowerCase().includes("fan") ||
      activity.action.toLowerCase().includes("led") ||
      activity.action.toLowerCase().includes("module")
    ) {
      activityType = "module";
    } else if (activity.type === "automation") {
      activityType = "automation";
    } else if (activity.type === "alert") {
      activityType = "alert";
    }

    if (actionFilter !== "all" && activityType !== actionFilter) return false;
    if (searchQuery && !activity.action.toLowerCase().includes(searchQuery.toLowerCase()))
      return false;
    return true;
  });

  // Group by date
  const groupedActivities = filteredActivities.reduce(
    (acc, activity) => {
      if (!acc[activity.date]) {
        acc[activity.date] = [];
      }
      acc[activity.date].push(activity);
      return acc;
    },
    {} as Record<string, typeof activities>
  );

  // Further group by type within each date
  const getGroupedByType = (dayActivities: typeof activities) => {
    return {
      hub: dayActivities.filter(a => a.action.toLowerCase().includes("hub")),
      module: dayActivities.filter(a =>
        a.action.toLowerCase().includes("temperature") ||
        a.action.toLowerCase().includes("fan") ||
        a.action.toLowerCase().includes("led") ||
        a.action.toLowerCase().includes("module")
      ),
      automation: dayActivities.filter(a => a.type === "automation"),
      alert: dayActivities.filter(a => a.type === "alert"),
    };
  };

  if (activities.length === 0) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className={`rounded-xl border p-12 text-center ${
          isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}>
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
            <Calendar className="w-12 h-12 text-blue-600" />
          </div>
          <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
            No activity yet
          </h3>
          <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
            Actions you take will appear here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
          Activity History
        </h1>
        <p className={isDarkMode ? "text-gray-400 mt-1" : "text-gray-600 mt-1"}>
          View all hub, module, and system events
        </p>
      </div>

      {/* Filters */}
      <div className={`rounded-xl shadow-sm border p-4 ${
        isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      }`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="relative">
            <Calendar className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
              isDarkMode ? "text-gray-500" : "text-gray-400"
            }`} />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as DateRange)}
              className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
            >
              <option value="today">Today</option>
              <option value="week">Last 7 days</option>
              <option value="month">Last 30 days</option>
              <option value="all">All time</option>
            </select>
          </div>

          <div className="relative">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
              isDarkMode ? "text-gray-500" : "text-gray-400"
            }`} />
            <input
              type="text"
              placeholder="Search activities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
              }`}
            />
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex gap-2 flex-wrap">
          <FilterChip
            label="All"
            icon={Filter}
            active={actionFilter === "all"}
            onClick={() => setActionFilter("all")}
          />
          <FilterChip
            label="Hub Events"
            icon={HardDrive}
            active={actionFilter === "hub"}
            onClick={() => setActionFilter("hub")}
            color="blue"
          />
          <FilterChip
            label="Module Events"
            icon={Cpu}
            active={actionFilter === "module"}
            onClick={() => setActionFilter("module")}
            color="purple"
          />
          <FilterChip
            label="Automation"
            icon={Bot}
            active={actionFilter === "automation"}
            onClick={() => setActionFilter("automation")}
            color="green"
          />
          <FilterChip
            label="Alerts"
            icon={AlertTriangle}
            active={actionFilter === "alert"}
            onClick={() => setActionFilter("alert")}
            color="red"
          />
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-6">
        {Object.entries(groupedActivities).map(([date, dayActivities]) => {
          const grouped = getGroupedByType(dayActivities);

          return (
            <div key={date}>
              <h2 className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                {date}
              </h2>

              <div className="space-y-4">
                {/* Hub Events */}
                {grouped.hub.length > 0 && (
                  <EventGroup
                    title="HUB EVENTS"
                    icon={HardDrive}
                    color="blue"
                    events={grouped.hub}
                  />
                )}

                {/* Module Events */}
                {grouped.module.length > 0 && (
                  <EventGroup
                    title="MODULE EVENTS"
                    icon={Cpu}
                    color="purple"
                    events={grouped.module}
                  />
                )}

                {/* Automation Events */}
                {grouped.automation.length > 0 && (
                  <EventGroup
                    title="AUTOMATION EVENTS"
                    icon={Bot}
                    color="green"
                    events={grouped.automation}
                  />
                )}

                {/* Alerts */}
                {grouped.alert.length > 0 && (
                  <EventGroup
                    title="ALERTS"
                    icon={AlertTriangle}
                    color="red"
                    events={grouped.alert}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredActivities.length === 0 && (
        <div className={`rounded-xl border p-8 text-center ${
          isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}>
          <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
            No activities found matching your filters
          </p>
        </div>
      )}
    </div>
  );
}

function FilterChip({
  label,
  icon: Icon,
  active,
  onClick,
  color,
}: {
  label: string;
  icon: any;
  active: boolean;
  onClick: () => void;
  color?: "blue" | "purple" | "green" | "red";
}) {
  const { isDarkMode } = useApp();

  const colorClasses = {
    blue: active
      ? isDarkMode
        ? "bg-blue-900/50 text-blue-300 border-blue-700"
        : "bg-blue-100 text-blue-700 border-blue-300"
      : "",
    purple: active
      ? isDarkMode
        ? "bg-purple-900/50 text-purple-300 border-purple-700"
        : "bg-purple-100 text-purple-700 border-purple-300"
      : "",
    green: active
      ? isDarkMode
        ? "bg-green-900/50 text-green-300 border-green-700"
        : "bg-green-100 text-green-700 border-green-300"
      : "",
    red: active
      ? isDarkMode
        ? "bg-red-900/50 text-red-300 border-red-700"
        : "bg-red-100 text-red-700 border-red-300"
      : "",
  };

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border ${
        active
          ? color
            ? colorClasses[color]
            : isDarkMode
            ? "bg-blue-900/50 text-blue-300 border-blue-700"
            : "bg-blue-100 text-blue-700 border-blue-300"
          : isDarkMode
          ? "bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600"
          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}

function EventGroup({
  title,
  icon: Icon,
  color,
  events,
}: {
  title: string;
  icon: any;
  color: "blue" | "purple" | "green" | "red";
  events: any[];
}) {
  const { isDarkMode } = useApp();

  const colorClasses = {
    blue: isDarkMode ? "bg-blue-900/30 text-blue-400" : "bg-blue-50 text-blue-700",
    purple: isDarkMode ? "bg-purple-900/30 text-purple-400" : "bg-purple-50 text-purple-700",
    green: isDarkMode ? "bg-green-900/30 text-green-400" : "bg-green-50 text-green-700",
    red: isDarkMode ? "bg-red-900/30 text-red-400" : "bg-red-50 text-red-700",
  };

  return (
    <div className={`rounded-xl shadow-sm border ${
      isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
    }`}>
      <div className={`px-5 py-3 border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-lg ${colorClasses[color]} flex items-center justify-center`}>
            <Icon className="w-4 h-4" />
          </div>
          <span className={`text-sm font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
            {title}
          </span>
        </div>
      </div>
      <div className={`divide-y ${isDarkMode ? "divide-gray-700" : "divide-gray-200"}`}>
        {events.map((event) => (
          <ActivityItem key={event.id} activity={event} />
        ))}
      </div>
    </div>
  );
}

function ActivityItem({ activity }: { activity: any }) {
  const { isDarkMode } = useApp();

  return (
    <div className="px-5 py-4 flex items-start gap-3">
      <div className="flex-1">
        <p className={`font-medium ${isDarkMode ? "text-gray-200" : "text-gray-900"}`}>
          {activity.action}
        </p>
        {activity.detail && (
          <p className={`text-sm mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            {activity.detail}
          </p>
        )}
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        <span className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
          {activity.time}
        </span>
        {activity.success ? (
          <CheckCircle className="w-5 h-5 text-green-500" />
        ) : (
          <XCircle className="w-5 h-5 text-red-500" />
        )}
      </div>
    </div>
  );
}
