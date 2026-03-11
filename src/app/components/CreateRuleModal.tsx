import { useState } from "react";
import { X, Clock, Thermometer, Droplets, Sun, Activity, Power, Bell, ChevronRight, ChevronLeft } from "lucide-react";
import { useApp, type AutomationRule } from "../contexts/AppContext";

interface CreateRuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  editRule?: AutomationRule | null;
}

export function CreateRuleModal({ isOpen, onClose, editRule }: CreateRuleModalProps) {
  const { devices, addAutomationRule, updateAutomationRule, isDarkMode } = useApp();
  const [step, setStep] = useState(1);
  
  // Form state
  const [ruleName, setRuleName] = useState(editRule?.name || "");
  const [conditionType, setConditionType] = useState(editRule?.conditionType || "");
  const [conditionOperator, setConditionOperator] = useState(editRule?.conditionOperator || ">");
  const [conditionValue, setConditionValue] = useState<string | number>(editRule?.conditionValue || "");
  const [actionType, setActionType] = useState(editRule?.actionType || "");
  const [selectedDeviceId, setSelectedDeviceId] = useState(editRule?.deviceId || "");
  const [brightness, setBrightness] = useState(50);
  const [speed, setSpeed] = useState(2);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [hasSchedule, setHasSchedule] = useState(!!editRule?.schedule);
  const [startTime, setStartTime] = useState(editRule?.schedule?.startTime || "");
  const [endTime, setEndTime] = useState(editRule?.schedule?.endTime || "");
  const [selectedDays, setSelectedDays] = useState<string[]>(editRule?.schedule?.days || []);

  if (!isOpen) return null;

  const handleNext = () => {
    if (step < 5) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSave = () => {
    // Build condition string
    let conditionStr = "IF ";
    if (conditionType === "temperature") {
      conditionStr += `Temperature ${conditionOperator} ${conditionValue}°C`;
    } else if (conditionType === "humidity") {
      conditionStr += `Humidity ${conditionOperator} ${conditionValue}%`;
    } else if (conditionType === "light") {
      conditionStr += `Light level ${conditionOperator} ${conditionValue} lux`;
    } else if (conditionType === "motion") {
      conditionStr += "Motion detected";
    } else if (conditionType === "time") {
      conditionStr += `Time = ${conditionValue}`;
    } else if (conditionType === "device") {
      const device = devices.find(d => d.id === selectedDeviceId);
      conditionStr += `${device?.name} turns on`;
    }

    // Build action string
    let actionStr = "";
    const device = devices.find(d => d.id === selectedDeviceId);
    if (actionType === "turn_on") {
      actionStr = `Turn on ${device?.name}`;
      if (brightness !== 100) actionStr += ` (brightness ${brightness}%)`;
    } else if (actionType === "turn_off") {
      actionStr = `Turn off ${device?.name}`;
    } else if (actionType === "notification") {
      actionStr = `Send notification "${notificationMessage}"`;
    } else if (actionType === "adjust_brightness") {
      actionStr = `Set ${device?.name} brightness to ${brightness}%`;
    } else if (actionType === "set_speed") {
      actionStr = `Set ${device?.name} speed to ${speed}`;
    }

    const newRule: AutomationRule = {
      id: editRule?.id || Date.now().toString(),
      name: ruleName,
      condition: conditionStr,
      action: actionStr,
      enabled: editRule?.enabled ?? true,
      conditionType,
      conditionOperator,
      conditionValue,
      actionType,
      deviceId: selectedDeviceId,
      schedule: hasSchedule ? {
        startTime,
        endTime,
        days: selectedDays,
      } : undefined,
    };

    if (editRule) {
      updateAutomationRule(editRule.id, newRule);
    } else {
      addAutomationRule(newRule);
    }
    
    onClose();
  };

  const toggleDay = (day: string) => {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className={`w-full max-w-2xl rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto ${
        isDarkMode ? "bg-gray-800" : "bg-white"
      }`}>
        {/* Header */}
        <div className={`sticky top-0 px-6 py-4 border-b flex items-center justify-between ${
          isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}>
          <div>
            <h2 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              {editRule ? "Edit Rule" : "Create New Rule"}
            </h2>
            <p className={`text-sm mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              Step {step} of 5
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
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6">
          {/* Step 1: Rule Name */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  Name Your Rule
                </h3>
                <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                  Give your rule a descriptive name
                </p>
              </div>
              <input
                type="text"
                value={ruleName}
                onChange={(e) => setRuleName(e.target.value)}
                placeholder="Enter rule name (e.g., Hot weather fan)"
                className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              />
            </div>
          )}

          {/* Step 2: Condition */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  Set Condition (IF)
                </h3>
                <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                  Choose what triggers this rule
                </p>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Condition Type
                </label>
                <select
                  value={conditionType}
                  onChange={(e) => setConditionType(e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                >
                  <option value="">Select condition type</option>
                  <option value="temperature">Temperature (°C)</option>
                  <option value="humidity">Humidity (%)</option>
                  <option value="light">Light level (lux)</option>
                  <option value="motion">Motion detected</option>
                  <option value="time">Time (scheduling)</option>
                  <option value="device">Device status</option>
                </select>
              </div>

              {conditionType && conditionType !== "motion" && conditionType !== "device" && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Operator
                    </label>
                    <select
                      value={conditionOperator}
                      onChange={(e) => setConditionOperator(e.target.value)}
                      className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        isDarkMode
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                    >
                      <option value=">">Greater than (&gt;)</option>
                      <option value="<">Less than (&lt;)</option>
                      <option value="=">Equal to (=)</option>
                      <option value=">=">Greater or equal (≥)</option>
                      <option value="<=">Less or equal (≤)</option>
                    </select>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Value
                    </label>
                    {conditionType === "time" ? (
                      <input
                        type="time"
                        value={conditionValue}
                        onChange={(e) => setConditionValue(e.target.value)}
                        className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          isDarkMode
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-white border-gray-300 text-gray-900"
                        }`}
                      />
                    ) : (
                      <input
                        type="number"
                        value={conditionValue}
                        onChange={(e) => setConditionValue(e.target.value)}
                        placeholder="Enter value"
                        className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          isDarkMode
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-white border-gray-300 text-gray-900"
                        }`}
                      />
                    )}
                  </div>
                </div>
              )}

              {conditionType === "device" && (
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Select Device
                  </label>
                  <select
                    value={selectedDeviceId}
                    onChange={(e) => setSelectedDeviceId(e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                  >
                    <option value="">Select device</option>
                    {devices.map((device) => (
                      <option key={device.id} value={device.id}>
                        {device.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Action */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  Set Action (THEN)
                </h3>
                <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                  Choose what happens when the condition is met
                </p>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Action Type
                </label>
                <select
                  value={actionType}
                  onChange={(e) => setActionType(e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                >
                  <option value="">Select action type</option>
                  <option value="turn_on">Turn on device</option>
                  <option value="turn_off">Turn off device</option>
                  <option value="notification">Send notification</option>
                  <option value="adjust_brightness">Adjust brightness</option>
                  <option value="set_speed">Set fan speed</option>
                </select>
              </div>

              {(actionType === "turn_on" || actionType === "turn_off" || actionType === "adjust_brightness" || actionType === "set_speed") && (
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Select Device
                  </label>
                  <select
                    value={selectedDeviceId}
                    onChange={(e) => setSelectedDeviceId(e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                  >
                    <option value="">Select device</option>
                    {devices.filter(d => d.type === "light" || d.type === "fan" || d.type === "rgb-light").map((device) => (
                      <option key={device.id} value={device.id}>
                        {device.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {actionType === "adjust_brightness" && (
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Brightness: {brightness}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={brightness}
                    onChange={(e) => setBrightness(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              )}

              {actionType === "set_speed" && (
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Fan Speed
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3].map((s) => (
                      <button
                        key={s}
                        onClick={() => setSpeed(s)}
                        className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                          speed === s
                            ? "bg-blue-600 text-white"
                            : isDarkMode
                            ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        Speed {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {actionType === "notification" && (
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Notification Message
                  </label>
                  <textarea
                    value={notificationMessage}
                    onChange={(e) => setNotificationMessage(e.target.value)}
                    placeholder="Enter notification message"
                    rows={3}
                    className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                  />
                </div>
              )}
            </div>
          )}

          {/* Step 4: Schedule */}
          {step === 4 && (
            <div className="space-y-4">
              <div>
                <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  Schedule (Optional)
                </h3>
                <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                  Set time restrictions for this rule
                </p>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasSchedule}
                  onChange={(e) => setHasSchedule(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className={isDarkMode ? "text-gray-300" : "text-gray-700"}>
                  Apply time schedule to this rule
                </span>
              </label>

              {hasSchedule && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                        Start Time
                      </label>
                      <input
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          isDarkMode
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-white border-gray-300 text-gray-900"
                        }`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                        End Time
                      </label>
                      <input
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          isDarkMode
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-white border-gray-300 text-gray-900"
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Days of Week
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                        <button
                          key={day}
                          onClick={() => toggleDay(day)}
                          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            selectedDays.includes(day)
                              ? "bg-blue-600 text-white"
                              : isDarkMode
                              ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedDays(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"])}
                    className={`text-sm font-medium ${isDarkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-700"}`}
                  >
                    Repeat daily
                  </button>
                </>
              )}
            </div>
          )}

          {/* Step 5: Review */}
          {step === 5 && (
            <div className="space-y-4">
              <div>
                <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  Review and Save
                </h3>
                <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                  Review your automation rule
                </p>
              </div>

              <div className={`p-6 rounded-xl border ${isDarkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-200"}`}>
                <h4 className={`text-xl font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  {ruleName || "Untitled Rule"}
                </h4>
                <div className="space-y-2">
                  <p className={`font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    IF: {conditionType ? (
                      <>
                        {conditionType === "temperature" && `Temperature ${conditionOperator} ${conditionValue}°C`}
                        {conditionType === "humidity" && `Humidity ${conditionOperator} ${conditionValue}%`}
                        {conditionType === "light" && `Light level ${conditionOperator} ${conditionValue} lux`}
                        {conditionType === "motion" && "Motion detected"}
                        {conditionType === "time" && `Time = ${conditionValue}`}
                        {conditionType === "device" && `${devices.find(d => d.id === selectedDeviceId)?.name} turns on`}
                      </>
                    ) : "No condition set"}
                  </p>
                  <p className={`font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    THEN: {actionType ? (
                      <>
                        {actionType === "turn_on" && `Turn on ${devices.find(d => d.id === selectedDeviceId)?.name}`}
                        {actionType === "turn_off" && `Turn off ${devices.find(d => d.id === selectedDeviceId)?.name}`}
                        {actionType === "notification" && `Send notification "${notificationMessage}"`}
                        {actionType === "adjust_brightness" && `Set ${devices.find(d => d.id === selectedDeviceId)?.name} brightness to ${brightness}%`}
                        {actionType === "set_speed" && `Set ${devices.find(d => d.id === selectedDeviceId)?.name} speed to ${speed}`}
                      </>
                    ) : "No action set"}
                  </p>
                  {hasSchedule && (
                    <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                      Schedule: {selectedDays.length > 0 ? selectedDays.join(", ") : "No days selected"}
                      {startTime && endTime && ` (${startTime} - ${endTime})`}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`sticky bottom-0 px-6 py-4 border-t flex items-center justify-between ${
          isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}>
          <button
            onClick={handleBack}
            disabled={step === 1}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              step === 1
                ? isDarkMode ? "text-gray-600 cursor-not-allowed" : "text-gray-400 cursor-not-allowed"
                : isDarkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </button>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                isDarkMode
                  ? "text-gray-300 hover:bg-gray-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Cancel
            </button>
            {step < 5 ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                Next
                <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                Save Rule
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
