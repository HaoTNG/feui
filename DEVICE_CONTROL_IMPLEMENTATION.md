# Device Control System - Implementation Guide

## 🎯 Overview

The Smart Home Device Control System provides complete control over IoT devices with module-based command architecture. It supports device management, module control, and real-time status updates.

## 📦 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        React Components                       │
│  (DeviceListItem, ModuleControlCard, DeviceControlPanel)     │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                      Custom Hooks                            │
│     (useDeviceControl, useModuleControl)                     │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                    API Services                              │
│  (deviceService, moduleService)                             │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                  Backend APIs                                │
│          (Spring Boot REST Endpoints)                        │
└─────────────────────────────────────────────────────────────┘
```

## 🔧 Services

### deviceService
Handles device CRUD and channel operations

```typescript
// Get all devices in home
await deviceService.getDevicesByHome(homeId);

// Get single device
await deviceService.getDevice(deviceId);

// Create new device
await deviceService.createDevice(homeId, {
  name: "Living Room Light",
  firmwareId: "DEVICE_001",
  roomId: "room123"
});

// Update device name
await deviceService.updateDeviceName(deviceId, "New Name");

// Move device to another room
await deviceService.moveDevice(deviceId, roomId);

// Move to Unassigned
await deviceService.moveDevice(deviceId, null);

// Delete device
await deviceService.deleteDevice(deviceId);

// Get device channels
await deviceService.getDeviceChannels(deviceId);
```

### moduleService
Handles module CRUD and control commands

```typescript
// Add module to device
await moduleService.addModule(deviceId, {
  name: "Main Light",
  type: "LIGHT",
  channelId: "channel123"
});

// Get module details
await moduleService.getModule(moduleId);

// Update module name
await moduleService.updateModuleName(moduleId, "New Name");

// Delete module
await moduleService.deleteModule(moduleId);

// Send control command
await moduleService.sendCommand(moduleId, '{"action": 1}');

// Toggle on/off
await moduleService.toggle(moduleId, true);  // turn on
await moduleService.toggle(moduleId, false); // turn off

// Send with value
await moduleService.sendWithValue(moduleId, 1, "brightness", 80);
```

## 🎮 Custom Hooks

### useDeviceControl
Manage device operations

```typescript
const {
  devices,      // DeviceDTO[]
  channels,     // DeviceChannelDTO[]
  loading,      // boolean
  error,        // string | null
  
  // Device CRUD
  fetchDevices,
  fetchDevice,
  createDevice,
  updateDeviceName,
  moveDevice,
  deleteDevice,
  
  // Channels
  fetchChannels,
  
  // Utilities
  clearError,
} = useDeviceControl();

// Usage
useEffect(() => {
  fetchDevices(homeId);
}, [homeId]);

// Create device
const newDevice = await createDevice(homeId, {
  name: "Kitchen Lights",
  firmwareId: "DEVICE_002",
  roomId: "kitchen123"
});

// Move device
await moveDevice(deviceId, newRoomId);
```

### useModuleControl
Manage module operations and commands

```typescript
const {
  modules,         // Map<string, ModuleDTO>
  loading,         // boolean
  error,           // string | null
  commandLoading,  // Set<string>
  
  // Module CRUD
  addModule,
  getModule,
  updateModuleName,
  deleteModule,
  
  // Module Control
  sendCommand,
  toggle,
  setBrightness,
  setSpeed,
  setColor,
  
  // Utilities
  clearError,
  isCommandLoading,
} = useModuleControl();

// Usage examples

// Toggle light
await toggle(moduleId, true);  // turn on

// Set brightness (0-100)
await setBrightness(moduleId, 75);

// Set fan speed
await setSpeed(moduleId, 2);

// Set LED color
await setColor(moduleId, "FF5733");

// Send raw command
await sendCommand(moduleId, '{"action": 1, "value": 50}');

// Check if command is loading
const isLoading = isCommandLoading(moduleId);
```

## 🧩 Components

### DeviceListItem
Displays a single device with status and action buttons

```typescript
import { DeviceListItem } from './components/DeviceListItem';

<DeviceListItem
  device={device}
  onSelect={(device) => console.log('Selected:', device)}
  onDelete={(deviceId) => handleDelete(deviceId)}
  onMove={(deviceId) => handleMove(deviceId)}
  onRename={(deviceId) => handleRename(deviceId)}
/>
```

### ModuleControlCard
Displays module with type-specific controls

- **TEMPERATURE/HUMIDITY/MOTION**: Read-only display
- **LIGHT/SWITCH**: Toggle on/off
- **LED**: Color picker and apply
- **FAN**: Speed slider and controls
- **[Others]**: Generic control icon

```typescript
import { ModuleControlCard } from './components/ModuleControlCard';

<ModuleControlCard
  module={module}
  onCommandSent={() => console.log('Command executed')}
/>
```

### DeviceControlPanel
Complete 3-column management panel

```typescript
import { DeviceControlPanel } from './components/DeviceControlPanel';

<DeviceControlPanel
  homeId="home123"
  roomId="room123"  // optional: filter by room
  onDeviceSelected={(device) => console.log('Device:', device)}
/>
```

## 📡 API Command Format

All commands use payload format with `action: 1` (ON) and `action: 0` (OFF)

### LIGHT/SWITCH
```json
{
  "payload": "{\"action\": 1}"  // Turn ON
}
{
  "payload": "{\"action\": 0}"  // Turn OFF
}
{
  "payload": "{\"action\": 1, \"value\": 80}"  // ON with brightness
}
```

### FAN
```json
{
  "payload": "{\"action\": 1, \"speed\": 2}"  // ON with speed
}
{
  "payload": "{\"action\": 0}"  // Turn OFF
}
```

### LED
```json
{
  "payload": "{\"color\": \"FF5733\"}"  // Set color
}
```

## 🔄 Complete Usage Example

```typescript
import { useDeviceControl } from '../hooks/useDeviceControl';
import { useModuleControl } from '../hooks/useModuleControl';
import { DeviceControlPanel } from '../components/DeviceControlPanel';

function MyComponent() {
  const homeId = 'abc123';
  const [selectedDevice, setSelectedDevice] = useState(null);
  
  return (
    <div>
      <DeviceControlPanel
        homeId={homeId}
        onDeviceSelected={setSelectedDevice}
      />
    </div>
  );
}

// Standalone device management
function DeviceManager() {
  const {
    devices,
    fetchDevices,
    createDevice,
    deleteDevice,
    loading,
    error
  } = useDeviceControl();

  useEffect(() => {
    fetchDevices(homeId);
  }, [homeId]);

  const handleCreate = async () => {
    try {
      await createDevice(homeId, {
        name: 'New Device',
        firmwareId: 'DEVICE_123',
        roomId: null
      });
    } catch (err) {
      console.error('Failed to create device:', err);
    }
  };

  return (
    <div>
      {error && <div className='error'>{error}</div>}
      {loading && <div>Loading...</div>}
      
      <button onClick={handleCreate}>Create Device</button>
      
      {devices.map(device => (
        <div key={device.id}>
          <h3>{device.name}</h3>
          <p>Status: {device.status}</p>
          <button onClick={() => deleteDevice(device.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

// Module control
function ModuleController() {
  const { toggle, setBrightness, isCommandLoading } = useModuleControl();
  const [moduleId] = useState('module123');

  return (
    <div>
      <button 
        onClick={() => toggle(moduleId, true)}
        disabled={isCommandLoading(moduleId)}
      >
        Turn On
      </button>
      
      <button 
        onClick={() => setBrightness(moduleId, 75)}
        disabled={isCommandLoading(moduleId)}
      >
        Set Brightness
      </button>
    </div>
  );
}
```

## 📊 Module Types & Controls

| Type | Display | Controls | Payload |
|------|---------|----------|---------|
| TEMPERATURE | Value display | None | Read-only |
| HUMIDITY | Value display | None | Read-only |
| MOTION | Value display | None | Read-only |
| LIGHT | Toggle | On/Off + Brightness | `{"action": 1/0, "value": 0-100}` |
| SWITCH | Toggle | On/Off | `{"action": 1/0}` |
| FAN | Slider | Speed, On/Off | `{"action": 1, "speed": 1-3}` |
| LED | Color Picker | Color, Apply | `{"color": "RRGGBB"}` |
| LCD | Text | Send text | Custom JSON |

## ⚡ Error Handling

```typescript
try {
  await deviceService.getDevicesByHome(homeId);
} catch (error) {
  if (error instanceof Error) {
    console.error('Error message:', error.message);
  }
}

// With hooks
const { error, clearError } = useDeviceControl();

useEffect(() => {
  if (error) {
    console.error('Device error:', error);
    // Clear error after displaying
    setTimeout(clearError, 5000);
  }
}, [error, clearError]);
```

## 📝 Type Definitions

See [types/api.ts](../types/api.ts) for all TypeScript interfaces:

- `DeviceDTO`: Device data from backend
- `DeviceChannelDTO`: Channel information
- `ModuleDTO`: Module data with current state
- `CreateDeviceRequest`: Device creation payload
- `AddModuleRequest`: Module creation payload
- `SendModuleCommandRequest`: Control command payload
- `ModuleType`: Union type of all module types

## 🚀 Integration with AppContext

Device data is managed through custom hooks. To integrate with AppContext:

```typescript
// In AppContext component
const { devices } = useDeviceControl();
const { modules } = useModuleControl();

// Provide to consumers
<AppProvider value={{
  devices,
  modules,
  ...
}}>
  {children}
</AppProvider>
```

## 🧪 Testing

```typescript
// Mock device
const mockDevice: DeviceDTO = {
  id: 'dev123',
  name: 'Test Light',
  firmwareId: 'FW001',
  homeId: 'home123',
  roomId: 'room123',
  roomName: 'Living Room',
  status: 'ONLINE',
  createdAt: '2024-01-15T10:00:00Z',
  updatedAt: '2024-01-15T10:00:00Z'
};

// Mock module
const mockModule: ModuleDTO = {
  id: 'mod123',
  name: 'Main Light',
  state: '1',
  type: 'LIGHT',
  deviceChannelId: 'ch123',
  status: 'ONLINE',
  createdAt: '2024-01-15T10:00:00Z'
};
```

## 📚 Related Documentation

- [API_TEST_GUIDE.md](../API_TEST_GUIDE.md) - API testing guide
- [FE_BE_INTEGRATION_STRATEGY.md](../FE_BE_INTEGRATION_STRATEGY.md) - Frontend integration strategy
- [BACKEND_DATA_MAPPING.md](../BACKEND_DATA_MAPPING.md) - Backend data mapping

---

**Version**: 1.0  
**Last Updated**: 2026-04-12
