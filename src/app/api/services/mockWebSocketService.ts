/**
 * Mock WebSocket Service
 * Simulates sensor data from MongoDB for testing
 * Generates realistic WebSocket messages with temperature, humidity, light, and motion data
 */

import type { WebSocketData, WebSocketMessage } from './websocketService';

export interface SensorData {
  moduleId: string;
  value: string | number;
  type: 'light' | 'motion' | 'temperature' | 'humidity';
}

// Mock sensor data from MongoDB
const mockSensorData: SensorData[] = [
  {
    moduleId: '7e1292e7-c1e0-4022-903d-bf9b33a81f15',
    value: '79',
    type: 'light',
  },
  {
    moduleId: '1c574eea-402d-4c26-bc96-023e36bec1d9',
    value: '0',
    type: 'motion',
  },
  {
    moduleId: 'f859fb5b-5670-4c7f-8d86-e9aecf580cad',
    value: '27.0',
    type: 'temperature',
  },
  {
    moduleId: 'cb8da9d0-2845-46f9-9941-9386f3173b94',
    value: '46.6',
    type: 'humidity',
  },
  {
    moduleId: 'f859fb5b-5670-4c7f-8d86-e9aecf580cad',
    value: '26.9',
    type: 'temperature',
  },
  {
    moduleId: '7e1292e7-c1e0-4022-903d-bf9b33a81f15',
    value: '80',
    type: 'light',
  },
  {
    moduleId: '1c574eea-402d-4c26-bc96-023e36bec1d9',
    value: '0',
    type: 'motion',
  },
];

// Map moduleId to device and room
const moduleToDeviceMap: { [key: string]: { deviceId: string; roomId: string; deviceName: string } } = {
  '7e1292e7-c1e0-4022-903d-bf9b33a81f15': {
    deviceId: 'device-001',
    roomId: 'living-room',
    deviceName: 'Living Room Light Sensor',
  },
  '1c574eea-402d-4c26-bc96-023e36bec1d9': {
    deviceId: 'device-002',
    roomId: 'living-room',
    deviceName: 'Living Room Motion Sensor',
  },
  'f859fb5b-5670-4c7f-8d86-e9aecf580cad': {
    deviceId: 'device-003',
    roomId: 'bedroom',
    deviceName: 'Bedroom Temperature Sensor',
  },
  'cb8da9d0-2845-46f9-9941-9386f3173b94': {
    deviceId: 'device-004',
    roomId: 'bedroom',
    deviceName: 'Bedroom Humidity Sensor',
  },
};

type WebSocketCallback = (message: WebSocketMessage) => void;

class MockWebSocketService {
  private callbacks: Set<WebSocketCallback> = new Set();
  private intervalIds: ReturnType<typeof setInterval>[] = [];
  private isRunning = false;

  /**
   * Start simulating WebSocket messages
   */
  start(): void {
    if (this.isRunning) return;

    this.isRunning = true;
    console.log('[MockWebSocket] Starting simulation...');

    // Send initial data
    this.broadcastAllSensorData();

    // Simulate updates every 3-5 seconds per sensor
    mockSensorData.forEach((sensor, index) => {
      const delay = 3000 + Math.random() * 2000; // 3-5 seconds
      const intervalId = setInterval(() => {
        this.broadcastSensorUpdate(sensor);
      }, delay);
      this.intervalIds.push(intervalId);
    });

    // Occasionally send room stats update
    const roomStatsInterval = setInterval(() => {
      this.broadcastRoomStats();
    }, 8000);
    this.intervalIds.push(roomStatsInterval);
  }

  /**
   * Stop simulating WebSocket messages
   */
  stop(): void {
    this.isRunning = false;
    this.intervalIds.forEach((id) => clearInterval(id));
    this.intervalIds = [];
    console.log('[MockWebSocket] Simulation stopped');
  }

  /**
   * Subscribe to mock messages
   */
  onMessage(callback: WebSocketCallback): () => void {
    this.callbacks.add(callback);
    return () => {
      this.callbacks.delete(callback);
    };
  }

  /**
   * Broadcast all sensor data at once
   */
  private broadcastAllSensorData(): void {
    mockSensorData.forEach((sensor) => {
      this.broadcastSensorUpdate(sensor);
    });
  }

  /**
   * Broadcast a single sensor update with small random variation
   */
  private broadcastSensorUpdate(sensor: SensorData): void {
    const deviceInfo = moduleToDeviceMap[sensor.moduleId];
    if (!deviceInfo) return;

    let value: number;
    let message: WebSocketMessage;

    // Add slight variation to simulate real sensor changes
    const baseValue = parseFloat(String(sensor.value));
    const variation = (Math.random() - 0.5) * (sensor.type === 'temperature' ? 0.5 : 2);
    value = parseFloat((baseValue + variation).toFixed(1));

    // Create message based on sensor type
    switch (sensor.type) {
      case 'temperature':
        message = {
          type: 'module',
          data: {
            moduleId: sensor.moduleId,
            deviceId: deviceInfo.deviceId,
            status: 'online',
            temperature: value,
            value,
          },
          timestamp: Date.now(),
        };
        break;

      case 'humidity':
        message = {
          type: 'module',
          data: {
            moduleId: sensor.moduleId,
            deviceId: deviceInfo.deviceId,
            status: 'online',
            humidity: Math.round(value),
            value: Math.round(value),
          },
          timestamp: Date.now(),
        };
        break;

      case 'light':
        message = {
          type: 'module',
          data: {
            moduleId: sensor.moduleId,
            deviceId: deviceInfo.deviceId,
            status: 'online',
            value: Math.round(value),
            lux: Math.round(value),
          },
          timestamp: Date.now(),
        };
        break;

      case 'motion':
        message = {
          type: 'module',
          data: {
            moduleId: sensor.moduleId,
            deviceId: deviceInfo.deviceId,
            status: 'online',
            value: Math.round(value),
            motion: value > 0,
          },
          timestamp: Date.now(),
        };
        break;

      default:
        return;
    }

    this.broadcast(message);
  }

  /**
   * Broadcast room statistics based on current sensor data
   */
  private broadcastRoomStats(): void {
    const rooms = new Set<string>(Object.values(moduleToDeviceMap).map((info) => info.roomId));

    rooms.forEach((roomId) => {
      const roomSensors = Object.entries(moduleToDeviceMap)
        .filter(([_, info]) => info.roomId === roomId)
        .map(([moduleId, _]) => ({
          moduleId,
          sensor: mockSensorData.find((s) => s.moduleId === moduleId),
        }));

      // Calculate room stats
      const tempSensor = roomSensors.find((s) => s.sensor?.type === 'temperature');
      const humiditySensor = roomSensors.find((s) => s.sensor?.type === 'humidity');
      const lightSensor = roomSensors.find((s) => s.sensor?.type === 'light');

      const temperature = tempSensor ? parseFloat(String(tempSensor.sensor?.value)) : 24;
      const humidity = humiditySensor ? parseFloat(String(humiditySensor.sensor?.value)) : 50;
      const lux = lightSensor ? parseFloat(String(lightSensor.sensor?.value)) : 400;

      // Determine trends and status
      const temperatureTrend: 'stable' | 'rising' | 'falling' =
        ['stable', 'rising', 'falling'][Math.floor(Math.random() * 3)] as any;
      const humidityStatus: 'normal' | 'high' | 'low' =
        humidity > 60 ? 'high' : humidity < 30 ? 'low' : 'normal';
      const lightStatus: 'bright' | 'dim' | 'normal' =
        lux > 600 ? 'bright' : lux < 200 ? 'dim' : 'normal';

      const message: WebSocketMessage = {
        type: 'room',
        data: {
          roomId,
          temperature: parseFloat(temperature.toFixed(1)),
          humidity: parseFloat(humidity.toFixed(1)),
          lightLevel: Math.round(lux),
          temperatureTrend,
          humidityStatus,
          lightStatus,
        },
        timestamp: Date.now(),
      };

      this.broadcast(message);
    });
  }

  /**
   * Broadcast message to all subscribers
   */
  private broadcast(message: WebSocketMessage): void {
    console.log('[MockWebSocket] Broadcasting:', message.type, message.data);
    this.callbacks.forEach((callback) => {
      try {
        callback(message);
      } catch (error) {
        console.error('[MockWebSocket] Error in callback:', error);
      }
    });
  }

  /**
   * Add a new sensor data
   */
  addSensorData(sensor: SensorData): void {
    mockSensorData.push(sensor);
    console.log('[MockWebSocket] Added sensor:', sensor);
  }

  /**
   * Get all mock sensor data
   */
  getSensorData(): SensorData[] {
    return mockSensorData;
  }
}

export const mockWebSocketService = new MockWebSocketService();
export default mockWebSocketService;
