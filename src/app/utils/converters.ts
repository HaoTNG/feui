/**
 * DTO to Frontend Model Converters
 * Transform backend API responses to frontend-friendly types
 */

import type {
  HomeDTO,
  RoomDTO,
  DeviceDTO,
  ModuleDTO,
  UserInfo,
  Home,
  Room,
  Device,
  Module,
  UserProfile,
  ModuleType,
} from '../types/api';

/**
 * Convert HomeDTO to Frontend Home model
 */
export function convertDTOToHome(dto: HomeDTO): Home {
  return {
    id: dto.id,
    name: dto.name,
    ownerUserId: dto.ownerUserId,
    ownerName: dto.ownerName,
    createdAt: new Date(dto.createdAt),
    updatedAt: new Date(dto.updatedAt),
    roomCount: 0, // Will be computed by frontend
    deviceCount: 0, // Will be computed by frontend
    isDefault: false, // Frontend can set this
  };
}

/**
 * Convert RoomDTO to Frontend Room model
 */
export function convertDTOToRoom(dto: RoomDTO): Room {
  return {
    id: dto.id,
    name: dto.name,
    homeId: dto.homeId,
    createdAt: new Date(dto.createdAt),
    updatedAt: new Date(dto.updatedAt),
    deviceCount: 0, // Will be computed by frontend
    // Environmental stats - can be populated from modules
    temperature: undefined,
    humidity: undefined,
    lightLevel: undefined,
  };
}

/**
 * Convert DeviceDTO to Frontend Device model
 */
export function convertDTOToDevice(dto: DeviceDTO): Device {
  return {
    id: dto.id,
    firmwareId: dto.firmwareId,
    name: dto.name,
    homeId: dto.homeId,
    roomId: dto.roomId,
    roomName: dto.roomName || 'Unassigned',
    createdAt: new Date(dto.createdAt),
    updatedAt: new Date(dto.updatedAt),
    modules: [],
    state: {},
    status: 'offline', // Will be updated when fetching device state
  };
}

/**
 * Convert ModuleDTO to Frontend Module model
 */
export function convertDTOToModule(dto: ModuleDTO): Module {
  return {
    id: dto.id,
    name: dto.name,
    type: dto.type,
    deviceChannelId: dto.deviceChannelId,
    deviceId: dto.deviceId,
    createdAt: new Date(dto.createdAt),
    value: undefined, // Will be populated from device state
    displayValue: undefined,
    unit: getUnitForModuleType(dto.type),
  };
}

/**
 * Convert UserInfo to Frontend UserProfile
 */
export function convertUserInfoToProfile(userInfo: UserInfo): UserProfile {
  return {
    id: userInfo.id,
    email: userInfo.email,
    name: userInfo.name,
    isActive: userInfo.isActive,
    createdAt: new Date(),
    updatedAt: new Date(),
    role: inferRoleFromEmail(userInfo.email),
  };
}

/**
 * Infer user role from email or default to 'family'
 */
function inferRoleFromEmail(email: string): 'owner' | 'family' | 'guest' {
  if (email.toLowerCase().includes('owner')) return 'owner';
  if (email.toLowerCase().includes('guest')) return 'guest';
  return 'family';
}

/**
 * Get display unit for module type
 */
export function getUnitForModuleType(type: ModuleType): string {
  const units: Record<ModuleType, string> = {
    TEMPERATURE: '°C',
    HUMIDITY: '%',
    LIGHT_SENSOR: 'lux',
    MOTION: 'bool',
    LIGHT: 'bool',
    FAN: 'bool',
    AC: '°C',
    WATER_HEATER: '°C',
  };
  return units[type] || '';
}

/**
 * Format module value for display
 */
export function formatModuleValue(module: Module): string {
  if (module.value === undefined || module.value === null) return 'N/A';
  
  if (typeof module.value === 'boolean') {
    return module.value ? 'ON' : 'OFF';
  }
  
  if (typeof module.value === 'number') {
    return `${module.value}${module.unit}`;
  }
  
  return String(module.value);
}

/**
 * Compute home stats from rooms and devices
 */
export function computeHomeStats(
  homeId: string,
  rooms: Room[],
  devices: Device[]
) {
  const homeRooms = rooms.filter(r => r.homeId === homeId);
  const homeDevices = devices.filter(d => d.homeId === homeId);
  
  return {
    roomCount: homeRooms.length,
    deviceCount: homeDevices.length,
  };
}

/**
 * Compute room stats from devices
 */
export function computeRoomStats(roomId: string | null, devices: Device[]) {
  if (!roomId) return { deviceCount: 0 };
  
  const roomDevices = devices.filter(d => d.roomId === roomId);
  
  return {
    deviceCount: roomDevices.length,
  };
}

/**
 * Parse device state JSON string
 */
export function parseDeviceState(stateJson: string | null | undefined): Record<string, any> {
  if (!stateJson) return {};
  
  try {
    return JSON.parse(stateJson);
  } catch (error) {
    console.error('Failed to parse device state:', error);
    return {};
  }
}

/**
 * Determine device status based on state
 */
export function determineDeviceStatus(
  state: Record<string, any> | null | undefined
): 'online' | 'offline' {
  // If state exists and is not empty, device is online
  if (state && Object.keys(state).length > 0) {
    return 'online';
  }
  return 'offline';
}

export default {
  convertDTOToHome,
  convertDTOToRoom,
  convertDTOToDevice,
  convertDTOToModule,
  convertUserInfoToProfile,
  getUnitForModuleType,
  formatModuleValue,
  computeHomeStats,
  computeRoomStats,
  parseDeviceState,
  determineDeviceStatus,
};
