Hello Figma AI, I need you to fix the critical inconsistencies in my smart home web application. Please follow these precise instructions to resolve the conflicts between the old Device model and the new Hub-Module architecture.

OVERVIEW OF REQUIRED CHANGES
The app currently has two parallel systems running simultaneously:

OLD System: Uses "Devices" (lights, fans, sensors as standalone items)

NEW System: Uses "Hubs" (YoloBit hardware) with "Modules" (sensors/actuators connected to hubs)

This causes inconsistent data display across different screens. The new Hub-Module architecture is correct and matches the actual hardware. All old Device-based components must be updated or deprecated.

TASK 1: FIX ROOM MANAGEMENT TO SHOW HUBS AND MODULES CONSISTENTLY
Step 1: Understand the Current Problem
Currently, two different pages show room information completely differently:

/rooms (old page) shows "devices" grouped by room

/room-management (new page) correctly shows hubs and their modules

This confuses users and makes the app feel broken. We need to redirect all room views to the new Hub-Module version.

Step 2: Deprecate the Old Rooms Page
Locate the navigation menu in the sidebar. Find the link labeled "Rooms" that points to /rooms. Replace it with a link to /room-management instead. The label should change to "Room Management" to be clearer.

In the navigation structure, ensure there is only ONE room-related entry. Remove any duplicate "Rooms" links from both main navigation and admin navigation sections.

Step 3: Add Redirect from Old Route
Create a redirect rule so that if anyone types /rooms directly into the browser, they are automatically sent to /room-management. This ensures no one can access the outdated view.

Step 4: Update Room Detail View
Locate the file RoomDetail.tsx. This component currently shows a list of "devices" in the room. Completely redesign it to show hubs first, then their modules.

The new layout should have:

At the top of the page, show:

Room name as a large heading

Back button to return to Room Management

Edit button to rename the room

Below the header, create a statistics row showing:

Total hubs in this room (with hub icon)

Total modules in this room (with module icon)

Online modules count (with green dot)

Step 5: Redesign the Main Content Area
Create a two-level hierarchy in the main content:

For each hub in this room:

Show a hub header with hub name, status (online/offline with colored dot), and a small "View Hub" link that goes to Hub Detail page

Below the hub header, show all modules belonging to this hub in a grid layout

For modules that are in this room but belong to hubs in other rooms:

Create a separate section called "Modules from Other Hubs"

Show each module with its parent hub name for context

Step 6: Redesign Module Cards for Room Detail
Each module card in this view should show:

Module icon (temperature: thermometer, humidity: droplet, fan: fan, LED: lightbulb)

Module name

Module type badge

Current value (temperature: 24°C, humidity: 65%, fan: Speed 2, LED: On/Off)

Status indicator (green dot for online, gray for offline)

For actuators (fan, LED), add simple toggle switch to turn on/off directly from this view

Step 7: Add Empty States
When a room has no hubs:

Show an empty state illustration with a hub icon

Title: "No hubs in this room"

Description: "Add a YoloBit hub to this room to start controlling devices"

Action button: "Add Hub" that opens the Add Hub modal

When a hub has no modules:

Within that hub's section, show a small empty state

Message: "No modules configured for this hub"

Action link: "Configure Modules"

TASK 2: FIX GUEST DASHBOARD TO USE MODULES INSTEAD OF DEVICES
Step 1: Understand the Current Problem
The Guest Dashboard currently filters and displays "devices" based on allowed rooms. Since devices are being phased out, guest users won't be able to control anything once devices are removed. The Guest Dashboard must be rebuilt to use modules.

Step 2: Redesign Guest Access Data Structure
First, update how guest permissions work. Guest access should be based on:

Which rooms the guest can access (by room ID, not room name)

Which specific modules in those rooms are allowed (optional, defaults to all)

Create a visual representation of guest permissions showing:

List of homes the guest has access to

For each home, list of allowed rooms with checkboxes

Within each room, option to allow all modules or select specific ones

Step 3: Redesign the Guest Dashboard Layout
The guest dashboard should have these sections:

Header section:

Welcome message: "Guest Access"

Expiration notice showing when access expires (if applicable)

List of allowed rooms as badges

Main content area:

Group modules by room (only showing allowed rooms)

Within each room, show hubs for context (read-only) and modules (controllable)

Step 4: Design Module Cards for Guest View
For each module, determine if the guest can control it:

Sensors (temperature, humidity, light, motion): Display-only, show current value

Actuators (fan, LED): Show toggle switch, brightness slider, color picker as applicable

Each module card should show:

Module name

Module type icon

Parent hub name (small text)

Current status/value

Controls (if actuator and allowed)

Step 5: Add Permission Indicators
When a guest cannot control a module:

Gray out the control elements

Add a small lock icon with tooltip "Not permitted by owner"

Still show the current value/status (read-only)

Step 6: Add Session Expiry Warning
When guest access is within 24 hours of expiring:

Show a yellow warning banner at the top

Message: "Your guest access expires in [X] hours"

Contact owner button (placeholder)

When guest access has expired:

Show a red banner: "Access expired"

Disable all controls

Show "Renew Access" button (placeholder)

TASK 3: FIX AUTOMATION RULES TO USE MODULES INSTEAD OF DEVICES
Step 1: Understand the Current Problem
Automation rules currently reference deviceId in their data structure. This means rules will break when devices are removed. All automation rules must be updated to reference modules.

Step 2: Redesign the Automation Rule Data Structure
Create a new representation for automation rules that shows:

Rule metadata:

Rule name (editable text field)

Enabled/disabled toggle switch

Rule type badge (Temperature, Motion, Time, etc.)

Condition section with label "IF":

Condition type selector: Temperature, Humidity, Light Level, Motion, Time, Module Status

For numeric conditions: operator dropdown (>, <, =, ≥, ≤) and value input

For module-based conditions: module selector showing only relevant modules

For time conditions: time picker

Action section with label "THEN":

Action type selector: Turn On, Turn Off, Set Brightness, Set Speed, Send Notification

Module selector showing only actuators (fan, LED)

For brightness: slider from 0-100%

For fan speed: 1-3 selector

For notification: text input for message

Schedule section (optional, collapsible):

Enable schedule toggle

Days of week selector (buttons for Mon-Sun)

Start time and end time pickers

Step 3: Redesign the Rule List View
Each rule card should show:

Rule name with enabled/disabled toggle

IF condition in readable format (e.g., "IF Living Room Temperature > 28°C")

THEN action in readable format (e.g., "THEN turn on Living Room Fan")

Schedule info if applicable (e.g., "Mon-Fri, 8:00-22:00")

Stats: Affected modules count, last run time

Action buttons: Edit, Delete, Run Now

Step 4: Add Module Selector to Rule Creation
When creating a new rule, the module selector should:

Group modules by hub

Show module type icon and name

Filter to show only relevant modules based on action type

Show parent hub name for context

Indicate module status (online/offline) with colored dot

Step 5: Visualize Rule Impact
When a rule is active and conditions are met:

Highlight the rule card with a green border

Show "Currently Active" badge

Visually indicate affected modules turning on/off in the Control tab

Show animation on module cards when triggered by automation

Step 6: Add Rule Testing Mode
Create a "Test Rule" button that:

Temporarily overrides normal conditions

Executes the action immediately

Shows success/failure toast

Does not save the test to activity log (optional setting)

TASK 4: DEPRECATE DEVICE MANAGEMENT PAGE
Step 1: Understand the Current Problem
The Device Management page at /device-management allows full CRUD operations on the old Device model. This page should not exist in the final app and must be clearly marked as deprecated, with a path to migrate to the new system.

Step 2: Add Deprecation Banner
At the very top of the Device Management page, add a prominent warning banner:

Background color: Yellow (#FBBF24) with 10% opacity
Border left: 4px solid yellow (#FBBF24)
Padding: 16px all sides
Icon: AlertTriangle on the left

Content:

Title: "⚠️ This page is deprecated" in bold 16pt font

Description: "Device Management has been replaced by Hub Management and Modules Management." in 14pt

Action links: "Go to Hub Management" and "Go to Modules Management" as blue links

Step 3: Add Auto-Redirect
After 5 seconds, show a countdown: "Redirecting to Modules Management in 5... 4... 3..."
Add a "Cancel" button to stop the redirect if the user wants to stay.

When redirect happens, send the user to /modules (Modules Management).

Step 4: Convert Device Data to Module Data (Optional)
If the user has existing devices in the system, show a migration option:

"Migrate your devices to the new system:" with two options:

"Convert all lights/fans to modules" - creates modules with default settings

"Keep devices for now" - dismisses and won't show again

Show a preview of what will be converted:

List of lights that will become LED modules

List of fans that will become fan modules

Note that sensors will need to be reconfigured

Step 5: Hide from Navigation
Remove the "Device Management" link from all navigation menus:

Main navigation sidebar

Admin navigation section

Any quick-access links or dropdowns

Add a comment in the design system: "DEVICE MANAGEMENT: Do not link to this page in final version"

TASK 5: FIX ACTIVITY LOG CATEGORIZATION
Step 1: Understand the Current Problem
The Activity Log currently guesses the event type by searching for keywords in the action text (looking for "hub", "temperature", etc.). This is fragile and will miss events or miscategorize them. The activity type should be explicitly set when the activity is created.

Step 2: Redesign Activity Data Structure
Each activity should have these explicit fields:

id: unique identifier

timestamp: full date/time

type: one of ["hub_event", "module_event", "automation", "alert", "system", "user"]

hubId: ID of related hub (if applicable)

hubName: name of related hub (if applicable)

moduleId: ID of related module (if applicable)

moduleName: name of related module (if applicable)

moduleType: type of module (if applicable)

action: human-readable action description

details: additional context

status: "success" or "error"

homeId: home this belongs to

Step 3: Redesign Activity Log Filters
Replace the keyword-based filters with proper category filters:

Filter chips should show:

"All Events" (default)

"Hub Events" (type = hub_event)

"Module Events" (type = module_event)

"Automation" (type = automation)

"Alerts" (type = alert)

"System" (type = system)

Each filter chip should have:

Icon representing the category

Label text

Active state: blue background, white text

Inactive state: gray background, dark text (light mode) or dark background, light text (dark mode)

Step 4: Redesign Activity Items
Each activity item should show:

Left side:

Category icon with color coding:

Hub events: blue (HardDrive icon)

Module events: purple (Cpu icon)

Automation: green (Bot icon)

Alerts: red (AlertTriangle icon)

System: gray (Settings icon)

User: gray (User icon)

Middle section:

Action description (bold)

Details (smaller, gray text)

For module events: show module type badge

For hub events: show hub name

Right side:

Time ago (e.g., "5 min ago")

Status icon: CheckCircle for success, XCircle for error

Step 5: Group Activities by Date and Category
Activities should be grouped first by date, then by category within each date:

For each date heading (Today, Yesterday, March 10, etc.):

Show "Hub Events" section with hub-related activities

Show "Module Events" section with module-related activities

Show "Automation Events" section with automation-triggered activities

Show "Alerts" section with alert activities

Each section should have:

Category header with icon and title

Collapse/expand functionality (default expanded)

List of activities in that category

Step 6: Add Search Functionality
Add a search bar that searches across:

Action description

Details

Hub names

Module names

Search should highlight matching text in results.

TASK 6: CREATE UNIVERSAL DELETE CONFIRMATION MODAL
Step 1: Understand the Current Problem
Currently, different components use different deletion patterns:

Some use browser's confirm() dialog (inconsistent with app design)

Some have custom modals with different designs

This creates a fragmented user experience

Step 2: Design Universal Delete Modal
Create a single, reusable delete confirmation modal that works for all item types: hubs, modules, rooms, homes, automation rules.

Modal specifications:

Width: 400px

Background: white (light mode) or dark gray #1F2937 (dark mode)

Border radius: 12px

Shadow: large, with Y offset 8px, blur 24px, black at 25% opacity

Step 3: Modal Header Design
Header should contain:

Left side: icon representing what's being deleted (HardDrive for hubs, Cpu for modules, Home for rooms, Building2 for homes, Bot for rules)

Icon background: light version of item color (blue-50 for hubs, purple-50 for modules, etc.) in light mode, dark version with 30% opacity in dark mode

Title: "Delete [Item Type]" (e.g., "Delete Hub", "Delete Room")

Close button (X icon) in top right

Step 4: Modal Content Design
Content area should show:

Main message:

"Are you sure you want to delete [item name]?" with the item name in bold

If deletion will cascade to other items (e.g., deleting a hub deletes its modules):

Show a warning box with yellow background

Icon: AlertTriangle

Text: "This will also delete:"

Bullet list of affected items (e.g., "• 4 modules", "• 2 automation rules")

If there are special warnings:

Red text with warning icon for irreversible actions

Step 5: Modal Footer Design
Footer should contain two buttons side by side:

Cancel button:

Background: transparent

Border: 1px solid gray (light mode) or white with 20% opacity (dark mode)

Text: "Cancel"

Hover: light gray background (light mode) or white with 10% opacity (dark mode)

Delete button:

Background: red (#EF4444)

Text: white, "Delete [Item Type]"

Hover: darker red (#DC2626)

No border

Step 6: Add Type-Specific Details
For each item type, show relevant details:

Hub deletion:

Show module count that will be deleted

Show rooms affected

Show automation rules that reference this hub's modules

Module deletion:

Show parent hub name

Show automation rules that reference this module

Show if module is currently online

Room deletion:

Show option to move modules to another room or mark as unassigned

Radio buttons: "Move to another room" with dropdown, "Move to unassigned", "Delete modules"

Home deletion:

Show all rooms, hubs, modules that will be deleted

Warning about permanent data loss

Require typing home name to confirm

Rule deletion:

Simple confirmation (no cascade)

Step 7: Add Success Feedback
After deletion:

Close modal automatically

Show success toast: "[Item Type] deleted successfully"

Update the list view to remove the item

If on a detail page of deleted item, redirect to parent list

TASK 7: FIX TOAST NOTIFICATION SYSTEM
Step 1: Understand the Current Problem
Two different toast systems are used:

Custom ToastContext with ToastContainer

Sonner Toaster from RootLayout

This creates inconsistent notifications and duplicate code.

Step 2: Choose One System (Keep Custom ToastContext)
Standardize on the custom ToastContext because:

It's already integrated with the app's theme system

It has dark mode support built-in

It's more customizable for our needs

Remove the Sonner Toaster from RootLayout.tsx. Delete the line:

jsx
<Toaster />
Step 3: Redesign Toast Component
Create a unified toast design that works for all notification types:

Toast container position: top right, 24px from top and right

Toast specifications:

Width: 320px

Padding: 16px

Border radius: 8px

Shadow: Y offset 4px, blur 12px, black at 15% opacity

Animation: slide in from right, fade out

Step 4: Design Toast Types

Success toast:

Background: green (#10B981) with 10% opacity in light mode, green with 20% opacity in dark mode

Border left: 4px solid green (#10B981)

Icon: CheckCircle, green

Title: "Success" (bold)

Message: user-friendly success message

Auto-dismiss after 3 seconds

Error toast:

Background: red (#EF4444) with 10% opacity in light mode, red with 20% opacity in dark mode

Border left: 4px solid red (#EF4444)

Icon: XCircle, red

Title: "Error" (bold)

Message: user-friendly error message

Manual dismiss required (X button)

Info toast:

Background: blue (#3B82F6) with 10% opacity in light mode, blue with 20% opacity in dark mode

Border left: 4px solid blue (#3B82F6)

Icon: Info, blue

Title: "Info" (bold)

Message: informational message

Auto-dismiss after 2 seconds

Step 5: Add Toast Stacking
When multiple toasts appear:

Stack them vertically with 8px gap

Newest appears at the top

Maximum 3 toasts visible at once

Older toasts automatically dismiss as new ones arrive

Step 6: Replace All Toast Calls
Find all instances where toast.success() or toast.error() from sonner is used and replace with the custom showToast() function:

Profile.tsx: change toast.success("Profile updated successfully") to showToast("Profile updated successfully", "success")

DeviceManagement.tsx: change all sonner calls

RoomManagement.tsx: change all sonner calls

UserManagement.tsx: change all sonner calls

Settings.tsx: change all sonner calls

Step 7: Add Toast for All User Actions
Ensure these actions trigger appropriate toasts:

Adding hub: "Hub added successfully"

Deleting hub: "Hub deleted"

Adding module: "Module configured"

Toggling device: "Living Room Light turned on"

Saving automation: "Rule saved"

Enabling/disabling rule: "Rule status updated"

Inviting user: "Invitation sent to email@example.com"

Removing user: "Member removed"