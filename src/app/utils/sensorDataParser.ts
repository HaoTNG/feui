/**
 * Sensor Data Parser & Formatter
 * Handles WebSocket sensor messages and data validation/formatting
 */

import type { ModuleType } from '../types/api';

// ============================================================
// SENSOR DATA TYPES
// ============================================================

export interface SensorWebSocketMessage {
  firmwareId: string;
  category: 'data' | 'command' | 'status';
  type: ModuleType;
  channel: number;
  payload: string;
  timestamp?: number;
}

export interface ParsedSensorData {
  type: ModuleType;
  value: number | boolean | string;
  displayValue: string;
  unit: string;
  isValid: boolean;
  errors?: string[];
}

// ============================================================
// TEMPERATURE PARSING
// ============================================================

export function parseTemperature(payload: string): ParsedSensorData {
  const errors: string[] = [];
  
  const temp = parseFloat(payload);
  const isValid = !isNaN(temp) && temp >= -50 && temp <= 100;

  if (!isValid) {
    errors.push(`Invalid temperature: ${payload}. Expected range: -50 to 100°C`);
  }

  const value = temp;
  const displayValue = `${value.toFixed(1)}°C`;

  return {
    type: 'TEMPERATURE',
    value,
    displayValue,
    unit: '°C',
    isValid,
    errors: errors.length > 0 ? errors : undefined,
  };
}

export function formatTemperature(celsius: number) {
  return {
    celsius: parseFloat(celsius.toFixed(1)),
    fahrenheit: parseFloat((celsius * 9/5 + 32).toFixed(1)),
    kelvin: parseFloat((celsius + 273.15).toFixed(2)),
    display: `${celsius.toFixed(1)}°C`,
  };
}

export function getTemperatureWarning(temp: number): string | null {
  if (temp > 30) return 'High temperature alert!';
  if (temp < 5) return 'Low temperature alert!';
  return null;
}

// ============================================================
// HUMIDITY PARSING
// ============================================================

export function parseHumidity(payload: string): ParsedSensorData {
  const errors: string[] = [];
  
  const humidity = parseInt(payload, 10);
  const isValid = !isNaN(humidity) && humidity >= 0 && humidity <= 100;

  if (!isValid) {
    errors.push(`Invalid humidity: ${payload}. Expected range: 0-100%`);
  }

  return {
    type: 'HUMIDITY',
    value: humidity,
    displayValue: `${humidity}%`,
    unit: '%',
    isValid,
    errors: errors.length > 0 ? errors : undefined,
  };
}

export interface HumidityStatus {
  status: 'TOO_DRY' | 'DRY' | 'COMFORT' | 'WARM' | 'TOO_HUMID';
  color: string;
  recommendation: string;
  moldRisk?: 'LOW' | 'MEDIUM' | 'HIGH';
}

export function getHumidityStatus(humidity: number): HumidityStatus {
  if (humidity < 30) {
    return {
      status: 'TOO_DRY',
      color: '#FF6B6B',
      recommendation: 'Very dry',
      moldRisk: 'LOW',
    };
  }
  if (humidity < 40) {
    return {
      status: 'DRY',
      color: '#FFA500',
      recommendation: 'A bit dry',
      moldRisk: 'LOW',
    };
  }
  if (humidity <= 60) {
    return {
      status: 'COMFORT',
      color: '#51CF66',
      recommendation: 'Comfortable',
      moldRisk: 'LOW',
    };
  }
  if (humidity <= 70) {
    return {
      status: 'WARM',
      color: '#FFD93D',
      recommendation: 'A bit humid',
      moldRisk: 'MEDIUM',
    };
  }
  return {
    status: 'TOO_HUMID',
    color: '#FF6B9D',
    recommendation: 'Too humid',
    moldRisk: 'HIGH',
  };
}

export function checkMoldRisk(humidity: number, temperature: number): { risk: 'LOW' | 'MEDIUM' | 'HIGH'; warning: string } {
  if (humidity > 60 && temperature > 20) {
    return { risk: 'MEDIUM', warning: 'Mold growth possible' };
  }
  if (humidity > 75) {
    return { risk: 'HIGH', warning: 'High mold risk!' };
  }
  return { risk: 'LOW', warning: 'Normal' };
}

// ============================================================
// MOTION PARSING
// ============================================================

export function parseMotion(payload: string): ParsedSensorData {
  const errors: string[] = [];
  
  const isMotionDetected = payload === '1';
  const isValid = payload === '0' || payload === '1';

  if (!isValid) {
    errors.push(`Invalid motion value: ${payload}. Expected: '0' or '1'`);
  }

  return {
    type: 'MOTION',
    value: isMotionDetected,
    displayValue: isMotionDetected ? 'Motion Detected' : 'No Motion',
    unit: '',
    isValid,
    errors: errors.length > 0 ? errors : undefined,
  };
}

export interface MotionDisplay {
  status: 'DETECTED' | 'CLEAR';
  icon: string;
  color: string;
  label: string;
}

export function getMotionDisplay(isDetected: boolean): MotionDisplay {
  return {
    status: isDetected ? 'DETECTED' : 'CLEAR',
    icon: isDetected ? '🔴' : '⚪',
    color: isDetected ? '#FF0000' : '#00AA00',
    label: isDetected ? 'Motion Detected' : 'No Motion',
  };
}

// ============================================================
// LIGHT/LUX PARSING
// ============================================================

const LUX_REFERENCE = {
  FULL_SUNLIGHT: 32000,
  BRIGHT_OFFICE: 320,
  LIVING_ROOM: 50,
  TWILIGHT: 10,
  NIGHT: 0.1,
};

export function parseLight(payload: string): ParsedSensorData {
  const errors: string[] = [];
  
  const lux = parseInt(payload, 10);
  const isValid = !isNaN(lux) && lux >= 0 && lux <= 100000;

  if (!isValid) {
    errors.push(`Invalid light value: ${payload}. Expected range: 0-100000 Lux`);
  }

  return {
    type: 'LIGHT',
    value: lux,
    displayValue: `${lux} Lux`,
    unit: 'Lux',
    isValid,
    errors: errors.length > 0 ? errors : undefined,
  };
}

export interface LightLevelDescription {
  level: 'VERY_BRIGHT' | 'BRIGHT' | 'MEDIUM' | 'DIM' | 'DARK' | 'VERY_DARK';
  color: string;
  description: string;
  automationMode?: 'OFF' | 'DIM' | 'NIGHT';
}

export function getLightLevelDescription(lux: number): LightLevelDescription {
  const value = Math.max(0, lux); // Ensure non-negative

  if (value > 10000) {
    return {
      level: 'VERY_BRIGHT',
      color: '#FFD700',
      description: 'Very bright - direct sunlight',
      automationMode: 'OFF',
    };
  }
  if (value > 5000) {
    return {
      level: 'BRIGHT',
      color: '#FFC700',
      description: 'Bright - well-lit',
      automationMode: 'OFF',
    };
  }
  if (value > 1000) {
    return {
      level: 'MEDIUM',
      color: '#FFA500',
      description: 'Medium light',
      automationMode: 'DIM',
    };
  }
  if (value > 100) {
    return {
      level: 'DIM',
      color: '#FFD700',
      description: 'Dim - office light',
      automationMode: 'DIM',
    };
  }
  if (value > 10) {
    return {
      level: 'DARK',
      color: '#808080',
      description: 'Dark - twilight',
      automationMode: 'NIGHT',
    };
  }
  return {
    level: 'VERY_DARK',
    color: '#000000',
    description: 'Very dark - night',
    automationMode: 'NIGHT',
  };
}

export function getLightPercentage(lux: number): number {
  const maxLux = 10000; // Full sunlight reference
  return Math.min((lux / maxLux) * 100, 100);
}

// ============================================================
// MAIN PARSER
// ============================================================

export function parseSensorData(msg: SensorWebSocketMessage): ParsedSensorData {
  try {
    // Normalize type to uppercase to handle both cases
    const normalizedType = (msg.type as string).toUpperCase() as ModuleType;
    
    switch (normalizedType) {
      case 'TEMPERATURE':
        return parseTemperature(msg.payload);
      case 'HUMIDITY':
        return parseHumidity(msg.payload);
      case 'MOTION':
        return parseMotion(msg.payload);
      case 'LIGHT':
      case 'LIGHT_SENSOR':
        return parseLight(msg.payload);
      default:
        return {
          type: msg.type,
          value: msg.payload,
          displayValue: msg.payload,
          unit: '',
          isValid: true,
        };
    }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    return {
      type: msg.type,
      value: msg.payload,
      displayValue: msg.payload,
      unit: '',
      isValid: false,
      errors: [errorMsg],
    };
  }
}

// ============================================================
// VALIDATION
// ============================================================

export function validateSensorMessage(msg: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!msg.firmwareId) errors.push('Missing firmwareId');
  if (!msg.category) errors.push('Missing category');
  if (!msg.type) errors.push('Missing type');
  if (msg.channel === undefined || msg.channel === null) {
    errors.push('Missing channel');
  }
  if (!msg.payload) errors.push('Missing payload');

  return {
    valid: errors.length === 0,
    errors,
  };
}

// ============================================================
// MODULE TO SENSOR DATA MAPPING
// ============================================================

export function mapWebSocketToModule(msg: SensorWebSocketMessage, deviceId: string, moduleId: string) {
  const parsed = parseSensorData(msg);
  
  return {
    id: moduleId,
    deviceId,
    type: msg.type,
    value: parsed.value,
    displayValue: parsed.displayValue,
    unit: parsed.unit,
    channel: msg.channel,
    firmwareId: msg.firmwareId,
    timestamp: msg.timestamp || Date.now(),
    isValid: parsed.isValid,
  };
}
