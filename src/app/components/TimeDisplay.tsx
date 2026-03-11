import { useState, useEffect } from "react";
import { Clock, ChevronDown } from "lucide-react";
import { useApp } from "../contexts/AppContext";

type Timezone = {
  name: string;
  offset: string;
};

const timezones: Timezone[] = [
  { name: "Local", offset: "auto" },
  { name: "New York", offset: "America/New_York" },
  { name: "London", offset: "Europe/London" },
  { name: "Tokyo", offset: "Asia/Tokyo" },
];

export function TimeDisplay() {
  const { isDarkMode } = useApp();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedTimezone, setSelectedTimezone] = useState(timezones[0]);
  const [showTimezones, setShowTimezones] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getTimeString = () => {
    if (selectedTimezone.offset === "auto") {
      return currentTime.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    }
    return currentTime.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: selectedTimezone.offset,
    });
  };

  const getDateString = () => {
    if (selectedTimezone.offset === "auto") {
      return currentTime.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
    return currentTime.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: selectedTimezone.offset,
    });
  };

  return (
    <div className="relative">
      <div
        className={`rounded-lg border p-4 inline-flex items-center gap-4 shadow-sm ${
          isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}
      >
        <Clock className={`w-6 h-6 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`} />
        <div>
          <div className={`font-mono text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
            {getTimeString()}
          </div>
          <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            {getDateString()}
          </div>
        </div>
        <button
          onClick={() => setShowTimezones(!showTimezones)}
          className={`p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
            isDarkMode ? "text-gray-400" : "text-gray-500"
          }`}
        >
          <ChevronDown className={`w-4 h-4 transition-transform ${showTimezones ? "rotate-180" : ""}`} />
        </button>
      </div>

      {/* Timezone Dropdown */}
      {showTimezones && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setShowTimezones(false)} />
          <div
            className={`absolute right-0 mt-2 w-48 rounded-lg border shadow-lg z-20 ${
              isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
            }`}
          >
            {timezones.map((tz) => (
              <button
                key={tz.name}
                onClick={() => {
                  setSelectedTimezone(tz);
                  setShowTimezones(false);
                }}
                className={`w-full text-left px-4 py-2 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                  selectedTimezone.name === tz.name
                    ? isDarkMode
                      ? "bg-blue-600 text-white"
                      : "bg-blue-500 text-white"
                    : isDarkMode
                    ? "text-gray-300 hover:bg-gray-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {tz.name}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
