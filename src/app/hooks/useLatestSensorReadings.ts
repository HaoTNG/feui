/**
 * useLatestSensorReadings Hook
 * Extracts latest sensor readings from AppContext websocketData
 */

import { useMemo } from 'react';
import { useApp } from '../contexts/AppContext';
import type { SensorWebSocketMessage } from '../api/services/websocketService';

export interface LatestReadings {
  temperature?: {
    value: number;
    displayValue: string;
    timestamp: number;
  };
  humidity?: {
    value: number;
    displayValue: string;
    timestamp: number;
  };
  light?: {
    value: number;
    displayValue: string;
    timestamp: number;
  };
  motion?: {
    value: boolean;
    displayValue: string;
    timestamp: number;
  };
}

export function useLatestSensorReadings(): LatestReadings {
  const { websocketData } = useApp();

  return useMemo(() => {
    const readings: LatestReadings = {};

    // Get latest reading for each sensor type (traverse backwards)
    for (let i = websocketData.length - 1; i >= 0; i--) {
      const data = websocketData[i];
      
      // Check if it's a sensor message (has firmwareId, type, payload)
      if (typeof data === 'object' && data !== null && 'payload' in data && 'type' in data) {
        const msg = data as any;
        const type = (msg.type as string).toLowerCase();

        // Temperature
        if (type === 'temperature' && !readings.temperature) {
          const value = parseFloat(msg.payload);
          if (!isNaN(value)) {
            readings.temperature = {
              value,
              displayValue: `${value.toFixed(1)}°C`,
              timestamp: msg.timestamp || Date.now(),
            };
          }
        }

        // Humidity
        if (type === 'humidity' && !readings.humidity) {
          const value = parseInt(msg.payload, 10);
          if (!isNaN(value)) {
            readings.humidity = {
              value,
              displayValue: `${value}%`,
              timestamp: msg.timestamp || Date.now(),
            };
          }
        }

        // Light
        if (type === 'light' && !readings.light) {
          const value = parseInt(msg.payload, 10);
          if (!isNaN(value)) {
            readings.light = {
              value,
              displayValue: `${value} Lux`,
              timestamp: msg.timestamp || Date.now(),
            };
          }
        }

        // Motion
        if (type === 'motion' && !readings.motion) {
          const value = msg.payload === '1';
          readings.motion = {
            value,
            displayValue: value ? 'Motion Detected' : 'No Motion',
            timestamp: msg.timestamp || Date.now(),
          };
        }

        // Stop searching if we found all readings
        if (
          readings.temperature &&
          readings.humidity &&
          readings.light &&
          readings.motion
        ) {
          break;
        }
      }
    }

    return readings;
  }, [websocketData]);
}

/**
 * Get timestamp difference in seconds
 */
export function getTimeSinceReading(timestamp: number): string {
  const now = Date.now();
  const seconds = Math.floor((now - timestamp) / 1000);

  if (seconds < 60) {
    return `${seconds}s ago`;
  }
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes}m ago`;
  }
  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
}
