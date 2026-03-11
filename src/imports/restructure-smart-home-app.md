Hello Figma AI, I need you to completely restructure the smart home web application based on a critical clarification about the hardware architecture. Previously we treated sensors and actuators as individual devices, but now we understand that the YoloBit is the actual DEVICE (hub), and everything else (sensors, fan, LED) are MODULES connected to that hub. Each module has its own feed on Adafruit IO.

Please implement all of the following changes across the entire application.

UNDERSTANDING THE NEW ARCHITECTURE
Before making changes, understand this hierarchy:

text
YoloBit Hub (DEVICE) - Has unique ID, connects to WiFi
      ├── Module: Temperature Sensor (feed: temperature)
      ├── Module: Humidity Sensor (feed: humidity)
      ├── Module: Light Sensor (feed: light)
      ├── Module: Fan (feed: fan) 
      ├── Module: LED Light (feed: led)
      └── Module: PIR Motion Sensor (feed: pir)
Key Principles:

Users add YoloBit HUBS, not individual sensors

Each hub contains multiple MODULES

Modules inherit the room assignment from their hub OR can be assigned to different rooms

Each module has its own feed for data/control

TASK 1: RENAME AND RESTRUCTURE NAVIGATION
Step 1: Rename Menu Items

In the left sidebar, find the "Device Management" menu item. Change it to:

New name: "Hub Management"

Icon: Change to a "hub" icon (central device/controller icon, maybe a square with radiating circles)

Keep the same position in the navigation

Step 2: Update Page Titles

Throughout the application, any reference to "Devices" should be carefully evaluated:

If referring to YoloBit hubs: use "Hubs"

If referring to sensors/actuators: use "Modules"

TASK 2: COMPLETELY REDESIGN ADD HUB MODAL (FORMERLY ADD DEVICE)
Navigate to Hub Management tab and open the Add Hub modal. Replace the entire content with this new design:

Modal Specifications:

Width: 550px

Background: white in light mode, dark gray in dark mode

Border radius: 16px

Padding: 24px

Title: "Add New YoloBit Hub" with hub icon

Step 1: Three Tabs for Different Addition Methods

Create three tabs at the top of the modal:

Tab 1: "QR Code" (default active)
Tab 2: "Manual Entry"
Tab 3: "Auto Discover"

Tab 1: QR Code Design:

Large square camera viewfinder (300x300px) with rounded corners

Scanning animation: horizontal line moving up and down

Placeholder text: "Position QR code on YoloBit in frame"

Below viewfinder: "QR code contains hub ID and authentication info"

After 2 seconds simulation, show success state with green border and checkmark

Display detected info: "Found YoloBit Hub: YB-2415A7"

"Continue" button appears

Tab 2: Manual Entry Design:

Label: "Hub ID / Serial Number"

Text input with placeholder: "Enter ID printed on YoloBit (e.g., YB-2415A7, YOLO-001)"

Width: 100%, height: 44px, border radius: 8px

Add "Verify" button next to field with search icon

Below the field, add a dynamic status area:

Initial state (empty): Show nothing

Verifying state: Show loading spinner and "Checking hub..."

Verified state (green):

Green checkmark icon

"YoloBit Hub YB-2415A7 found and online"

Hub info: "Firmware v2.1.0 • WiFi connected • 6 modules available"

Last seen: "Currently online"

Not found state (red):

Red X icon

"No hub found with ID 'YB-XXXXX'"

Suggestions: "Check the ID on the device label and try again"

Offline state (yellow):

Yellow warning icon

"Hub found but offline"

Last seen: "Last seen 3 days ago"

Checkbox: "Add anyway? It will appear when online"

Tab 3: Auto Discover Design:

Show animation of scanning icon with pulsing circles

Text: "Scanning network for YoloBit hubs..."

After 3 seconds, show list of discovered hubs:

YB-2415A7 - Living Room (already configured) - grayed out

YB-3821B4 - Unknown location - NEW

YB-5560C9 - Unknown location - NEW

Checkboxes to select which ones to add

"Add Selected Hubs" button

Step 2: Hub Information Form (After Verification)

After hub is verified (regardless of method), show this form:

Hub Name field:

Label: "Give this hub a friendly name"

Input placeholder: "e.g., Living Room Hub, Kitchen Hub"

Default suggestion based on location

Room Assignment:

Label: "Assign to room"

Dropdown with all existing rooms

Option: "Create new room" at bottom

Hub Icon selector:

Label: "Choose hub icon"

Grid of preset icons: Different YoloBit variations, generic hub icons

Icons 48x48 with circular background

Step 3: Module Configuration (New Step After Adding Hub)

After clicking "Continue" from hub info, show module configuration screen:

Title: "Configure Connected Modules"

Description: "Select which modules are connected to this YoloBit hub"

Create a grid of module cards, each with:

Module Card Design:

Width: full width, height: 70px

Left side: Module icon (temperature, humidity, light, fan, led, motion)

Module name: "Temperature Sensor", "Humidity Sensor", etc.

Feed name in small gray text: "feed: temperature"

Right side: Toggle switch (ON by default for common modules)

Additional: Room override dropdown (optional - "Same as hub" or select different room)

List all possible modules:

Temperature Sensor (DHT20) - toggle ON

Humidity Sensor (DHT20) - toggle ON

Light Sensor - toggle ON

Fan - toggle ON

RGB LED - toggle ON

PIR Motion Sensor - toggle ON

LCD Display - toggle OFF (optional)

Bottom section:

"Save Configuration" button (primary blue)

"Skip - Configure Later" link

Step 4: Success State

After saving, show success toast: "Living Room Hub added successfully with 6 modules"

TASK 3: REDESIGN HUB MANAGEMENT TAB (FORMERLY DEVICE MANAGEMENT)
Rename the tab content to reflect the new architecture:

Page Header:

Title: "Hub Management" with hub icon

Subtitle: "Manage all YoloBit hubs in your home"

"Add New Hub" button (same as redesigned modal)

Hub List/Grid:

Display hubs as cards with:

Hub Card Design:

Width: 350px, height: auto, border radius: 16px

Top row: Hub icon (large), status dot (green/orange/gray), signal strength bars

Hub name: "Living Room Hub" (18pt weight 600)

Hub ID: "YB-2415A7" in small gray text

Location: "Living Room" with room icon

Stats: "6 modules • 3 online • 3 offline" with small icons

Last seen: "Online now" or "Last seen 2 hours ago"

Bottom row: Edit icon, Delete icon, View Modules icon

Clicking the hub card opens Hub Detail View (see Task 4)

Alternative Table View:

Add toggle to switch between card view and table view:

Table columns:

Hub Name & Icon

Hub ID

Room

Status (Online/Offline with dot)

Modules Count (with breakdown: 6 total, 3 online)

Last Seen

Actions (Edit, Delete, Configure Modules)

TASK 4: CREATE HUB DETAIL VIEW
When clicking on any hub card, open a dedicated Hub Detail screen:

Page Header:

Back arrow to return to Hub Management

Hub name: "Living Room Hub" in 24pt

Status badge: Online (green) or Offline (gray)

Edit button (pencil icon)

Hub Information Section (Card):

Hub ID: YB-2415A7

Firmware version: v2.1.0

IP Address: 192.168.1.100

MAC Address: 84:CC:A8:12:34:56

WiFi Signal: Strong (3 bars) with percentage

Connected since: March 10, 2026 14:32

Room assignment dropdown (can change)

Modules Section:

Title: "Connected Modules" with "Configure Modules" button

Modules grid showing all modules belonging to this hub:

Each module card shows:

Module icon (based on type)

Module name (editable via pencil icon)

Type: "Temperature Sensor" in small text

Feed: "temperature" in gray text

Current value: "24.5°C" (for sensors) or control interface (for actuators)

Status: Online/Offline dot

Room assignment: Can be different from hub? Show dropdown if yes

Three-dot menu for more options

For actuator modules (fan, LED), include mini control:

Fan: Small speed slider or toggle

LED: Color preview dot and toggle

Recent Activity Section:
Show recent events specific to this hub:

"Temperature changed: 24°C → 25°C"

"Fan turned ON by automation"

"Module offline: PIR Sensor"

"Hub connected to WiFi"

Delete Hub Section (at bottom):
Red outline button: "Delete Hub"
Click shows confirmation: "Delete Living Room Hub? All modules will also be removed. This cannot be undone."

TASK 5: REDESIGN CONTROL TAB FOR HUB + MODULES
The Control tab needs to show modules organized in a way that makes sense:

Option A: Group by Hub (Recommended for clarity)

Each room section now contains hubs, and each hub contains modules:

text
Living Room
  ┌─────────────────────────────────────┐
  │  YoloBit Living Room Hub • Online   │
  │  ID: YB-2415A7  •  6 modules        │
  ├─────────────────────────────────────┤
  │  🌡️ Temperature: 24.5°C              │
  │  💧 Humidity: 65%                    │
  │  ☀️ Light Level: 450 lux              │
  │  🔄 Ceiling Fan [Speed: 2] [ON/OFF]  │
  │  💡 RGB LED [Color Picker] [ON/OFF]  │
  │  👁️ PIR Motion: No motion            │
  └─────────────────────────────────────┘
Option B: Flat with Hub Attribution

Each module card shows which hub it belongs to:

text
Living Room
  ├── 🌡️ Temperature: 24.5°C (via Living Room Hub)
  ├── 💧 Humidity: 65% (via Living Room Hub)
  ├── 🔄 Ceiling Fan [Speed: 2] (via Living Room Hub)
  └── 💡 RGB LED [Color Picker] (via Living Room Hub)
Option C: Toggle Between Views

Add a view toggle: "Group by Hub" / "Flat View"

Design the Module Cards:

For sensor modules (display only):

Icon + name

Current value in large font

Status dot

Trend indicator (stable/rising/falling)

For actuator modules (controllable):

Icon + name

Appropriate control:

Fan: Toggle + speed slider (1-3)

LED: Toggle + color picker

Switch: Simple toggle

Status dot showing online/offline

TASK 6: CREATE NEW MODULES MANAGEMENT TAB
Add a new tab next to Hub Management called "Modules" (or add as subtab within Hub Management)

Modules Tab Design:

Page Header:

Title: "All Modules" with modules icon

Subtitle: "Manage all sensors and actuators across all hubs"

Filter button and Search bar

Modules Table:

Table columns:

Module Name

Icon + name (editable via inline click)

Example: 🌡️ Living Room Temperature

Type

Badge with icon: Temperature, Humidity, Light, Fan, LED, Motion

Color coded by type

Parent Hub

Hub name with link to hub detail

Example: "Living Room Hub"

Feed

Feed name: "temperature", "fan", etc.

Copy icon to copy feed name

Room

Room name with dropdown to change

Can be different from hub's room?

Status

Online/Offline with dot

Last seen on hover

Current Value

For sensors: "24.5°C", "65%", "450 lux"

For actuators: State (ON/OFF, speed)

Actions

Edit icon (opens Module Detail)

Calibrate icon (for sensors)

Delete icon (remove module)

Module Detail Modal (when clicking Edit):

Title: "Edit Module"

Form fields:

Module Name: Editable text

Type: Display-only (cannot change)

Parent Hub: Display-only with link

Feed: Display-only

Room: Dropdown to change assignment

Calibration Offset: ± adjustment for sensors

Status: Online/Offline with "Test Connection" button

Delete button at bottom in red

TASK 7: UPDATE ROOM MANAGEMENT TO SHOW HUBS AND MODULES
In Room Management, when clicking into a room detail view, redesign to show:

Room Header:

Room name and icon

Edit room button

Hubs in this Room section:
List all hubs assigned to this room as cards (simplified version of hub cards)

Modules in this Room section:
If showing modules directly in room (not grouped by hub), display all modules from all hubs in this room

Environment section (keep as previously designed):
Show temperature, humidity, light level for this room (pulled from the appropriate modules)

TASK 8: UPDATE DASHBOARD ACTIVE ROOMS
Each room card should now show:

Room name and icon

Number of hubs in room

Number of modules total

Environmental stats strip (temp/humidity/light) pulled from sensors in that room

Warning indicator if any hub/module is offline

TASK 9: UPDATE ACTIVITY LOG
Activity log needs to distinguish between hub events and module events:

Hub events:

"Living Room Hub came online"

"Living Room Hub went offline"

"New hub YB-3821B4 added to Kitchen"

Module events:

"Temperature in Living Room changed: 24°C → 25°C"

"Ceiling Fan turned ON by automation"

"PIR Motion detected movement in Kitchen"

Use different icons:

Hub events: Hub icon

Module events: Respective module icons

TASK 10: ADDRESS THE ID QUESTION IN UI
Since your team is unsure whether YoloBit has hardware IDs or needs manual IDs, design the UI to handle both scenarios gracefully:

In Add Hub modal (Manual Entry tab):

Add helper text that explains:
"Hub ID is printed on the YoloBit device label (format: YB-XXXXX) or use any name you prefer to identify this hub."

In Hub Detail view:

Show both:

"Hub ID: YB-2415A7" (if hardware ID exists)

"Display Name: Living Room Hub" (user-editable)

For demo purposes:

Create sample hub IDs:

YB-2415A7 (online)

YB-3821B4 (offline)

YB-5560C9 (online)

This shows the UI can handle either approach.

TASK 11: ADD VISUAL INDICATORS FOR HUB VS MODULE
Throughout the app, make it visually clear what is a hub and what is a module:

Hubs: Use hub icon, slightly larger cards, show signal strength

Modules: Use specific sensor/actuator icons, smaller cards, show feed name

In lists, add a small "parent" indicator showing which hub a module belongs to.