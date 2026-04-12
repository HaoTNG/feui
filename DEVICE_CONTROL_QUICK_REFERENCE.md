# Device Control - Quick Reference

## 🚀 Quick Start

### 1. Import Hooks
```typescript
import { useDeviceControl } from '../hooks/useDeviceControl';
import { useModuleControl } from '../hooks/useModuleControl';
```

### 2. Use Hooks in Component
```typescript
function MyComponent() {
  const { devices, fetchDevices } = useDeviceControl();
  const { modules, toggle } = useModuleControl();

  useEffect(() => {
    fetchDevices('home123');
  }, []);

  return (
    <div>
      {devices.map(device => (
        <div key={device.id}>{device.name}</div>
      ))}
    </div>
  );
}
```

## 📋 Common Operations

### Device Management

**List all devices:**
```typescript
const { devices, fetchDevices } = useDeviceControl();
await fetchDevices(homeId);
```

**Create device:**
```typescript
const { createDevice } = useDeviceControl();
await createDevice(homeId, {
  name: 'Living Room Light',
  firmwareId: 'DEVICE_001',
  roomId: 'room123'
});
```

**Rename device:**
```typescript
const { updateDeviceName } = useDeviceControl();
await updateDeviceName(deviceId, 'New Name');
```

**Move device to room:**
```typescript
const { moveDevice } = useDeviceControl();
await moveDevice(deviceId, 'newRoomId');
```

**Unassign device (remove from room):**
```typescript
const { moveDevice } = useDeviceControl();
await moveDevice(deviceId, null);
```

**Delete device:**
```typescript
const { deleteDevice } = useDeviceControl();
await deleteDevice(deviceId);
```

### Module Control

**Toggle light on:**
```typescript
const { toggle } = useModuleControl();
await toggle(moduleId, true);
```

**Toggle light off:**
```typescript
const { toggle } = useModuleControl();
await toggle(moduleId, false);
```

**Set brightness (0-100):**
```typescript
const { setBrightness } = useModuleControl();
await setBrightness(moduleId, 75);  // 75% brightness
```

**Set fan speed:**
```typescript
const { setSpeed } = useModuleControl();
await setSpeed(moduleId, 2);  // Speed level 2
```

**Set LED color:**
```typescript
const { setColor } = useModuleControl();
await setColor(moduleId, 'FF5733');  // Hex color
```

**Send custom command:**
```typescript
const { sendCommand } = useModuleControl();
await sendCommand(moduleId, '{"action": 1, "value": 50}');
```

### Error Handling

**Catch errors:**
```typescript
const { error, clearError } = useDeviceControl();

useEffect(() => {
  if (error) {
    showErrorMessage(error);
    clearError();
  }
}, [error, clearError]);
```

**Check loading state:**
```typescript
const { loading } = useDeviceControl();
return loading ? <Spinner /> : <Content />;
```

**Check command loading (for modules):**
```typescript
const { isCommandLoading } = useModuleControl();
return (
  <button disabled={isCommandLoading(moduleId)}>
    Toggle
  </button>
);
```

## 🎨 UI Components

### Device List
```typescript
import { DeviceListItem } from '../components/DeviceListItem';

{devices.map(device => (
  <DeviceListItem
    key={device.id}
    device={device}
    onSelect={handleSelect}
    onDelete={handleDelete}
    onMove={handleMove}
  />
))}
```

### Module Control
```typescript
import { ModuleControlCard } from '../components/ModuleControlCard';

{modules.map(module => (
  <ModuleControlCard
    key={module.id}
    module={module}
    onCommandSent={handleCommandSent}
  />
))}
```

### Complete Panel
```typescript
import { DeviceControlPanel } from '../components/DeviceControlPanel';

<DeviceControlPanel
  homeId={homeId}
  roomId={roomId}
  onDeviceSelected={handleDeviceSelected}
/>
```

## 🔄 Load & Control Flow

```
1. Fetch devices
   ↓
2. User selects device
   ↓
3. Show device details & modules
   ↓
4. User interacts with module
   ↓
5. Send control command
   ↓
6. Show success/error feedback
```

## 📱 Device Status

- ✅ **ONLINE**: Device is connected and ready
- ❌ **OFFLINE**: Device is not connected

Control is only enabled for ONLINE devices.

## 💡 Module States

Each module type has different states:

- **Sensors** (TEMPERATURE, HUMIDITY, MOTION): Display value, read-only
- **Controls** (LIGHT, FAN, SWITCH, LED): Support commands
- **LCD**: Can display text

## 🎛️ Control Payload Examples

### Light - Turn ON
```json
{"payload": "{\"action\": 1}"}
```

### Light - Turn OFF
```json
{"payload": "{\"action\": 0}"}
```

### Light - Set Brightness to 75%
```json
{"payload": "{\"action\": 1, \"value\": 75}"}
```

### Fan - Set Speed 2
```json
{"payload": "{\"action\": 1, \"speed\": 2}"}
```

### LED - Set Color
```json
{"payload": "{\"color\": \"FF5733\"}"}
```

## 🛠️ Type Safety

All operations are fully typed:

```typescript
// Device types
interface DeviceDTO {
  id: string;
  name: string;
  firmwareId: string;
  homeId: string;
  roomId: string | null;
  roomName: string;
  status: 'ONLINE' | 'OFFLINE';
  createdAt: string;
  updatedAt: string;
}

// Module types
interface ModuleDTO {
  id: string;
  name: string;
  state: string;
  type: ModuleType;
  deviceChannelId: string;
  status: 'ONLINE' | 'OFFLINE';
  createdAt: string;
}
```

## ❓ Common Issues

**Module not responding?**
- Check device status (must be ONLINE)
- Verify channel ID is correct
- Check command payload format

**Device list empty?**
- Verify homeId is correct
- Check user permissions
- Ensure devices exist in home

**Command failed?**
- Check error message
- Verify module is ONLINE
- Try again after 2-3 seconds

## 📞 Need Help?

See full documentation in [DEVICE_CONTROL_IMPLEMENTATION.md](./DEVICE_CONTROL_IMPLEMENTATION.md)
