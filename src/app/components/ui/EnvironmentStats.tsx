import { Thermometer, Droplets, Sun } from "lucide-react";

interface EnvironmentStatsProps {
  temperature: number;
  humidity: number;
  lightLevel: number;
  variant?: "compact" | "pill" | "inline";
  isDarkMode?: boolean;
}

export function EnvironmentStats({ 
  temperature, 
  humidity, 
  lightLevel, 
  variant = "pill",
  isDarkMode = false 
}: EnvironmentStatsProps) {
  
  // Helper to get light status
  const getLightStatus = (lux: number) => {
    if (lux < 200) return "Dim";
    if (lux > 600) return "Bright";
    return "Normal";
  };

  // Helper to get temperature color gradient
  const getTempGradient = (temp: number) => {
    if (temp < 20) return isDarkMode ? "from-blue-900/50 to-cyan-900/50" : "from-blue-100 to-cyan-100";
    if (temp > 26) return isDarkMode ? "from-orange-900/50 to-red-900/50" : "from-orange-100 to-red-100";
    return isDarkMode ? "from-green-900/50 to-teal-900/50" : "from-green-100 to-teal-100";
  };

  if (variant === "inline") {
    // Compact inline format with separators
    return (
      <div className={`flex items-center gap-2 text-xs ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
        <div className="flex items-center gap-1">
          <Thermometer className="w-3 h-3" />
          <span>{temperature.toFixed(1)}°C</span>
        </div>
        <span className={isDarkMode ? "text-gray-600" : "text-gray-400"}>•</span>
        <div className="flex items-center gap-1">
          <Droplets className="w-3 h-3" />
          <span>{humidity}%</span>
        </div>
        <span className={isDarkMode ? "text-gray-600" : "text-gray-400"}>•</span>
        <div className="flex items-center gap-1">
          <Sun className="w-3 h-3" />
          <span>{lightLevel} lux</span>
        </div>
      </div>
    );
  }

  if (variant === "compact") {
    // Very compact version for room cards
    return (
      <div className="grid grid-cols-3 gap-2">
        <div className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-gradient-to-r ${getTempGradient(temperature)}`}>
          <Thermometer className={`w-3.5 h-3.5 ${isDarkMode ? "text-gray-200" : "text-gray-700"}`} />
          <span className={`text-xs font-medium ${isDarkMode ? "text-gray-100" : "text-gray-800"}`}>
            {temperature.toFixed(1)}°C
          </span>
        </div>
        
        <div className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg ${
          isDarkMode ? "bg-gradient-to-r from-cyan-900/50 to-blue-900/50" : "bg-gradient-to-r from-cyan-100 to-blue-100"
        }`}>
          <Droplets className={`w-3.5 h-3.5 ${isDarkMode ? "text-gray-200" : "text-gray-700"}`} />
          <span className={`text-xs font-medium ${isDarkMode ? "text-gray-100" : "text-gray-800"}`}>
            {humidity}%
          </span>
        </div>
        
        <div className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg ${
          isDarkMode ? "bg-gradient-to-r from-yellow-900/50 to-amber-900/50" : "bg-gradient-to-r from-yellow-100 to-amber-100"
        }`}>
          <Sun className={`w-3.5 h-3.5 ${isDarkMode ? "text-gray-200" : "text-gray-700"}`} />
          <span className={`text-xs font-medium ${isDarkMode ? "text-gray-100" : "text-gray-800"}`}>
            {lightLevel}
          </span>
        </div>
      </div>
    );
  }

  // Pill variant (default)
  return (
    <div className="flex items-center gap-2">
      <div 
        className={`group relative flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r ${getTempGradient(temperature)} transition-transform hover:scale-105 cursor-pointer`}
        title={`Temperature: ${temperature.toFixed(1)}°C`}
      >
        <Thermometer className={`w-3 h-3 ${isDarkMode ? "text-gray-200" : "text-gray-700"}`} />
        <span className={`text-xs font-medium ${isDarkMode ? "text-gray-100" : "text-gray-800"}`}>
          {temperature.toFixed(1)}°C
        </span>
      </div>
      
      <div 
        className={`group relative flex items-center gap-1.5 px-2.5 py-1 rounded-full ${
          isDarkMode ? "bg-gradient-to-r from-cyan-900/50 to-blue-900/50" : "bg-gradient-to-r from-cyan-100 to-blue-100"
        } transition-transform hover:scale-105 cursor-pointer`}
        title={`Humidity: ${humidity}%`}
      >
        <Droplets className={`w-3 h-3 ${isDarkMode ? "text-gray-200" : "text-gray-700"}`} />
        <span className={`text-xs font-medium ${isDarkMode ? "text-gray-100" : "text-gray-800"}`}>
          {humidity}%
        </span>
      </div>
      
      <div 
        className={`group relative flex items-center gap-1.5 px-2.5 py-1 rounded-full ${
          isDarkMode ? "bg-gradient-to-r from-yellow-900/50 to-amber-900/50" : "bg-gradient-to-r from-yellow-100 to-amber-100"
        } transition-transform hover:scale-105 cursor-pointer`}
        title={`Light Level: ${lightLevel} lux (${getLightStatus(lightLevel)})`}
      >
        <Sun className={`w-3 h-3 ${isDarkMode ? "text-gray-200" : "text-gray-700"}`} />
        <span className={`text-xs font-medium ${isDarkMode ? "text-gray-100" : "text-gray-800"}`}>
          {getLightStatus(lightLevel)}
        </span>
      </div>
    </div>
  );
}
