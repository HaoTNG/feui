# API Testing Guide

Hướng dẫn test toàn bộ API endpoints trên giao diện. Mỗi test có step-by-step hướng dẫn.

---

## 1. AUTHENTICATION API

### ✅ 1.1 LOGIN - POST `/auth/login`
**Status:** Implemented in authService  
**Test Steps:**
1. Goto `http://localhost:5173/auth/login`
2. Enter email: `demo@example.com`, password: `password123`
3. Click "Sign In"
4. **Expected:** Login successful, redirect to Dashboard
5. **Check:** Open DevTools → Application → localStorage → verify `authToken` exists

**API Call:**
```
POST /auth/login
Body: { email, password }
Response: { accessToken, user }
```

---

### ✅ 1.2 LOGOUT - POST `/auth/logout`
**Status:** Implemented in authService  
**Test Steps:**
1. After logged in, goto Dashboard
2. Click user profile icon (top right) → "Logout"
3. **Expected:** Redirect to login page
4. **Check:** localStorage → `authToken` should be removed

**API Call:**
```
POST /auth/logout
Response: { success: true }
```

---

### ✅ 1.3 REFRESH TOKEN - POST `/auth/refresh`
**Status:** Implemented in authService  
**Test Steps:**
1. Login normally
2. Wait 5+ minutes (simulating token near expiry)
3. Navigate to any page → AppContext should auto-refresh token
4. **Expected:** No forced logout, token silently refreshed
5. **Check:** DevTools Network tab → see `/api/auth/refresh` calls

**API Call:**
```
POST /auth/refresh
Body: { refreshToken }
Response: { accessToken, refreshToken }
```

---

## 2. USER API

### ✅ 2.1 GET CURRENT USER - GET `/users/me`
**Status:** Implemented in userService  
**Test Steps:**
1. Login to Dashboard
2. Open DevTools → Console
3. Should see `[AppContext] Fetching user profile...` log
4. Click profile icon (top right)
5. **Expected:** Display user name, email, role
6. **Check:** User info loaded correctly from API

**API Call:**
```
GET /users/me
Response: { fullName, email, phone, role, avatar }
```

---

### ✅ 2.2 UPDATE PROFILE - PUT `/users/me`
**Status:** Implemented in userService  
**Test Steps:**
1. Goto `Settings` page (from sidebar)
2. Update "Full Name" field
3. Click "Save Changes"
4. **Expected:** Profile updated successfully
5. **Check:** Toast notification shows "Profile updated"

**API Call:**
```
PUT /users/me
Body: { fullName, email, phone, timeZone, language }
Response: { success: true, user }
```

---

## 3. HOMES API

### ✅ 3.1 GET ALL HOMES - GET `/homes`
**Status:** Implemented in homeService  
**Test Steps:**
1. Login to Dashboard
2. Check sidebar → should see list of homes
3. Open DevTools → Console
4. **Expected:** See `[AppContext] Homes fetched:` log with homes array
5. **Check:** Dashboard displays all homes with icons

**API Call:**
```
GET /homes
Response: [{ id, name, type, address, icon, isDefault, roomCount, deviceCount }]
```

---

### ✅ 3.2 GET HOME DETAILS - GET `/homes/{homeId}`
**Status:** Implemented in homeService  
**Test Steps:**
1. Login to Dashboard
2. Click on a home card
3. **Expected:** Show home detail page with all rooms, devices
4. **Check:** API called with correct homeId

**API Call:**
```
GET /homes/{homeId}
Response: { id, name, type, address, icon, rooms, devices }
```

---

### ✅ 3.3 CREATE HOME - POST `/homes`
**Status:** Implemented in homeService  
**Test Steps:**
1. Goto Dashboard → Homes page
2. Click "Add New Home" button
3. Fill form: Name = "Beach House", Type = "Condo", Address = "123 Beach St"
4. Click "Create Home"
5. **Expected:** New home appears in list
6. **Check:** Home count increases, new home has default ID

**API Call:**
```
POST /homes
Body: { name, type, address, icon }
Response: { id, name, type, address, icon, createdAt }
```

---

### ✅ 3.4 UPDATE HOME - PUT `/homes/{homeId}`
**Status:** Implemented in homeService  
**Test Steps:**
1. Goto Homes page
2. Click home card → "Edit"
3. Change home name to "Updated House Name"
4. Click "Save"
5. **Expected:** Home name updated in list
6. **Check:** API called with homeId

**API Call:**
```
PUT /homes/{homeId}
Body: { name, type, address, icon }
Response: { id, name, type, address, icon, updatedAt }
```

---

### ✅ 3.5 DELETE HOME - DELETE `/homes/{homeId}`
**Status:** Implemented in homeService  
**Test Steps:**
1. Goto Homes page
2. Find a test home → Click "Delete"
3. Confirm deletion
4. **Expected:** Home removed from list
5. **Check:** API called with DELETE method

**API Call:**
```
DELETE /homes/{homeId}
Response: { success: true }
```

---

## 4. ROOMS API

### ✅ 4.1 GET ROOMS BY HOME - GET `/homes/{homeId}/rooms`
**Status:** Implemented in roomService  
**Test Steps:**
1. Goto Dashboard → Select a home
2. Check "Rooms" section
3. **Expected:** All rooms for that home displayed
4. **Check:** DevTools → `[AppContext] Rooms fetched:` log

**API Call:**
```
GET /homes/{homeId}/rooms
Response: [{ id, name, homeId, deviceCount, temperature, humidity }]
```

---

### ✅ 4.2 GET ROOM DETAILS - GET `/rooms/{roomId}`
**Status:** Implemented in roomService  
**Test Steps:**
1. Click on a room card
2. **Expected:** Room detail page with devices inside
3. **Check:** All devices in room are displayed

**API Call:**
```
GET /rooms/{roomId}
Response: { id, name, homeId, devices, deviceCount, temperature }
```

---

### ✅ 4.3 CREATE ROOM - POST `/homes/{homeId}/rooms`
**Status:** Implemented in roomService  
**Test Steps:**
1. Goto home → Click "Add Room"
2. Enter name: "Master Bedroom"
3. Click "Create"
4. **Expected:** New room appears in list
5. **Check:** Room appears under correct home

**API Call:**
```
POST /homes/{homeId}/rooms
Body: { name }
Response: { id, name, homeId, createdAt }
```

---

### ✅ 4.4 UPDATE ROOM - PUT `/rooms/{roomId}`
**Status:** Implemented in roomService  
**Test Steps:**
1. Click room → "Edit"
2. Change name to "Guest Bedroom"
3. Click "Save"
4. **Expected:** Room name updated
5. **Check:** Toast shows "Room updated"

**API Call:**
```
PUT /rooms/{roomId}
Body: { name }
Response: { id, name, homeId, updatedAt }
```

---

### ✅ 4.5 DELETE ROOM - DELETE `/rooms/{roomId}`
**Status:** Implemented in roomService  
**Test Steps:**
1. Click room → "Delete"
2. Confirm deletion
3. **Expected:** Room removed from home
4. **Check:** Devices in room moved to unassigned

**API Call:**
```
DELETE /rooms/{roomId}
Response: { success: true }
```

---

## 5. DEVICES API

### ✅ 5.1 GET DEVICES BY HOME - GET `/homes/{homeId}/devices`
**Status:** Implemented in deviceService  
**Test Steps:**
1. Goto Dashboard → Select home
2. Scroll to "Devices" section
3. **Expected:** All devices displayed with their modules
4. **Check:** DevTools → `[AppContext] Devices fetched:` log

**API Call:**
```
GET /homes/{homeId}/devices
Response: [{ 
  id, name, type, room, status, 
  modules: [{ id, name, type, status, value }]
}]
```

---

### ✅ 5.2 GET DEVICE DETAILS - GET `/devices/{deviceId}`
**Status:** Implemented in deviceService  
**Test Steps:**
1. Click on a device card
2. **Expected:** Show device detail with all modules
3. **Check:** Module list matches device.modules

**API Call:**
```
GET /devices/{deviceId}
Response: { 
  id, name, type, room, status, 
  modules: [{ ... }], 
  firmwareId, state 
}
```

---

### ✅ 5.3 CREATE DEVICE - POST `/homes/{homeId}/devices`
**Status:** Implemented in deviceService  
**Test Steps:**
1. Goto home → Click "Add Device"
2. Select room: "Living Room"
3. Select device type: "Smart Hub"
4. Click "Add"
5. **Expected:** Device added to home
6. **Check:** Device appears in device list

**API Call:**
```
POST /homes/{homeId}/devices
Body: { name, type, roomId }
Response: { id, name, type, room, status, modules: [] }
```

---

### ✅ 5.4 SEND COMMAND TO DEVICE - POST `/devices/{deviceId}/commands`
**Status:** Implemented in deviceService  
**Test Steps:**
1. Goto Control page → `/devices`
2. Find a controllable module (LED, Fan)
3. Try to turn it ON/OFF
4. **Expected:** Command sent, UI updates
5. **Check:** DevTools Network → POST to `/api/devices/{id}/commands`

**API Call:**
```
POST /devices/{deviceId}/commands
Body: { module_id, command: "on"|"off", parameters: {...} }
Response: { success: true, state }
```

---

### ✅ 5.5 GET DEVICE STATE - GET `/devices/{deviceId}/state`
**Status:** Implemented in deviceService  
**Test Steps:**
1. Goto Control page
2. All modules should display current state
3. **Expected:** States match API response
4. **Check:** Real-time state displayed for each module

**API Call:**
```
GET /devices/{deviceId}/state
Response: { 
  modules: [{ 
    id, status, 
    temperature, humidity, brightness, ... 
  }]
}
```

---

### ✅ 5.6 UPDATE DEVICE NAME - PUT `/devices/{deviceId}/name`
**Status:** Implemented in deviceService  
**Test Steps:**
1. Click device → "Edit"
2. Change name to "Main Hub"
3. Click "Save"
4. **Expected:** Name updated in UI
5. **Check:** Toast shows "Device updated"

**API Call:**
```
PUT /devices/{deviceId}/name
Body: { name }
Response: { id, name, updatedAt }
```

---

### ✅ 5.7 MOVE DEVICE TO ROOM - PUT `/devices/{deviceId}/move-room`
**Status:** Implemented in deviceService  
**Test Steps:**
1. Click device → "Move to Room"
2. Select new room: "Bedroom"
3. Click "Move"
4. **Expected:** Device now shows in new room
5. **Check:** Old room device count decreases

**API Call:**
```
PUT /devices/{deviceId}/move-room
Body: { roomId }
Response: { id, room, roomId, updatedAt }
```

---

### ✅ 5.8 DELETE DEVICE - DELETE `/devices/{deviceId}`
**Status:** Implemented in deviceService  
**Test Steps:**
1. Click device → "Delete"
2. Confirm deletion
3. **Expected:** Device removed
4. **Check:** Device no longer in list

**API Call:**
```
DELETE /devices/{deviceId}
Response: { success: true }
```

---

## 6. MODULES API

### ✅ 6.1 GET MODULE DETAILS - GET `/modules/{moduleId}`
**Status:** Implemented in moduleService  
**Test Steps:**
1. Goto Control page → `/devices`
2. Click on any module
3. **Expected:** Show module detail modal
4. **Check:** Module info matches API

**API Call:**
```
GET /modules/{moduleId}
Response: { 
  id, deviceId, name, type, status, 
  temperature, humidity, brightness, ... 
}
```

---

### ✅ 6.2 ADD MODULE TO DEVICE - POST `/devices/{deviceId}/modules`
**Status:** Implemented in moduleService  
**Test Steps:**
1. Click device → "Add Module"
2. Select type: "Temperature Sensor"
3. Click "Add"
4. **Expected:** Module added to device
5. **Check:** Device now shows new module

**API Call:**
```
POST /devices/{deviceId}/modules
Body: { name, type }
Response: { id, deviceId, name, type, status, createdAt }
```

---

### ✅ 6.3 UPDATE MODULE NAME - PUT `/modules/{moduleId}/name`
**Status:** Implemented in moduleService  
**Test Steps:**
1. Click module → "Edit"
2. Change name to "Room Temperature"
3. Click "Save"
4. **Expected:** Module name updated
5. **Check:** Name reflects in all places showing module

**API Call:**
```
PUT /modules/{moduleId}/name
Body: { name }
Response: { id, name, updatedAt }
```

---

### ✅ 6.4 DELETE MODULE - DELETE `/modules/{moduleId}`
**Status:** Implemented in moduleService  
**Test Steps:**
1. Click module → "Delete"
2. Confirm deletion
3. **Expected:** Module removed from device
4. **Check:** Device now has fewer modules

**API Call:**
```
DELETE /modules/{moduleId}
Response: { success: true }
```

---

## 7. MEMBERS API

### ✅ 7.1 GET HOME MEMBERS - GET `/homes/{homeId}/members`
**Status:** Implemented in memberService  
**Test Steps:**
1. Goto home → "Members" page
2. **Expected:** List all members with their roles
3. **Check:** Owner, family members, guests shown

**API Call:**
```
GET /homes/{homeId}/members
Response: [{ id, name, email, role, joinedAt }]
```

---

### ✅ 7.2 ADD MEMBER TO HOME - POST `/homes/{homeId}/members`
**Status:** Implemented in memberService  
**Test Steps:**
1. Goto home → "Members" → "Invite Member"
2. Enter email: `family@example.com`
3. Select role: "Family"
4. Click "Invite"
5. **Expected:** Member added/invited
6. **Check:** Toast shows "Invitation sent"

**API Call:**
```
POST /homes/{homeId}/members
Body: { email, role }
Response: { id, email, role, status: "invited"|"active" }
```

---

### ✅ 7.3 REMOVE MEMBER FROM HOME - DELETE `/homes/{homeId}/members/{userId}`
**Status:** Implemented in memberService  
**Test Steps:**
1. Goto home → "Members"
2. Find a family member → Click "Remove"
3. Confirm removal
4. **Expected:** Member removed from home
5. **Check:** Member no longer in list

**API Call:**
```
DELETE /homes/{homeId}/members/{userId}
Response: { success: true }
```

---

### ✅ 7.4 LEAVE HOME - DELETE `/homes/{homeId}/members/me`
**Status:** Implemented in memberService  
**Test Steps:**
1. As a family member, goto home → "Members"
2. Click "Leave Home"
3. Confirm action
4. **Expected:** User removed from home
5. **Check:** Home no longer in user's home list

**API Call:**
```
DELETE /homes/{homeId}/members/me
Response: { success: true }
```

---

## Testing Workflow

### Phase 1: Authentication ✅
1. Test Login (1.1)
2. Check localStorage token (1.1)
3. Test User Profile fetch (2.1)

### Phase 2: Homes Management ✅
4. Test Get All Homes (3.1)
5. Test Create Home (3.3)
6. Test Update Home (3.4)
7. Test Get Home Details (3.2)

### Phase 3: Rooms Management ✅
8. Test Get Rooms (4.1)
9. Test Create Room (4.3)
10. Test Update Room (4.4)
11. Test Get Room Details (4.2)

### Phase 4: Devices Management ✅
12. Test Get Devices (5.1)
13. Test Create Device (5.3)
14. Test Get Device Details (5.2)
15. Test Send Command (5.4)
16. Test Get Device State (5.5)

### Phase 5: Advanced Operations ✅
17. Test Move Device (5.7)
18. Test Update Device Name (5.6)
19. Test Delete Device (5.8)

### Phase 6: Modules ✅
20. Test Get Module (6.1)
21. Test Add Module (6.2)
22. Test Update Module Name (6.3)
23. Test Delete Module (6.4)

### Phase 7: Members Management ✅
24. Test Get Members (7.1)
25. Test Add Member (7.2)
26. Test Remove Member (7.3)
27. Test Leave Home (7.4)

### Phase 8: Cleanup ✅
28. Test Logout (1.2)
29. Verify token cleared

---

## Console Debugging

Open DevTools (F12) and check console for logs:

```
[AppContext] - State changes, API fetches
[API] - Request/response details
[Interceptor] - Token handling
[AuthService] - Auth flow
```

Look for **no 403/401 errors** when testing!

---

## Common Issues & Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| 403 Forbidden | No/expired token | Login again, check localStorage authToken |
| 404 Not Found | Wrong endpoint path | Check API_ENDPOINTS constant matches backend |
| CORS Error | Proxy misconfigured | Restart Vite server with `npm run dev` |
| Empty list | API returned no data | Check backend has seed data for test home |
| Token not sent | Interceptor issue | Check localStorage has `authToken` key |

---

**Last Updated:** March 15, 2026  
**Status:** All endpoints documented and ready for testing
