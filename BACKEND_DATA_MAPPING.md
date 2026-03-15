# 🔄 Backend ↔ Frontend Data Mapping - Quick Reference

## Side-by-Side Comparison

### 1️⃣ **Authentication**

| Aspect | Backend | Frontend |
|--------|---------|----------|
| **Login Endpoint** | `POST /auth/login` | Call via `apiService.login()` |
| **Input** | `{ email, password }` | Same |
| **Output** | `{ accessToken, user: UserInfo }` | Store token + User in context |
| **Token Storage** | - | `localStorage.authToken` |
| **Token Usage** | - | Add to `Authorization` header |

### 2️⃣ **Homes**

| Aspect | Backend | Frontend |
|--------|---------|----------|
| **Get All** | `GET /homes` | `homeService.getHomes()` |
| **Response** | `HomeDTO[]` | Convert to `Home[]` |
| **Create** | `POST /homes` | `homeService.createHome(name)` |
| **Update** | `PATCH /homes/{homeId}` | `homeService.updateHome(id, name)` |
| **Delete** | `DELETE /homes/{homeId}` | `homeService.deleteHome(id)` |
| **Select** | - | Store in `selectedHomeId` |

**HomeDTO Structure:**
```
id: UUID
name: string
ownerUserId: UUID
ownerName: string
createdAt: ISO 8601
updatedAt: ISO 8601
```

**Frontend Home Addition:**
```
+ roomCount: number (computed)
+ deviceCount: number (computed)
+ isDefault: boolean
```

---

### 3️⃣ **Members**

| Aspect | Backend | Frontend |
|--------|---------|----------|
| **List** | `GET /homes/{homeId}/members` | Display with role/status |
| **Add** | `POST /homes/{homeId}/members` | Email-based invitation |
| **Remove** | `DELETE /homes/{homeId}/members/{userId}` | Owner only |
| **Leave** | `DELETE /homes/{homeId}/members/me` | Member can leave |

**Member Roles:**
- `OWNER` - Full access, can manage members
- `MEMBER` - Limited access, can control devices
- `GUEST` - View only (future)

---

### 4️⃣ **Rooms**

| Aspect | Backend | Frontend |
|--------|---------|----------|
| **List** | `GET /homes/{homeId}/rooms` | Show per home |
| **Create** | `POST /homes/{homeId}/rooms` | Owner only |
| **Update** | `PATCH /rooms/{roomId}` | Rename room |
| **Delete** | `DELETE /rooms/{roomId}` | Remove room |
| **On Delete** | Devices → Unassigned | Device status updates |

**RoomDTO:**
```
id: UUID
name: string
homeId: UUID
createdAt: ISO 8601
updatedAt: ISO 8601
```

**Frontend Room Addition:**
```
+ deviceCount: number (computed)
+ temperature?: number (from sensors)
+ humidity?: number (from sensors)
+ lightLevel?: number (from sensors)
```

---

### 5️⃣ **Devices**

| Aspect | Backend | Frontend |
|--------|---------|----------|
| **Add** | `POST /homes/{homeId}/devices` | With name, firmwareId, roomId |
| **List** | `GET /homes/{homeId}/devices` | Show all in home |
| **Get Details** | `GET /devices/{deviceId}` | View specific device |
| **Update Name** | `PATCH /devices/{deviceId}/name` | Rename device |
| **Move Room** | `PATCH /devices/{deviceId}/move-room` | Assign to room |
| **Delete** | `DELETE /devices/{deviceId}` | Remove device |

**DeviceDTO:**
```
id: UUID
firmwareId: string (hardware ID from IoT)
name: string
homeId: UUID
roomId: UUID | null
roomName: string ("Unassigned" if null)
createdAt: ISO 8601
updatedAt: ISO 8601
```

**Frontend Device Addition:**
```
+ modules?: Module[] (nested)
+ state?: DeviceState (current values)
+ status?: "online" | "offline"
```

**Example DeviceDTO:**
```json
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
```

---

### 6️⃣ **Modules (Components/Sensors)**

| Aspect | Backend | Frontend |
|--------|---------|----------|
| **Add to Device** | `POST /devices/{deviceId}/modules` | With name, type, channelId |
| **List** | Via device modules | Nested in device |
| **Get** | `GET /modules/{moduleId}` | Single module details |
| **Update Name** | `PATCH /modules/{moduleId}/name` | Rename module |
| **Delete** | `DELETE /modules/{moduleId}` | Remove module |

**Module Types:**
```
TEMPERATURE
HUMIDITY
LIGHT_SENSOR
MOTION
LIGHT (switch)
FAN (speed control)
AC (temperature control)
WATER_HEATER
```

**ModuleDTO:**
```
id: UUID
name: string
type: ModuleType (enum above)
deviceChannelId: UUID (hardware channel)
deviceId: UUID
createdAt: ISO 8601
```

**Frontend Module Addition:**
```
+ value?: number | boolean | string (current reading)
+ displayValue?: string (formatted for UI)
+ unit?: string (°C, %, lux, etc)
```

**Example ModuleDTO:**
```json
{
  "id": "fd89fc7b-ef78-4614-98f1-a9d2645efde3",
  "name": "DHT-20",
  "type": "TEMPERATURE",
  "deviceChannelId": "2134af50-e553-495c-bf32-71e4da0e349a",
  "deviceId": "2286f3d7-33dd-48b4-940c-1511886d7521",
  "createdAt": "2026-03-06T18:30:00Z"
}
```

---

### 7️⃣ **Device Commands**

| Command | Value | Example |
|---------|-------|---------|
| `POWER` | `boolean` | `{ command: "POWER", value: true }` |
| `SET_BRIGHTNESS` | `0-100` | `{ command: "SET_BRIGHTNESS", value: 80 }` |
| `SET_TEMPERATURE` | `number` | `{ command: "SET_TEMPERATURE", value: 26 }` |
| `SET_SPEED` | `0-3` | `{ command: "SET_SPEED", value: 2 }` |
| `SET_COLOR` | `hex string` | `{ command: "SET_COLOR", value: "#FF5500" }` |

**API Endpoint:** `POST /devices/{deviceId}/commands`

**Response:** `{ statusCode: 200, message: "Command sent successfully", data: null }`

---

### 8️⃣ **Device State**

**Get Current State:** `GET /devices/{deviceId}/state`

**Response Example:**
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": "{\"power\":true,\"brightness\":80}"
}
```

**Frontend DeviceState:**
```typescript
{
  power?: boolean;
  brightness?: number; // 0-100
  temperature?: number; // °C
  speed?: number; // 0-3 or 1-10
  color?: string; // hex
  humidity?: number;
  motionDetected?: boolean;
}
```

---

## 🔀 Data Transformation Examples

### Example 1: User Logs In

**Step 1 - Call Backend:**
```typescript
const response = await apiClient.post('/auth/login', {
  email: 'owner_test@gmail.com',
  password: 'password123'
});
```

**Step 2 - Backend Returns:**
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

**Step 3 - Frontend Processing:**
```typescript
// Store token
localStorage.setItem('authToken', response.data.data.accessToken);

// Convert UserInfo to UserProfile
const userProfile: UserProfile = {
  ...response.data.data.user,
  role: 'owner', // Infer or receive from backend
  createdAt: new Date(),
  updatedAt: new Date(),
};

// Store in context
setUser(userProfile);
```

---

### Example 2: Create Device

**Step 1 - User Input:**
```
Device Name: "Living Room Light"
Firmware ID: "fe45nkhiz" (from hardware)
Room: "Living Room" (d3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44)
```

**Step 2 - Frontend Sends:**
```typescript
const createRequest: CreateDeviceRequest = {
  name: 'Living Room Light',
  firmwareId: 'fe45nkhiz',
  roomId: 'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44'
};

await apiClient.post(`/homes/${homeId}/devices`, createRequest);
```

**Step 3 - Backend Returns:**
```json
{
  "statusCode": 201,
  "message": "Device added successfully",
  "data": {
    "id": "e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a55",
    "firmwareId": "fe45nkhiz",
    "name": "Living Room Light",
    "homeId": "c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33",
    "roomId": "d3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44",
    "roomName": "Living Room",
    "createdAt": "2026-03-06T18:30:00Z",
    "updatedAt": "2026-03-06T18:30:00Z"
  }
}
```

**Step 4 - Frontend Stores:**
```typescript
const newDevice: Device = convertDTOToDevice(response.data.data);

// Add to state
setDevices(prev => [...prev, newDevice]);

// Log activity
addActivity({
  type: 'user',
  deviceName: 'Living Room Light',
  action: 'Device added',
  detail: 'Connected firmware: fe45nkhiz',
  success: true
});
```

---

### Example 3: Control Device (Send Command)

**Step 1 - User Action:**
```
User clicks brightness slider to 80%
```

**Step 2 - Frontend Sends Command:**
```typescript
const commandPayload: SendCommandRequest = {
  command: 'SET_BRIGHTNESS',
  value: 80
};

await apiClient.post(
  `/devices/e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a55/commands`,
  commandPayload
);
```

**Step 3 - Backend:**
- Validates user has permission
- Sends MQTT message to device
- Waits for confirmation
- Updates database
- Returns success

**Step 4 - Frontend Updates:**
```typescript
// Optimistically update UI
setDevices(prev => prev.map(d => 
  d.id === deviceId 
    ? { 
        ...d, 
        state: { ...d.state, brightness: 80 }
      }
    : d
));

// Log activity
addActivity({
  type: 'user',
  deviceId: 'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a55',
  deviceName: 'Living Room Light',
  action: 'Brightness set to 80%',
  detail: 'via Web Dashboard',
  success: true
});

// Show feedback
showToast('Brightness updated', 'success');
```

---

## 🎯 Current vs New Data Structure

### BEFORE (Mock/In-Memory)
```typescript
// OLD AppContext data
interface Hub {
  id: string;
  name: string;
  homeId: string;
  room: string;
  status: "online" | "offline";
  wifiSignal: number;
  moduleCount: number;
  onlineModuleCount: number;
}

interface Module {
  id: string;
  name: string;
  type: ModuleType;
  hubId: string;
  room: string;
  homeId: string;
  status: ModuleStatus;
  temperature?: number;
  humidity?: number;
}

// No API integration
// All data in-memory (React state)
// No persistence
```

### AFTER (Backend API)
```typescript
// NEW: Cleaner separation
// Backend manages: Homes, Rooms, Devices, Modules, Members
// Frontend manages: Auth, UI state, Activities (local log)

interface DeviceDTO {
  id: string;
  firmwareId: string;
  name: string;
  homeId: string;
  roomId: string | null;
  roomName: string;
  createdAt: string;
  updatedAt: string;
}

interface Device {
  // From DTO
  id: string;
  firmwareId: string;
  name: string;
  homeId: string;
  roomId: string | null;
  roomName: string;
  createdAt: Date;
  updatedAt: Date;
  // From separate calls
  modules?: Module[];
  state?: DeviceState;
  status?: "online" | "offline";
}

// Persistent: Database on backend
// Synced: API calls
```

---

## 📋 API Response Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| `200` | Success (GET/PATCH) | Request completed |
| `201` | Created (POST) | Resource created |
| `204` | No Content (DELETE) | Resource deleted |
| `400` | Bad Request | Invalid data sent |
| `401` | Unauthorized | Invalid/expired token |
| `403` | Forbidden | No permission (not owner) |
| `404` | Not Found | Resource doesn't exist |
| `500` | Server Error | Backend error |

---

## ✅ Key Differences - Backend vs Frontend

| Aspect | Backend | Frontend |
|--------|---------|----------|
| **Authority** | Source of truth | Display layer |
| **Data Persistence** | Database | React state (temporary) |
| **Validation** | Complex business logic | UI validation only |
| **Authorization** | Enforced (role-based) | UX-based (hide buttons) |
| **Transactions** | ACID compliant | N/A |
| **ID Format** | UUID v4 | Same (UUID v4) |
| **Timestamps** | ISO 8601 UTC | Convert to local Date |
| **Error Messages** | English messages | Translate if needed |

---

## 🚀 Implementation Checklist

### Before Starting
- [ ] Backend API running on http://localhost:8080
- [ ] Backend API documentation reviewed
- [ ] JWT tokens understood
- [ ] API response formats memorized

### Type Definitions
- [ ] `src/app/types/api.ts` created with all DTOs
- [ ] Frontend types (Home, Room, Device, Module) defined
- [ ] Conversion functions created in `src/app/utils/converters.ts`

### API Service Layer
- [ ] HTTP client configured (axios with interceptors)
- [ ] API endpoints constants created
- [ ] Auth service implemented
- [ ] Home/Room/Device/Module services implemented
- [ ] Error handling standardized

### AppContext Updates
- [ ] Remove mock initial data
- [ ] Add async data loading
- [ ] Add loading/error states
- [ ] Update all CRUD methods to call API

### Component Updates
- [ ] Login component → real authentication
- [ ] Dashboard → fetch real homes/rooms
- [ ] Device control → real commands
- [ ] Error handling → user feedback

### Testing
- [ ] Manual testing each endpoint
- [ ] Handle network errors gracefully
- [ ] Verify token refresh works
- [ ] Check role-based permissions

---

**Last Updated:** March 15, 2026  
**Files Reference:**
- Types: `/home/rat/feui/src/app/types/api.ts`
- Guide: `/home/rat/feui/DATA_STRUCTURE_GUIDE.md`
- Strategy: `/home/rat/feui/FE_BE_INTEGRATION_STRATEGY.md`
