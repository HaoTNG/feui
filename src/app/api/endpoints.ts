/**
 * API Endpoints Constants
 * Centralized endpoint definitions matching backend API
 */

export const API_ENDPOINTS = {
  // ============================================================
  // AUTHENTICATION
  // ============================================================
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
  },

  // ============================================================
  // USER
  // ============================================================
  USERS: {
    ME: '/users/me',
    UPDATE_PROFILE: '/users/me',
  },

  // ============================================================
  // HOMES
  // ============================================================
  HOMES: {
    LIST: '/homes',
    CREATE: '/homes',
    GET: (homeId: string) => `/homes/${homeId}`,
    UPDATE: (homeId: string) => `/homes/${homeId}`,
    DELETE: (homeId: string) => `/homes/${homeId}`,
  },

  // ============================================================
  // HOME MEMBERS
  // ============================================================
  HOME_MEMBERS: {
    LIST: (homeId: string) => `/homes/${homeId}/members`,
    ADD: (homeId: string) => `/homes/${homeId}/members`,
    REMOVE: (homeId: string, userId: string) => `/homes/${homeId}/members/${userId}`,
    LEAVE: (homeId: string) => `/homes/${homeId}/members/me`,
  },

  // ============================================================
  // ROOMS
  // ============================================================
  ROOMS: {
    LIST: (homeId: string) => `/homes/${homeId}/rooms`,
    CREATE: (homeId: string) => `/homes/${homeId}/rooms`,
    GET: (roomId: string) => `/rooms/${roomId}`,
    UPDATE: (roomId: string) => `/rooms/${roomId}`,
    DELETE: (roomId: string) => `/rooms/${roomId}`,
  },

  // ============================================================
  // DEVICES
  // ============================================================
  DEVICES: {
    LIST: (homeId: string) => `/homes/${homeId}/devices`,
    CREATE: (homeId: string) => `/homes/${homeId}/devices`,
    GET: (deviceId: string) => `/devices/${deviceId}`,
    UPDATE_NAME: (deviceId: string) => `/devices/${deviceId}/name`,
    MOVE_ROOM: (deviceId: string) => `/devices/${deviceId}/move-room`,
    DELETE: (deviceId: string) => `/devices/${deviceId}`,
    // Device Control
    SEND_COMMAND: (deviceId: string) => `/devices/${deviceId}/commands`,
    GET_STATE: (deviceId: string) => `/devices/${deviceId}/state`,
  },

  // ============================================================
  // MODULES
  // ============================================================
  MODULES: {
    ADD: (deviceId: string) => `/devices/${deviceId}/modules`,
    GET: (moduleId: string) => `/modules/${moduleId}`,
    UPDATE_NAME: (moduleId: string) => `/modules/${moduleId}/name`,
    DELETE: (moduleId: string) => `/modules/${moduleId}`,
  },
} as const;

export default API_ENDPOINTS;
