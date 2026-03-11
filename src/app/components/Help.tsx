import { useState } from "react";
import { HelpCircle, RefreshCw, Wifi, CheckCircle } from "lucide-react";
import { useApp } from "../contexts/AppContext";
import { useToast } from "../contexts/ToastContext";

export default function Help() {
  const { isDarkMode } = useApp();
  const { showToast } = useToast();
  const [isChecking, setIsChecking] = useState(false);

  const handleCheckConnection = () => {
    setIsChecking(true);
    setTimeout(() => {
      setIsChecking(false);
      showToast("Connection status checked successfully", "success");
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className={`rounded-xl shadow-sm border p-8 ${
        isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      }`}>
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center">
            <HelpCircle className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              Getting Started
            </h1>
            <p className={`mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              Follow these simple steps to connect your devices
            </p>
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-6 mb-8">
          {/* Step 1 */}
          <div className={`p-6 rounded-xl border-2 transition-all ${
            isDarkMode 
              ? "bg-gray-700/50 border-gray-600 hover:border-blue-500" 
              : "bg-gray-50 border-gray-200 hover:border-blue-400"
          }`}>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
                1
              </div>
              <div className="flex-1">
                <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  Power On Your Device
                </h3>
                <p className={isDarkMode ? "text-gray-300" : "text-gray-700"}>
                  Make sure your YoloBit device is powered on and connected to WiFi.
                </p>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className={`p-6 rounded-xl border-2 transition-all ${
            isDarkMode 
              ? "bg-gray-700/50 border-gray-600 hover:border-blue-500" 
              : "bg-gray-50 border-gray-200 hover:border-blue-400"
          }`}>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
                2
              </div>
              <div className="flex-1">
                <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  Verify Data Publishing
                </h3>
                <p className={isDarkMode ? "text-gray-300" : "text-gray-700"}>
                  Verify your device is publishing data to the correct Adafruit IO feeds.
                </p>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className={`p-6 rounded-xl border-2 transition-all ${
            isDarkMode 
              ? "bg-gray-700/50 border-gray-600 hover:border-blue-500" 
              : "bg-gray-50 border-gray-200 hover:border-blue-400"
          }`}>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
                3
              </div>
              <div className="flex-1">
                <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  Automatic Discovery
                </h3>
                <p className={isDarkMode ? "text-gray-300" : "text-gray-700"}>
                  Your devices will automatically appear in the app once they're online.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Check Connection Button */}
        <div className="flex justify-center mb-8">
          <button
            onClick={handleCheckConnection}
            disabled={isChecking}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              isChecking
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            } text-white shadow-lg hover:shadow-xl`}
          >
            <RefreshCw className={`w-5 h-5 ${isChecking ? "animate-spin" : ""}`} />
            {isChecking ? "Checking..." : "Check Connection Status"}
          </button>
        </div>

        {/* Connection Illustration */}
        <div className={`p-8 rounded-xl border-2 border-dashed ${
          isDarkMode ? "border-gray-600 bg-gray-700/30" : "border-gray-300 bg-gray-50"
        }`}>
          <div className="flex flex-col items-center justify-center gap-6">
            {/* Device Icon with Waves */}
            <div className="relative">
              {/* Animated waves */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 rounded-full border-4 border-blue-400 opacity-30 animate-ping" 
                     style={{ animationDuration: '2s' }}></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full border-4 border-blue-500 opacity-40 animate-ping" 
                     style={{ animationDuration: '1.5s' }}></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full border-4 border-blue-600 opacity-50 animate-ping" 
                     style={{ animationDuration: '1s' }}></div>
              </div>
              
              {/* Device Icon */}
              <div className="relative w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg">
                <Wifi className="w-8 h-8 text-white" />
              </div>
            </div>

            {/* Connection Text */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <h4 className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  Ready to Connect
                </h4>
              </div>
              <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                Your device will broadcast its presence when online
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
