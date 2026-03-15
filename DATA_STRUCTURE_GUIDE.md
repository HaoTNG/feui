# 📊 Frontend Data Structure - API Mapping Guide

## 🎯 Mục Tiêu
Cung cấp bộ types/interfaces chính xác mapping giữa Backend API và Frontend state/components.

---

## 📋 Tóm Tắt Data Flow

```
Backend API Response (DTOs)
    ↓
Convert to Frontend Models
    ↓
Store in AppContext State
    ↓
Components render with correct types
```

---

## 🔄 Data Transformations

### 1. **Login Response → User State**

**Backend Response:**
```json
{
  "statusCode": 200,
  "message": "Login success",
  "data": {
    "accessToken": "eyJhbGc...",
    "user": {
      "id": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
      "email": "owner_test@gmail.com",
      "name": "Test Owner",
      "isActive": true
    }
  }
}
```

**Frontend State:**
```typescript
// Store in localStorage
localStorage.setItem('authToken', response.data.accessToken);

// Store in AppContext
const user: UserProfile = {
  id: response.data.user.id,
  email: response.data.user.email,
  name: response.data.user.name,
  isActive: response.data.user.isActive,
  role: 'owner', // Infer from email or API
};
```

---

### 2. **HomeDTO → Frontend Home**

**Backend Response:**
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": [
    {
      "id": "c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33",
      "name": "My Smart Home",
      "ownerUserId": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
      "ownerName": "Test Owner",
      "createdAt": "2026-03-06T16:00:00Z",
      "updatedAt": "2026-03-06T16:00:00Z"
    }
  ]
}
```

**Frontend Transformation:**
```typescript
const home: Home = {
  id: dto.id,
  name: dto.name,
  ownerUserId: dto.ownerUserId,
  ownerName: dto.ownerName,
  createdAt: new Date(dto.createdAt),
  updatedAt: new Date(dto.updatedAt),
  // Computed on frontend
  roomCount: rooms.filter(r => r.homeId === home.id).length,
  deviceCount: devices.filter(d => d.homeId === home.id).length,
};
```

---

### 3. **RoomDTO → Frontend Room**

**Backend Response:**
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": [
    {
      "id": "d3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44",
      "name": "Living Room",
      "homeId": "c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33",
      "createdAt": "2026-03-06T17:30:00Z",
      "updatedAt": "2026-03-06T17:30:00Z"
    }
  ]
}
```

**Frontend Transformation:**
```typescript
const room: Room = {
  id: dto.id,
  name: dto.name,
  homeId: dto.homeId,
  createdAt: new Date(dto.createdAt),
  updatedAt: new Date(dto.updatedAt),
  // Computed
  deviceCount: devices.filter(d => d.roomId === room.id).length,
  // Environmental data (from modules if available)
  temperature: undefined, // Will be populated from device state
  humidity: undefined,
  lightLevel: undefined,
};
```

---

### 4. **DeviceDTO → Frontend Device**

**Backend Response:**
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": [
    {
      "id": "e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a55",
      "firmwareId": "fe45nkhiz",
      "name": "Living Room Light",
      "homeId": "c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33",
      "roomId": "d3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44",
      "roomName": "Living Room",
      "createdAt": "2026-03-06T18:30:00Z",
      "updatedAt": "2026-03-06T19:00:00Z"
    }
  ]
}
```

**Frontend Transformation:**
```typescript
const device: Device = {
  id: dto.id,
  firmwareId: dto.firmwareId,
  name: dto.name,
  homeId: dto.homeId,
  roomId: dto.roomId,
  roomName: dto.roomName || 'Unassigned',
  createdAt: new Date(dto.createdAt),
  updatedAt: new Date(dto.updatedAt),
  // Populated separately
  modules: [], // Get from GET /devices/{deviceId}/modules
  state: {}, // Get from GET /devices/{deviceId}/state
  status: 'online', // Infer from module data
};
```

---

### 5. **ModuleDTO → Frontend Module**

**Backend Response:**
```json
{
  "statusCode": 201,
  "message": "Module added successfully",
  "data": {
    "id": "fd89fc7b-ef78-4614-98f1-a9d2645efde3",
    "name": "DHT-20",
    "type": "TEMPERATURE",
    "deviceChannelId": "2134af50-e553-495c-bf32-71e4da0e349a",
    "deviceId": "2286f3d7-33dd-48b4-940c-1511886d7521",
    "createdAt": "2026-03-06T18:30:00Z"
  }
}
```

**Frontend Transformation:**
```typescript
const module: Module = {
  id: dto.id,
  name: dto.name,
  type: dto.type,
  deviceChannelId: dto.deviceChannelId,
  deviceId: dto.deviceId,
  createdAt: new Date(dto.createdAt),
  // Populated from device state
  value: 24.5, // Current reading
  displayValue: "24.5°C",
  unit: getUnitForModuleType(dto.type),
};

// Helper function
function getUnitForModuleType(type: ModuleType): string {
  const units: Record<ModuleType, string> = {
    TEMPERATURE: "°C",
    HUMIDITY: "%",
    LIGHT_SENSOR: "lux",
    MOTION: "bool",
    LIGHT: "bool",
    FAN: "bool",
    AC: "°C",
    WATER_HEATER: "°C",
  };
  return units[type] || "";
}
```

---

## 🗂️ AppContext Data Structure (Updated)

### Current State vs New State (With Backend)

**OLD (In-memory only):**
```typescript
interface AppContextType {
  // In-memory arrays
  homes: Home[];
  hubs: Hub[];
  modules: Module[];
  devices: Device[];
  rooms: Room[];
  activities: Activity[];
  
  // Methods
  addHome: (home: Home) => void;
  updateDevice: (id: string, updates: Partial<Device>) => void;
}
```

**NEW (With Backend API):**
```typescript
interface AppContextType {
  // Data from backend
  homes: Home[];
  rooms: Room[];
  devices: Device[];
  users: User[];
  members: HomeMember[];
  
  // Auth
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  
  // State management
  selectedHomeId: string | null;
  setSelectedHomeId: (homeId: string) => void;
  
  // Data loading
  loading: boolean;
  error: string | null;
  
  // Async methods (call backend API)
  createHome: (name: string) => Promise<Home>;
  updateHome: (homeId: string, name: string) => Promise<Home>;
  deleteHome: (homeId: string) => Promise<void>;
  
  createRoom: (homeId: string, name: string) => Promise<Room>;
  updateRoom: (roomId: string, name: string) => Promise<Room>;
  deleteRoom: (roomId: string) => Promise<void>;
  
  createDevice: (homeId: string, payload: CreateDeviceRequest) => Promise<Device>;
  updateDeviceName: (deviceId: string, name: string) => Promise<Device>;
  moveDevice: (deviceId: string, roomId: string | null) => Promise<Device>;
  deleteDevice: (deviceId: string) => Promise<void>;
  
  sendCommand: (deviceId: string, command: DeviceCommand, value: any) => Promise<void>;
  getDeviceState: (deviceId: string) => Promise<DeviceState>;
  
  // Local activity log (frontend-only)
  activities: Activity[];
  addActivity: (activity: Omit<Activity, 'id' | 'timestamp'>) => void;
}
```

---

## 📊 Data Consistency Rules

### 1. **Homes**
- Always populated from `GET /homes`
- When creating/updating, replace in local state
- When deleting, remove from state

### 2. **Rooms**
- Only contains rooms from selected home
- When adding room, filter by `homeId === selectedHomeId`
- When deleting room, devices move to "Unassigned"

### 3. **Devices**
- Contains devices from selected home
- Each device has a `roomId` (can be null = Unassigned)
- Modules are nested inside device
- State is separate, fetched on demand

### 4. **Modules**
- Each module belongs to a device
- Not stored globally, but within device object
- Retrieved when viewing device details

### 5. **Activities**
- Frontend-only logging (not from backend)
- Log every user action for history view
- Cleared when logout or switch home

---

## 🔄 API Call Patterns

### Pattern 1: Fetch Homes on Mount

```typescript
useEffect(() => {
  const loadHomes = async () => {
    try {
      const response = await apiClient.get<ApiResponse<HomeDTO[]>>('/homes');
      const homes: Home[] = response.data.data.map(convertDTOToHome);
      setHomes(homes);
      
      // Select first home by default
      if (homes.length > 0) {
        setSelectedHomeId(homes[0].id);
      }
    } catch (error) {
      console.error('Failed to load homes:', error);
      setError('Failed to load homes');
    }
  };
  
  loadHomes();
}, []);
```

### Pattern 2: Load Rooms & Devices for Selected Home

```typescript
useEffect(() => {
  if (!selectedHomeId) return;
  
  const loadHomeData = async () => {
    try {
      // Load rooms
      const roomsRes = await apiClient.get<ApiResponse<RoomDTO[]>>(
        `/homes/${selectedHomeId}/rooms`
      );
      const rooms: Room[] = roomsRes.data.data.map(convertDTOToRoom);
      setRooms(rooms);
      
      // Load devices
      const devicesRes = await apiClient.get<ApiResponse<DeviceDTO[]>>(
        `/homes/${selectedHomeId}/devices`
      );
      const devices: Device[] = devicesRes.data.data.map(convertDTOToDevice);
      setDevices(devices);
    } catch (error) {
      console.error('Failed to load home data:', error);
      setError('Failed to load home data');
    }
  };
  
  loadHomeData();
}, [selectedHomeId]);
```

### Pattern 3: Create Entity

```typescript
const createRoom = async (homeId: string, name: string): Promise<Room> => {
  try {
    const response = await apiClient.post<ApiResponse<RoomDTO>>(
      `/homes/${homeId}/rooms`,
      { name }
    );
    
    const newRoom: Room = convertDTOToRoom(response.data.data);
    setRooms(prev => [...prev, newRoom]);
    
    // Log activity
    addActivity({
      type: 'user',
      action: `Created room "${name}"`,
      detail: 'via Web Dashboard',
      success: true,
    });
    
    return newRoom;
  } catch (error) {
    console.error('Failed to create room:', error);
    throw error;
  }
};
```

### Pattern 4: Send Device Command

```typescript
const sendCommand = async (
  deviceId: string,
  command: DeviceCommand,
  value: any
): Promise<void> => {
  try {
    await apiClient.post<ApiResponse<void>>(
      `/devices/${deviceId}/commands`,
      { command, value }
    );
    
    // Update local device state optimistically
    setDevices(prev => prev.map(d => 
      d.id === deviceId 
        ? { ...d, state: { ...d.state, [getStateKey(command)]: value } }
        : d
    ));
    
    // Log activity
    addActivity({
      type: 'user',
      deviceId,
      deviceName: devices.find(d => d.id === deviceId)?.name,
      action: `Sent ${command} to device`,
      detail: `Value: ${value}`,
      success: true,
    });
  } catch (error) {
    console.error('Failed to send command:', error);
    throw error;
  }
};

function getStateKey(command: DeviceCommand): string {
  const keys: Record<DeviceCommand, string> = {
    POWER: 'power',
    SET_BRIGHTNESS: 'brightness',
    SET_TEMPERATURE: 'temperature',
    SET_SPEED: 'speed',
    SET_COLOR: 'color',
  };
  return keys[command] || 'unknown';
}
```

---

## 🎨 Component Props - Updated

### OLD (Mock Data)
```typescript
interface DeviceCardProps {
  device: Device;
  onClick: () => void;
}
```

### NEW (With Real Data)
```typescript
interface DeviceCardProps {
  device: Device;
  onClick: () => void;
  onCommand: (command: DeviceCommand, value: any) => Promise<void>;
  loading?: boolean;
}

// Usage
<DeviceCard
  device={device}
  onClick={handleClick}
  onCommand={async (cmd, val) => {
    try {
      setLoading(true);
      await sendCommand(device.id, cmd, val);
      showToast('Command sent', 'success');
    } catch (error) {
      showToast('Failed to send command', 'error');
    } finally {
      setLoading(false);
    }
  }}
  loading={isLoading}
/>
```

---

## 🔐 Error Handling

### Backend Error Response:
```json
{
  "statusCode": 401,
  "message": "Invalid email or password",
  "data": null
}
```

### Frontend Error Handler:
```typescript
try {
  await apiClient.post('/auth/login', { email, password });
} catch (error: any) {
  if (error.response?.status === 401) {
    showToast('Invalid credentials', 'error');
  } else if (error.response?.status === 400) {
    showToast(error.response.data.message, 'error');
  } else if (error.code === 'ECONNREFUSED') {
    showToast('Backend server not responding', 'error');
  } else {
    showToast('An error occurred', 'error');
  }
}
```

---

## 📝 Conversion Helper Functions

```typescript
// src/app/utils/converters.ts

import type { 
  HomeDTO, RoomDTO, DeviceDTO, ModuleDTO,
  Home, Room, Device, Module 
} from '../types/api';

export function convertDTOToHome(dto: HomeDTO): Home {
  return {
    id: dto.id,
    name: dto.name,
    ownerUserId: dto.ownerUserId,
    ownerName: dto.ownerName,
    createdAt: new Date(dto.createdAt),
    updatedAt: new Date(dto.updatedAt),
    roomCount: 0, // Will be computed
    deviceCount: 0, // Will be computed
  };
}

export function convertDTOToRoom(dto: RoomDTO): Room {
  return {
    id: dto.id,
    name: dto.name,
    homeId: dto.homeId,
    createdAt: new Date(dto.createdAt),
    updatedAt: new Date(dto.updatedAt),
    deviceCount: 0, // Will be computed
  };
}

export function convertDTOToDevice(dto: DeviceDTO): Device {
  return {
    id: dto.id,
    firmwareId: dto.firmwareId,
    name: dto.name,
    homeId: dto.homeId,
    roomId: dto.roomId,
    roomName: dto.roomName,
    createdAt: new Date(dto.createdAt),
    updatedAt: new Date(dto.updatedAt),
    modules: [],
    state: {},
    status: 'offline',
  };
}

export function convertDTOToModule(dto: ModuleDTO): Module {
  return {
    id: dto.id,
    name: dto.name,
    type: dto.type,
    deviceChannelId: dto.deviceChannelId,
    deviceId: dto.deviceId,
    createdAt: new Date(dto.createdAt),
    value: undefined,
    displayValue: undefined,
    unit: getUnitForModuleType(dto.type),
  };
}

function getUnitForModuleType(type: string): string {
  const units: Record<string, string> = {
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
```

---

## ✅ Checklist - Frontend Updates Needed

### Authentication Flow
- [ ] Update LoginComponent to use new types
- [ ] Store JWT token from API
- [ ] Add token to all API requests
- [ ] Handle 401 errors (token expired/invalid)

### Home Management
- [ ] Update Dashboard to fetch homes from API
- [ ] Display real home data
- [ ] Handle loading states
- [ ] Handle errors gracefully

### Room Management
- [ ] Fetch rooms from `GET /homes/{homeId}/rooms`
- [ ] Update RoomManagement component
- [ ] Support create/update/delete rooms

### Device Management
- [ ] Fetch devices from `GET /homes/{homeId}/devices`
- [ ] Update DeviceControl component
- [ ] Support device commands
- [ ] Display device state

### Module Management
- [ ] Fetch modules for each device
- [ ] Display module data
- [ ] Support add/remove modules
- [ ] Show module readings (if available from IoT)

### Error Handling
- [ ] Add try-catch to all API calls
- [ ] Show error toasts to user
- [ ] Handle specific error codes
- [ ] Add retry logic if needed

### Loading States
- [ ] Show skeleton/spinner while loading
- [ ] Disable buttons while pending
- [ ] Show success/error feedback

---

## 🚀 Implementation Priority

1. **Week 1**: Setup API types + HTTP client
2. **Week 2**: Update Auth flow + Home/Room pages
3. **Week 3**: Update Device/Module pages
4. **Week 4**: Polish + Error handling

---

## 📚 References

- Full API types: `/home/rat/feui/src/app/types/api.ts`
- FE-BE Strategy: `/home/rat/feui/FE_BE_INTEGRATION_STRATEGY.md`
- Backend API Docs: Shared document from backend team
