/**
 * Module Service
 * Handles module operations on devices
 */

import type { ModuleDTO, AddModuleRequest, UpdateModuleNameRequest, SendModuleCommandRequest, CommandExecutionDTO } from '../../types/api';
import { apiRequest } from '../client';
import API_ENDPOINTS from '../endpoints';
import { MODULE_IDS, FAN_SPEEDS, BRIGHTNESS_LEVELS } from '../../config/moduleConstants';

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
   * Get command execution history for a module
   */
  async getCommandExecutions(moduleId: string): Promise<CommandExecutionDTO[]> {
    try {
      const response = await apiRequest<CommandExecutionDTO[]>('get', API_ENDPOINTS.MODULES.COMMAND_EXECUTIONS(moduleId));
      return response.data || [];
    } catch (error) {
      console.error(`Failed to fetch command executions for module ${moduleId}:`, error);
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
   * @param action - Action value (e.g., 1 for ON, 0 for OFF)
   */
  async sendCommand(moduleId: string, action: number): Promise<void> {
    try {
      const endpoint = API_ENDPOINTS.MODULES.SEND_COMMAND(moduleId);
      console.log('[moduleService] Sending command to module:', moduleId);
      console.log('[moduleService] Command endpoint:', endpoint);
      console.log('[moduleService] Command action:', action);
      const commandPayload: SendModuleCommandRequest = { action };
      await apiRequest<void>('post', endpoint, commandPayload);
      console.log('[moduleService] Command sent successfully');
    } catch (error) {
      console.error('[moduleService] Failed to send module command:', error);
      throw error;
    }
  }

  /**
   * Helper: Toggle module (send 1 for on, 0 for off)
   */
  async toggle(moduleId: string, on: boolean): Promise<void> {
    const action = on ? 1 : 0;
    return this.sendCommand(moduleId, action);
  }

  /**
   * Helper: Send command with value
   * Useful for brightness, speed, color, etc.
   * For now, simplified to send the value as action
   */
  async sendWithValue(moduleId: string, value: number): Promise<void> {
    return this.sendCommand(moduleId, value);
  }

  // ============================================================
  // DEVICE-SPECIFIC CONTROL METHODS (Using Hardcoded IDs)
  // ============================================================

  /**
   * Control FAN device
   */
  async controlFan(action: number): Promise<void> {
    return this.sendCommand(MODULE_IDS.FAN, action);
  }

  async toggleFan(on: boolean): Promise<void> {
    return this.toggle(MODULE_IDS.FAN, on);
  }

  async setFanSpeed(speed: number): Promise<void> {
    return this.sendCommand(MODULE_IDS.FAN, speed);
  }

  /**
   * Control LED RGB device
   */
  async controlLED(action: number): Promise<void> {
    return this.sendCommand(MODULE_IDS.LED_RGB, action);
  }

  async toggleLED(on: boolean): Promise<void> {
    return this.toggle(MODULE_IDS.LED_RGB, on);
  }

  async setLEDBrightness(brightness: number): Promise<void> {
    const value = Math.max(0, Math.min(100, brightness));
    return this.sendCommand(MODULE_IDS.LED_RGB, value);
  }

  /**
   * Control Light Sensor
   */
  async toggleLight(on: boolean): Promise<void> {
    return this.toggle(MODULE_IDS.LIGHT_SENSOR, on);
  }

  /**
   * Control Motion Sensor (read-only)
   */
  async getMotionStatus(): Promise<ModuleDTO> {
    return this.getModule(MODULE_IDS.MOTION_SENSOR);
  }

  /**
   * Control Temperature Sensor (read-only)
   */
  async getTemperature(): Promise<ModuleDTO> {
    return this.getModule(MODULE_IDS.TEMPERATURE_SENSOR);
  }

  /**
   * Control Humidity Sensor (read-only)
   */
  async getHumidity(): Promise<ModuleDTO> {
    return this.getModule(MODULE_IDS.HUMIDITY_SENSOR);
  }

  /**
   * Control LCD Display
   */
  async controlLCD(action: number): Promise<void> {
    return this.sendCommand(MODULE_IDS.LCD_DISPLAY, action);
  }

  async toggleLCD(on: boolean): Promise<void> {
    return this.toggle(MODULE_IDS.LCD_DISPLAY, on);
  }
}

export const moduleService = new ModuleService();
export default moduleService;
