/**
 * useDeviceControl Hook
 * Provides easy access to hardcoded device control functions
 * Directly controls devices using pre-defined IDs from backend
 */

import { useCallback, useState } from 'react';
import { moduleService } from '../api/services/moduleService';

interface UseDeviceControlState {
  loading: boolean;
  error: string | null;
}

export const useDeviceControl = () => {
  const [state, setState] = useState<UseDeviceControlState>({
    loading: false,
    error: null,
  });

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  // ============================================================
  // FAN CONTROL
  // ============================================================

  const toggleFan = useCallback(async (on: boolean) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      await moduleService.toggleFan(on);
      setState((prev) => ({ ...prev, loading: false }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to control fan';
      setState((prev) => ({ ...prev, error: message, loading: false }));
      throw error;
    }
  }, []);

  const setFanSpeed = useCallback(async (speed: number) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      await moduleService.setFanSpeed(speed);
      setState((prev) => ({ ...prev, loading: false }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to set fan speed';
      setState((prev) => ({ ...prev, error: message, loading: false }));
      throw error;
    }
  }, []);

  // ============================================================
  // LED CONTROL
  // ============================================================

  const toggleLED = useCallback(async (on: boolean) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      await moduleService.toggleLED(on);
      setState((prev) => ({ ...prev, loading: false }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to control LED';
      setState((prev) => ({ ...prev, error: message, loading: false }));
      throw error;
    }
  }, []);

  const setLEDBrightness = useCallback(async (brightness: number) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      await moduleService.setLEDBrightness(brightness);
      setState((prev) => ({ ...prev, loading: false }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to set LED brightness';
      setState((prev) => ({ ...prev, error: message, loading: false }));
      throw error;
    }
  }, []);

  // ============================================================
  // LIGHT SENSOR CONTROL
  // ============================================================

  const toggleLight = useCallback(async (on: boolean) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      await moduleService.toggleLight(on);
      setState((prev) => ({ ...prev, loading: false }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to control light';
      setState((prev) => ({ ...prev, error: message, loading: false }));
      throw error;
    }
  }, []);

  // ============================================================
  // SENSOR READS
  // ============================================================

  const getTemperature = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const result = await moduleService.getTemperature();
      setState((prev) => ({ ...prev, loading: false }));
      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to get temperature';
      setState((prev) => ({ ...prev, error: message, loading: false }));
      throw error;
    }
  }, []);

  const getHumidity = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const result = await moduleService.getHumidity();
      setState((prev) => ({ ...prev, loading: false }));
      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to get humidity';
      setState((prev) => ({ ...prev, error: message, loading: false }));
      throw error;
    }
  }, []);

  const getMotionStatus = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const result = await moduleService.getMotionStatus();
      setState((prev) => ({ ...prev, loading: false }));
      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to get motion status';
      setState((prev) => ({ ...prev, error: message, loading: false }));
      throw error;
    }
  }, []);

  // ============================================================
  // LCD CONTROL
  // ============================================================

  const toggleLCD = useCallback(async (on: boolean) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      await moduleService.toggleLCD(on);
      setState((prev) => ({ ...prev, loading: false }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to control LCD';
      setState((prev) => ({ ...prev, error: message, loading: false }));
      throw error;
    }
  }, []);

  return {
    // State
    loading: state.loading,
    error: state.error,
    clearError,
    
    // Fan Control
    toggleFan,
    setFanSpeed,
    
    // LED Control
    toggleLED,
    setLEDBrightness,
    
    // Light Control
    toggleLight,
    
    // Sensor Reads
    getTemperature,
    getHumidity,
    getMotionStatus,
    
    // LCD Control
    toggleLCD,
  };
};

export default useDeviceControl;
