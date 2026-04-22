import { Thermometer, Droplets, Lightbulb, AlertCircle } from 'lucide-react';
import { useSensorData } from '../hooks/useSensorData';
import type { ModuleType } from '../types/api';

export interface SensorCardProps {
  type: ModuleType;
  value?: number | boolean | string;
  label?: string;
  isDarkMode?: boolean;
}

/**
 * Temperature Sensor Card
 */
export function TemperatureSensorCard({ value, isDarkMode = false }: SensorCardProps) {
  const temp = useSensorData({ type: 'TEMPERATURE', value: typeof value === 'number' ? value : parseFloat(String(value || 0)) });

  const isWarning = temp.warning !== null;
  const bgColor = isWarning
    ? isDarkMode ? 'bg-red-900/20' : 'bg-red-50'
    : isDarkMode ? 'bg-blue-900/20' : 'bg-blue-50';
  const textColor = isWarning
    ? 'text-red-600'
    : isDarkMode ? 'text-blue-400' : 'text-blue-600';

  return (
    <div className={`rounded-lg border p-4 ${bgColor}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Thermometer className={`w-6 h-6 ${textColor}`} />
          <div>
            <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Temperature
            </p>
            <p className={`text-2xl font-bold ${textColor}`}>{temp.displayValue}</p>
          </div>
        </div>
        {isWarning && (
          <AlertCircle className="w-5 h-5 text-red-500" />
        )}
      </div>
      {temp.warning && (
        <p className="text-xs text-red-600 mt-2">{temp.warning}</p>
      )}
    </div>
  );
}

/**
 * Humidity Sensor Card
 */
export function HumiditySensorCard({ value, isDarkMode = false }: SensorCardProps) {
  const humidity = useSensorData({ type: 'HUMIDITY', value: typeof value === 'number' ? value : parseInt(String(value || 0), 10) });
  const status = humidity.status;

  return (
    <div
      className={`rounded-lg border p-4 ${isDarkMode ? 'bg-gray-800/50' : 'bg-white'}`}
      style={{ borderLeftColor: status?.color, borderLeftWidth: '4px' }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Droplets className="w-6 h-6" style={{ color: status?.color }} />
          <div>
            <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Humidity
            </p>
            <p className="text-2xl font-bold" style={{ color: status?.color }}>
              {humidity.displayValue}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-3 space-y-1">
        <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Status: {status?.recommendation}
        </p>
        {status?.moldRisk && (
          <p className={`text-xs font-medium ${status.moldRisk === 'HIGH' ? 'text-red-600' : status.moldRisk === 'MEDIUM' ? 'text-yellow-600' : 'text-green-600'}`}>
            Mold Risk: {status.moldRisk}
          </p>
        )}
      </div>
    </div>
  );
}

/**
 * Light/Lux Sensor Card
 */
export function LightSensorCard({ value, isDarkMode = false }: SensorCardProps) {
  const light = useSensorData({ type: 'LIGHT', value: typeof value === 'number' ? value : parseInt(String(value || 0), 10) });
  const description = light.status;

  return (
    <div
      className={`rounded-lg border p-4 ${isDarkMode ? 'bg-gray-800/50' : 'bg-white'}`}
      style={{ borderLeftColor: description?.color, borderLeftWidth: '4px' }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Lightbulb className="w-6 h-6" style={{ color: description?.color }} />
          <div>
            <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Light Level
            </p>
            <p className="text-2xl font-bold" style={{ color: description?.color }}>
              {light.displayValue}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-3 space-y-1">
        <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {description?.description}
        </p>
        {description?.automationMode && (
          <p className={`text-xs font-medium ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
            Auto Mode: {description.automationMode}
          </p>
        )}
      </div>
    </div>
  );
}

/**
 * Motion Sensor Card
 */
export function MotionSensorCard({ value, isDarkMode = false }: SensorCardProps) {
  const motion = useSensorData({ 
    type: 'MOTION', 
    value: typeof value === 'boolean' ? value : value === 1 || value === '1' 
  });
  const display = motion.status;

  const bgColor = display?.status === 'DETECTED'
    ? isDarkMode ? 'bg-red-900/20' : 'bg-red-50'
    : isDarkMode ? 'bg-green-900/20' : 'bg-green-50';

  return (
    <div className={`rounded-lg border p-4 ${bgColor}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{display?.icon}</span>
          <div>
            <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Motion
            </p>
            <p className={`text-xl font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
              {display?.label}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Sensor Overview - Display all sensors at once
 */
export function SensorOverview({
  tempValue,
  humidityValue,
  lightValue,
  motionValue,
  isDarkMode = false,
}: {
  tempValue?: number | string;
  humidityValue?: number | string;
  lightValue?: number | string;
  motionValue?: number | boolean | string;
  isDarkMode?: boolean;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {tempValue !== undefined && (
        <TemperatureSensorCard value={tempValue} isDarkMode={isDarkMode} />
      )}
      {humidityValue !== undefined && (
        <HumiditySensorCard value={humidityValue} isDarkMode={isDarkMode} />
      )}
      {lightValue !== undefined && (
        <LightSensorCard value={lightValue} isDarkMode={isDarkMode} />
      )}
      {motionValue !== undefined && (
        <MotionSensorCard value={motionValue} isDarkMode={isDarkMode} />
      )}
    </div>
  );
}
