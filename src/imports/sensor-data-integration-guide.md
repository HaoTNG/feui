# 📊 Sensor Data Integration Guide

This guide explains how to use the sensor data utilities for real-time temperature, humidity, motion, and light data from the IoT backend.

## 🏗️ Architecture Overview

```
Backend (IoT Server)
    ↓
WebSocket (ws://localhost:8080/ws)
    ↓
SensorWebSocketMessage Format:
{
  firmwareId: "DEVICE_UNIQUE_001",
  category: "data",
  type: "TEMPERATURE|HUMIDITY|MOTION|LIGHT",
  channel: 1,
  payload: "25.5"
}
    ↓
WebSocketService (parsing)
    ↓
sensorDataParser.ts (format & validate)
    ↓
AppContext (state management)
    ↓
React Components (useSensorData hook)
```

---

## 🔧 Quick Start

### 1. **Display Temperature with Hook**

```tsx
import { useSensorData } from '@/hooks/useSensorData';

export function TemperatureDisplay({ value }: { value: number }) {
  const temp = useSensorData({ type: 'TEMPERATURE', value });
  
  return (
    <div>
      <h2>{temp.displayValue}</h2>
      {temp.warning && <p style={{ color: 'red' }}>{temp.warning}</p>}
    </div>
  );
}
```

### 2. **Display Humidity with Status**

```tsx
import { useSensorData } from '@/hooks/useSensorData';

export function HumidityCard({ value }: { value: number }) {
  const humidity = useSensorData({ type: 'HUMIDITY', value });
  
  const status = humidity.status;
  
  return (
    <div style={{ backgroundColor: `${status.color}20` }}>
      <p>Humidity: {humidity.displayValue}</p>
      <p>{status.recommendation}</p>
      <p>Mold Risk: {status.moldRisk}</p>
    </div>
  );
}
```

### 3. **Display Motion Sensors**

```tsx
import { useSensorData } from '@/hooks/useSensorData';

export function MotionIndicator({ detected }: { detected: boolean }) {
  const motion = useSensorData({ type: 'MOTION', value: detected });
  
  const display = motion.status;
  
  return (
    <div>
      <span>{display.icon} {display.label}</span>
    </div>
  );
}
```

### 4. **Display Light Levels**

```tsx
import { useSensorData } from '@/hooks/useSensorData';

export function LightLevelCard({ lux }: { lux: number }) {
  const light = useSensorData({ type: 'LIGHT', value: lux });
  
  const description = light.status;
  
  return (
    <div style={{ backgroundColor: `${description.color}20` }}>
      <p>{light.displayValue}</p>
      <p>{description.description}</p>
      {description.automationMode && (
        <p>Auto Mode: {description.automationMode}</p>
      )}
    </div>
  );
}
```

---

## 📡 WebSocket Message Format

### Temperature
```json
{
  "firmwareId": "DEVICE_UNIQUE_001",
  "category": "data",
  "type": "TEMPERATURE",
  "channel": 1,
  "payload": "25.5"
}
```
- **Payload**: Float string (°C)
- **Range**: -50°C to 100°C
- **Format**: One decimal place

### Humidity
```json
{
  "firmwareId": "DEVICE_UNIQUE_001",
  "category": "data",
  "type": "HUMIDITY",
  "channel": 2,
  "payload": "65"
}
```
- **Payload**: Integer string (%)
- **Range**: 0-100%
- **Precision**: 1%

### Motion
```json
{
  "firmwareId": "DEVICE_UNIQUE_001",
  "category": "data",
  "type": "MOTION",
  "channel": 3,
  "payload": "1"
}
```
- **Payload**: "1" (detected) or "0" (clear)
- **Type**: Binary boolean

### Light / Lux
```json
{
  "firmwareId": "DEVICE_UNIQUE_001",
  "category": "data",
  "type": "LIGHT",
  "channel": 4,
  "payload": "450"
}
```
- **Payload**: Integer (Lux)
- **Range**: 0-100000 Lux
- **Unit**: Illuminance

---

## 📚 Utility Functions Reference

### `parseSensorData(msg: SensorWebSocketMessage): ParsedSensorData`

Parse any sensor message into a standardized format.

```tsx
import { parseSensorData } from '@/utils/sensorDataParser';

const msg = {
  firmwareId: 'DEVICE_001',
  category: 'data',
  type: 'TEMPERATURE',
  channel: 1,
  payload: '25.5'
};

const parsed = parseSensorData(msg);
// {
//   type: 'TEMPERATURE',
//   value: 25.5,
//   displayValue: '25.5°C',
//   unit: '°C',
//   isValid: true
// }
```

### Temperature Utilities

```tsx
import { 
  parseTemperature,
  formatTemperature,
  getTemperatureWarning 
} from '@/utils/sensorDataParser';

const temp = parseTemperature('25.5');
// { value: 25.5, displayValue: '25.5°C', unit: '°C', isValid: true }

const formatted = formatTemperature(25.5);
// {
//   celsius: 25.5,
//   fahrenheit: 77.9,
//   kelvin: 298.65,
//   display: '25.5°C'
// }

const warning = getTemperatureWarning(35);
// 'High temperature alert!'
```

### Humidity Utilities

```tsx
import {
  parseHumidity,
  getHumidityStatus,
  checkMoldRisk
} from '@/utils/sensorDataParser';

const humidity = parseHumidity('65');
const status = getHumidityStatus(65);
// {
//   status: 'WARM',
//   color: '#FFD93D',
//   recommendation: 'A bit humid',
//   moldRisk: 'MEDIUM'
// }

const moldRisk = checkMoldRisk(75, 22);
// { risk: 'HIGH', warning: 'High mold risk!' }
```

### Motion Utilities

```tsx
import {
  parseMotion,
  getMotionDisplay
} from '@/utils/sensorDataParser';

const motion = parseMotion('1');
// { value: true, displayValue: 'Motion Detected', unit: '', isValid: true }

const display = getMotionDisplay(true);
// {
//   status: 'DETECTED',
//   icon: '🔴',
//   color: '#FF0000',
//   label: 'Motion Detected'
// }
```

### Light Utilities

```tsx
import {
  parseLight,
  getLightLevelDescription,
  getLightPercentage
} from '@/utils/sensorDataParser';

const light = parseLight('450');
// { value: 450, displayValue: '450 Lux', unit: 'Lux', isValid: true }

const desc = getLightLevelDescription(450);
// {
//   level: 'MEDIUM',
//   color: '#FFA500',
//   description: 'Medium light',
//   automationMode: 'DIM'
// }

const percentage = getLightPercentage(450);
// 4.5  (450/10000 * 100)
```

---

## 🪝 React Hook: `useSensorData`

Simplest way to use sensor data in components.

```tsx
import { useSensorData } from '@/hooks/useSensorData';

function MyComponent() {
  const temp = useSensorData({ 
    type: 'TEMPERATURE', 
    payload: '25.5' 
  });
  
  return <div>{temp.displayValue}</div>;
}
```

**Returns:**
```tsx
{
  value: 25.5,                    // Parsed value
  displayValue: '25.5°C',         // Formatted for display
  unit: '°C',                     // Unit string
  isValid: true,                  // Validation result
  type: 'TEMPERATURE',            // Sensor type
  warning?: string,               // Type-specific warning
  status?: Object                 // Type-specific status info
}
```

---

## 🔌 WebSocket Integration (AppContext)

The AppContext automatically handles WebSocket messages:

```tsx
// In AppContext.tsx

// Sensor messages are parsed automatically
// and stored in websocketData state

// Access in components via AppContext
const { websocketData } = useAppContext();

// Latest sensor readings
const latestReading = websocketData[websocketData.length - 1];
```

---

## 🛡️ Data Validation

All data is validated automatically:

```tsx
import { validateSensorMessage } from '@/utils/sensorDataParser';

const validation = validateSensorMessage(msg);
if (!validation.valid) {
  console.error('Errors:', validation.errors);
}
```

**Validation checks:**
- ✅ Required fields present (firmwareId, category, type, channel, payload)
- ✅ Value in valid range for each type
- ✅ Payload format matches expected type

---

## 📊 Reference: Light Levels (Lux)

| Lux Range | Level | Description | Automation |
|-----------|-------|-------------|-----------|
| > 10000 | VERY_BRIGHT | Direct sunlight | OFF |
| 5000-10000 | BRIGHT | Well-lit | OFF |
| 1000-5000 | MEDIUM | Medium light | DIM |
| 100-1000 | DIM | Office light | DIM |
| 10-100 | DARK | Twilight | NIGHT |
| < 10 | VERY_DARK | Night | NIGHT |

---

## 💧 Reference: Humidity Zones

| Range | Status | Color | Recommendation | Mold Risk |
|-------|--------|-------|-----------------|-----------|
| < 30% | TOO_DRY | #FF6B6B | Very dry | LOW |
| 30-40% | DRY | #FFA500 | A bit dry | LOW |
| 40-60% | COMFORT | #51CF66 | Comfortable | LOW |
| 60-70% | WARM | #FFD93D | A bit humid | MEDIUM |
| > 70% | TOO_HUMID | #FF6B9D | Too humid | HIGH |

---

## 🌡️ Reference: Temperature Alerts

| Range | Status | Alert |
|-------|--------|-------|
| > 30°C | HIGH | ⚠️ High temperature alert! |
| 5-30°C | NORMAL | ✓ Normal |
| < 5°C | LOW | ⚠️ Low temperature alert! |

---

## 📱 Real-World Example: Room Dashboard

```tsx
import { useSensorData } from '@/hooks/useSensorData';
import { useAppContext } from '@/contexts/AppContext';

export function RoomDashboard({ roomId }: { roomId: string }) {
  const { devices } = useAppContext();
  
  // Get sensors in this room
  const roomDevices = devices.filter(d => d.roomId === roomId);
  const tempModule = roomDevices[0]?.modules?.find(m => m.type === 'TEMPERATURE');
  const humidityModule = roomDevices[0]?.modules?.find(m => m.type === 'HUMIDITY');
  const lightModule = roomDevices[0]?.modules?.find(m => m.type === 'LIGHT');
  
  const temp = useSensorData({ 
    type: 'TEMPERATURE', 
    value: tempModule?.value 
  });
  const humidity = useSensorData({ 
    type: 'HUMIDITY', 
    value: humidityModule?.value 
  });
  const light = useSensorData({ 
    type: 'LIGHT', 
    value: lightModule?.value 
  });
  
  return (
    <div className="room-dashboard">
      <div className="sensor-card" style={{ borderLeft: `4px solid ${temp.warning ? '#dc3545' : '#28a745'}` }}>
        <h3>Temperature</h3>
        <p className="value">{temp.displayValue}</p>
        {temp.warning && <p className="warning">{temp.warning}</p>}
      </div>
      
      <div className="sensor-card" style={{ borderLeft: `4px solid ${humidity.status?.color}` }}>
        <h3>Humidity</h3>
        <p className="value">{humidity.displayValue}</p>
        <p className="status">{humidity.status?.recommendation}</p>
      </div>
      
      <div className="sensor-card" style={{ borderLeft: `4px solid ${light.status?.color}` }}>
        <h3>Light Level</h3>
        <p className="value">{light.displayValue}</p>
        <p className="status">{light.status?.description}</p>
      </div>
    </div>
  );
}
```

---

## 🔍 Troubleshooting

**Issue: Sensor data not updating**
- Check WebSocket connection: `AppContext.websocketStatus`
- Verify backend is sending messages in correct format
- Check browser DevTools console for parsing errors

**Issue: Invalid data warnings**
- Ensure payload values are in valid range
- Temperature: -50 to 100°C
- Humidity: 0 to 100%
- Motion: "0" or "1"
- Light: 0 to 100000 Lux

**Issue: Module values not updating**
- Need device → module mapping from backend
- Currently requires manual linking by firmwareId/channel

---

## ✨ Summary

1. **Real-time sensor data** arrives via WebSocket
2. **Automatically parsed and validated** by WebSocketService
3. **Stored in AppContext** for app-wide access
4. **Easy display with useSensorData hook** in components
5. **Type-specific utilities** for advanced formatting

Happy building! 🚀
