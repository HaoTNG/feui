Hello Figma AI, now that we have established the new Hub-Module architecture, I need you to go through EVERY tab and screen in the entire application and update them to work with this new data structure. This is a comprehensive update that affects how data is displayed, how users interact with devices, and how information flows throughout the app.

UNDERSTANDING THE NEW DATA STRUCTURE
Before making changes, understand that our data model has fundamentally changed:

OLD STRUCTURE (Deprecated):

text
Home → Room → Device (individual sensors/actuators)
NEW STRUCTURE (Live):

text
Home → Room → Hub (YoloBit) → Module (sensors/actuators)
Key Relationships:

A Home contains multiple Rooms

A Room contains multiple Hubs (YoloBit devices)

A Hub contains multiple Modules (temperature sensor, fan, LED, etc.)

Modules can be assigned to a different room than their parent Hub (optional)

Data Flow:

Hubs have status (online/offline, WiFi signal, firmware, IP)

Modules have their own status, current values, and feeds

All user interactions (turning on fan, reading temperature) happen at the module level

TASK 1: UPDATE THE GLOBAL APP CONTEXT (MENTAL MODEL FOR DESIGN)
Even though Figma doesn't have code, you need to design with this mental model. Every screen should reflect that:

Hubs are the physical devices - Show hub information prominently

Modules are what users actually interact with - Show module cards with controls

Hierarchy is clear - Users should always know which hub a module belongs to

TASK 2: REDESIGN THE DASHBOARD TAB
Current Dashboard: Shows rooms with device summaries and recent activity.

New Dashboard Design:

Page Header:

Welcome message with user name

Quick stats row showing:

Total Hubs: "3 Hubs" with hub icon

Total Modules: "15 Modules" with module icon

Online Status: "12 Online • 3 Offline" with colored dots

Main Content - Two Column Layout:

Left Column (60%): Active Rooms with Hub Integration

For each room card, redesign to show:

text
┌─────────────────────────────────────┐
│ 🛋️ Living Room                      │
│ 2 hubs • 8 modules                  │
├─────────────────────────────────────┤
│ ┌─ YoloBit Living Room ───────────┐ │
│ │ 🌡️ 24.5°C  💧 65%  ☀️ 450 lux   │ │
│ │ 🔄 Fan: ON • 💡 LED: OFF         │ │
│ │ 📶 Strong • Online               │ │
│ └───────────────────────────────────┘ │
│ ┌─ YoloBit Entertainment ──────────┐ │
│ │ 🌡️ 23.5°C  💧 60%                │ │
│ │ 📶 Medium • Online                │ │
│ └───────────────────────────────────┘ │
│ 👁️ 2 modules offline                 │
└─────────────────────────────────────┘
Each room card should:

Show total hubs and modules count

List each hub in the room with key modules summary

Show environmental stats pulled from temperature/humidity modules

Indicate online/offline status for hubs

Show warning if any modules are offline

Right Column (40%): Recent Activity with Hub/Module Distinction

Redesign activity feed to clearly distinguish:

text
Today
├── 🏠 Hub: Living Room Hub came online • 10:32 AM
├── 🌡️ Module: Temperature changed 24°C → 25°C • 10:28 AM
├── 🔄 Module: Fan turned ON by automation • 10:25 AM
├── 🏠 Hub: Kitchen Hub went offline • 09:15 AM
└── ➕ New: YB-3821B4 added to Kitchen • 08:30 AM
Use different icons and colors:

Hub events: 🏠 Hub icon with blue background

Module events: Respective module icons (🌡️💧☀️🔄💡👁️)

System events: ⚙️ Gear icon

Add filter chips: "All Events", "Hub Events", "Module Events", "Automation"

TASK 3: REDESIGN THE CONTROL TAB
Current Control Tab: Shows devices grouped by room.

New Control Tab Design:

Page Header:

Title: "Control" with icon

View toggle: "Group by Hub" (default) / "Group by Room" / "All Modules"

Default View: Group by Hub

Each room section now contains hubs, and each hub shows its modules:

text
Living Room
  ┌─────────────────────────────────────────────────┐
  │  🏠 YoloBit Living Room Hub                      │
  │  ID: YB-2415A7 • Online • 📶 Strong              │
  │  Firmware: v2.1.0 • IP: 192.168.1.100            │
  ├─────────────────────────────────────────────────┤
  │  ┌─────────────────────────────────────────┐    │
  │  │ 🌡️ Temperature Sensor                    │    │
  │  │ Feed: temperature • Room: Living Room    │    │
  │  │             24.5°C                       │    │
  │  │              [History]                    │    │
  │  └─────────────────────────────────────────┘    │
  │  ┌─────────────────────────────────────────┐    │
  │  │ 💧 Humidity Sensor                        │    │
  │  │ Feed: humidity • Room: Living Room        │    │
  │  │             65%                           │    │
  │  └─────────────────────────────────────────┘    │
  │  ┌─────────────────────────────────────────┐    │
  │  │ 🔄 Ceiling Fan                            │    │
  │  │ Feed: fan • Room: Living Room             │    │
  │  │     [⏻ OFF]  Speed: [───⊙───] 2           │    │
  │  └─────────────────────────────────────────┘    │
  │  ┌─────────────────────────────────────────┐    │
  │  │ 💡 RGB LED Strip                          │    │
  │  │ Feed: led • Room: Living Room             │    │
  │  │     [⏻ ON]  Color: [●] [Color Picker]     │    │
  │  └─────────────────────────────────────────┘    │
  └─────────────────────────────────────────────────┘

Kitchen
  ┌─────────────────────────────────────────────────┐
  │  🏠 YoloBit Kitchen Hub                          │
  │  ID: YB-3821B4 • Online • 📶 Medium              │
  ├─────────────────────────────────────────────────┤
  │  ... modules ...
  └─────────────────────────────────────────────────┘
Alternative View: Group by Room (Flat)

If user switches to "Group by Room", show modules directly under room, but still indicate parent hub:

text
Living Room
  ├── 🌡️ Temperature (via Living Room Hub): 24.5°C
  ├── 💧 Humidity (via Living Room Hub): 65%
  ├── 🔄 Fan (via Living Room Hub): [⏻ OFF] Speed 2
  ├── 💡 LED (via Living Room Hub): [⏻ ON] ● Purple
  └── 🏠 Living Room Hub: Online • 4 modules
Alternative View: All Modules

Show all modules from all hubs in one scrollable list, sortable by room, type, or status.

Module Card Design (Standardized):

For sensor modules:

Icon + name

Current value in large font

Feed name in small text

Status dot + last updated

Mini graph sparkline (optional)

Room and hub indicators

For actuator modules:

Icon + name

Appropriate controls (toggle, slider, color picker)

Current state displayed

Feed name

Status dot

Room and hub indicators

TASK 4: REDESIGN THE AUTOMATION TAB
Current Automation Tab: Rules reference individual devices.

New Automation Tab Design:

Page Header:

Title: "Automation Rules"

"Create Rule" button

Filter: "All Rules", "Active", "Inactive"

Rule Cards Redesign:

Each rule card should now show:

text
┌─────────────────────────────────────────────────┐
│ 🌙 Good Night Mode                          ● ON│
├─────────────────────────────────────────────────┤
│ IF: Time is 11:00 PM                             │
│ AND: Living Room Hub is Online                    │
│ THEN:                                             │
│   • Turn OFF Living Room LED (module)             │
│   • Set Bedroom Fan to OFF (module)               │
│   • Set All Hubs to Night Mode (hub command)      │
├─────────────────────────────────────────────────┤
│ Affects: 2 hubs • 3 modules • Last run: Yesterday│
│ [Edit] [Disable] [Run Now]                        │
└─────────────────────────────────────────────────┘
Condition Builder Redesign:

When creating/editing a rule, the condition builder should allow:

Conditions at hub level:

"Hub [name] goes online/offline"

"Hub WiFi signal drops below [level]"

"Hub firmware updates available"

Conditions at module level:

"Temperature in [room] exceeds [value]"

"Humidity drops below [value]"

"Motion detected in [room]"

"Light level changes to [value]"

"Fan state changes to [ON/OFF]"

Actions at hub level:

"Restart hub"

"Update hub firmware"

"Enable/disable hub"

Actions at module level:

"Turn [module] ON/OFF"

"Set fan speed to [level]"

"Set LED color to [color]"

"Send notification"

Module Selector in Rule Builder:

When selecting devices for rules, show hierarchical picker:

text
Select modules to control:
┌─────────────────────────────────┐
│ 🏠 Living Room Hub              │
│   ├── 🌡️ Temperature (sensor)   │
│   ├── 💧 Humidity (sensor)      │
│   ├── 🔄 Fan (actuator)         │
│   └── 💡 LED (actuator)         │
├─────────────────────────────────┤
│ 🏠 Kitchen Hub                   │
│   ├── 🌡️ Temperature (sensor)   │
│   ├── 🔄 Fan (actuator)         │
│   └── 💡 LED (actuator)         │
└─────────────────────────────────┘
TASK 5: REDESIGN THE HISTORY TAB
Current History Tab: Linear list of device events.

New History Tab Design:

Page Header:

Title: "Activity History"

Date range selector

Filter chips: "All", "Hub Events", "Module Events", "Automation", "Alerts"

Enhanced Timeline:

Group events by type with visual distinction:

text
Today, March 10, 2026

🔵 HUB EVENTS
├── 10:32 AM - Living Room Hub came online
├── 09:15 AM - Kitchen Hub went offline (no response)
└── 08:00 AM - Bedroom Hub firmware updated to v2.1.0

🟢 MODULE EVENTS
├── 10:28 AM - Living Room Temperature: 24°C → 25°C
├── 10:25 AM - Kitchen Fan turned ON (by automation)
├── 09:30 AM - Bedroom LED color changed to Purple
└── 08:15 AM - Motion detected in Living Room

🟠 AUTOMATION EVENTS
├── 11:00 PM - Good Night rule executed (3 actions)
├── 07:00 AM - Good Morning rule enabled
└── Yesterday - Away Mode rule created

🔴 ALERTS
├── 09:15 AM - Kitchen Hub offline for 2+ hours
└── 08:00 AM - Low battery: Living Room Motion Sensor
Detail View:

Clicking any event opens detail panel showing:

Exact timestamp

Hub/module information with links

Related events

Option to acknowledge (for alerts)

TASK 6: REDESIGN THE HOMES TAB
Current Homes Tab: Simple home cards with room/device counts.

New Homes Tab Design:

Home Cards Redesign:

Each home card should show:

text
┌─────────────────────────────────────┐
│ 🏠 My Apartment                      │
│ Address: 123 Main St, Apt 4B         │
├─────────────────────────────────────┤
│ 📊 STATS                              │
│ • 3 Hubs (2 online, 1 offline)       │
│ • 15 Modules (12 online, 3 offline)  │
│ • 4 Rooms                             │
├─────────────────────────────────────┤
│ 🔔 ACTIVE ALERTS                      │
│ • Kitchen Hub offline (2h)            │
│ • Low battery: Motion Sensor          │
├─────────────────────────────────────┤
│ [View Details] [Edit] [Delete]        │
└─────────────────────────────────────┘
Home Detail View:

When clicking into a home, show:

Page Header:

Home name and address

Edit button

Overall status: "3 hubs, 15 modules - 12 online"

Tab Navigation within Home:

Dashboard (home-specific dashboard)

Hubs (list of hubs in this home)

Rooms (rooms with their hubs/modules)

Settings (home settings)

Hubs Tab within Home:
List all hubs in this home with detailed status:

Hub name, ID, room

Online/offline with last seen

Module count (online/total)

WiFi signal strength

Firmware version

Quick actions: View, Edit, Restart, Update

Rooms Tab within Home:
Show rooms with their hubs and modules in a hierarchical view:

text
Living Room
  ├── 🏠 Living Room Hub (online)
  │    ├── 🌡️ Temperature: 24.5°C
  │    ├── 💧 Humidity: 65%
  │    ├── 🔄 Fan: ON (speed 2)
  │    └── 💡 LED: OFF
  └── 🏠 Entertainment Hub (online)
       ├── 🌡️ Temperature: 23.5°C
       └── 💡 LED Strip: ON (purple)

Kitchen
  └── 🏠 Kitchen Hub (offline - 2h)
       └── (no data available)
TASK 7: REDESIGN THE ROOM MANAGEMENT TAB
Current Room Management: Simple room list with device counts.

New Room Management Design:

Rooms Grid:

Each room card shows:

text
┌─────────────────────────────────────┐
│ 🛋️ Living Room                       │
│ 2 hubs • 8 modules                   │
├─────────────────────────────────────┤
│ HUBS:                                 │
│ • Living Room Hub (online)           │
│ • Entertainment Hub (online)          │
├─────────────────────────────────────┤
│ ENVIRONMENT:                          │
│ 🌡️ 24.5°C  💧 65%  ☀️ 450 lux        │
├─────────────────────────────────────┤
│ ALERTS: 1 module offline              │
│ [Manage Room] [Edit] [Delete]         │
└─────────────────────────────────────┘
Room Detail View (when clicking Manage Room):

Page Header:

Room name with icon

Edit room button

"Add Hub to Room" button

Tab Navigation within Room:

Overview (dashboard for this room)

Hubs (list of hubs in this room)

Modules (all modules from all hubs in this room)

Environment (charts and history)

Overview Tab:

Environmental stats cards (temp/humidity/light)

List of hubs with module summaries

Recent activity in this room

Quick controls for common modules

Hubs Tab:
List all hubs in this room with:

Hub card with status

Module count

Quick actions: View Hub, Edit, Remove from Room

Modules Tab:
List all modules from all hubs in this room with:

Module name, type, parent hub

Current value/state

Status

Quick controls

Actions: Edit, Calibrate, Delete

TASK 8: UPDATE ALL MODALS AND DIALOGS
Edit Hub Modal:

Allow changing hub name, room, icon

Show firmware version (read-only)

Show IP/MAC addresses (read-only)

"Restart Hub" button

"Update Firmware" button

Edit Module Modal:

Module name (editable)

Type (read-only)

Parent Hub (read-only with link)

Feed name (read-only with copy)

Room assignment (dropdown - can differ from hub)

Calibration offset (for sensors)

Status with "Test Connection" button

Delete button

Move Module Modal:

Select new room

Option to move parent hub as well? (checkbox)

Add Module to Hub Modal:

Select module type from list

Auto-generate name based on type + room

Assign room (default = hub's room)

Configure feed name (auto-generated)

TASK 9: UPDATE SETTINGS TAB
Hub Settings Section (new):

Default firmware update behavior

WiFi network preferences for hubs

Hub discovery settings

Module auto-detection settings

Notification Settings:

Separate toggles for hub events vs module events

Thresholds for sensor alerts

Offline notification delays

TASK 10: CONSISTENCY CHECKLIST
Go through EVERY screen and ensure:

✅ Hub information is displayed where relevant

Hub name, status, signal strength

Link to hub detail view

✅ Module information is clear

Module type with appropriate icon

Current value/state

Parent hub indicator

Feed name (for technical users)

✅ Hierarchy is visually communicated

Visual nesting of modules under hubs

Consistent color coding by module type

Room assignment visible

✅ Actions are context-appropriate

Hub actions: Restart, Update, Configure

Module actions: Control, Calibrate, Edit

✅ Status indicators are consistent

Online: Green dot/pulse

Offline: Gray dot

Warning: Yellow dot (low battery, signal weak)

Error: Red dot (hardware issue)

✅ Empty states handled

Room with no hubs: Show "Add Hub" button

Hub with no modules: Show "Configure Modules" button

No data: Show graceful fallback