Hello Figma AI, I need you to implement several major features and updates to my smart home web application. Please follow these precise instructions to build the CRUD Home functionality and make the necessary changes to existing screens.

TASK 1: BUILD COMPLETE CRUD HOME FEATURE
Step 1: Understand the Requirement
Users need to manage multiple homes within the same account. A user might have "My Apartment", "Vacation Home", and "Parents' House". Each home has its own rooms, devices, and settings. Create a complete interface for managing these homes.

Step 2: Add Home Selection to Sidebar

In the left sidebar, below the logo and above the main menu items, add a new home selector component:

Create a dropdown selector with these specifications:

Width: 100% of sidebar width minus 20px padding on each side

Height: 48 pixels

Background: Light gray with 10% opacity in light mode, white with 10% opacity in dark mode

Border radius: 8 pixels

Padding: 0 12px

The dropdown should display:

Left side: Home icon (small house)

Center: Currently selected home name (default: "My Apartment")

Right side: Chevron down icon

When clicked, the dropdown expands to show:

List of all homes with checkmark next to the currently selected one

Each home shows: Home icon, home name, and room count in parentheses

At the bottom: "Manage Homes" link with settings icon

"Add New Home" button with plus icon

Step 3: Create Homes Management Screen

Add a new menu item in sidebar called "Homes" with a house icon, placed above Dashboard or in a separate section. When clicked, navigate to a full Homes management screen.

Design the Homes screen with:

Page Header:

Title: "My Homes" in 24pt font weight 600

Subtitle: "Manage all your properties" in 14pt with 60% opacity

"Add New Home" button on the right with plus icon, primary blue background, white text, border radius 8px, padding 10px 16px

Homes Grid:

Display homes as cards in a responsive grid (3 columns on desktop, 2 on tablet, 1 on mobile)

Each home card dimensions: 320px width, 200px height, border radius 16px, white background in light mode, dark gray in dark mode, subtle shadow

Home Card design:

Top section: Home icon large (48x48) with background color based on home type (apartment, house, condo)

Home name: 18pt weight 600, margin top 8px

Address: 14pt with 60% opacity, single line with ellipsis if too long

Stats row: Room count and device count with small icons

Bottom row: Three action icons on the right side (Edit, Delete, Set as Default)

Clicking anywhere on the card navigates to that home's dashboard

Empty state:

If no homes exist, show centered illustration of a house with plus sign

Text: "You haven't added any homes yet"

"Add Your First Home" button

Step 4: Design Add Home Modal

When "Add New Home" is clicked anywhere, open a modal with these specifications:

Modal dimensions:

Width: 500px

Background: white in light mode, dark gray in dark mode

Border radius: 16px

Padding: 24px

Close button (X) in top right

Modal content:

Title: "Add New Home" in 20pt weight 600

Form fields:

Home Name field:

Label: "Home Name" in 14pt weight 500

Text input with placeholder: "e.g., My Apartment, Vacation Home"

Full width, height 44px, border radius 8px, border light gray, padding 12px

Home Type field:

Label: "Home Type"

Dropdown selector with options: Apartment, House, Condo, Townhouse, Other

Full width

Address field:

Label: "Address (Optional)"

Text area with placeholder: "Enter full address"

Height: 80px, resize vertical

Home Icon selector:

Label: "Choose Icon"

Grid of preset icons: Apartment building, House, Condo, Beach house, Cabin, etc.

Icons 48x48 with circular background, selectable (highlighted when clicked)

Set as Default checkbox:

Checkbox with label: "Set as my default home"

When checked, this home will be selected by default when user logs in

Bottom buttons:

"Cancel" button: gray outline, padding 10px 20px, border radius 8px

"Save Home" button: primary blue background, white text, padding 10px 20px, border radius 8px, disabled until form valid

Step 5: Design Edit Home Modal

Similar to Add Home modal but:

Title: "Edit Home"

Fields pre-filled with existing data

Delete option in red at bottom (or separate delete confirmation)

Delete confirmation:

When clicking Delete, show confirmation dialog: "Are you sure you want to delete [Home Name]? All rooms and devices in this home will also be deleted."

"Cancel" and "Delete" (red) buttons

Step 6: Home Dashboard View

When a home is selected (via dropdown or clicking a home card), the main dashboard should update to show data for that specific home.

Modify the Dashboard screen to be home-aware:

Add a breadcrumb or indicator at top: "My Apartment > Dashboard"

All data displayed (rooms, devices, activity log) should be filtered to show only items belonging to the selected home.

The Active Rooms section should only show rooms from the current home.

The Recent Activity should only show actions performed in the current home.

Step 7: Home Switching Animation

When switching between homes, add a smooth transition:

Fade out content (0.2s)

Show loading spinner

Fade in new home's content (0.2s)

This gives visual feedback that the data is changing.

Step 8: Default Home Behavior

When user logs in:

If they have a default home set, automatically select it

If no default, select the first home in their list

If no homes exist, redirect to Homes screen to create one

TASK 2: UPDATE DASHBOARD SCREEN - REMOVE GLOBAL SENSORS
Step 1: Understand the Change
Previously, the dashboard may have shown overall temperature, humidity, and light level for the entire house. These are being removed because each room now has its own stats. Keep only Active Rooms and Recent Activity.

Step 2: Redesign Dashboard Layout

Navigate to the main Dashboard screen. Remove any elements showing global sensor readings:

Delete/remove:

Any large temperature card at the top

Any humidity gauge

Any light level meter

Any "Overall Environment" section

Any charts showing aggregate data

The dashboard should now have a cleaner, simpler layout:

Page Header:

Welcome back, [User Name] with time-based greeting (Good morning/afternoon/evening)

Current time display (already added from previous instruction)

Main Content Area - Two column layout:

Left column (60% width): Active Rooms

Title: "Active Rooms" with room icon

Grid of room cards (as previously designed)

Each room card shows room name, icon, device count, and the three environmental stats (temperature, humidity, light level) in the bottom strip

Clicking any room card navigates to that room's detail view

Right column (40% width): Recent Activity

Title: "Recent Activity" with clock icon

"View All" link that goes to History tab

List of 5 most recent activities (as previously designed)

Each activity shows: icon, description, timestamp, and source badge (manual/automation)

Optional: Add a "Quick Actions" section below if space permits, with buttons for common tasks like "Add Device", "Create Automation"

Step 3: Ensure Room Cards Show Environmental Stats

Double-check that each room card in Active Rooms displays:

Temperature with thermometer icon

Humidity with droplet icon

Light level with sun icon
As designed in previous task instructions.

TASK 3: UPDATE HISTORY SCREEN TO TRACK AUTOMATION RULE CHANGES
Step 1: Understand the Requirement
The History/Activity Log screen needs to track when automation rules are added, turned on, or turned off. These events should appear in the main activity feed alongside device actions.

Step 2: Add New Automation Event Types

In the History screen, add these new event types to the activity log:

Rule Created Events:

Icon: Document with plus sign or robot with plus

Description: "New automation rule 'Good Morning' created"

Timestamp: When rule was created

Source badge: "Automation" with robot icon

Rule Enabled Events:

Icon: Robot with green power on symbol

Description: "Automation rule 'Night Mode' turned ON"

Timestamp: When rule was toggled on

Source badge: "Automation"

Rule Disabled Events:

Icon: Robot with gray power off symbol

Description: "Automation rule 'Away Mode' turned OFF"

Timestamp: When rule was toggled off

Source badge: "Automation"

Rule Edited Events:

Icon: Robot with pencil

Description: "Automation rule 'Leave Home' was edited"

Timestamp: When changes were saved

Source badge: "Automation"

Step 3: Design the History Screen Layout

Keep the existing History screen structure but enhance it:

Page Header:

Title: "Activity History" in 24pt

Subtitle: "Track all events across your home"

Filter Bar:

Date range selector (Today, Yesterday, Last 7 days, Custom)

Filter chips: "All Events", "Device Actions", "Automation Events", "Rule Changes"

Search bar with magnifying glass icon

Activity Timeline:

Events displayed in reverse chronological order (newest first)

Group by date with date headers (Today, Yesterday, This Week, etc.)

Each event card shows:

Left side: Icon representing event type

Main content: Description of what happened

Right side: Timestamp (e.g., "10:32 AM")

Source badge if automation-related

Visual distinction:

Manual actions: Regular styling

Automation-triggered actions: Light purple background with robot badge

Rule state changes: Light blue background with gear/robot badge

Step 4: Add Detail View for Automation Events

When clicking on any automation-related event, show a detail panel:

Slide-in panel from right or expandable section showing:

Rule name: "Good Morning Rule"

Current status: Enabled/Disabled

Trigger: "Time: 7:00 AM daily" or "Temperature > 28°C"

Actions performed: "Turn on Living Room light, Set fan to speed 2"

Created by: "Owner" (if multiple users)

Last triggered: "Today at 7:00 AM" (if applicable)

Step 5: Connect Automation Tab to History

Ensure that any action in the Automation tab creates history entries:

When user creates new rule:

In Automation tab, fill out rule details and click Save

Show success toast

Immediately add entry to History: "New rule '[Rule Name]' created"

When user toggles rule ON/OFF:

Click toggle switch

Show success toast

Add entry: "Rule '[Rule Name]' turned ON/OFF"

When user edits rule:

Make changes and save

Add entry: "Rule '[Rule Name]' was edited"

TASK 4: ADD SENSOR MANAGEMENT TAB IN DEVICE MANAGEMENT
Step 1: Understand the Requirement
In the Device Management screen, next to the existing device list, add a new tab for managing sensors (temperature, humidity, light level sensors). This tab should have the same table/grid format showing sensor name, type, room, status, added date, and actions.

Step 2: Redesign Device Management Layout

Navigate to the Device Management screen. Add tab navigation at the top:

Create two tabs side by side:

Tab 1: "Devices" (active by default) - Shows controllable devices (lights, fans, RGB)

Tab 2: "Sensors" - Shows environmental sensors (temperature, humidity, light)

Tab design:

Container with bottom border

Each tab: Padding 12px 24px, font weight 500

Active tab: Primary blue text, blue bottom border (2px)

Inactive tab: Gray text, no border

Step 3: Design Sensors Tab Content

When Sensors tab is clicked, show a table or grid of all sensors across all rooms:

Page Header within tab:

Title: "Sensors" with sensor icon

Subtitle: "Manage temperature, humidity, and light sensors"

"Add Sensor" button (even though sensors are typically added via YoloBit, include for completeness)

Sensors List (Table format):

Table columns:

Sensor Name

Icon (thermometer/droplet/sun) + name

Example: "Living Room Temperature"

Type

Badge with icon and text: "Temperature", "Humidity", "Light Level"

Color coded: Temperature = orange, Humidity = blue, Light = yellow

Room

Room name with small icon

Dropdown to change room assignment (edit mode)

Status

Online/Offline indicator with green/gray dot

Last seen time on hover

Added Date

Format: "Mar 15, 2026"

Sorted with newest first by default

Actions

Edit icon (pencil) - opens sensor details

Delete icon (trash) - with confirmation

Calibrate icon (optional) - for advanced users

Step 4: Design Sensor Cards Alternative View

For smaller screens or alternative visualization, also provide a card grid view:

Sensor card dimensions: 280px width, 160px height

Card design:

Top row: Sensor icon (large) on left, status dot on right

Sensor name: 16pt weight 600

Type badge: Small pill with type

Room: Room name with small icon

Current reading: Large value display (e.g., "24.5°C", "65%", "450 lux")

Bottom row: Last updated timestamp and three-dot menu for actions

Step 5: Add Sensor Detail Modal

When clicking Edit on any sensor, open a modal:

Title: "Edit Sensor"

Form fields:

Sensor Name:

Text input with current name

Sensor Type:

Display-only (cannot change type) - shows Temperature/Humidity/Light with icon

Room Assignment:

Dropdown to move sensor to different room

Calibration Offset (optional):

Number field with +/- adjustment

Small help text: "Adjust if readings are inaccurate"

Current Reading:

Display-only showing real-time value

Update button to refresh

Status:

Online/Offline indicator

"Check Connection" button

Bottom buttons:

"Save Changes", "Cancel", "Delete" (red outline)

Step 6: Add Sensor Wizard for New Sensors

When clicking "Add Sensor", open a multi-step modal:

Step 1: Select Sensor Type

Three large cards: Temperature, Humidity, Light Level

Click to select

Step 2: Assign to YoloBit

Dropdown to select which YoloBit hub this sensor is connected to

Or "Auto-detect" button that scans

Step 3: Assign Room

Room dropdown

Sensor Name field (auto-generate based on room and type)

Step 4: Confirmation

Summary of settings

"Add Sensor" button

Step 7: Ensure Consistency Between Tabs

Make sure both Devices tab and Sensors tab have similar:

Table structure

Sorting options

Filter options (by room, by status, by type)

Search functionality

Bulk actions (select multiple, delete, move to room)

Step 8: Add Sensor Data to Room Views

Ensure that sensors added in Sensor Management appear in:

Room detail views (in Environment section)

Control tab (as read-only cards or in a separate section)

Dashboard (via room cards)

When a new sensor is added, it should immediately appear in the appropriate room's environmental stats.