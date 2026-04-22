# 🚀 Sensor Data - Quick Reference Card

## Import Statements
```tsx
// For components
import { useSensorData } from '@/hooks/useSensorData';

// For direct parsing
import { parseSensorData, getHumidityStatus, getLightLevelDescription } from '@/utils/sensorDataParser';

// For styles
import { getSensorStyling } from '@/hooks/useSensorData';
```

---

## Hook Usage (Easiest Way)
```tsx
const sensorData = useSensorData({ 
  type: 'TEMPERATURE', 
  value: 25.5 
  // OR
  // payload: '25.5'  // from WebSocket
});

// Properties:
// sensorData.value          // 25.5 (parsed)
// sensorData.displayValue   // "25.5°C" (formatted)
// sensorData.unit           // "°C"
// sensorData.isValid        // true/false
// sensorData.warning        // "High temperature alert!" or null
// sensorData.status         // { status: 'COMFORT', color: '#51CF66', ... }
```

---

## Supported Types

| Type | Values | Unit | Example |
|------|--------|------|---------|
| `'TEMPERATURE'` | -50 to 100 | °C | `25.5` |
| `'HUMIDITY'` | 0 to 100 | % | `65` |
| `'MOTION'` | true/false | - | `true` or `false` |
| `'LIGHT'` \| `'LIGHT_SENSOR'` | 0 to 100000 | Lux | `450` |

---

## Display Examples

### 🌡️ Temperature
```tsx
<div>
  <p>{temp.displayValue}</p>
  {temp.warning && <p style={{color: 'red'}}>{temp.warning}</p>}
</div>
```

### 💧 Humidity
```tsx
<div style={{color: temp.status?.color}}>
  <p>{humidity.displayValue}</p>
  <p>{humidity.status?.recommendation}</p>
  <p>Mold Risk: {humidity.status?.moldRisk}</p>
</div>
```

### 🚨 Motion
```tsx
<div>
  <span>{motion.status?.icon} {motion.status?.label}</span>
</div>
```

### 💡 Light
```tsx
<div>
  <p>{light.displayValue}</p>
  <p>{light.status?.description}</p>
</div>
```

---

## Data Formats from Server

### Temperature
```json
{ "firmwareId": "DEV_001", "category": "data", "type": "TEMPERATURE", "channel": 1, "payload": "25.5" }
```

### Humidity
```json
{ "firmwareId": "DEV_001", "category": "data", "type": "HUMIDITY", "channel": 2, "payload": "65" }
```

### Motion
```json
{ "firmwareId": "DEV_001", "category": "data", "type": "MOTION", "channel": 3, "payload": "1" }
```

### Light
```json
{ "firmwareId": "DEV_001", "category": "data", "type": "LIGHT", "channel": 4, "payload": "450" }
```

---

## Temperature Alerts
| Condition | Alert |\n| < 5°C | ❄️ Low temperature |\n| 5-30°C | ✓ Normal |\n| > 30°C | 🔥 High temperature |

---

## Humidity Zones
| Range | Status | Color | Risk |\n| < 30% | TOO_DRY | #FF6B6B | None |\n| 30-40% | DRY | #FFA500 | None |\n| 40-60% | COMFORT | #51CF66 | None |\n| 60-70% | WARM | #FFD93D | Medium |\n| > 70% | TOO_HUMID | #FF6B9D | High |

---

## Light Levels
| Lux | Level | Description | Mode |\n| < 10 | VERY_DARK | Night | NIGHT |\n| 10-100 | DARK | Twilight | NIGHT |\n| 100-1000 | DIM | Office | DIM |\n| 1000-5000 | MEDIUM | Medium | DIM |\n| 5000-10000 | BRIGHT | Well-lit | OFF |\n| > 10000 | VERY_BRIGHT | Sunlight | OFF |

---

## Direct Parsing

```tsx
// If you need to parse raw WebSocket data
import { parseSensorData } from '@/utils/sensorDataParser';

const message = {
  firmwareId: 'DEV_001',
  category: 'data',
  type: 'TEMPERATURE',
  channel: 1,
  payload: '25.5'
};

const parsed = parseSensorData(message);
// { value: 25.5, displayValue: '25.5°C', unit: '°C', isValid: true, type: 'TEMPERATURE' }
```

---

## Validation

```tsx
import { validateSensorMessage } from '@/utils/sensorDataParser';

const { valid, errors } = validateSensorMessage(msg);
if (!valid) {
  console.error('Invalid:', errors);
}
```

---

## Context Access

```tsx
import { useAppContext } from '@/contexts/AppContext';

const { websocketData, websocketStatus } = useAppContext();

// Latest sensor reading
const latest = websocketData[websocketData.length - 1];

// Connection status: 'connected' | 'disconnected' | 'error' | 'connecting'
console.log(websocketStatus);
```

---

## Advanced: Temperature Conversion

```tsx
import { formatTemperature } from '@/utils/sensorDataParser';

const temps = formatTemperature(25.5);
// {
//   celsius: 25.5,
//   fahrenheit: 77.9,
//   kelvin: 298.65,
//   display: '25.5°C'
// }
```

---

## Advanced: Motion Triggers

```tsx
import { useSensorData } from '@/hooks/useSensorData';
import { useEffect } from 'react';

function AutoLighting({ value }) {
  const motion = useSensorData({ type: 'MOTION', value });
  
  useEffect(() => {
    if (motion.value === true) {
      // Turn on lights
      activateLighting();
    }
  }, [motion.value]);
}
```

---

## Advanced: Light Auto-Adjust

```tsx
import { useSensorData } from '@/hooks/useSensorData';

function SmartLighting({ value }) {
  const light = useSensorData({ type: 'LIGHT', value });
  const mode = light.status?.automationMode; // 'OFF' | 'DIM' | 'NIGHT'
  
  return <p>Auto Mode: {mode}</p>;
}
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Data not updating | Check `websocketStatus` in context |
| Invalid data | Check payload format & value range |
| TypeScript errors | Import types: `import type { ModuleType }` |
| Hook returns same value | Check if dependency changed |
| No alerts appearing | Check warning/status properties |

---

## File Locations
- **Parser**: `src/app/utils/sensorDataParser.ts`
- **Hook**: `src/app/hooks/useSensorData.ts`
- **Converter**: `src/app/utils/converters.ts`
- **Guide**: `src/imports/sensor-data-integration-guide.md`
- **Summary**: `SENSOR_INTEGRATION_SUMMARY.md`

---

**Last Updated**: April 21, 2026  
**Status**: ✅ Production Ready
