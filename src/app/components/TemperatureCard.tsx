import { useState } from "react";
import { Thermometer, TestTube } from "lucide-react";
import { useApp } from "../contexts/AppContext";

export function TemperatureCard({ 
  value, 
  label, 
  status 
}: { 
  value: number; 
  label: string; 
  status: string;
}) {
  const { isDarkMode, temperatureSimulation, setTemperatureSimulation } = useApp();
  const [showSimulation, setShowSimulation] = useState(false);

  // DEMO-SIMULATION-REMOVE-LATER: Use simulated or real temperature
  const displayValue = temperatureSimulation.enabled ? temperatureSimulation.value : value;

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTemperatureSimulation({ ...temperatureSimulation, value: parseFloat(e.target.value) });
  };

  const incrementTemp = () => {
    setTemperatureSimulation({ 
      ...temperatureSimulation, 
      value: Math.min(35, temperatureSimulation.value + 0.5) 
    });
  };

  const decrementTemp = () => {
    setTemperatureSimulation({ 
      ...temperatureSimulation, 
      value: Math.max(15, temperatureSimulation.value - 0.5) 
    });
  };

  const toggleSimulation = () => {
    setTemperatureSimulation({ 
      ...temperatureSimulation, 
      enabled: !temperatureSimulation.enabled 
    });
  };

  const colorClasses = temperatureSimulation.enabled
    ? (isDarkMode ? "bg-purple-900/30 text-purple-400" : "bg-purple-50 text-purple-600")
    : (isDarkMode ? "bg-blue-900/30 text-blue-400" : "bg-blue-50 text-blue-600");

  return (
    <div className={`rounded-xl shadow-sm border p-5 ${
      isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
    }`}>
      {/* DEMO-SIMULATION-REMOVE-LATER: This entire component */}
      <div className="flex items-start justify-between mb-3">
        <div className={`w-12 h-12 rounded-lg ${colorClasses} flex items-center justify-center`}>
          <Thermometer className="w-6 h-6" />
        </div>
        <button
          onClick={() => setShowSimulation(!showSimulation)}
          className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-colors ${
            showSimulation
              ? "bg-purple-600 text-white"
              : isDarkMode
              ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <TestTube className="w-3 h-3" />
          {!showSimulation && <span>Test</span>}
        </button>
      </div>

      <div className="flex items-baseline gap-2">
        <div className={`text-3xl font-bold ${
          temperatureSimulation.enabled 
            ? "text-purple-500" 
            : isDarkMode ? "text-white" : "text-gray-900"
        }`}>
          {displayValue.toFixed(1)}°C
        </div>
        {temperatureSimulation.enabled && (
          <span className="px-2 py-0.5 bg-purple-500/20 text-purple-600 dark:text-purple-400 text-xs font-medium rounded-full">
            Simulating
          </span>
        )}
      </div>

      <div className={`text-sm font-medium mt-1 ${isDarkMode ? "text-gray-300" : "text-gray-900"}`}>
        {label}
      </div>
      <div className={`text-sm mt-1 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>
        {status}
      </div>

      {/* DEMO-SIMULATION-REMOVE-LATER: Simulation Control Panel */}
      {showSimulation && (
        <div className={`mt-4 pt-4 border-t ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
          <div className="space-y-4">
            {/* Enable Simulation Toggle */}
            <div className="flex items-center justify-between">
              <span className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                Enable Simulation Mode
              </span>
              <button
                onClick={toggleSimulation}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  temperatureSimulation.enabled ? "bg-purple-600" : isDarkMode ? "bg-gray-700" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    temperatureSimulation.enabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Temperature Controls - Only shown when simulation is enabled */}
            {temperatureSimulation.enabled && (
              <>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Set Temperature
                    </label>
                    <div className={`text-sm font-bold ${isDarkMode ? "text-purple-400" : "text-purple-600"}`}>
                      {temperatureSimulation.value.toFixed(1)}°C
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button
                      onClick={decrementTemp}
                      className={`w-9 h-9 rounded-full border-2 flex items-center justify-center font-bold text-lg transition-colors ${
                        isDarkMode
                          ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                          : "border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      −
                    </button>
                    
                    <div className="flex-1 relative pt-6">
                      <input
                        type="range"
                        min="15"
                        max="35"
                        step="0.5"
                        value={temperatureSimulation.value}
                        onChange={handleSliderChange}
                        className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
                      />
                      <div 
                        className="absolute -top-0 bg-purple-600 text-white text-xs font-semibold px-2 py-1 rounded shadow-lg pointer-events-none"
                        style={{
                          left: `${((temperatureSimulation.value - 15) / (35 - 15)) * 100}%`,
                          transform: 'translateX(-50%)'
                        }}
                      >
                        {temperatureSimulation.value.toFixed(1)}°C
                      </div>
                    </div>
                    
                    <button
                      onClick={incrementTemp}
                      className={`w-9 h-9 rounded-full border-2 flex items-center justify-center font-bold text-lg transition-colors ${
                        isDarkMode
                          ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                          : "border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className={`text-xs italic p-2 rounded ${
                  isDarkMode ? "bg-purple-900/20 text-purple-400" : "bg-purple-50 text-purple-700"
                }`}>
                  Simulated values override real sensor data for testing purposes only.
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}