/**
 * Alert Rule Service
 * Handles alert rule CRUD operations for modules
 */

import type { AlertRuleDTO, CreateAlertRuleRequest, UpdateAlertRuleRequest } from '../../types/api';
import { apiRequest } from '../client';
import API_ENDPOINTS from '../endpoints';

class AlertRuleService {
  /**
   * Get all alert rules for a module
   */
  async getAlertRules(moduleId: string): Promise<AlertRuleDTO[]> {
    try {
      const response = await apiRequest<AlertRuleDTO[]>('get', API_ENDPOINTS.MODULES.ALERTS_LIST(moduleId));
      return response.data ?? [];
    } catch (error) {
      console.error(`Failed to fetch alert rules for module ${moduleId}:`, error);
      throw error;
    }
  }

  /**
   * Create a new alert rule for a module
   */
  async createAlertRule(moduleId: string, payload: CreateAlertRuleRequest): Promise<AlertRuleDTO> {
    try {
      const response = await apiRequest<AlertRuleDTO>('post', API_ENDPOINTS.MODULES.ALERTS_CREATE(moduleId), payload);
      if (!response.data) {
        throw new Error('Failed to create alert rule');
      }
      return response.data;
    } catch (error) {
      console.error('Failed to create alert rule:', error);
      throw error;
    }
  }

  /**
   * Update an existing alert rule
   */
  async updateAlertRule(moduleId: string, ruleId: string, payload: UpdateAlertRuleRequest): Promise<AlertRuleDTO> {
    try {
      const response = await apiRequest<AlertRuleDTO>(
        'put',
        API_ENDPOINTS.MODULES.ALERTS_UPDATE(moduleId, ruleId),
        payload
      );
      if (!response.data) {
        throw new Error('Failed to update alert rule');
      }
      return response.data;
    } catch (error) {
      console.error('Failed to update alert rule:', error);
      throw error;
    }
  }

  /**
   * Delete an alert rule
   */
  async deleteAlertRule(moduleId: string, ruleId: string): Promise<void> {
    try {
      await apiRequest<void>('delete', API_ENDPOINTS.MODULES.ALERTS_DELETE(moduleId, ruleId));
    } catch (error) {
      console.error('Failed to delete alert rule:', error);
      throw error;
    }
  }

  /**
   * Toggle alert rule enabled/disabled
   */
  async toggleAlertRule(moduleId: string, ruleId: string, enabled: boolean): Promise<AlertRuleDTO> {
    return this.updateAlertRule(moduleId, ruleId, { enabled });
  }
}

export const alertRuleService = new AlertRuleService();
export default alertRuleService;
