/**
 * API HTTP Client with Interceptors
 * Handles authentication, error handling, and request/response transformation
 */

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import type { ApiResponse, ApiErrorResponse } from '../types/api';

// Configuration
const API_BASE_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:8080';
const USE_MOCK_API = (import.meta as any).env.VITE_USE_MOCK === 'true';

// Create axios instance
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: unknown) => {
    if (error instanceof AxiosError) {
      // Handle 401 Unauthorized - token expired or invalid
      if (error.response?.status === 401) {
        // Clear token and redirect to login
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        
        // Redirect to login (will be handled by ProtectedRoute)
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/login';
        }
      }

      // Handle 403 Forbidden - no permission
      if (error.response?.status === 403) {
        console.warn('Access denied:', error.response.data?.message);
      }

      // Log error details
      console.error('API Error:', {
        status: error.response?.status,
        message: error.response?.data?.message,
        data: error.response?.data?.data,
      });
    }

    return Promise.reject(error);
  }
);

export const apiClient = axiosInstance;
export const isUsingMockAPI = USE_MOCK_API;

/**
 * Generic API request wrapper with type support
 */
export async function apiRequest<T = any>(
  method: 'get' | 'post' | 'patch' | 'delete' | 'put',
  url: string,
  data?: any
): Promise<ApiResponse<T>> {
  try {
    const response = await axiosInstance({
      method,
      url,
      data,
    });
    return response.data as ApiResponse<T>;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw {
        statusCode: error.response?.status,
        message: error.response?.data?.message || error.message,
        data: null,
      } as ApiErrorResponse;
    }
    throw error;
  }
}

export default apiClient;
