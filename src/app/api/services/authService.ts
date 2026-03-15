/**
 * Authentication Service
 * Handles login, logout, and token management
 */

import type { LoginRequest, ApiResponse, UserInfo } from '../../types/api';
import { apiClient, apiRequest } from '../client';
import API_ENDPOINTS from '../endpoints';

class AuthService {
  /**
   * Login with email and password
   */
  async login(email: string, password: string): Promise<{ accessToken: string; user: UserInfo }> {
    try {
      console.log('[AuthService] Attempting login for:', email);
      const response = await apiRequest<{
        accessToken: string;
        user: UserInfo;
      }>('post', API_ENDPOINTS.AUTH.LOGIN, { email, password });

      console.log('[AuthService] Login response:', response);

      if (!response.data) {
        throw new Error('Invalid response from login endpoint');
      }

      console.log('[AuthService] Login successful, storing token and user data');
      // Store token
      localStorage.setItem('authToken', response.data.accessToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      return response.data;
    } catch (error) {
      console.error('[AuthService] Login failed:', error);
      throw error;
    }
  }

  /**
   * Logout - clear tokens and user data
   */
  async logout(): Promise<void> {
    try {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      // Optionally call backend logout endpoint
      // await apiRequest('post', API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  }

  /**
   * Get stored token
   */
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Get stored user info
   */
  getStoredUser(): UserInfo | null {
    const stored = localStorage.getItem('user');
    if (!stored) return null;
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }
}

export const authService = new AuthService();
export default authService;
