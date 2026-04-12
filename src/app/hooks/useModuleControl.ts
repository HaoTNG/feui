/**
 * useModuleControl Hook
 * Manages module operations and control commands
 */

import { useState, useCallback } from 'react';
import { moduleService } from '../api/services/moduleService';
import type { ModuleDTO, AddModuleRequest } from '../types/api';

interface UseModuleControlState {
  modules: Map<string, ModuleDTO>; // moduleId -> ModuleDTO
  loading: boolean;
  error: string | null;
  commandLoading: Set<string>; // Track which modules are executing commands
}

export const useModuleControl = () => {
  const [state, setState] = useState<UseModuleControlState>({
    modules: new Map(),
    loading: false,
    error: null,
    commandLoading: new Set(),
  });

  // ============================================================
  // MODULE CRUD OPERATIONS
  // ============================================================

  /**
   * Add module to device
   */
  const addModule = useCallback(async (deviceId: string, moduleData: AddModuleRequest) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const module = await moduleService.addModule(deviceId, moduleData);
      setState((prev) => {
        const modules = new Map(prev.modules);
        modules.set(module.id, module);
        return { ...prev, modules, loading: false };
      });
      return module;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to add module';
      setState((prev) => ({ ...prev, error: message, loading: false }));
      throw error;
    }
  }, []);

  /**
   * Get module details
   */
  const getModule = useCallback(async (moduleId: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const module = await moduleService.getModule(moduleId);
      setState((prev) => {
        const modules = new Map(prev.modules);
        modules.set(moduleId, module);
        return { ...prev, modules, loading: false };
      });
      return module;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch module';
      setState((prev) => ({ ...prev, error: message, loading: false }));
      throw error;
    }
  }, []);

  /**
   * Update module name
   */
  const updateModuleName = useCallback(async (moduleId: string, name: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const module = await moduleService.updateModuleName(moduleId, name);
      setState((prev) => {
        const modules = new Map(prev.modules);
        modules.set(moduleId, module);
        return { ...prev, modules, loading: false };
      });
      return module;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update module';
      setState((prev) => ({ ...prev, error: message, loading: false }));
      throw error;
    }
  }, []);

  /**
   * Delete module
   */
  const deleteModule = useCallback(async (moduleId: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      await moduleService.deleteModule(moduleId);
      setState((prev) => {
        const modules = new Map(prev.modules);
        modules.delete(moduleId);
        return { ...prev, modules, loading: false };
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete module';
      setState((prev) => ({ ...prev, error: message, loading: false }));
      throw error;
    }
  }, []);

  // ============================================================
  // MODULE CONTROL COMMANDS
  // ============================================================

  /**
   * Send raw command to module (payload as JSON string)
   * Uses format: {"action": 1} for ON, {"action": 0} for OFF
   */
  const sendCommand = useCallback(async (moduleId: string, payload: string) => {
    setState((prev) => ({
      ...prev,
      commandLoading: new Set([...prev.commandLoading, moduleId]),
      error: null,
    }));
    try {
      await moduleService.sendCommand(moduleId, payload);
      setState((prev) => {
        const commandLoading = new Set(prev.commandLoading);
        commandLoading.delete(moduleId);
        return { ...prev, commandLoading };
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to send command';
      setState((prev) => {
        const commandLoading = new Set(prev.commandLoading);
        commandLoading.delete(moduleId);
        return { ...prev, error: message, commandLoading };
      });
      throw error;
    }
  }, []);

  /**
   * Toggle module on/off
   * @param moduleId - Module ID
   * @param on - true to turn on, false to turn off
   */
  const toggle = useCallback(async (moduleId: string, on: boolean) => {
    const payload = JSON.stringify({ action: on ? 1 : 0 });
    return sendCommand(moduleId, payload);
  }, [sendCommand]);

  /**
   * Send command with brightness/value
   * @param moduleId - Module ID
   * @param value - 0-100 for brightness, speed, etc.
   */
  const setBrightness = useCallback(async (moduleId: string, value: number) => {
    const payload = JSON.stringify({ action: 1, value: Math.max(0, Math.min(100, value)) });
    return sendCommand(moduleId, payload);
  }, [sendCommand]);

  /**
   * Set fan speed
   * @param moduleId - Module ID
   * @param speed - Speed level (1, 2, 3, etc.)
   */
  const setSpeed = useCallback(async (moduleId: string, speed: number) => {
    const payload = JSON.stringify({ action: 1, speed });
    return sendCommand(moduleId, payload);
  }, [sendCommand]);

  /**
   * Set LED color
   * @param moduleId - Module ID
   * @param color - HEX color (e.g., "FF5733")
   */
  const setColor = useCallback(async (moduleId: string, color: string) => {
    const payload = JSON.stringify({ color });
    return sendCommand(moduleId, payload);
  }, [sendCommand]);

  // ============================================================
  // UTILITIES
  // ============================================================

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  const isCommandLoading = useCallback((moduleId: string) => {
    return state.commandLoading.has(moduleId);
  }, [state.commandLoading]);

  return {
    // State
    modules: state.modules,
    loading: state.loading,
    error: state.error,
    commandLoading: state.commandLoading,
    // Module CRUD
    addModule,
    getModule,
    updateModuleName,
    deleteModule,
    // Module Control
    sendCommand,
    toggle,
    setBrightness,
    setSpeed,
    setColor,
    // Utilities
    clearError,
    isCommandLoading,
  };
};

export default useModuleControl;
