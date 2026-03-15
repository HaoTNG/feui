/**
 * Room Service
 * Handles room CRUD operations
 */

import type { ApiResponse, RoomDTO, CreateRoomRequest, UpdateRoomRequest } from '../../types/api';
import { apiRequest } from '../client';
import API_ENDPOINTS from '../endpoints';

class RoomService {
  /**
   * Get all rooms in a home
   */
  async getRoomsByHome(homeId: string): Promise<RoomDTO[]> {
    try {
      const response = await apiRequest<RoomDTO[]>('get', API_ENDPOINTS.ROOMS.LIST(homeId));
      return response.data || [];
    } catch (error) {
      console.error(`Failed to fetch rooms for home ${homeId}:`, error);
      throw error;
    }
  }

  /**
   * Get single room details
   */
  async getRoom(roomId: string): Promise<RoomDTO> {
    try {
      const response = await apiRequest<RoomDTO>('get', API_ENDPOINTS.ROOMS.GET(roomId));
      if (!response.data) {
        throw new Error(`Room ${roomId} not found`);
      }
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch room ${roomId}:`, error);
      throw error;
    }
  }

  /**
   * Create new room
   */
  async createRoom(homeId: string, name: string): Promise<RoomDTO> {
    try {
      const payload: CreateRoomRequest = { name };
      const response = await apiRequest<RoomDTO>('post', API_ENDPOINTS.ROOMS.CREATE(homeId), payload);
      if (!response.data) {
        throw new Error('Failed to create room');
      }
      return response.data;
    } catch (error) {
      console.error('Failed to create room:', error);
      throw error;
    }
  }

  /**
   * Update room
   */
  async updateRoom(roomId: string, name: string): Promise<RoomDTO> {
    try {
      const payload: UpdateRoomRequest = { name };
      const response = await apiRequest<RoomDTO>('patch', API_ENDPOINTS.ROOMS.UPDATE(roomId), payload);
      if (!response.data) {
        throw new Error('Failed to update room');
      }
      return response.data;
    } catch (error) {
      console.error('Failed to update room:', error);
      throw error;
    }
  }

  /**
   * Delete room
   */
  async deleteRoom(roomId: string): Promise<void> {
    try {
      await apiRequest<void>('delete', API_ENDPOINTS.ROOMS.DELETE(roomId));
    } catch (error) {
      console.error('Failed to delete room:', error);
      throw error;
    }
  }
}

export const roomService = new RoomService();
export default roomService;
