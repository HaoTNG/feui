Hello Figma AI, I need you to make several significant updates to my smart home web application. Please follow these precise instructions to implement three major improvements across the entire app.

TASK 1: ADD TEMPERATURE, HUMIDITY, AND LIGHT LEVEL STATS TO EVERY ROOM AND REMOVE AIR QUALITY
Step 1: Understand the Scope
Currently, environmental stats appear only in limited locations. I need temperature, humidity, and light level displays added to every single room throughout the entire application. Air quality references must be completely removed.

Step 2: Update the Dashboard - Active Rooms Section

Navigate to the main Dashboard tab and locate the Active Rooms bar or grid. For each room card displayed, modify the design as follows:

Each room card currently shows the room name, room icon, and maybe a few device summaries. Redesign each room card to include a new environmental stats strip at the bottom of the card.

Create a horizontal strip with three evenly spaced stat indicators:

Left stat: Temperature

Icon: Thermometer icon (simple outline)

Value: Display a temperature value between 18°C and 32°C

Format: "24.5°C" with one decimal place

Background: Subtle gradient from blue to orange depending on value (cooler temps more blue, warmer temps more orange)

Middle stat: Humidity

Icon: Droplet icon

Value: Display a humidity percentage between 30% and 90%

Format: "65%" with percentage symbol

Background: Light blue gradient

Right stat: Light Level

Icon: Sun icon

Value: Display a light level value between 100 and 1000 lux

Format: "450 lux" or use descriptive text like "Bright", "Dim", "Normal" based on value ranges

Background: Yellow gradient

Each stat should be in a small pill-shaped container with 16px height, 8px border radius, and appropriate padding. When hovered, slightly expand with a tooltip showing the full value.

For demo purposes, populate every room with sample data:

Living Room: 24.5°C, 65%, 450 lux

Bedroom: 22.0°C, 55%, 120 lux (dimmer)

Kitchen: 26.5°C, 70%, 800 lux (brighter)

Office: 23.5°C, 50%, 350 lux

Bathroom: 25.0°C, 80%, 200 lux

If a room doesn't exist yet (like Home Office added later), generate reasonable default values based on room type.

Step 3: Update the Control Tab with Room Environment Headers

Navigate to the Control tab where devices are organized by room. For each room section, add a new header area above the device cards.

The room header should now include:

Left side:

Room icon (existing)

Room name in 20pt font (existing)

Small device count badge (existing)

Right side:

A new compact environmental stats bar showing the three values in a horizontal row

Each stat should be a small chip with icon and value only (no background, just icon and text)

Separator dots between each stat

Example: "🌡️ 24.5°C • 💧 65% • ☀️ 450 lux"

Below the room header but above the device cards, add a quick glance row showing which sensors are active in this room with small colored dots.

Step 4: Create Detailed Room View with Full Environment Section

Navigate to Room Management tab and click into any room to see its detailed view. Currently this shows only devices. Redesign this detailed room view to have two distinct sections:

Top Section: Environment Dashboard (new)

Create a prominent card spanning the full width

Title: "Room Environment" with a small sensor icon

Three large stat cards arranged horizontally with equal width

For Temperature card:

Large thermometer icon at top

Big value: "24.5°C" in 36pt font weight 600

Small trend indicator: "Stable" or "Rising 0.5°" with arrow icon

Colored background gradient from cool to warm

For Humidity card:

Large droplet icon

Big value: "65%" in 36pt

Small indicator: "Normal range" or "High/Low" warning if applicable

Light blue gradient background

For Light Level card:

Large sun icon

Big value: "450 lux" in 36pt

Small indicator: "Bright" or "Dim" descriptor

Yellow gradient background

Below these three cards, add a small timeline preview showing recent changes (last 6 readings in sparkline format). For demo, show mock data lines trending up or down.

Bottom Section: Devices in This Room (existing)

Keep the current device grid/list

Each device card should now also show a small environmental indicator if relevant (for example, a smart plug might show energy usage, but keep it simple)

Step 5: Remove All Air Quality References

Perform a global search and destroy for anything related to air quality:

Search for any "Air Quality" text, "AQI", "Air Index", or similar terms

Find any cards, badges, or UI elements showing air quality values

If any graphs or charts include air quality, remove those lines or replace with light level data

In any settings or filters, remove air quality options

In activity log filters, remove air quality event types

In automation rules, remove any condition related to air quality

If there was a dedicated Air Quality sensor card anywhere, replace it entirely with a Light Level sensor card using the same design pattern as temperature and humidity.

Step 6: Add Environment Filters to History Tab

In the History/Activity Log tab, add a new filter option for "Environment Events" that includes temperature changes, humidity changes, and light level changes. When selected, show logs like:

"Temperature in Living Room exceeded 28°C"

"Humidity dropped below 40% in Bedroom"

"Light level increased to 800 lux in Kitchen"

TASK 2: ENHANCE ACTIVITY LOG TO TRACK AUTOMATION CHANGES
Step 1: Understand the Requirement
Currently, the activity log tracks manual actions like turning devices on/off. Now it needs to also track:

When an automation rule is turned ON or OFF

When a device is changed DUE to an automation rule firing

This should appear in both the Dashboard's Recent Activity and the full History tab

Step 2: Create New Automation Event Types

Add these new event types to the activity log system:

Automation Rule State Change Events:

"Auto Night Mode was turned ON" with robot icon and green badge

"Auto Night Mode was turned OFF" with robot icon and gray badge

"Morning Routine was edited" with edit icon

"New automation rule 'Leave Home' was created" with plus icon

Automation-Triggered Device Events:

"Living Room light turned ON by Good Night automation" with light bulb icon and robot badge

"Bedroom fan speed set to 3 by Temperature Rule" with fan icon and robot badge

"All lights turned OFF by Away Mode" with multiple light icons and robot badge

Step 3: Design Visual Differentiation

Automation-triggered events should look different from manual events to make them easily identifiable:

Add a small robot icon badge on every automation-related event
Use a different background color for automation events (light purple with 10% opacity)
Add tooltip on hover: "Triggered by automation rule"
Include the rule name in the description

Step 4: Update Recent Activity on Dashboard

The Recent Activity bar on the main Dashboard should now show a mix of manual and automation events. The most recent 5 events should appear regardless of type.

Design sample entries showing:

"10:32 AM - You turned off Kitchen light"
"10:30 AM - Auto Night Mode turned ON" (with robot icon)
"10:28 AM - Living Room light ON (triggered by Sunset Rule)" (with robot icon)
"10:25 AM - Temperature Rule was edited"
"10:20 AM - You adjusted fan speed to 3"

Step 5: Enhance Full History Tab

In the History tab, add new filter options:

Add filter chips:

"All Events" (default)

"Manual Actions"

"Automation Events"

"Rule Changes"

"Device Triggers"

Add a new column or badge in the event list showing the source:

Manual: "By you" with user icon

Automation: "By [Rule Name]" with robot icon

System: "System" with gear icon (for things like device offline alerts)

Add a detail view when clicking on any automation-triggered event showing:

Which rule caused it

What condition triggered it (e.g., "Temperature exceeded 28°C")

What actions were taken

Timestamp

Step 6: Connect Automation Toggle to Activity Log

When a user toggles an automation rule from ON to OFF in the Automation tab, this action should immediately create an activity log entry.

Design this flow:

User finds automation rule card with toggle switch

User clicks toggle from ON to OFF

Toggle animates to OFF position

Green success toast appears: "Auto Night Mode turned off"

Simultaneously, a new entry appears in Recent Activity: "Auto Night Mode was turned OFF" with robot icon and timestamp

In the History tab, this event appears with the correct filter category

Same for turning a rule ON: "Auto Night Mode was turned ON"

Step 7: Track Rule Creation and Editing

When a user creates a new automation rule:

After clicking Save, show success toast

Add to activity log: "New rule 'Leave Home' created" with plus icon and robot badge

Include who created it (if multiple users)

When a user edits an existing rule:

Add to activity log: "Rule 'Good Morning' was edited" with edit icon

Optionally show what changed (if possible in demo, can be generic)

TASK 3: ENHANCE DEVICE MANAGEMENT WITH CONNECTION STATUS AND PROPER INTEGRATION
Step 1: Understand the Requirements

Three specific improvements needed:

All changes in Device Management must appear in Control tab and Room tab immediately

Manual entry devices must show connection status (connected/disconnected)

Every device must show online/offline status

Step 2: Redesign Add Device Modal for Manual Entry with Status

Navigate to Device Management tab and open the Add Device modal. Redesign the Manual Entry tab with these new elements:

Keep the two tabs: QR Code and Manual Entry

In Manual Entry tab, redesign the layout:

Device ID field:

Label: "Device ID or Serial Number"

Text input with placeholder: "Enter device ID (e.g., YOLO-001, LIGHT-A7B3)"

Add a "Verify" button next to the field with a search icon

Below the Device ID field, add a Status Area that changes based on verification:

Initial state (no ID entered yet):

Show nothing or gray placeholder text

Verifying state (after clicking Verify):

Show loading spinner and text: "Checking device..."

Device Found - Online state (green):

Green checkmark icon

Text: "Device YOLO-001 found and online"

Show device info: "YoloBit Hub v2 • Temperature, Humidity, Light sensors"

Last seen: "Currently connected"

Device Found - Offline state (yellow):

Yellow warning icon

Text: "Device LIGHT-002 found but offline"

Last seen: "Last seen 3 days ago"

Add checkbox: "Add anyway? It will appear when online"

Device Not Found state (red):

Red X icon

Text: "No device found with ID 'ASDFGHJKL'"

Suggestions: "Check the ID and try again, or try QR code scanning"

Add button: "Search again"

Device Already Registered state (red):

Red X icon

Text: "This device belongs to another user"

Option: "Contact support if you think this is an error"

Step 3: Add Connection Status to All Device Cards

Every single device card throughout the entire app must now show online/offline status:

In Control tab device cards:

Add a small status indicator in the top right corner

Green dot with pulsing animation for online

Gray dot with "offline" tooltip for offline

If offline for more than 24 hours, show orange dot with "offline - check connection"

In Room Management device list:

Add status column or badge

Online: green badge with "Online"

Offline: gray badge with "Offline"

Include last seen time on hover: "Last seen 2 hours ago"

In Dashboard Active Rooms summary:

If a room has any offline devices, show a small warning indicator on the room card

Clicking it shows which devices are offline

Step 4: Create Unified Device State Across All Tabs

When a new device is added through Device Management, it must appear everywhere immediately:

Test this flow:

In Device Management, click Add Device

Fill in ID "YOLO-001" (mock online device)

Select Device Type as "YoloBit Hub" (or appropriate)

Assign to "Living Room"

Click Add Device

Modal closes, success toast appears

Now verify the device appears in:

Control Tab:

Under Living Room section, new cards appear for:

Temperature Sensor (showing sample data)

Humidity Sensor (showing sample data)

Light Sensor (showing sample data)

Fan control (if applicable)

RGB Light control (if applicable)

Each card shows green online indicator

Room Management:

Click into Living Room detail view

In devices section, all new components appear

Each shows online status

Dashboard:

Active Rooms card for Living Room now shows the environmental stats updating

Recent Activity shows: "New device YOLO-001 added to Living Room"

Step 5: Handle Offline Device Behavior

When a device is added but offline:

Example: Add device with ID "LIGHT-002" that's offline

In Control Tab:

Device card appears but with gray "Offline" badge

Controls are disabled (grayed out, not clickable)

Card shows "Device offline" message

No sensor data shown (just dashes)

In Room Management:

Device appears in list with "Offline" status

Last seen time visible

In Dashboard:

No environmental data from this device shows

Room card may show warning if this is the only sensor

When offline device comes online (simulated):

Status changes to green with animation

Controls become enabled

Sensor data starts appearing

Activity log entry: "LIGHT-002 is now online"

Step 6: Add Manual Status Override for Demo

For demonstration purposes, add a hidden or developer option to toggle device status:

In Device Management, when clicking on any device, add a small "Demo Controls" expandable section:

Toggle between Online and Offline

Toggle between Connected and Disconnected

Adjust signal strength (1-3 bars)

This allows presenting different scenarios during demo

Step 7: Update Room Management to Reflect Device Changes

When a device is added to a room, that room's device count should update immediately.
When a device is moved from one room to another, both rooms should update.
When a device is deleted, it disappears from all room views.

Design these updates to be instantaneous in the prototype with smooth animations.

Step 8: Add Connection Status Indicators in Device Management List

In the main Device Management tab (list/grid view), add:

Status column with colored dots

Connection type badge: "WiFi", "Wired", "Zigbee" (for demo, all can be WiFi)

Signal strength indicator (WiFi bars)

Last seen timestamp

Quick action to test connection (ping icon)

