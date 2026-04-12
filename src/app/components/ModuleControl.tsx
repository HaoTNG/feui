/**
 * Module Control Component
 * Provides UI controls for different module types (LIGHT, FAN, etc.)
 */

import { FC, useState, useEffect } from 'react';
import { Power, Zap, Volume2, Palette, Thermometer, Droplets, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { moduleService } from '../api/services/moduleService';
import type { ModuleDTO, ModuleType } from '../types/api';

interface ModuleControlProps {
  module: ModuleDTO;
  isDarkMode: boolean;
  onStateChange?: (newState: string) => void;
}

/**
 * Get appropriate icon for module type
 */
function getModuleIcon(type: ModuleType) {
  const iconProps = { className: 'w-5 h-5' };
  
  switch (type) {
    case 'LIGHT':
      return <Zap {...iconProps} />;
    case 'FAN':
      return <Volume2 {...iconProps} />;
    case 'LED':
      return <Palette {...iconProps} />;
    case 'TEMPERATURE':
      return <Thermometer {...iconProps} />;
    case 'HUMIDITY':
      return <Droplets {...iconProps} />;
    case 'MOTION':
      return <AlertCircle {...iconProps} />;
    default:
      return <Power {...iconProps} />;
  }
}

/**
 * Light Module Control
 */
const LightControl: FC<{ module: ModuleDTO; isDarkMode: boolean; onStateChange?: (state: string) => void }> = ({
  module,
  isDarkMode,
  onStateChange,
}) => {
  const [isOn, setIsOn] = useState(module.state === '1');
  const [brightness, setBrightness] = useState(50);
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    try {
      const newState = isOn ? 0 : 1;
      await moduleService.toggle(module.id, newState === 1);
      setIsOn(newState === 1);
      onStateChange?.(newState.toString());
      toast.success(newState === 1 ? 'Light turned ON' : 'Light turned OFF');
    } catch (error) {
      toast.error('Failed to control light');
      console.error('Toggle light error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBrightnessChange = async (value: number) => {
    setBrightness(value);
    setLoading(true);
    try {
      await moduleService.sendWithValue(module.id, 1, 'value', value);
      onStateChange?.('1');
      toast.success(`Brightness set to ${value}%`);
    } catch (error) {
      toast.error('Failed to set brightness');
      console.error('Brightness error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`border rounded-lg p-4 space-y-4 ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className={`w-5 h-5 ${isOn ? 'text-yellow-500' : isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
          <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{module.name}</span>
        </div>
        <button
          onClick={handleToggle}
          disabled={loading}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            isOn
              ? 'bg-yellow-600 text-white hover:bg-yellow-700'
              : isDarkMode
              ? 'bg-gray-600 text-gray-300 hover:bg-gray-500'
              : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
          } disabled:opacity-50`}
        >
          {loading ? 'Loading...' : isOn ? 'ON' : 'OFF'}
        </button>
      </div>

      {isOn && (
        <div className="space-y-2">
          <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Brightness: {brightness}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={brightness}
            onChange={(e) => handleBrightnessChange(Number(e.target.value))}
            disabled={loading}
            className="w-full h-2 bg-gray-400 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      )}
    </div>
  );
};

/**
 * Fan Module Control
 */
const FanControl: FC<{ module: ModuleDTO; isDarkMode: boolean; onStateChange?: (state: string) => void }> = ({
  module,
  isDarkMode,
  onStateChange,
}) => {
  const [isOn, setIsOn] = useState(module.state === '1');
  const [speed, setSpeed] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    try {
      const newState = isOn ? 0 : 1;
      await moduleService.toggle(module.id, newState === 1);
      setIsOn(newState === 1);
      onStateChange?.(newState.toString());
      toast.success(newState === 1 ? 'Fan turned ON' : 'Fan turned OFF');
    } catch (error) {
      toast.error('Failed to control fan');
      console.error('Toggle fan error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSpeedChange = async (newSpeed: number) => {
    setSpeed(newSpeed);
    setLoading(true);
    try {
      await moduleService.sendWithValue(module.id, 1, 'speed', newSpeed);
      onStateChange?.('1');
      const speedLabels = { 1: 'Low', 2: 'Medium', 3: 'High' };
      toast.success(`Fan speed set to ${speedLabels[newSpeed as keyof typeof speedLabels] || `Level ${newSpeed}`}`);
    } catch (error) {
      toast.error('Failed to set fan speed');
      console.error('Fan speed error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`border rounded-lg p-4 space-y-4 ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Volume2 className={`w-5 h-5 ${isOn ? 'text-blue-500' : isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
          <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{module.name}</span>
        </div>
        <button
          onClick={handleToggle}
          disabled={loading}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            isOn
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : isDarkMode
              ? 'bg-gray-600 text-gray-300 hover:bg-gray-500'
              : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
          } disabled:opacity-50`}
        >
          {loading ? 'Loading...' : isOn ? 'ON' : 'OFF'}
        </button>
      </div>

      {isOn && (
        <div className="flex gap-2">
          {[1, 2, 3].map((level) => (
            <button
              key={level}
              onClick={() => handleSpeedChange(level)}
              disabled={loading}
              className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                speed === level
                  ? 'bg-blue-600 text-white'
                  : isDarkMode
                  ? 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                  : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
              } disabled:opacity-50`}
            >
              {level === 1 ? 'Low' : level === 2 ? 'Med' : 'High'}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * Switch/Generic Module Control
 */
const SwitchControl: FC<{ module: ModuleDTO; isDarkMode: boolean; onStateChange?: (state: string) => void }> = ({
  module,
  isDarkMode,
  onStateChange,
}) => {
  const [isOn, setIsOn] = useState(module.state === '1');
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    try {
      const newState = isOn ? 0 : 1;
      await moduleService.toggle(module.id, newState === 1);
      setIsOn(newState === 1);
      onStateChange?.(newState.toString());
      toast.success(newState === 1 ? `${module.name} turned ON` : `${module.name} turned OFF`);
    } catch (error) {
      toast.error(`Failed to control ${module.name}`);
      console.error('Toggle error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`border rounded-lg p-4 ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Power className={`w-5 h-5 ${isOn ? 'text-green-500' : isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
          <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{module.name}</span>
        </div>
        <button
          onClick={handleToggle}
          disabled={loading}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            isOn
              ? 'bg-green-600 text-white hover:bg-green-700'
              : isDarkMode
              ? 'bg-gray-600 text-gray-300 hover:bg-gray-500'
              : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
          } disabled:opacity-50`}
        >
          {loading ? 'Loading...' : isOn ? 'ON' : 'OFF'}
        </button>
      </div>
    </div>
  );
};

/**
 * Sensor Display (Read-only)
 */
const SensorDisplay: FC<{ module: ModuleDTO; isDarkMode: boolean }> = ({ module, isDarkMode }) => {
  const getUnit = () => {
    switch (module.type) {
      case 'TEMPERATURE':
        return '°C';
      case 'HUMIDITY':
        return '%';
      default:
        return '';
    }
  };

  const getReadable = () => {
    switch (module.type) {
      case 'MOTION':
        return module.state === '1' ? 'Detected' : 'Not detected';
      default:
        return `${module.state}${getUnit()}`;
    }
  };

  return (
    <div className={`border rounded-lg p-4 ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {getModuleIcon(module.type)}
          <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{module.name}</span>
        </div>
        <div className="text-right">
          <p className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{getReadable()}</p>
          <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Sensor reading</p>
        </div>
      </div>
    </div>
  );
};

/**
 * Main Module Control Component
 * Routes to appropriate control component based on module type
 */
export const ModuleControl: FC<ModuleControlProps> = ({ module, isDarkMode, onStateChange }) => {
  // Controllable module types
  if (module.type === 'LIGHT') {
    return <LightControl module={module} isDarkMode={isDarkMode} onStateChange={onStateChange} />;
  }

  if (module.type === 'FAN') {
    return <FanControl module={module} isDarkMode={isDarkMode} onStateChange={onStateChange} />;
  }

  if (module.type === 'SWITCH' || module.type === 'LED' || module.type === 'LCD') {
    return <SwitchControl module={module} isDarkMode={isDarkMode} onStateChange={onStateChange} />;
  }

  // Sensor types (read-only)
  if (module.type === 'TEMPERATURE' || module.type === 'HUMIDITY' || module.type === 'MOTION' || module.type === 'LIGHT_SENSOR') {
    return <SensorDisplay module={module} isDarkMode={isDarkMode} />;
  }

  // Fallback for unknown types
  return <SwitchControl module={module} isDarkMode={isDarkMode} onStateChange={onStateChange} />;
};

export default ModuleControl;
