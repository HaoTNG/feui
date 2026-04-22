/**
 * useSensorData Hook
 * Simplified hook for displaying and formatting sensor data in components
 */

import { useMemo } from 'react';
import type { ModuleType } from '../types/api';
import {
  parseSensorData,
  getTemperatureWarning,
  getHumidityStatus,
  getLightLevelDescription,
  getMotionDisplay,
  type ParsedSensorData,
} from '../utils/sensorDataParser';

export interface UseSensorDataProps {
  type: ModuleType;
  value?: number | boolean | string;
  payload?: string; // Raw payload string from server
}

export interface SensorDataDisplay {
  // Parsed data
  value: number | boolean | string;
  displayValue: string;
  unit: string;
  isValid: boolean;
  
  // Metadata
  type: ModuleType;
  
  // Helpers (available depending on type)
  warning?: string | null;
  status?: any; // TemperatureStatus, HumidityStatus, MotionDisplay, LightLevelDescription
}

/**
 * Hook to parse and format sensor data for display
 * 
 * @example
 * const tempData = useSensorData({ type: 'TEMPERATURE', payload: '25.5' });
 * return <div>{tempData.displayValue}</div>;
 */
export function useSensorData({
  type,
  value,
  payload,
}: UseSensorDataProps): SensorDataDisplay {
  const displayData = useMemo(() => {
    // Construct sensor message
    const sensorMsg = {
      firmwareId: 'unknown',
      category: 'data' as const,
      type,
      channel: 1,
      payload: payload || String(value || ''),
    };

    // Parse data
    const parsed = parseSensorData(sensorMsg);

    const result: SensorDataDisplay = {
      value: parsed.value,
      displayValue: parsed.displayValue,
      unit: parsed.unit,
      isValid: parsed.isValid,
      type,
    };

    // Add type-specific helpers
    switch (type) {
      case 'TEMPERATURE':
        if (typeof parsed.value === 'number') {
          result.warning = getTemperatureWarning(parsed.value);
        }
        break;

      case 'HUMIDITY':
        if (typeof parsed.value === 'number') {
          result.status = getHumidityStatus(parsed.value);
        }
        break;

      case 'MOTION':
        if (typeof parsed.value === 'boolean') {
          result.status = getMotionDisplay(parsed.value);
        }
        break;

      case 'LIGHT':
      case 'LIGHT_SENSOR':
        if (typeof parsed.value === 'number') {
          result.status = getLightLevelDescription(parsed.value);
        }
        break;
    }

    return result;
  }, [type, value, payload]);

  return displayData;
}

/**
 * Get sensor-specific styling and formatting
 */
export function getSensorStyling(data: SensorDataDisplay) {
  switch (data.type) {
    case 'TEMPERATURE':
      if (!data.warning) return { color: '#28a745', bgColor: '#d4edda' };
      if (data.warning.includes('High')) return { color: '#dc3545', bgColor: '#f8d7da' };
      if (data.warning.includes('Low')) return { color: '#0066ff', bgColor: '#cfe2ff' };
      break;

    case 'HUMIDITY':
      if (data.status) {
        return { color: data.status.color, bgColor: `${data.status.color}20` };
      }
      break;

    case 'MOTION':
      if (data.status) {
        return { color: data.status.color, bgColor: `${data.status.color}20` };
      }
      break;

    case 'LIGHT':
    case 'LIGHT_SENSOR':
      if (data.status) {
        return { color: data.status.color, bgColor: `${data.status.color}20` };
      }
      break;
  }

  return { color: '#333333', bgColor: '#f5f5f5' };
}
