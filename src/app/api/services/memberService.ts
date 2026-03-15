/**
 * Member Service
 * Handles home member operations
 */

import type { ApiResponse, HomeMember, AddMemberRequest } from '../../types/api';
import { apiRequest } from '../client';
import API_ENDPOINTS from '../endpoints';

class MemberService {
  /**
   * Get all members in a home
   */
  async getMembers(homeId: string): Promise<HomeMember[]> {
    try {
      const response = await apiRequest<HomeMember[]>('get', API_ENDPOINTS.HOME_MEMBERS.LIST(homeId));
      return response.data || [];
    } catch (error) {
      console.error(`Failed to fetch members for home ${homeId}:`, error);
      throw error;
    }
  }

  /**
   * Add member to home
   */
  async addMember(homeId: string, email: string): Promise<HomeMember> {
    try {
      const payload: AddMemberRequest = { email };
      const response = await apiRequest<HomeMember>('post', API_ENDPOINTS.HOME_MEMBERS.ADD(homeId), payload);
      if (!response.data) {
        throw new Error('Failed to add member');
      }
      return response.data;
    } catch (error) {
      console.error('Failed to add member:', error);
      throw error;
    }
  }

  /**
   * Remove member from home
   */
  async removeMember(homeId: string, userId: string): Promise<void> {
    try {
      await apiRequest<void>('delete', API_ENDPOINTS.HOME_MEMBERS.REMOVE(homeId, userId));
    } catch (error) {
      console.error('Failed to remove member:', error);
      throw error;
    }
  }

  /**
   * Leave home (current user)
   */
  async leaveHome(homeId: string): Promise<void> {
    try {
      await apiRequest<void>('delete', API_ENDPOINTS.HOME_MEMBERS.LEAVE(homeId));
    } catch (error) {
      console.error('Failed to leave home:', error);
      throw error;
    }
  }
}

export const memberService = new MemberService();
export default memberService;
