/**
 * Module Service
 * Handles module operations on devices
 */

import type { ApiResponse, ModuleDTO, AddModuleRequest, UpdateModuleNameRequest } from '../../types/api';
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
}

export const moduleService = new ModuleService();
export default moduleService;
