# WebSocket Real-Time Integration Guide

## Overview
The frontend is now connected to your WebSocket server at `ws://localhost:8080/ws` for real-time data updates.

## Features

### 1. **Automatic Connection Management**
- WebSocket automatically connects when user is authenticated
- Automatic reconnection with exponential backoff (up to 5 attempts)
- Graceful disconnection on logout

### 2. **Real-Time Data Updates**
The following data types are automatically synced:

#### Device Status Updates
```json
{
  "type": "device",
  "data": {
    "deviceId": "device-id",
    "status": "online|offline",
    "modules": []
  }
}
```

#### Module Data Updates
```json
{
  "type": "module",
  "data": {
    "moduleId": "module-id",
    "deviceId": "device-id",
    "status": "online|offline",
    "temperature": 25.5,
    "humidity": 60,
    "value": 100
  }
}
```

#### Room Statistics Updates
```json
{
  "type": "room",
  "data": {
    "roomId": "room-id",
    "temperature": 25.5,
    "humidity": 60,
    "lightLevel": 80,
    "temperatureTrend": "stable|rising|falling",
    "humidityStatus": "normal|high|low",
    "lightStatus": "bright|dim|normal"
  }
}
```

#### Alert/Event Notifications
```json
{
  "type": "alert|event",
  "data": {
    "deviceId": "device-id",
    "deviceName": "Device Name",
    "action": "Action description",
    "detail": "Additional details"
  }
}
```

### 3. **Auto-Update Behavior**
When WebSocket messages are received:
- **Device updates**: Updates device status and modules in real-time
- **Module updates**: Updates specific module properties (temperature, humidity, etc.)
- **Room updates**: Updates room environmental stats
- **Alerts**: Automatically added to activity log

## Usage in React Components

### Access WebSocket Status
```tsx
import { useApp } from '../contexts/AppContext';

export function MyComponent() {
  const { websocketConnected, websocketStatus, websocketData } = useApp();

  return (
    <div>
      <p>Status: {websocketStatus}</p>
      <p>Connected: {websocketConnected ? 'Yes' : 'No'}</p>
      <p>Messages received: {websocketData.length}</p>
    </div>
  );
}
```

### Dashboard Status Indicator
The Dashboard now shows a real-time connection indicator in the top-right:
- 🟢 **Green pulsing**: Connected and receiving real-time updates
- 🟡 **Yellow pulsing**: Currently connecting
- 🔴 **Red solid**: Disconnected

## Testing WebSocket Connection

### 1. **Check Browser Console**
Look for logs like:
```
[WebSocket] Connected to server
[WebSocket] Received message: {...}
```

### 2. **Monitor Dashboard Status**
The WebSocket status indicator shows connection state.

### 3. **Test with Mock Data**
Send messages from your backend like:
```bash
# Connect to ws://localhost:8080/ws and send:
{
  "type": "device",
  "data": {
    "deviceId": "living-room-light",
    "status": "online"
  },
  "timestamp": 1704067200000
}
```

## Backend Requirements

Your WebSocket server at `ws://localhost:8080/ws` should:
1. Accept WebSocket connections from the frontend
2. Send JSON messages with format:
   ```json
   {
     "type": "device|module|room|alert|event",
     "data": { /* payload */ },
     "timestamp": 1704067200000
   }
   ```
3. Handle client connection/disconnection gracefully

## Configuration

To change the WebSocket URL:
1. Edit `src/app/api/services/websocketService.ts`
2. Change the `url` property:
```typescript
class WebSocketService {
  private url: string = 'ws://localhost:8080/ws'; // Change this
  ...
}
```

## State Management

### AppContext Integration
The WebSocket data is integrated with the main AppContext:
- Device state is automatically updated
- Room stats are automatically updated
- Activities are logged
- All subscribers are automatically notified

### No Manual Refresh Needed
Once connected, all components using `useApp()` will get real-time updates without manual refresh.

## Troubleshooting

### WebSocket Connection Failed
- Check that `ws://localhost:8080/ws` is accessible
- Verify backend server is running
- Check browser console for CORS errors
- Try connecting from a different browser tab

### Messages Not Updating UI
1. Ensure message format is correct (valid JSON)
2. Check that `deviceId` or `roomId` matches existing data
3. Look for errors in browser console

### Auto-Reconnection Issues
- Max reconnection attempts: 5
- Initial delay: 3 seconds
- Exponential backoff applied
- Check browser console for reconnection logs

## Performance Notes
- Last 100 WebSocket messages are cached in `websocketData` state
- Auto-update prevents unnecessary state mutations
- Connection pooling and cleanup handled automatically
