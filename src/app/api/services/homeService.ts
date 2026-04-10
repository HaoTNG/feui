/**
 * Home Service
 * Handles home CRUD operations
 */

import type { ApiResponse, HomeDTO, CreateHomeRequest, UpdateHomeRequest } from '../../types/api';
import type { Home } from '../../contexts/AppContext';
import { apiRequest } from '../client';
import API_ENDPOINTS from '../endpoints';
import { convertDTOToHome } from '../../utils/converters';

class HomeService {
  /**
   * Get all homes for current user
   */
  async getHomes(): Promise<Home[]> {
    try {
      const response = await apiRequest<HomeDTO[]>('get', API_ENDPOINTS.HOMES.LIST);
      return (response.data || []).map(dto => convertDTOToHome(dto));
    } catch (error) {
      console.error('Failed to fetch homes:', error);
      throw error;
    }
  }

  /**
   * Get single home details
   */
  async getHome(homeId: string): Promise<Home> {
    try {
      const response = await apiRequest<HomeDTO>('get', API_ENDPOINTS.HOMES.GET(homeId));
      if (!response.data) {
        throw new Error(`Home ${homeId} not found`);
      }
      return convertDTOToHome(response.data);
    } catch (error) {
      console.error(`Failed to fetch home ${homeId}:`, error);
      throw error;
    }
  }

  /**
   * Create new home
   */
  async createHome(name: string): Promise<Home> {
    try {
      const payload: CreateHomeRequest = { name };
      const response = await apiRequest<HomeDTO>('post', API_ENDPOINTS.HOMES.CREATE, payload);
      if (!response.data) {
        throw new Error('Failed to create home');
      }
      return convertDTOToHome(response.data);
    } catch (error) {
      console.error('Failed to create home:', error);
      throw error;
    }
  }

  /**
   * Update home
   */
  async updateHome(homeId: string, name: string): Promise<Home> {
    try {
      const payload: UpdateHomeRequest = { name };
      const response = await apiRequest<HomeDTO>('patch', API_ENDPOINTS.HOMES.UPDATE(homeId), payload);
      if (!response.data) {
        throw new Error('Failed to update home');
      }
      return convertDTOToHome(response.data);
    } catch (error) {
      console.error('Failed to update home:', error);
      throw error;
    }
  }

  /**
   * Delete home
   */
  async deleteHome(homeId: string): Promise<void> {
    try {
      await apiRequest<void>('delete', API_ENDPOINTS.HOMES.DELETE(homeId));
    } catch (error) {
      console.error('Failed to delete home:', error);
      throw error;
    }
  }
}

export const homeService = new HomeService();
export default homeService;
