/**
 * Automation Service
 * Handles automation CRUD operations
 */

import type {
  AutomationDTO,
  CreateAutomationRequest,
  UpdateAutomationRequest,
  AutomationActionDTO,
  AddAutomationActionRequest,
  UpdateAutomationActionRequest,
  CommandTemplateDTO,
} from '../../types/api';
import { apiRequest } from '../client';
import API_ENDPOINTS from '../endpoints';

class AutomationService {
  /**
   * Get all automations
   */
  async getAllAutomations(): Promise<AutomationDTO[]> {
    try {
      const response = await apiRequest<AutomationDTO[]>('get', API_ENDPOINTS.AUTOMATIONS.LIST);
      return response.data || [];
    } catch (error) {
      console.error('Failed to fetch automations:', error);
      throw error;
    }
  }

  /**
   * Create new automation
   */
  async createAutomation(request: CreateAutomationRequest): Promise<AutomationDTO> {
    try {
      const response = await apiRequest<AutomationDTO>('post', API_ENDPOINTS.AUTOMATIONS.CREATE, request);
      if (!response.data) {
        throw new Error('Failed to create automation');
      }
      return response.data;
    } catch (error) {
      console.error('Failed to create automation:', error);
      throw error;
    }
  }

  /**
   * Update automation
   */
  async updateAutomation(automationId: string, request: UpdateAutomationRequest): Promise<AutomationDTO> {
    try {
      const response = await apiRequest<AutomationDTO>('put', API_ENDPOINTS.AUTOMATIONS.UPDATE(automationId), request);
      if (!response.data) {
        throw new Error('Failed to update automation');
      }
      return response.data;
    } catch (error) {
      console.error('Failed to update automation:', error);
      throw error;
    }
  }

  /**
   * Delete automation
   */
  async deleteAutomation(automationId: string): Promise<void> {
    try {
      await apiRequest<void>('delete', API_ENDPOINTS.AUTOMATIONS.DELETE(automationId));
    } catch (error) {
      console.error('Failed to delete automation:', error);
      throw error;
    }
  }

  /**
   * Get automation actions
   */
  async getAutomationActions(automationId: string): Promise<AutomationActionDTO[]> {
    try {
      const response = await apiRequest<AutomationActionDTO[]>('get', API_ENDPOINTS.AUTOMATIONS.LIST_ACTIONS(automationId));
      return response.data || [];
    } catch (error) {
      console.error('Failed to fetch automation actions:', error);
      throw error;
    }
  }

  /**
   * Add action to automation
   */
  async addAutomationAction(automationId: string, request: AddAutomationActionRequest): Promise<AutomationActionDTO> {
    try {
      const response = await apiRequest<AutomationActionDTO>('post', API_ENDPOINTS.AUTOMATIONS.ADD_ACTION(automationId), request);
      if (!response.data) {
        throw new Error('Failed to add automation action');
      }
      return response.data;
    } catch (error) {
      console.error('Failed to add automation action:', error);
      throw error;
    }
  }

  /**
   * Update automation action
   */
  async updateAutomationAction(
    automationId: string,
    actionId: string,
    request: UpdateAutomationActionRequest
  ): Promise<AutomationActionDTO> {
    try {
      const response = await apiRequest<AutomationActionDTO>(
        'put',
        API_ENDPOINTS.AUTOMATIONS.UPDATE_ACTION(automationId, actionId),
        request
      );
      if (!response.data) {
        throw new Error('Failed to update automation action');
      }
      return response.data;
    } catch (error) {
      console.error('Failed to update automation action:', error);
      throw error;
    }
  }

  /**
   * Get all command templates
   */
  async getCommandTemplates(): Promise<CommandTemplateDTO[]> {
    try {
      const response = await apiRequest<CommandTemplateDTO[]>('get', API_ENDPOINTS.AUTOMATIONS.LIST_TEMPLATES);
      return response.data || [];
    } catch (error) {
      console.error('Failed to fetch command templates:', error);
      throw error;
    }
  }
}

export const automationService = new AutomationService();
export default automationService;
