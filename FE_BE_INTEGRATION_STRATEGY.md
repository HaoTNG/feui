# FE-BE Integration Strategy - Smart Home App

## 📊 Tình Hình Hiện Tại

### Frontend (FE)
- ✅ React + Vite + TypeScript
- ✅ AppContext quản lý state (in-memory)
- ✅ Dữ liệu mock (initialHubs, initialModules, initialDevices)
- ✅ Không có backend connection hiện tại
- ✅ Tất cả dữ liệu lưu trong React state

### Backend (BE)
- ❌ Chưa tồn tại
- ❌ Không có API server
- ❌ Không có database

### Data Flow Hiện Tại
```
User Action
    ↓
Component
    ↓
AppContext (updateModule, addActivity, etc.)
    ↓
React State (in-memory)
    ↓
Component Re-render
```

---

## 🎯 Chiến Lược FE-BE Integration: Layered API Architecture

### Mục tiêu:
1. ✅ FE không biết BE implementation (loose coupling)
2. ✅ Easy switch giữa mock data → real API
3. ✅ Centralized API management
4. ✅ Error handling, loading states
5. ✅ Real-time data sync (optional: WebSocket)

---

## 🏗️ Kiến Trúc Đề Xuất: API Service Layer

### 3 Tầng API:

```
┌────────────────────────────────────┐
│   Components (UI Layer)             │
│   - Call hooks like useModules()    │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   AppContext (State Management)      │ ← "Dumb" about API
│   - Just stores and updates state    │
│   - Calls API service methods        │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   API Service Layer (API Interface)  │ ← "Smart" về communication
│   - apiClient (HTTP/REST)            │
│   - apiService (business logic)      │
│   - Can swap mock ↔ real API         │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   Backend API (Cần tạo)              │
│   - REST endpoints                   │
│   - Database                         │
│   - MQTT/WebSocket (cho IoT)         │
└────────────────────────────────────┘
```

---

## 📁 Cấu Trúc Thư Mục Đề Xuất

```
src/app/
├── api/                           # NEW - API Layer
│   ├── client.ts                  # HTTP client (axios/fetch)
│   ├── endpoints.ts               # API endpoints constants
│   ├── services/                  # Business logic APIs
│   │   ├── authService.ts         # Auth API
│   │   ├── moduleService.ts       # Module API
│   │   ├── hubService.ts          # Hub API
│   │   ├── roomService.ts         # Room API
│   │   ├── activityService.ts     # Activity API
│   │   ├── automationService.ts   # Automation API
│   │   └── homeService.ts         # Home API
│   └── mock/                      # Mock implementations
│       ├── mockModuleService.ts
│       ├── mockHubService.ts
│       └── ...
│
├── contexts/
│   └── AppContext.tsx             # Updated: call API services
│
├── hooks/
│   ├── useModules.ts
│   └── ...
│
├── types/
│   ├── index.ts
│   └── api.ts                     # NEW - API response types
│
└── ...
```

---

## 🔧 Chi Tiết Implementation

### 1. **HTTP Client Setup** (src/app/api/client.ts)

```typescript
// src/app/api/client.ts
import axios, { AxiosInstance } from 'axios';

// Development: can toggle between mock and real API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
const USE_MOCK_API = process.env.REACT_APP_USE_MOCK === 'true';

// Create axios instance with default config
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to all requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

export const isUsingMockAPI = USE_MOCK_API;
```

### 2. **API Endpoints Constants** (src/app/api/endpoints.ts)

```typescript
// src/app/api/endpoints.ts
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
  },

  // Homes
  HOMES: {
    LIST: '/homes',
    GET: (id: string) => `/homes/${id}`,
    CREATE: '/homes',
    UPDATE: (id: string) => `/homes/${id}`,
    DELETE: (id: string) => `/homes/${id}`,
  },

  // Hubs
  HUBS: {
    LIST: (homeId: string) => `/homes/${homeId}/hubs`,
    GET: (hubId: string) => `/hubs/${hubId}`,
    CREATE: '/hubs',
    UPDATE: (hubId: string) => `/hubs/${hubId}`,
    DELETE: (hubId: string) => `/hubs/${hubId}`,
  },

  // Modules
  MODULES: {
    LIST: (homeId: string) => `/homes/${homeId}/modules`,
    GET: (moduleId: string) => `/modules/${moduleId}`,
    CREATE: '/modules',
    UPDATE: (moduleId: string) => `/modules/${moduleId}`,
    DELETE: (moduleId: string) => `/modules/${moduleId}`,
    // Control
    TOGGLE: (moduleId: string) => `/modules/${moduleId}/toggle`,
    SET_VALUE: (moduleId: string) => `/modules/${moduleId}/value`,
  },

  // Rooms
  ROOMS: {
    LIST: (homeId: string) => `/homes/${homeId}/rooms`,
    GET: (roomId: string) => `/rooms/${roomId}`,
    CREATE: '/rooms',
    UPDATE: (roomId: string) => `/rooms/${roomId}`,
    DELETE: (roomId: string) => `/rooms/${roomId}`,
  },

  // Activities
  ACTIVITIES: {
    LIST: (homeId: string) => `/homes/${homeId}/activities`,
    CREATE: '/activities',
  },

  // Automation
  AUTOMATION: {
    LIST: (homeId: string) => `/homes/${homeId}/automation`,
    CREATE: '/automation',
    UPDATE: (ruleId: string) => `/automation/${ruleId}`,
    DELETE: (ruleId: string) => `/automation/${ruleId}`,
    TOGGLE: (ruleId: string) => `/automation/${ruleId}/toggle`,
  },
};
```

### 3. **API Service - Module Example** (src/app/api/services/moduleService.ts)

```typescript
// src/app/api/services/moduleService.ts
import { apiClient, isUsingMockAPI } from '../client';
import { API_ENDPOINTS } from '../endpoints';
import type { Module, Activity } from '../../contexts/AppContext';
import { mockModuleService } from '../mock/mockModuleService';

interface CreateModulePayload {
  name: string;
  type: string;
  hubId: string;
  room: string;
  homeId: string;
  feed: string;
}

interface UpdateModulePayload extends Partial<CreateModulePayload> {
  status?: 'online' | 'offline';
  temperature?: number;
  humidity?: number;
  brightness?: number;
  // ... other module properties
}

class ModuleService {
  // List modules by home
  async getModulesByHome(homeId: string | null): Promise<Module[]> {
    if (!homeId) return [];
    
    if (isUsingMockAPI) {
      return mockModuleService.getModulesByHome(homeId);
    }

    try {
      const response = await apiClient.get(API_ENDPOINTS.MODULES.LIST(homeId));
      return response.data.modules || [];
    } catch (error) {
      console.error('Failed to fetch modules:', error);
      throw error;
    }
  }

  // Get single module
  async getModule(moduleId: string): Promise<Module> {
    if (isUsingMockAPI) {
      return mockModuleService.getModule(moduleId);
    }

    try {
      const response = await apiClient.get(API_ENDPOINTS.MODULES.GET(moduleId));
      return response.data.module;
    } catch (error) {
      console.error('Failed to fetch module:', error);
      throw error;
    }
  }

  // Create module
  async createModule(payload: CreateModulePayload): Promise<Module> {
    if (isUsingMockAPI) {
      return mockModuleService.createModule(payload);
    }

    try {
      const response = await apiClient.post(API_ENDPOINTS.MODULES.CREATE, payload);
      return response.data.module;
    } catch (error) {
      console.error('Failed to create module:', error);
      throw error;
    }
  }

  // Update module
  async updateModule(moduleId: string, payload: UpdateModulePayload): Promise<Module> {
    if (isUsingMockAPI) {
      return mockModuleService.updateModule(moduleId, payload);
    }

    try {
      const response = await apiClient.patch(
        API_ENDPOINTS.MODULES.UPDATE(moduleId),
        payload
      );
      return response.data.module;
    } catch (error) {
      console.error('Failed to update module:', error);
      throw error;
    }
  }

  // Delete module
  async deleteModule(moduleId: string): Promise<void> {
    if (isUsingMockAPI) {
      return mockModuleService.deleteModule(moduleId);
    }

    try {
      await apiClient.delete(API_ENDPOINTS.MODULES.DELETE(moduleId));
    } catch (error) {
      console.error('Failed to delete module:', error);
      throw error;
    }
  }

  // Toggle module on/off
  async toggleModule(moduleId: string): Promise<Module> {
    if (isUsingMockAPI) {
      return mockModuleService.toggleModule(moduleId);
    }

    try {
      const response = await apiClient.post(
        API_ENDPOINTS.MODULES.TOGGLE(moduleId)
      );
      return response.data.module;
    } catch (error) {
      console.error('Failed to toggle module:', error);
      throw error;
    }
  }

  // Set module value (e.g., brightness, temperature setpoint)
  async setModuleValue(
    moduleId: string,
    property: string,
    value: any
  ): Promise<Module> {
    if (isUsingMockAPI) {
      return mockModuleService.setModuleValue(moduleId, property, value);
    }

    try {
      const response = await apiClient.post(
        API_ENDPOINTS.MODULES.SET_VALUE(moduleId),
        { property, value }
      );
      return response.data.module;
    } catch (error) {
      console.error('Failed to set module value:', error);
      throw error;
    }
  }
}

export const moduleService = new ModuleService();
```

### 4. **Updated AppContext** (Simplified Example)

```typescript
// src/app/contexts/AppContext.tsx (Partial - showing integration pattern)

import { moduleService } from '../api/services/moduleService';
import { hubService } from '../api/services/hubService';

export function AppProvider({ children }: { children: ReactNode }) {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load initial data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const modulesData = await moduleService.getModulesByHome(selectedHomeId);
        setModules(modulesData);
        setError(null);
      } catch (err) {
        console.error('Failed to load modules:', err);
        setError('Failed to load modules');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [selectedHomeId]);

  // Update module function - now calls API
  const updateModule = async (id: string, updates: Partial<Module>) => {
    try {
      const updatedModule = await moduleService.updateModule(id, updates);
      
      // Update local state
      setModules(prev => 
        prev.map(m => m.id === id ? { ...m, ...updates } : m)
      );
      
      // Log activity
      addActivity({
        type: 'user',
        deviceId: id,
        action: `Updated ${updatedModule.name}`,
        detail: 'via Web Dashboard',
        success: true,
      });
    } catch (err) {
      console.error('Failed to update module:', err);
      setError('Failed to update module');
      throw err;
    }
  };

  // Similar pattern for addModule, deleteModule, etc.
  const addModule = async (module: Omit<Module, 'id'>) => {
    try {
      const newModule = await moduleService.createModule(module as any);
      setModules(prev => [...prev, newModule]);
      return newModule;
    } catch (err) {
      console.error('Failed to add module:', err);
      setError('Failed to add module');
      throw err;
    }
  };

  // ... rest of context
}
```

---

## 🔄 Data Flow - With Backend Integration

### User Action Flow:
```
User clicks "Toggle Fan"
    ↓
Component calls: updateModule(fanId, { isOn: true })
    ↓
AppContext.updateModule()
    ↓
moduleService.updateModule(fanId, { isOn: true })
    ↓
API: POST /modules/{fanId}/toggle
    ↓
Backend: 
  - Publish MQTT message to YoloBit
  - Wait for confirmation from device
  - Update database
    ↓
API Response: { success: true, module: {...} }
    ↓
AppContext: Update local state
    ↓
Component: Re-render with new state
    ↓
User sees "Fan is now ON"
```

---

## 🔌 .env Configuration

```bash
# .env file
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_USE_MOCK=false          # false = real API, true = mock data
REACT_APP_MQTT_BROKER=io.adafruit.com
REACT_APP_MQTT_PORT=443
REACT_APP_ADAFRUIT_USERNAME=dadn50
REACT_APP_ADAFRUIT_KEY=your_key_here
```

---

## 🚀 Development Workflow

### Phase 1: Setup Mock API (Current State)
```bash
# .env
REACT_APP_USE_MOCK=true
```
- ✅ FE fully functional with mock data
- ✅ Can refine UI without backend
- ✅ Test all features locally

### Phase 2: Build Backend
```
Backend REST API + Database
├── Auth endpoints
├── CRUD endpoints (Homes, Hubs, Modules, etc.)
├── Control endpoints (toggle, setValue)
└── Activity logging
```

### Phase 3: Switch to Real API
```bash
# .env
REACT_APP_USE_MOCK=false
REACT_APP_API_URL=http://localhost:3001/api
```
- Just 1 line change!
- All components work without modification

---

## 📋 Backend API Requirements

### 1. **Auth Endpoints**
```
POST   /api/auth/login
POST   /api/auth/register
POST   /api/auth/logout
POST   /api/auth/refresh
```

### 2. **Home Endpoints**
```
GET    /api/homes                    # List all homes
POST   /api/homes                    # Create home
GET    /api/homes/{homeId}           # Get specific home
PUT    /api/homes/{homeId}           # Update home
DELETE /api/homes/{homeId}           # Delete home
```

### 3. **Hub Endpoints**
```
GET    /api/homes/{homeId}/hubs      # List hubs in home
POST   /api/hubs                     # Create hub
GET    /api/hubs/{hubId}             # Get hub details
PUT    /api/hubs/{hubId}             # Update hub
DELETE /api/hubs/{hubId}             # Delete hub
```

### 4. **Module Endpoints**
```
GET    /api/homes/{homeId}/modules   # List modules in home
POST   /api/modules                  # Create module
GET    /api/modules/{moduleId}       # Get module
PUT    /api/modules/{moduleId}       # Update module
DELETE /api/modules/{moduleId}       # Delete module
POST   /api/modules/{moduleId}/toggle # Toggle on/off
POST   /api/modules/{moduleId}/value  # Set value (brightness, etc)
```

### 5. **Room Endpoints**
```
GET    /api/homes/{homeId}/rooms     # List rooms
POST   /api/rooms                    # Create room
PUT    /api/rooms/{roomId}           # Update room
DELETE /api/rooms/{roomId}           # Delete room
```

### 6. **Activity Endpoints**
```
GET    /api/homes/{homeId}/activities # Get activities
POST   /api/activities                # Log activity
```

### 7. **Automation Endpoints**
```
GET    /api/homes/{homeId}/automation    # List rules
POST   /api/automation                   # Create rule
PUT    /api/automation/{ruleId}          # Update rule
DELETE /api/automation/{ruleId}          # Delete rule
POST   /api/automation/{ruleId}/toggle   # Enable/disable
```

---

## 🎁 Benefits of This Architecture

| Benefit | Explanation |
|---------|-------------|
| **Loose Coupling** | FE doesn't care about BE implementation |
| **Easy Testing** | Can use mock API in tests |
| **API Flexibility** | Can swap REST ↔ GraphQL ↔ Other |
| **Loading States** | Service layer can manage loading/error |
| **Real-time Updates** | Can add WebSocket without changing AppContext |
| **Single Responsibility** | Each service handles one domain |
| **Type Safety** | TypeScript types for API responses |
| **Error Handling** | Centralized error management |

---

## 🔐 Security Considerations

### Token Management
```typescript
// Store JWT token securely
localStorage.setItem('authToken', jwtToken);

// API client automatically adds to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### CORS Configuration
```
Backend should enable CORS for:
- http://localhost:5173 (development)
- https://yourdomain.com (production)
```

### HTTPS in Production
```bash
# All API calls should use HTTPS
REACT_APP_API_URL=https://api.yourdomain.com/api
```

---

## 📊 Recommended Backend Stack

```
Option 1: Node.js (JavaScript/TypeScript)
├── Express or NestJS (HTTP server)
├── PostgreSQL or MongoDB (database)
├── Redis (caching)
└── MQTT.js (IoT communication)

Option 2: Python
├── FastAPI or Django (HTTP server)
├── PostgreSQL or MongoDB (database)
├── Redis (caching)
└── paho-mqtt (IoT communication)

Option 3: Go
├── Gin or Echo (HTTP server)
├── PostgreSQL (database)
├── Redis (caching)
└── paho.mqtt (IoT communication)
```

---

## ✅ Implementation Checklist

- [ ] Create `/api` directory structure
- [ ] Setup HTTP client with axios
- [ ] Create API endpoints constants
- [ ] Create mock service implementations
- [ ] Create real service implementations
- [ ] Update AppContext to use services
- [ ] Add loading/error states to components
- [ ] Test with mock API
- [ ] Build backend
- [ ] Test with real API
- [ ] Add WebSocket for real-time updates (optional)

---

## 🎯 Next Steps

1. **Implement API Services** (this week)
   - Create all service classes
   - Add mock implementations
   - Update AppContext

2. **Build Backend** (next 2 weeks)
   - Choose tech stack
   - Setup database
   - Implement REST endpoints

3. **Connect & Test** (1 week)
   - Switch from mock to real API
   - Test all features
   - Performance optimization

4. **Real-time Features** (optional)
   - WebSocket integration
   - Live module updates
   - Instant notifications

---

## 📚 References

- Axios: https://axios-http.com/
- REST API Best Practices: https://restfulapi.net/
- React Context Best Practices: https://react.dev/reference/react/useContext
- MQTT for IoT: https://mqtt.org/
