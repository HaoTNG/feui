Hello Figma AI, I need you to fix the remaining inconsistencies in the smart home application. The app is mostly correct, but there are several components that still reference the old "Device" model or have visual issues. Please follow these precise instructions.

OVERVIEW OF REMAINING ISSUES
After reviewing the current state, these issues persist:

Room components still have "device" references and outdated views

Dark mode is inconsistent in Hub Management and Modules Management

Module list table cuts off status information (column too narrow)

Room Detail view when clicking into a room is completely outdated

TASK 1: COMPLETE ROOM ADAPTATION TO HUB-MODULE ARCHITECTURE
Step 1: Identify All Room-Related Components
Locate these files in the project:

RoomManagement.tsx (already mostly correct but may have device references)

RoomDetail.tsx (completely outdated - needs full rewrite)

Rooms.tsx (old device-based view - should be deprecated)

Any other files with "room" in the name

Step 2: Update RoomManagement.tsx to Remove All Device References

Find any remaining references to "devices" in this file and replace them with hub/module equivalents:

In the Room interface definition:
Change from:

typescript
deviceCount: number;
To:

typescript
hubCount: number;
moduleCount: number;
In the statistics display:
Change from showing "deviceCount" to showing both "hubCount" and "moduleCount" with appropriate icons.

In the room card design:
Ensure each room card clearly shows:

Number of hubs in the room (with hub icon - HardDrive)

Number of modules in the room (with module icon - Cpu)

List of hubs in the room with online/offline status dots

Environmental data pulled from modules (temperature, humidity, light)

Step 3: Deprecate the Old Rooms.tsx Component

Create a deprecation banner for Rooms.tsx similar to what was done for Device Management:

At the top of the page, add a prominent warning banner:

Background color: Yellow (#FBBF24) with 10% opacity

Border left: 4px solid yellow

Icon: AlertTriangle

Title: "⚠️ This view is deprecated"

Description: "The Rooms view has been replaced by Room Management with Hub-Module support."

Action button: "Go to Room Management" that links to /room-management

After 5 seconds, show an auto-redirect countdown and redirect to /room-management.

Step 4: Remove Rooms.tsx from Navigation
In the main sidebar navigation, remove the "Rooms" link entirely. Keep only "Room Management" as the single room-related navigation item.

TASK 2: COMPLETELY REDEVELOP ROOM DETAIL VIEW
Step 1: Understand the Current Problem
The current RoomDetail.tsx component shows a flat list of "devices" with toggle switches. This is completely wrong. The correct view should show:

Hubs located in this room

Modules belonging to those hubs

Modules that are in this room but belong to hubs in other rooms

Step 2: Design the New Room Detail Layout

Header Section:

Back button to return to Room Management

Room name as large heading (28pt font, bold)

Edit pencil icon to rename the room

Statistics row showing:

Total hubs in this room (with HardDrive icon)

Total modules in this room (with Cpu icon)

Online modules count (with green dot)

Offline modules count (with gray dot)

Main Content Area - Three Sections:

Section 1: Hubs in This Room
For each hub physically located in this room:

Hub card with:

Hub icon (HardDrive) with color based on status

Hub name

Status badge (Online/Offline) with colored dot

WiFi signal strength indicator (bars)

"View Hub" link/button

List of modules belonging to this hub (nested under hub card)

Section 2: Modules from Other Hubs
For modules that are assigned to this room but belong to hubs in other rooms:

Section title with explanation: "These modules are in this room but connected to hubs elsewhere"

For each such module:

Module card showing:

Module type icon (Thermometer, Droplets, Fan, etc.)

Module name

Parent hub name with link to that hub

Current value/status

Control toggle (if actuator)

Section 3: Quick Controls
Bottom section with:

"Add Hub to This Room" button

"Configure Modules" button (opens module configuration for hubs in this room)

Step 3: Design Individual Module Cards for Room Detail

Each module card should have:

Left side: Icon with color coding (blue for temp, light blue for humidity, yellow for light, etc.)

Middle:

Module name (bold)

Module type badge (small, rounded)

Parent hub reference (if not obvious from context)

Right side:

Current value display (temperature, humidity percentage, on/off state)

Status dot (green/yellow/red)

For actuators: simple toggle switch

Step 4: Add Empty States

When room has no hubs:

Illustration with hub icon

Title: "No hubs in this room"

Description: "Add a YoloBit hub to this room to start controlling devices"

Primary button: "Add Hub"

When hubs have no modules:

Within each hub section, show mini empty state

Message: "No modules configured for this hub"

Action link: "Configure Modules"

Step 5: Add Real-time Controls

For actuator modules (fan, LED):

Add toggle switch that updates instantly

When toggled ON:

Show additional controls (speed selector for fan, brightness slider for LED)

Save state to module

Show success toast notification

For sensor modules:

Display current reading

Add small refresh icon to manually poll latest value

Step 6: Add Quick Actions

At the bottom of each hub section:

"View Hub Details" link

"Configure Modules" link

"Move Hub to Different Room" (opens room selector)

TASK 3: FIX DARK MODE FOR HUB MANAGEMENT AND MODULES MANAGEMENT
Step 1: Identify Current Dark Mode Issues

In both HubManagement.tsx and ModulesManagement.tsx, when dark mode is enabled:

Text may still be dark on dark background

Table rows may not have proper contrast

Borders may be invisible

Status indicators may be hard to read

Step 2: Fix Hub Management Dark Mode

Background colors:

Page background: dark gray (#111827) or as defined by app theme

Card backgrounds: dark gray (#1F2937) with subtle border

Table header background: slightly lighter dark gray (#374151)

Table row background: dark gray (#1F2937) with alternating subtle variation

Hover state: slightly lighter (#4B5563) with 50% opacity

Text colors:

Primary text: white (#F9FAFB) with 90% opacity

Secondary text: white with 60% opacity

Tertiary text: white with 40% opacity

Headings: full white (#FFFFFF)

Border colors:

All borders: white with 10% opacity

Table cell dividers: white with 5% opacity

Status indicators:

Online: bright green (#10B981) with glow effect

Offline: gray (#6B7280) with 50% opacity

Warning: yellow (#FBBF24)

Action buttons:

Edit: white with 60% opacity, hover becomes full white with background change

Delete: red (#EF4444) with 80% opacity, hover becomes full red

Step 3: Fix Modules Management Dark Mode

Apply the same dark mode specifications to Modules Management:

Table styling:

Header: dark background with light text

Rows: alternating subtle contrast

Cell padding: 12px 16px

Text colors: white with appropriate opacity levels

Module type badges:

Temperature: orange with dark text in light mode, but in dark mode use orange with 20% background and bright orange text

Humidity: light blue with dark text in light mode, but in dark mode use blue with 20% background and bright blue text

Fan: cyan with dark text in light mode, but in dark mode use cyan with 20% background and bright cyan text

LED: purple with dark text in light mode, but in dark mode use purple with 20% background and bright purple text

Status indicators:

Online: green dot with pulsing animation (optional)

Offline: gray dot

Last seen: white with 40% opacity

Step 4: Add Dark Mode Toggle Preview

In the Settings page, when switching between light and dark mode:

Hub Management preview card should show both versions

Modules Management preview card should show both versions

Ensure smooth transition between modes

Step 5: Test All Interactive Elements

Test these elements in dark mode:

Dropdown menus (should have dark background, light text)

Modal dialogs (should follow dark mode colors)

Toast notifications (should be visible with proper contrast)

Tooltips (light text on dark background)

Hover states (should lighten slightly)

TASK 4: ADJUST MODULE LIST TABLE WIDTH
Step 1: Identify the Problem
In ModulesManagement.tsx, the table columns are too narrow, causing the status information to be cut off or wrapped incorrectly. The rightmost content (actions and status) gets hidden or requires horizontal scrolling.

Step 2: Redesign Table Column Widths

Overall table container:

Set minimum width to 100% of parent container

Add horizontal scroll only when necessary (screen width < 1200px)

Set table layout to "auto" to allow columns to adjust based on content

Column width specifications:

Column	Width	Justification
Module Name	20%	Needs space for names
Type	10%	Badges are compact
Parent Hub	15%	Hub names need space
Feed	15%	Technical names need space
Room	10%	Room names
Status	8%	Compact with dot and text
Current Value	10%	Numbers + units
Actions	12%	Buttons need space
Step 3: Implement Responsive Behavior

For screens 1200px and above:

Show all columns with specified widths

No horizontal scroll needed

Text truncation with ellipsis for long content

For screens 768px to 1199px:

Keep all columns but allow some to shrink

Hide less important columns (Feed, maybe Room) behind a "Details" expander

Add horizontal scroll as needed

For screens below 768px (mobile):

Stack cards instead of table

Each module becomes a card with all information

Actions become buttons at bottom of card

Step 4: Add Column Resizing (Optional Enhancement)

Add subtle drag handles between column headers:

When user drags, column width adjusts

Show width indicator during drag

Save user preference in local storage

Step 5: Ensure Status Column is Always Visible

The Status column must never be cut off:

Set minimum width of 100px for Status column

Status text "Online" or "Offline" should always be fully visible

Status dot should always be next to text, not wrapped

If screen is too narrow, hide other columns before hiding Status

Step 6: Add Tooltips for Truncated Content

When content is truncated with ellipsis:

Add tooltip on hover showing full content

Tooltip should appear after 500ms delay

Tooltip background: dark gray, text: white

Tooltip arrow pointing to element

TASK 5: FIX ANY REMAINING DEVICE REFERENCES
Step 1: Global Search for "device" References

Search throughout the entire codebase for these terms:

"device" (case insensitive)

"Device" in type names

"devices" array references

"deviceId" in any interface

"deviceName" in any interface

"deviceCount" in any interface

Step 2: Fix Each Found Reference

In AppContext.tsx:

Keep Device interface but mark as deprecated with JSDoc comment

Add computed devices from modules for backward compatibility

Add migration warning in comments

In Room interface:
Change:

typescript
deviceCount: number;
To:

typescript
hubCount: number;
moduleCount: number;
In Activity interface:
If it has deviceId and deviceName, add optional hubId/hubName and moduleId/moduleName fields.

In AutomationRule interface:
Change deviceId to moduleId (optional with fallback for backward compatibility)

Step 3: Update All Components

For each component that uses devices:

If it's a core component (Dashboard, Control, etc.), it should already use hubs/modules

If it's a deprecated component (DeviceManagement, old Rooms), add deprecation banner

If it's a utility component, update to use modules

Step 4: Add Console Warnings for Development

In development mode, add console warnings:

javascript
if (process.env.NODE_ENV === 'development') {
  console.warn('⚠️ Device API is deprecated. Use Hub and Module APIs instead.');
}