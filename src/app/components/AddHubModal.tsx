import { useState, useEffect } from "react";
import { useApp } from "../contexts/AppContext";
import { X, QrCode, Keyboard, Wifi, Server, Check, AlertCircle, Loader2, Search } from "lucide-react";
import type { Hub, Module } from "../contexts/AppContext";

interface AddHubModalProps {
  onClose: () => void;
}

type Tab = "qr" | "manual" | "discover";
type Step = "method" | "info" | "modules";
type VerificationState = "idle" | "verifying" | "verified" | "not-found" | "offline";

export function AddHubModal({ onClose }: AddHubModalProps) {
  const { addHub, addModule, rooms, selectedHomeId } = useApp();
  const [activeTab, setActiveTab] = useState<Tab>("qr");
  const [step, setStep] = useState<Step>("method");
  const [verificationState, setVerificationState] = useState<VerificationState>("idle");
  
  // Hub data
  const [hubId, setHubId] = useState("");
  const [hubName, setHubName] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("hub");
  
  // QR scanning
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  
  // Auto discover
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [discoveredHubs, setDiscoveredHubs] = useState<Array<{ id: string; location: string; isNew: boolean }>>([]);
  const [selectedDiscoveredHubs, setSelectedDiscoveredHubs] = useState<string[]>([]);
  
  // Module configuration
  const [moduleStates, setModuleStates] = useState({
    temperature: true,
    humidity: true,
    light: true,
    fan: true,
    led: true,
    pir: true,
    lcd: false,
  });

  // QR Code simulation
  useEffect(() => {
    if (activeTab === "qr" && step === "method" && !isScanning) {
      setIsScanning(true);
      const interval = setInterval(() => {
        setScanProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            // Simulate successful scan
            setTimeout(() => {
              setHubId("YB-7890XY");
              setVerificationState("verified");
            }, 300);
            return 100;
          }
          return prev + 10;
        });
      }, 200);
      return () => clearInterval(interval);
    }
  }, [activeTab, step, isScanning]);

  // Auto discover simulation
  useEffect(() => {
    if (activeTab === "discover" && step === "method" && !isDiscovering) {
      setIsDiscovering(true);
      setTimeout(() => {
        setDiscoveredHubs([
          { id: "YB-2415A7", location: "Living Room", isNew: false },
          { id: "YB-9988DD", location: "Unknown location", isNew: true },
          { id: "YB-1122EE", location: "Unknown location", isNew: true },
        ]);
        setIsDiscovering(false);
      }, 3000);
    }
  }, [activeTab, step, isDiscovering]);

  const handleVerifyHub = () => {
    if (!hubId.trim()) return;
    
    setVerificationState("verifying");
    
    // Simulate API call
    setTimeout(() => {
      // Random verification result for demo
      const random = Math.random();
      if (random > 0.7) {
        setVerificationState("not-found");
      } else if (random > 0.4) {
        setVerificationState("verified");
      } else {
        setVerificationState("offline");
      }
    }, 1500);
  };

  const handleContinueToInfo = () => {
    setStep("info");
  };

  const handleContinueToModules = () => {
    if (!hubName.trim() || !selectedRoom) {
      alert("Please fill in hub name and room");
      return;
    }
    setStep("modules");
  };

  const handleSaveHub = () => {
    if (!selectedHomeId) return;

    const newHub: Hub = {
      id: hubId,
      name: hubName,
      homeId: selectedHomeId,
      room: selectedRoom,
      status: "online",
      icon: selectedIcon,
      firmwareVersion: "v2.1.0",
      ipAddress: "192.168.1.103",
      macAddress: "84:CC:A8:12:34:59",
      wifiSignal: 88,
      connectedSince: new Date(),
      lastSeen: new Date(),
      moduleCount: Object.values(moduleStates).filter(Boolean).length,
      onlineModuleCount: Object.values(moduleStates).filter(Boolean).length,
      addedDate: new Date(),
    };

    addHub(newHub);

    // Add enabled modules
    const moduleTypes: Array<{ type: any; name: string; feed: string }> = [
      { type: "temperature", name: "Temperature Sensor", feed: "temperature" },
      { type: "humidity", name: "Humidity Sensor", feed: "humidity" },
      { type: "light-sensor", name: "Light Sensor", feed: "light" },
      { type: "fan", name: "Fan", feed: "fan" },
      { type: "led", name: "RGB LED", feed: "led" },
      { type: "pir-motion", name: "PIR Motion Sensor", feed: "pir" },
      { type: "lcd-display", name: "LCD Display", feed: "lcd" },
    ];

    moduleTypes.forEach(({ type, name, feed }) => {
      if (moduleStates[type as keyof typeof moduleStates]) {
        const module: Module = {
          id: `mod-${type}-${hubId}`,
          name: `${selectedRoom} ${name}`,
          type,
          hubId: hubId,
          room: selectedRoom,
          homeId: selectedHomeId,
          status: "online",
          feed,
          lastSeen: new Date(),
        };

        // Add default values for sensors
        if (type === "temperature") module.temperature = 24.0;
        if (type === "humidity") module.humidity = 60;
        if (type === "light-sensor") module.lux = 400;
        if (type === "fan") {
          module.isOn = false;
          module.speed = 0;
        }
        if (type === "led") {
          module.isOn = false;
          module.brightness = 0;
        }
        if (type === "pir-motion") module.motion = false;

        addModule(module);
      }
    });

    onClose();
  };

  const renderMethodStep = () => {
    if (activeTab === "qr") {
      return (
        <div className="text-center">
          <div className="relative mx-auto w-80 h-80 bg-gray-900 rounded-2xl overflow-hidden mb-4">
            {/* Camera viewfinder */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-64 h-64 border-2 border-white rounded-xl relative">
                {/* Corner markers */}
                <div className="absolute top-0 left-0 w-8 h-8 border-l-4 border-t-4 border-blue-500" />
                <div className="absolute top-0 right-0 w-8 h-8 border-r-4 border-t-4 border-blue-500" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-l-4 border-b-4 border-blue-500" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-r-4 border-b-4 border-blue-500" />
                
                {/* Scanning line */}
                {scanProgress < 100 && (
                  <div
                    className="absolute left-0 right-0 h-1 bg-blue-500 shadow-lg shadow-blue-500/50 transition-all duration-200"
                    style={{ top: `${scanProgress}%` }}
                  />
                )}
                
                {/* Success state */}
                {scanProgress === 100 && verificationState === "verified" && (
                  <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                    <div className="bg-green-500 rounded-full p-4">
                      <Check className="w-12 h-12 text-white" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {verificationState === "verified" ? (
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-green-600 mb-2">
                <Check className="w-5 h-5" />
                <p className="font-medium">Found YoloBit Hub: {hubId}</p>
              </div>
              <p className="text-sm text-gray-500 mb-4">QR code contains hub ID and authentication info</p>
              <button
                onClick={handleContinueToInfo}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Continue
              </button>
            </div>
          ) : (
            <p className="text-sm text-gray-400">Position QR code on YoloBit in frame</p>
          )}
        </div>
      );
    }
    
    if (activeTab === "manual") {
      return (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hub ID / Serial Number
          </label>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={hubId}
              onChange={(e) => setHubId(e.target.value)}
              placeholder="Enter ID printed on YoloBit (e.g., YB-2415A7, YOLO-001)"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleVerifyHub}
              disabled={!hubId.trim() || verificationState === "verifying"}
              className="flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {verificationState === "verifying" ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Search className="w-5 h-5" />
              )}
              Verify
            </button>
          </div>

          <p className="text-xs text-gray-500 mb-4">
            Hub ID is printed on the YoloBit device label (format: YB-XXXXX) or use any name you prefer to identify this hub.
          </p>

          {/* Verification Status */}
          {verificationState === "verifying" && (
            <div className="flex items-center gap-2 p-4 bg-blue-50 rounded-lg">
              <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
              <span className="text-blue-600">Checking hub...</span>
            </div>
          )}

          {verificationState === "verified" && (
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 text-green-600 mb-2">
                <Check className="w-5 h-5" />
                <span className="font-medium">YoloBit Hub {hubId} found and online</span>
              </div>
              <p className="text-sm text-green-700 mb-2">
                Firmware v2.1.0 • WiFi connected • 6 modules available
              </p>
              <p className="text-xs text-green-600">Currently online</p>
              <button
                onClick={handleContinueToInfo}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Continue
              </button>
            </div>
          )}

          {verificationState === "not-found" && (
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center gap-2 text-red-600 mb-2">
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium">No hub found with ID '{hubId}'</span>
              </div>
              <p className="text-sm text-red-600">Check the ID on the device label and try again</p>
            </div>
          )}

          {verificationState === "offline" && (
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-center gap-2 text-yellow-700 mb-2">
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium">Hub found but offline</span>
              </div>
              <p className="text-sm text-yellow-700 mb-3">Last seen 3 days ago</p>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
                <span className="text-sm text-gray-700">Add anyway? It will appear when online</span>
              </label>
              <button
                onClick={handleContinueToInfo}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Continue
              </button>
            </div>
          )}
        </div>
      );
    }
    
    if (activeTab === "discover") {
      return (
        <div>
          {isDiscovering ? (
            <div className="text-center py-12">
              <div className="relative w-20 h-20 mx-auto mb-4">
                <div className="absolute inset-0 border-4 border-blue-200 rounded-full animate-ping" />
                <div className="absolute inset-0 border-4 border-blue-600 rounded-full animate-pulse" />
                <Wifi className="absolute inset-0 m-auto w-10 h-10 text-blue-600" />
              </div>
              <p className="text-gray-600">Scanning network for YoloBit hubs...</p>
            </div>
          ) : (
            <div>
              <p className="text-sm text-gray-600 mb-4">Select hubs to add:</p>
              <div className="space-y-2 mb-4">
                {discoveredHubs.map((hub) => (
                  <label
                    key={hub.id}
                    className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                      hub.isNew
                        ? "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
                        : "border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed"
                    }`}
                  >
                    <input
                      type="checkbox"
                      disabled={!hub.isNew}
                      checked={selectedDiscoveredHubs.includes(hub.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedDiscoveredHubs([...selectedDiscoveredHubs, hub.id]);
                        } else {
                          setSelectedDiscoveredHubs(selectedDiscoveredHubs.filter((id) => id !== hub.id));
                        }
                      }}
                      className="w-4 h-4 text-blue-600 rounded disabled:opacity-50"
                    />
                    <Server className="w-5 h-5 text-gray-600" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{hub.id}</span>
                        {hub.isNew ? (
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                            NEW
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-gray-200 text-gray-600 text-xs rounded-full">
                            Already configured
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{hub.location}</p>
                    </div>
                  </label>
                ))}
              </div>
              <button
                onClick={() => {
                  if (selectedDiscoveredHubs.length > 0) {
                    setHubId(selectedDiscoveredHubs[0]);
                    handleContinueToInfo();
                  }
                }}
                disabled={selectedDiscoveredHubs.length === 0}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Add Selected Hubs ({selectedDiscoveredHubs.length})
              </button>
            </div>
          )}
        </div>
      );
    }
  };

  const renderInfoStep = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Give this hub a friendly name
        </label>
        <input
          type="text"
          value={hubName}
          onChange={(e) => setHubName(e.target.value)}
          placeholder="e.g., Living Room Hub, Kitchen Hub"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Assign to room
        </label>
        <select
          value={selectedRoom}
          onChange={(e) => setSelectedRoom(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select a room</option>
          {rooms.map((room) => (
            <option key={room.id} value={room.name}>
              {room.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Choose hub icon
        </label>
        <div className="grid grid-cols-4 gap-3">
          {["hub", "server", "wifi", "home"].map((icon) => (
            <button
              key={icon}
              onClick={() => setSelectedIcon(icon)}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedIcon === icon
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <Server className="w-8 h-8 mx-auto text-gray-600" />
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleContinueToModules}
        className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Continue to Module Configuration
      </button>
    </div>
  );

  const renderModulesStep = () => (
    <div>
      <p className="text-sm text-gray-600 mb-4">
        Select which modules are connected to this YoloBit hub
      </p>
      
      <div className="space-y-3 mb-6">
        {[
          { key: "temperature", name: "Temperature Sensor", feed: "temperature", icon: "🌡️" },
          { key: "humidity", name: "Humidity Sensor", feed: "humidity", icon: "💧" },
          { key: "light", name: "Light Sensor", feed: "light", icon: "☀️" },
          { key: "fan", name: "Fan", feed: "fan", icon: "🔄" },
          { key: "led", name: "RGB LED", feed: "led", icon: "💡" },
          { key: "pir", name: "PIR Motion Sensor", feed: "pir", icon: "👁️" },
          { key: "lcd", name: "LCD Display", feed: "lcd", icon: "📟" },
        ].map(({ key, name, feed, icon }) => (
          <label
            key={key}
            className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
          >
            <span className="text-2xl">{icon}</span>
            <div className="flex-1">
              <p className="font-medium text-gray-900">{name}</p>
              <p className="text-sm text-gray-500">feed: {feed}</p>
            </div>
            <div className="relative inline-block w-12 h-6">
              <input
                type="checkbox"
                checked={moduleStates[key as keyof typeof moduleStates]}
                onChange={(e) =>
                  setModuleStates({ ...moduleStates, [key]: e.target.checked })
                }
                className="sr-only peer"
              />
              <div className="w-12 h-6 bg-gray-300 rounded-full peer-checked:bg-blue-600 transition-colors" />
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-6" />
            </div>
          </label>
        ))}
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleSaveHub}
          className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Save Configuration
        </button>
        <button
          onClick={handleSaveHub}
          className="px-4 py-3 text-gray-600 hover:text-gray-800"
        >
          Skip - Configure Later
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Server className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              {step === "method"
                ? "Add New YoloBit Hub"
                : step === "info"
                ? "Hub Information"
                : "Configure Modules"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === "method" && (
            <>
              {/* Tabs */}
              <div className="flex gap-2 mb-6 border-b border-gray-200">
                <button
                  onClick={() => {
                    setActiveTab("qr");
                    setVerificationState("idle");
                    setIsScanning(false);
                    setScanProgress(0);
                  }}
                  className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                    activeTab === "qr"
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <QrCode className="w-5 h-5" />
                  QR Code
                </button>
                <button
                  onClick={() => {
                    setActiveTab("manual");
                    setVerificationState("idle");
                  }}
                  className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                    activeTab === "manual"
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Keyboard className="w-5 h-5" />
                  Manual Entry
                </button>
                <button
                  onClick={() => {
                    setActiveTab("discover");
                    setIsDiscovering(false);
                    setDiscoveredHubs([]);
                  }}
                  className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                    activeTab === "discover"
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Wifi className="w-5 h-5" />
                  Auto Discover
                </button>
              </div>

              {renderMethodStep()}
            </>
          )}

          {step === "info" && renderInfoStep()}
          {step === "modules" && renderModulesStep()}
        </div>
      </div>
    </div>
  );
}
