/**
 * Mock Data Initializer
 * Provides mock devices, rooms, and modules for testing
 * Synchronized with WebSocket mock sensor data
 */

import type { Device, Module } from '../../types/api';

// Mock Room interface (to avoid circular dependency)
interface Room {
  id: string;
  name: string;
  homeId: string;
  deviceCount: number;
  temperature?: number;
  humidity?: number;
  lightLevel?: number;
  temperatureTrend?: 'stable' | 'rising' | 'falling';
  humidityStatus?: 'normal' | 'high' | 'low';
  lightStatus?: 'bright' | 'dim' | 'normal';
}

export const mockRooms: Room[] = [
  {
    id: 'living-room',
    name: 'Living Room',
    homeId: 'home-1',
    deviceCount: 2,
    temperature: 25.5,
    humidity: 50,
    lightLevel: 400,
    temperatureTrend: 'stable',
    humidityStatus: 'normal',
    lightStatus: 'normal',
  },
  {
    id: 'bedroom',
    name: 'Bedroom',
    homeId: 'home-1',
    deviceCount: 2,
    temperature: 26.9,
    humidity: 46.6,
    lightLevel: 80,
    temperatureTrend: 'stable',
    humidityStatus: 'normal',
    lightStatus: 'dim',
  },
];

export const mockDevices: Device[] = [
  {
    id: 'device-001',
    firmwareId: 'fw-light-001',
    name: 'Living Room Light Sensor',
    homeId: 'home-1',
    roomId: 'living-room',
    roomName: 'Living Room',
    createdAt: new Date(),
    updatedAt: new Date(),
    status: 'online',
    modules: [
      {
        id: '7e1292e7-c1e0-4022-903d-bf9b33a81f15',
        name: 'Light Sensor Module',
        type: 'LIGHT_SENSOR',
        deviceChannelId: '1',
        deviceId: 'device-001',
        createdAt: new Date(),
        value: 79,
        status: 'online',
      } as Module,
    ],
  },
  {
    id: 'device-002',
    firmwareId: 'fw-motion-001',
    name: 'Living Room Motion Sensor',
    homeId: 'home-1',
    roomId: 'living-room',
    roomName: 'Living Room',
    createdAt: new Date(),
    updatedAt: new Date(),
    status: 'online',
    modules: [
      {
        id: '1c574eea-402d-4c26-bc96-023e36bec1d9',
        name: 'Motion Sensor Module',
        type: 'MOTION',
        deviceChannelId: '1',
        deviceId: 'device-002',
        createdAt: new Date(),
        value: 0,
        status: 'online',
      } as Module,
    ],
  },
  {
    id: 'device-003',
    firmwareId: 'fw-temp-001',
    name: 'Bedroom Temperature Sensor',
    homeId: 'home-1',
    roomId: 'bedroom',
    roomName: 'Bedroom',
    createdAt: new Date(),
    updatedAt: new Date(),
    status: 'online',
    modules: [
      {
        id: 'f859fb5b-5670-4c7f-8d86-e9aecf580cad',
        name: 'Temperature Module',
        type: 'TEMPERATURE',
        deviceChannelId: '1',
        deviceId: 'device-003',
        createdAt: new Date(),
        value: 27.0,
        status: 'online',
      } as Module,
    ],
  },
  {
    id: 'device-004',
    firmwareId: 'fw-humidity-001',
    name: 'Bedroom Humidity Sensor',
    homeId: 'home-1',
    roomId: 'bedroom',
    roomName: 'Bedroom',
    createdAt: new Date(),
    updatedAt: new Date(),
    status: 'online',
    modules: [
      {
        id: 'cb8da9d0-2845-46f9-9941-9386f3173b94',
        name: 'Humidity Module',
        type: 'HUMIDITY',
        deviceChannelId: '1',
        deviceId: 'device-004',
        createdAt: new Date(),
        value: 46.6,
        status: 'online',
      } as Module,
    ],
  },
];

/**
 * Initialize mock data
 */
export function initializeMockData() {
  return {
    rooms: mockRooms,
    devices: mockDevices,
  };
}
