/**
 * Device Service
 * Handles device CRUD and control operations
 */

import type {
  DeviceDTO,
  CreateDeviceRequest,
  UpdateDeviceNameRequest,
  MoveDeviceRequest,
  SendCommandRequest,
  DeviceChannelDTO,
  DeviceState,
} from '../../types/api';
import { apiRequest } from '../client';
import API_ENDPOINTS from '../endpoints';
import { parseDeviceState } from '../../utils/converters';

class DeviceService {
  /**
   * Get all devices in a home
   */
  async getDevicesByHome(homeId: string): Promise<DeviceDTO[]> {
    try {
      const endpoint = API_ENDPOINTS.DEVICES.LIST(homeId);
      console.log('[deviceService] Fetching devices from:', endpoint);
      const response = await apiRequest<DeviceDTO[]>('get', endpoint);
      console.log('[deviceService] Response:', response);
      return response.data || [];
    } catch (error) {
      console.error(`[deviceService] Failed to fetch devices for home ${homeId}:`, error);
      throw error;
    }
  }

  /**
   * Get single device details
   */
  async getDevice(deviceId: string): Promise<DeviceDTO> {
    try {
      const response = await apiRequest<DeviceDTO>('get', API_ENDPOINTS.DEVICES.GET(deviceId));
      if (!response.data) {
        throw new Error(`Device ${deviceId} not found`);
      }
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch device ${deviceId}:`, error);
      throw error;
    }
  }

  /**
   * Create new device
   */
  async createDevice(homeId: string, payload: CreateDeviceRequest): Promise<DeviceDTO> {
    try {
      const response = await apiRequest<DeviceDTO>('post', API_ENDPOINTS.DEVICES.CREATE(homeId), payload);
      if (!response.data) {
        throw new Error('Failed to create device');
      }
      return response.data;
    } catch (error) {
      console.error('Failed to create device:', error);
      throw error;
    }
  }

  /**
   * Update device name
   */
  async updateDeviceName(deviceId: string, name: string): Promise<DeviceDTO> {
    try {
      const payload: UpdateDeviceNameRequest = { name };
      const response = await apiRequest<DeviceDTO>(
        'patch',
        API_ENDPOINTS.DEVICES.UPDATE_NAME(deviceId),
        payload
      );
      if (!response.data) {
        throw new Error('Failed to update device name');
      }
      return response.data;
    } catch (error) {
      console.error('Failed to update device name:', error);
      throw error;
    }
  }

  /**
   * Move device to another room or unassigned
   */
  async moveDevice(deviceId: string, roomId: string | null): Promise<DeviceDTO> {
    try {
      const payload: MoveDeviceRequest = { roomId };
      const response = await apiRequest<DeviceDTO>(
        'patch',
        API_ENDPOINTS.DEVICES.MOVE_ROOM(deviceId),
        payload
      );
      if (!response.data) {
        throw new Error('Failed to move device');
      }
      return response.data;
    } catch (error) {
      console.error('Failed to move device:', error);
      throw error;
    }
  }

  /**
   * Delete device
   */
  async deleteDevice(deviceId: string): Promise<void> {
    try {
      await apiRequest<void>('delete', API_ENDPOINTS.DEVICES.DELETE(deviceId));
    } catch (error) {
      console.error('Failed to delete device:', error);
      throw error;
    }
  }

  /**
   * Get device channels
   */
  async getDeviceChannels(deviceId: string): Promise<DeviceChannelDTO[]> {
    try {
      const endpoint = API_ENDPOINTS.DEVICES.GET_CHANNELS(deviceId);
      console.log('[deviceService] Fetching channels from:', endpoint);
      const response = await apiRequest<DeviceChannelDTO[]>('get', endpoint);
      console.log('[deviceService] Channels response:', response);
      return response.data || [];
    } catch (error) {
      console.error(`[deviceService] Failed to fetch channels for device ${deviceId}:`, error);
      throw error;
    }
  }

  /**
   * Send command to device (deprecated - use moduleService instead)
   * @deprecated Use moduleService.sendCommand instead
   */
  async sendCommand(deviceId: string, payload: string): Promise<void> {
    try {
      const commandPayload: SendCommandRequest = { payload };
      await apiRequest<void>('post', API_ENDPOINTS.DEVICES.SEND_COMMAND(deviceId), commandPayload);
    } catch (error) {
      console.error('Failed to send command:', error);
      throw error;
    }
  }

  /**
   * Get device current state
   */
  async getDeviceState(deviceId: string): Promise<DeviceState> {
    try {
      const response = await apiRequest<string>('get', API_ENDPOINTS.DEVICES.GET_STATE(deviceId));
      if (!response.data) {
        return {};
      }
      // Backend returns state as JSON string
      return parseDeviceState(response.data);
    } catch (error) {
      console.error('Failed to fetch device state:', error);
      throw error;
    }
  }
}

export const deviceService = new DeviceService();
export default deviceService;
