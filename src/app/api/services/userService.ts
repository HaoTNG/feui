/**
 * User Service
 * Handles user profile operations
 */

import type { ApiResponse, User, UpdateUserRequest } from '../../types/api';
import { apiRequest } from '../client';
import API_ENDPOINTS from '../endpoints';

class UserService {
  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<User> {
    try {
      const response = await apiRequest<User>('get', API_ENDPOINTS.USERS.ME);
      if (!response.data) {
        throw new Error('Failed to fetch current user');
      }
      return response.data;
    } catch (error) {
      console.error('Failed to fetch current user:', error);
      throw error;
    }
  }

  /**
   * Update current user profile
   */
  async updateProfile(updates: UpdateUserRequest): Promise<User> {
    try {
      const response = await apiRequest<User>('patch', API_ENDPOINTS.USERS.UPDATE_PROFILE, updates);
      if (!response.data) {
        throw new Error('Failed to update user profile');
      }
      return response.data;
    } catch (error) {
      console.error('Failed to update user profile:', error);
      throw error;
    }
  }
}

export const userService = new UserService();
export default userService;
