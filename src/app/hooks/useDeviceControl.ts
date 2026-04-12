/**
 * useDeviceControl Hook
 * Manages device operations (CRUD and control)
 */

import { useState, useCallback } from 'react';
import { deviceService } from '../api/services/deviceService';
import { moduleService } from '../api/services/moduleService';
import type { DeviceDTO, DeviceChannelDTO, CreateDeviceRequest } from '../types/api';

interface UseDeviceControlState {
  devices: DeviceDTO[];
  channels: DeviceChannelDTO[];
  loading: boolean;
  error: string | null;
}

export const useDeviceControl = () => {
  const [state, setState] = useState<UseDeviceControlState>({
    devices: [],
    channels: [],
    loading: false,
    error: null,
  });

  // ============================================================
  // DEVICE CRUD OPERATIONS
  // ============================================================

  /**
   * Fetch all devices in a home
   */
  const fetchDevices = useCallback(async (homeId: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      console.log('[useDeviceControl] fetchDevices called for homeId:', homeId);
      const devices = await deviceService.getDevicesByHome(homeId);
      console.log('[useDeviceControl] Devices fetched:', devices);
      setState((prev) => ({ ...prev, devices, loading: false }));
      return devices;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch devices';
      console.error('[useDeviceControl] fetchDevices error:', message);
      setState((prev) => ({ ...prev, error: message, loading: false }));
      throw error;
    }
  }, []);

  /**
   * Fetch single device details
   */
  const fetchDevice = useCallback(async (deviceId: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const device = await deviceService.getDevice(deviceId);
      setState((prev) => ({
        ...prev,
        devices: prev.devices.map((d) => (d.id === deviceId ? device : d)),
        loading: false,
      }));
      return device;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch device';
      setState((prev) => ({ ...prev, error: message, loading: false }));
      throw error;
    }
  }, []);

  /**
   * Create new device
   */
  const createDevice = useCallback(async (homeId: string, deviceData: CreateDeviceRequest) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const device = await deviceService.createDevice(homeId, deviceData);
      setState((prev) => ({
        ...prev,
        devices: [...prev.devices, device],
        loading: false,
      }));
      return device;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create device';
      setState((prev) => ({ ...prev, error: message, loading: false }));
      throw error;
    }
  }, []);

  /**
   * Update device name
   */
  const updateDeviceName = useCallback(async (deviceId: string, name: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const device = await deviceService.updateDeviceName(deviceId, name);
      setState((prev) => ({
        ...prev,
        devices: prev.devices.map((d) => (d.id === deviceId ? device : d)),
        loading: false,
      }));
      return device;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update device';
      setState((prev) => ({ ...prev, error: message, loading: false }));
      throw error;
    }
  }, []);

  /**
   * Move device to another room or unassigned
   */
  const moveDevice = useCallback(async (deviceId: string, roomId: string | null) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const device = await deviceService.moveDevice(deviceId, roomId);
      setState((prev) => ({
        ...prev,
        devices: prev.devices.map((d) => (d.id === deviceId ? device : d)),
        loading: false,
      }));
      return device;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to move device';
      setState((prev) => ({ ...prev, error: message, loading: false }));
      throw error;
    }
  }, []);

  /**
   * Delete device
   */
  const deleteDevice = useCallback(async (deviceId: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      await deviceService.deleteDevice(deviceId);
      setState((prev) => ({
        ...prev,
        devices: prev.devices.filter((d) => d.id !== deviceId),
        loading: false,
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete device';
      setState((prev) => ({ ...prev, error: message, loading: false }));
      throw error;
    }
  }, []);

  // ============================================================
  // DEVICE CHANNELS
  // ============================================================

  /**
   * Fetch device channels
   */
  const fetchChannels = useCallback(async (deviceId: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      console.log('[useDeviceControl] Fetching channels for device:', deviceId);
      const channels = await deviceService.getDeviceChannels(deviceId);
      console.log('[useDeviceControl] Channels fetched:', channels);
      setState((prev) => ({ ...prev, channels, loading: false }));
      return channels;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch channels';
      console.error('[useDeviceControl] Failed to fetch channels:', message);
      setState((prev) => ({ ...prev, error: message, loading: false }));
      throw error;
    }
  }, []);

  // ============================================================
  // UTILITIES
  // ============================================================

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  return {
    // State
    devices: state.devices,
    channels: state.channels,
    loading: state.loading,
    error: state.error,
    // Device CRUD
    fetchDevices,
    fetchDevice,
    createDevice,
    updateDeviceName,
    moveDevice,
    deleteDevice,
    // Channels
    fetchChannels,
    // Utilities
    clearError,
  };
};

export default useDeviceControl;
