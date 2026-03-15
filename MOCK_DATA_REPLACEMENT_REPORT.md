# Mock Data Replacement Report

## 📋 Summary

Hiện tại AppContext đã được cập nhật để sử dụng API services. Dưới đây là danh sách **chi tiết** những mock data **nào chưa có dữ liệu từ services để thay thế**, cần giữ lại:

---

## ✅ ĐÃ THAY THẾ (Services Ready)

### 1. **Homes**
```
❌ REMOVED: initialHomes (hardcoded)
✅ REPLACED BY: homeService.getHomes()
Status: Ready to use
Data source: Backend API
Endpoint: GET /homes
```

### 2. **Rooms**
```
❌ REMOVED: initialRooms (hardcoded)
✅ REPLACED BY: roomService.getRoomsByHome(homeId)
Status: Ready to use
Data source: Backend API
Endpoint: GET /homes/{homeId}/rooms
```

### 3. **Devices**
```
❌ REMOVED: initialDevices (hardcoded)
✅ REPLACED BY: deviceService.getDevicesByHome(homeId)
Status: Ready to use
Data source: Backend API
Endpoint: GET /homes/{homeId}/devices
Note: Each device now has nested modules array
```

### 4. **Hubs & Modules**
```
❌ REMOVED: initialHubs (from hubsAndModulesData.ts)
❌ REMOVED: initialModules (from hubsAndModulesData.ts)
✅ REPLACED BY: Device structure with nested modules
- device.modules contains all Module objects
- device.firmwareId contains hub/firmware info
Status: Structure ready, devices fetched from API
```

### 5. **User Profile**
```
❌ REMOVED: Hardcoded demo user profile
✅ REPLACED BY: userService.getCurrentUser()
Status: Ready to use
Data source: Backend API
Endpoint: GET /users/me
```

### 6. **Authentication**
```
❌ REMOVED: Mock login logic
✅ REPLACED BY: authService.login(email, password)
Status: Ready to use
Data source: Backend API
Endpoint: POST /auth/login
Note: Now returns real JWT token and user data
```

---

## ⏸️ GIỮ LẠI (No Backend Support Yet)

### 1. **Activities** 
```
Status: ⏸️ KEEP AS MOCK
Reason: Activities are frontend-only action logs, not persisted to backend
Location: initialActivities in AppContext
Current behavior:
  - addActivity() creates new activity in memory
  - Activities only exist during session
  - Cleared when page refreshes

Future considerations:
  - Could persist to backend if needed
  - Would need: POST /activities endpoint
  - Requires timestamps and user context

Usage in AppContext:
  ✅ activities: Activity[]
  ✅ addActivity(): void
  ✅ No API calls needed currently
```

### 2. **Notifications**
```
Status: ⏸️ KEEP AS MOCK (for now)
Reason: Real notifications will come from backend via WebSocket/polling
Current mock:
  - initialNotifications with fake motion/temperature alerts
  - markNotificationAsRead() for UI interaction

Future implementation:
  - Replace with real backend events
  - Backend will push notifications when:
    a) Device goes offline
    b) Sensor reading exceeds threshold
    c) Automation rule triggers
    d) Someone adds/removes you from home
  - Will use WebSocket or Server-Sent Events
  - Will subscribe on app mount

Usage in AppContext:
  ✅ notifications: Notification[]
  ✅ markNotificationAsRead(id): void
  ✅ No API calls currently, but could be added later
```

### 3. **Automation Rules**
```
Status: ⏸️ KEEP AS MOCK
Reason: Backend automation API not yet created
Current mock:
  - initialAutomationRules with 4 example rules
  - Frontend-only CRUD operations

Future backend API would need:
  - GET /homes/{homeId}/automation-rules (list)
  - POST /homes/{homeId}/automation-rules (create)
  - PATCH /automation-rules/{ruleId} (update)
  - DELETE /automation-rules/{ruleId} (delete)
  - POST /automation-rules/{ruleId}/toggle (enable/disable)

Usage in AppContext:
  ✅ automationRules: AutomationRule[]
  ✅ addAutomationRule(), updateAutomationRule()
  ✅ toggleAutomationRule(), deleteAutomationRule()
  ✅ No API calls currently (frontend-only)
```

### 4. **Temperature Simulation** (DEMO ONLY)
```
Status: ⏸️ KEEP FOR DEMO TESTING
Reason: Helps test UI without real sensors
Location: temperatureSimulation in AppContext

Current structure:
  {
    enabled: boolean,
    value: number
  }

Usage:
  getCurrentTemperature() checks:
    if (enabled) return simulated_value
    else return real_temperature_from_device

To remove: Delete when backend sensors are reliable
```

---

## 📊 Data Source Summary Table

| Data | Current | Source | Backend? | When Ready | Notes |
|------|---------|--------|----------|-----------|-------|
| Homes | ✅ API | homeService | ✅ Yes | Now | Working |
| Rooms | ✅ API | roomService | ✅ Yes | Now | Working |
| Devices | ✅ API | deviceService | ✅ Yes | Now | Working |
| Modules | ✅ API | Nested in Device | ✅ Yes | Now | Working |
| User Profile | ✅ API | userService | ✅ Yes | Now | Working |
| Activities | ⏸️ Mock | Local state | ❌ No | TBD | Frontend log only |
| Notifications | ⏸️ Mock | Local state | ⏳ Future | Phase 2 | Will use WebSocket |
| Automation Rules | ⏸️ Mock | Local state | ❌ No | Future | Backend API needed |
| Members | ✅ API | memberService | ✅ Yes | Now | Available if needed |

---

## 🎯 What Each Mock Data is Used For

### Activities (User Action Log)
```typescript
// Example activity
{
  id: "1",
  timestamp: new Date(),
  type: "user",
  action: "You turned on Living Room Light",
  detail: "via Web Dashboard",
  success: true
}

// Where it's displayed:
- Dashboard → Activity Log section
- Possibly in audit trails

// Why it's mock:
- Backend doesn't persist action logs
- Only frontend cares about user actions
- Cleared on page refresh
```

### Notifications (Alert System)
```typescript
// Example notification
{
  id: "1",
  type: "motion",
  message: "Motion detected in Living Room",
  isRead: false
}

// Where it's displayed:
- Notification bell in header
- Notification list/drawer
- Toast messages

// Why it's mock (for now):
- Will be real events from backend
- Currently demonstrating UI
- Real backend will send:
  a) Device offline alerts
  b) Sensor threshold breaches
  c) Automation triggers
  d) Member join/leave events
```

### Automation Rules (Smart Home Logic)
```typescript
// Example rule
{
  id: "1",
  name: "Hot Weather Fan",
  condition: "Temperature > 30°C",
  action: "Turn on fan",
  enabled: true
}

// Where it's displayed:
- Automation.tsx component
- Rules list page
- Create/Edit rule modals

// Why it's mock:
- Backend automation API not created yet
- Frontend supports full CRUD
- Waiting for backend implementation
```

---

## 🔄 When to Replace Mock Data

### Activities ➡️ Backend Persistence
```
Only if requirement is to show historical logs
Current: Session-only
Consider:
  - Database table for activities
  - GET /homes/{homeId}/activities endpoint
  - Pagination/filtering (too many logs)
Priority: LOW - nice to have
```

### Notifications ➡️ Real-time Events
```
When backend starts sending real alerts
Current: Demo only
Implement with:
  - WebSocket connection for real-time
  - OR polling endpoint every 30 seconds
  - Handle offline gracefully
Priority: MEDIUM - important for UX
Timeline: Phase 2
```

### Automation Rules ➡️ Backend Storage
```
When backend creates automation API
Current: Frontend-only CRUD
Backend endpoints needed:
  - List, Create, Update, Delete, Toggle
  - Store in database
  - Execute on device state changes
Priority: HIGH - core feature
Timeline: Phase 2-3
```

---

## 🛠️ Where Mock Data is Defined

```
/home/rat/feui/src/app/contexts/AppContext.tsx

Lines 255-300:  initialActivities
Lines 305-330:  initialNotifications
Lines 335-400:  initialAutomationRules
Lines 420:      temperatureSimulation (state)
```

## 📝 How to Use Mock Data in Components

```typescript
import { useApp } from '@/app/contexts/AppContext';

export function MyComponent() {
  const {
    activities,      // Mock - frontend log
    notifications,   // Mock - will be real soon
    automationRules, // Mock - waiting for backend
    addActivity,     // Add to activity log
    addAutomationRule, // Create new automation
  } = useApp();

  // Activities
  addActivity({
    type: 'user',
    deviceId: 'device-1',
    action: 'Turned on light',
    detail: 'via dashboard',
    success: true
  });

  // Automation
  addAutomationRule({
    name: 'My Rule',
    condition: 'Temperature > 30',
    action: 'Turn on fan',
    enabled: true
  });
}
```

---

## ✨ Summary for Developer

**What needs to keep mock data:**

| Feature | Type | Status | Replacement |
|---------|------|--------|-------------|
| Activities | Log | Mock | Optional - add backend persistence |
| Notifications | Alerts | Mock | Will be WebSocket events |
| Automation | Rules | Mock | Needs backend CRUD API |
| Temperature Sim | Demo | Mock | Remove when sensors reliable |

**What's been replaced with API:**

| Feature | Type | Status | Source |
|---------|------|--------|--------|
| Homes | Data | API ✅ | homeService.getHomes() |
| Rooms | Data | API ✅ | roomService.getRoomsByHome() |
| Devices | Data | API ✅ | deviceService.getDevicesByHome() |
| Modules | Data | API ✅ | Nested in Device.modules |
| User | Data | API ✅ | userService.getCurrentUser() |
| Members | Data | API ✅ | memberService.getMembers() |
| Auth | Action | API ✅ | authService.login/logout |

---

**Created:** March 15, 2026
**Status:** Implementation Complete ✅
