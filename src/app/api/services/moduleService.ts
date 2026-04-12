/**
 * Module Service
 * Handles module operations on devices
 */

import type { ModuleDTO, AddModuleRequest, UpdateModuleNameRequest, SendModuleCommandRequest } from '../../types/api';
import { apiRequest } from '../client';
import API_ENDPOINTS from '../endpoints';

class ModuleService {
  /**
   * Add module to device
   */
  async addModule(deviceId: string, payload: AddModuleRequest): Promise<ModuleDTO> {
    try {
      const response = await apiRequest<ModuleDTO>('post', API_ENDPOINTS.MODULES.ADD(deviceId), payload);
      if (!response.data) {
        throw new Error('Failed to add module');
      }
      return response.data;
    } catch (error) {
      console.error('Failed to add module:', error);
      throw error;
    }
  }

  /**
   * Get module details
   */
  async getModule(moduleId: string): Promise<ModuleDTO> {
    try {
      const response = await apiRequest<ModuleDTO>('get', API_ENDPOINTS.MODULES.GET(moduleId));
      if (!response.data) {
        throw new Error(`Module ${moduleId} not found`);
      }
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch module ${moduleId}:`, error);
      throw error;
    }
  }

  /**
   * Update module name
   */
  async updateModuleName(moduleId: string, name: string): Promise<ModuleDTO> {
    try {
      const payload: UpdateModuleNameRequest = { name };
      const response = await apiRequest<ModuleDTO>(
        'patch',
        API_ENDPOINTS.MODULES.UPDATE_NAME(moduleId),
        payload
      );
      if (!response.data) {
        throw new Error('Failed to update module name');
      }
      return response.data;
    } catch (error) {
      console.error('Failed to update module name:', error);
      throw error;
    }
  }

  /**
   * Delete module
   */
  async deleteModule(moduleId: string): Promise<void> {
    try {
      await apiRequest<void>('delete', API_ENDPOINTS.MODULES.DELETE(moduleId));
    } catch (error) {
      console.error('Failed to delete module:', error);
      throw error;
    }
  }

  /**
   * Send control command to module
   * @param moduleId - Module ID to control
   * @param payload - JSON string command payload (e.g., '{"action": 1}' or '{"action": 0}')
   */
  async sendCommand(moduleId: string, payload: string): Promise<void> {
    try {
      const endpoint = API_ENDPOINTS.MODULES.SEND_COMMAND(moduleId);
      console.log('[moduleService] Sending command to module:', moduleId);
      console.log('[moduleService] Command endpoint:', endpoint);
      console.log('[moduleService] Command payload:', payload);
      const commandPayload: SendModuleCommandRequest = { payload };
      await apiRequest<void>('post', endpoint, commandPayload);
      console.log('[moduleService] Command sent successfully');
    } catch (error) {
      console.error('[moduleService] Failed to send module command:', error);
      throw error;
    }
  }

  /**
   * Helper: Toggle module (send action 1 for on, 0 for off)
   */
  async toggle(moduleId: string, on: boolean): Promise<void> {
    const action = on ? 1 : 0;
    const payload = JSON.stringify({ action });
    return this.sendCommand(moduleId, payload);
  }

  /**
   * Helper: Send command with value
   * Useful for brightness, speed, color, etc.
   */
  async sendWithValue(moduleId: string, action: number, key: string, value: any): Promise<void> {
    const payload = JSON.stringify({ [key]: value, action });
    return this.sendCommand(moduleId, payload);
  }
}

export const moduleService = new ModuleService();
export default moduleService;
