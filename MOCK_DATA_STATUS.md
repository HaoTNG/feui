# Mock Data Replacement Status

## Summary
AppContext hiện đang dùng mock data được hardcode. Dưới đây là danh sách các mock data và trạng thái thay thế bằng API services:

## ✅ CÓ THỂ THAY THẾ (Services đã tạo)

### 1. **initialHomes** → `homeService.getHomes()`
- Status: ✅ Ready
- Service: `homeService`
- Method: `getHomes()`
- Returns: `HomeDTO[]` → converts to `Home[]`
- Notes: Backend sẽ trả về danh sách tất cả homes của user

### 2. **initialRooms** → `roomService.getRoomsByHome(homeId)`
- Status: ✅ Ready
- Service: `roomService`
- Method: `getRoomsByHome(homeId)`
- Returns: `RoomDTO[]` → converts to `Room[]`
- Notes: Phải gọi sau khi có selectedHomeId

### 3. **initialDevices** → `deviceService.getDevicesByHome(homeId)`
- Status: ✅ Ready
- Service: `deviceService`
- Method: `getDevicesByHome(homeId)`
- Returns: `DeviceDTO[]` → converts to `Device[]` (deprecated structure)
- Notes: Backend trả về devices, cần map sang Device model

### 4. **initialHubs** & **initialModules** (từ hubsAndModulesData.ts)
- Status: ⚠️ KHÔNG CÓ SERVICE
- Issue: Backend không trả về Hub data riêng - Hubs là phần của Device
- Solution: Hubs và Modules không còn tồn tại độc lập, chúng là:
  - `firmwareId` (Hub equivalent) nested trong Device
  - `modules` array nested trong Device
- Action: **REMOVE từ AppContext**, dùng Device-Module structure từ deviceService

### 5. **Automation Rules** → Backend chưa support
- Status: ❌ KHÔNG CÓ SERVICE
- Issue: Backend không có automation rules API
- Current: initialAutomationRules hardcoded
- Action: **GIỮ LẠI mock data** cho frontend-only automation

### 6. **Activities** → Frontend-only (not persisted)
- Status: ⏹️ KHÔNG CẦN SERVICE
- Issue: Activities là frontend log của user actions
- Current: initialActivities + addActivity() method
- Action: **GIỮ LẠI**, chỉ là local logging

### 7. **Notifications** → Frontend-only (not persisted)
- Status: ⏹️ KHÔNG CẦN SERVICE
- Issue: Notifications không được persist trên backend
- Current: initialNotifications
- Action: **GIỮ LẠI mock**, có thể thêm real-time updates qua WebSocket sau

### 8. **User Profile** → `userService.getCurrentUser()`
- Status: ✅ Ready
- Service: `userService`
- Method: `getCurrentUser()`
- Returns: `User` → converts to `UserProfile`
- Notes: Lấy user info từ backend

### 9. **Members** → `memberService.getMembers(homeId)`
- Status: ✅ Ready
- Service: `memberService`
- Method: `getMembers(homeId)`
- Returns: `HomeMember[]`
- Notes: Lấy danh sách members của home

## ❌ KHÔNG ĐƯỢC THAY THẾ (Backend chưa support)

### 1. **initialHubs** (Hubs độc lập)
- Reason: Backend không có Hubs API, Hubs là property của Device
- Keep: ✅ REMOVE từ AppContext (dùng Device structure)

### 2. **initialModules** (Modules độc lập)
- Reason: Backend không có Modules API, Modules nested trong Device
- Keep: ✅ REMOVE từ AppContext (dùng Device.modules)

### 3. **Automation Rules**
- Reason: Backend không có automation API
- Keep: ✅ KEEP as mock data (frontend-only feature)

### 4. **Activities**
- Reason: Frontend log, không persist trên backend
- Keep: ✅ KEEP as local logging

### 5. **Notifications**
- Reason: Real-time events, sẽ implement qua WebSocket sau
- Keep: ✅ KEEP as mock (sẽ update với real data từ WebSocket)

## 🔄 MIGRATION PLAN

### Phase 1: Authentication & User
1. Remove hardcoded user in initialState
2. Add useEffect to fetch currentUser on app mount
3. Fetch user profile from `userService.getCurrentUser()`

### Phase 2: Homes & Rooms
1. Fetch homes with `homeService.getHomes()` on app mount
2. Fetch rooms when home is selected: `roomService.getRoomsByHome(homeId)`
3. Remove initialHomes and initialRooms

### Phase 3: Devices & Modules
1. Fetch devices with `deviceService.getDevicesByHome(homeId)` when home is selected
2. Remove initialDevices, initialHubs, initialModules
3. Update components to use Device.modules instead of separate modules/hubs

### Phase 4: Keep as Mock
1. Keep Automation Rules (no backend support yet)
2. Keep Activities (local logging)
3. Keep Notifications (will add WebSocket later)
4. Keep Members (already have memberService)

## 📊 Data Structure Changes

### Old (Mock-based)
```
AppContext
├── homes: Home[]
├── hubs: Hub[] ⏸️ REMOVE
├── modules: Module[] ⏸️ REMOVE
├── devices: Device[] (deprecated)
├── rooms: Room[]
└── automationRules: AutomationRule[] (keep)
```

### New (API-based)
```
AppContext
├── homes: Home[] (from homeService)
├── devices: Device[] (from deviceService + modules nested)
├── rooms: Room[] (from roomService)
├── automationRules: AutomationRule[] (mock, keep)
├── activities: Activity[] (mock, keep)
└── notifications: Notification[] (mock, keep)
```

## 🔗 API Services to Integrate

| Service | Methods | Status |
|---------|---------|--------|
| authService | login() | ✅ Ready |
| userService | getCurrentUser(), updateProfile() | ✅ Ready |
| homeService | getHomes(), getHome(), createHome(), updateHome(), deleteHome() | ✅ Ready |
| roomService | getRoomsByHome(), getRoom(), createRoom(), updateRoom(), deleteRoom() | ✅ Ready |
| deviceService | getDevicesByHome(), getDevice(), createDevice(), updateDeviceName(), moveDevice(), deleteDevice(), sendCommand(), getDeviceState() | ✅ Ready |
| moduleService | addModule(), getModule(), updateModuleName(), deleteModule() | ✅ Ready |
| memberService | getMembers(), addMember(), removeMember(), leaveHome() | ✅ Ready |

## 🎯 Implementation Notes

1. **Hubs & Modules**: Backend returns Devices with nested modules. Hubs information (firmwareId) is inside Device. No separate Hub/Module endpoints needed.

2. **Activities**: Keep in AppContext as local frontend log. Not persisted to backend. User can clear via UI only.

3. **Notifications**: Start with mock, later replace with WebSocket events from backend when IoT events occur.

4. **Automation Rules**: Backend may support this in future. For now, keep as frontend-only feature with localStorage persistence (optional).

5. **User Profile**: Fetch from backend on app mount via `userService.getCurrentUser()`

## 🚀 Next Steps

1. Update AppContext.tsx to:
   - Remove initialHubs and initialModules imports
   - Add useEffect hooks to fetch data from services
   - Remove hubs/modules state (use device.modules instead)
   - Keep activities/notifications/automationRules as mock

2. Update components to:
   - Use Device-Module structure instead of Hub-Module
   - Call services for CRUD operations
   - Handle loading/error states with useApi hook

3. Test with backend API running on localhost:8080
