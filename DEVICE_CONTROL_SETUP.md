# Device Control System - Setup & Integration Guide

## 📦 Installation

All dependencies are already included. No additional packages needed beyond what's in `package.json`.

## 📂 File Structure

```
src/app/
├── api/
│   ├── services/
│   │   ├── deviceService.ts          ✅ Device CRUD & channels
│   │   ├── moduleService.ts          ✅ Module CRUD & control
│   │   └── index.ts                  ✅ Service exports
│   ├── endpoints.ts                  ✅ API endpoint definitions
│   └── client.ts                     ✅ HTTP client
├── components/
│   ├── DeviceListItem.tsx            ✅ Device list item display
│   ├── ModuleControlCard.tsx         ✅ Module control UI
│   ├── DeviceControlPanel.tsx        ✅ Complete management panel
│   └── [other components]
├── hooks/
│   ├── useDeviceControl.ts           ✅ Device operations hook
│   ├── useModuleControl.ts           ✅ Module control hook
│   └── [other hooks]
├── types/
│   └── api.ts                        ✅ Type definitions
└── contexts/
    └── AppContext.tsx                (existing context)
```

## 🔌 Integration Points

### 1. With Existing Components

Add device control to any component:

```typescript
import { useDeviceControl } from '../hooks/useDeviceControl';

export function MyComponent() {
  const { devices, fetchDevices, loading } = useDeviceControl();
  
  useEffect(() => {
    fetchDevices('home-id');
  }, []);
  
  return (
    <div>
      {loading ? <Spinner /> : devices.map(d => <DeviceCard device={d} />)}
    </div>
  );
}
```

### 2. With Router

Add device control page to routes:

```typescript
// src/app/routes.tsx
import { DeviceControlPanel } from './components/DeviceControlPanel';

export const routes = [
  // ... other routes
  {
    path: '/home/:homeId/devices',
    element: <DeviceControlPanel homeId={homeId} />
  },
];
```

### 3. With AppContext

Consumers can access device state through hooks:

```typescript
// No need to modify AppContext - use hooks directly
const { devices } = useDeviceControl();
const { modules } = useModuleControl();
```

### 4. With Toast/Notifications

Add feedback for user actions:

```typescript
import { useDeviceControl } from '../hooks/useDeviceControl';
import { useToast } from '../contexts/ToastContext';

function MyComponent() {
  const { createDevice, error } = useDeviceControl();
  const { showToast } = useToast();
  
  const handleCreate = async () => {
    try {
      await createDevice(homeId, data);
      showToast('Device created successfully', 'success');
    } catch (err) {
      showToast('Failed to create device', 'error');
    }
  };
  
  return <button onClick={handleCreate}>Add Device</button>;
}
```

## 🔧 Configuration

### API Endpoints

All endpoints are defined in `src/app/api/endpoints.ts`:

```typescript
DEVICES: {
  LIST: (homeId) => `/homes/${homeId}/devices`,
  CREATE: (homeId) => `/homes/${homeId}/devices`,
  GET: (deviceId) => `/devices/${deviceId}`,
  GET_CHANNELS: (deviceId) => `/devices/${deviceId}/channels`,
  // ... more endpoints
}

MODULES: {
  ADD: (deviceId) => `/devices/${deviceId}/modules`,
  SEND_COMMAND: (moduleId) => `/modules/${moduleId}/commands`,
  // ... more endpoints
}
```

### Authorization

All requests include JWT token automatically (via `apiRequest` client):

```typescript
// Already handled by apiRequest in client.ts
// Token is read from localStorage/context
```

## 🧪 Testing Components

### Test Component - Device List

```typescript
import { DeviceListItem } from './components/DeviceListItem';

export function TestDeviceList() {
  const mockDevice = {
    id: '1',
    name: 'Test Light',
    firmwareId: 'FW001',
    homeId: 'home1',
    roomId: 'room1',
    roomName: 'Living Room',
    status: 'ONLINE' as const,
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  };

  return (
    <DeviceListItem
      device={mockDevice}
      onSelect={(d) => console.log('Selected:', d)}
      onDelete={(id) => console.log('Delete:', id)}
      onMove={(id) => console.log('Move:', id)}
    />
  );
}
```

### Test Component - Module Control

```typescript
import { ModuleControlCard } from './components/ModuleControlCard';

export function TestModuleControl() {
  const mockModule = {
    id: '1',
    name: 'Main Light',
    state: '1',
    type: 'LIGHT' as const,
    deviceChannelId: 'ch1',
    status: 'ONLINE' as const,
    createdAt: '2024-01-15T00:00:00Z'
  };

  return (
    <ModuleControlCard
      module={mockModule}
      onCommandSent={() => console.log('Command sent')}
    />
  );
}
```

## 📝 Development Workflow

### 1. Add New Module Type

**Step 1**: Update ModuleType enum in `types/api.ts`
```typescript
export type ModuleType =
  | "TEMPERATURE"
  | "HUMIDITY"
  | "MOTION"
  | "LIGHT"
  | "FAN"
  | "SWITCH"
  | "LED"
  | "LCD"
  | "YOUR_NEW_TYPE";  // Add here
```

**Step 2**: Add control logic in `ModuleControlCard.tsx`
```typescript
if (module.type === 'YOUR_NEW_TYPE') {
  return (
    <div className='bg-white rounded-lg p-4'>
      {/* Your custom control UI */}
    </div>
  );
}
```

**Step 3**: Add helper method in `useModuleControl` hook if needed
```typescript
const setYourParameter = useCallback(async (moduleId: string, param: number) => {
  const payload = JSON.stringify({ yourParam: param });
  return sendCommand(moduleId, payload);
}, [sendCommand]);
```

### 2. Add Device Action

**Step 1**: Add method to `deviceService.ts`
```typescript
async yourNewAction(deviceId: string, data: any): Promise<any> {
  try {
    const response = await apiRequest('post', '/devices/' + deviceId + '/your-action', data);
    return response.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
```

**Step 2**: Expose in `useDeviceControl` hook
```typescript
const yourNewAction = useCallback(async (deviceId: string, data: any) => {
  setState((prev) => ({ ...prev, loading: true, error: null }));
  try {
    const result = await deviceService.yourNewAction(deviceId, data);
    setState((prev) => ({ ...prev, loading: false }));
    return result;
  } catch (error) {
    // Handle error
  }
}, []);

return {
  // ... other returns
  yourNewAction,
};
```

## 🚀 Deployment

### Production Checklist

- [ ] All TypeScript errors fixed (`npm run build`)
- [ ] All tests passing (`npm run test`)
- [ ] Device endpoints tested with real backend
- [ ] Module control commands verified with hardware
- [ ] Error handling covers all failure cases
- [ ] Loading states shown during operations
- [ ] Toast notifications implemented for user feedback
- [ ] Response times acceptable (<2s for most operations)
- [ ] No console errors in production build

### Environment Variables

No special environment variables needed. Uses existing API configuration:

```typescript
// .env
VITE_API_URL=https://api.example.com
```

## 📊 Performance Optimization

### Reduce Re-renders

Use React.memo for device/module list items:

```typescript
export const DeviceListItem = React.memo(({ device, onSelect }: Props) => {
  // Component code
});
```

### Debounce Search

```typescript
import { useMemo } from 'react';

const filteredDevices = useMemo(
  () => devices.filter(d => d.name.includes(searchTerm)),
  [devices, searchTerm]
);
```

### Lazy Load Modules

```typescript
useEffect(() => {
  if (selectedDevice) {
    fetchChannels(selectedDevice.id);
  }
}, [selectedDevice?.id]);
```

## 🐛 Troubleshooting

### Devices not loading?

1. Check `homeId` is valid
2. Verify JWT token exists
3. Check browser console for API errors
4. Verify backend is running

### Module commands not working?

1. Check device status is ONLINE
2. Verify module ID is correct
3. Check payload format matches module type
4. Look for server errors in network tab

### Type errors in build?

1. Run `npm run build` to see all errors
2. Check `types/api.ts` for correct types
3. Verify all imports are correct
4. Use TypeScript strict mode

## 📚 Related Utilities

- `converters.ts`: Data conversion utilities
- `client.ts`: HTTP request client
- `AppContext.tsx`: Global app state
- `ToastContext.tsx`: Toast notifications

## 🔄 State Management Pattern

All state is managed through custom hooks:

```
Component
  ↓
useDeviceControl/useModuleControl hooks
  ↓
useState (local state)
  ↓
API services
  ↓
Backend
```

This pattern allows:
- ✅ Easy testing
- ✅ Reusable logic
- ✅ Type safety
- ✅ Clear separation of concerns

## 📞 Support

For issues or questions:
1. Check [DEVICE_CONTROL_IMPLEMENTATION.md](./DEVICE_CONTROL_IMPLEMENTATION.md)
2. Review [DEVICE_CONTROL_QUICK_REFERENCE.md](./DEVICE_CONTROL_QUICK_REFERENCE.md)
3. Check component JSDoc comments
4. Review existing similar implementations

---

**Version**: 1.0  
**Last Updated**: 2026-04-12
