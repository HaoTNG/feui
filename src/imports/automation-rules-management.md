Hello Figma AI, I need you to implement new automation and security features, fix dark mode, improve admin tabs, and create guidance documentation. Please follow these detailed instructions.

PART 1: IMPLEMENT AUTOMATION & SECURITY FEATURES
Create the Automation Rules Management Interface
Design a new page called "Automation Rules" accessible from the sidebar. This page will implement FR-15, FR-16, and FR-17 for Owner users only. For Family members, this page should be view-only with a "View Only" badge. For Guest users, this page should be completely hidden.

At the top of the Automation page, add a blue button that says "Create New Rule" that opens a modal for creating IF-THEN rules. Next to it, add a search bar and filter dropdown to find existing rules.

Below the header, create a grid or list view of all automation rules. Each rule card should show:

Rule name at the top (editable)

IF condition displayed clearly with an icon (temperature, humidity, light, motion, time)

THEN action displayed with an icon (turn on device, turn off device, send notification)

Status toggle switch showing Active or Inactive (FR-16)

Three-dot menu with Edit and Delete options

Schedule indicator if the rule has time-based scheduling (clock icon)

Design the Create Rule Modal (FR-15)
Create a multi-step modal for rule creation with these sections:

Step 1: Rule Name

Text input field with placeholder "Enter rule name (e.g., Hot weather fan)"

Helper text below: "Give your rule a descriptive name"

Step 2: Set Condition (IF)

First dropdown: Select condition type with options:

Temperature (with °C unit)

Humidity (with % unit)

Light level (with lux unit)

Motion detected (PIR sensor)

Time (for scheduling)

Device status (when device turns on/off)

Multiple conditions (AND/OR logic)

Second field depends on first selection:

For Temperature: Comparison operator dropdown (<, >, =, ≤, ≥) and value input field with number and °C

For Humidity: Same with % symbol

For Light: Same with lux unit

For Motion: Just "detected" text with no value

For Time: Time picker with hour and minute selectors, plus AM/PM or 24-hour format

For Device status: Device selector dropdown then "turns on" or "turns off"

Add "Add another condition" link to create complex rules with AND/OR logic. When clicked, show a second condition row with an AND/OR selector between them.

Step 3: Set Action (THEN)

Action type dropdown: "Turn on device", "Turn off device", "Send notification", "Adjust brightness", "Set fan speed", "Change color"

Device selector dropdown showing all available devices

For brightness: Add slider from 0-100%

For fan speed: Add slider or 1-3 speed buttons

For color: Add color picker with preset colors

For notification: Text input for custom message

Step 4: Schedule (Optional for FR-17)

Checkbox: "Apply time schedule to this rule"

When checked, show time range pickers:

Start time: Time picker

End time: Time picker

Days of week selector with buttons for Mon, Tue, Wed, Thu, Fri, Sat, Sun

Add "Repeat daily" checkbox for convenience

Step 5: Review and Save

Summary card showing the complete rule in plain English: "IF Living Room Temperature > 30°C THEN turn on Living Room Fan"

Blue "Save Rule" button

Gray "Cancel" button

Design Sample Rules
Create these sample rules to demonstrate functionality:

Rule 1: Hot Weather Fan

IF Living Room Temperature > 30°C

THEN turn on Living Room Fan

Status: Active

No schedule

Rule 2: Goodnight Mode

IF Time = 10:00 PM

THEN turn off Living Room Light, turn off Bedroom Light, turn off Kitchen Light

Status: Active

Days: Mon-Sun

Rule 3: Motion Security

IF Motion detected in Living Room AND Time between 11:00 PM and 6:00 AM

THEN send notification "Motion detected while away"

Status: Inactive (toggle off)

Created with multiple conditions using AND logic

Rule 4: Morning Wake Up

IF Time = 7:00 AM

THEN turn on Bedroom Light (brightness 50%)

Status: Active

Days: Mon-Fri only

Add Rule Editing and Deletion
When clicking the Edit option on any rule card, open the same modal pre-filled with that rule's data. Allow the Owner to modify any part and save changes.

When clicking Delete, show a confirmation modal with:

Warning icon

Title: "Delete Automation Rule"

Message: "Are you sure you want to delete 'Hot Weather Fan'? This action cannot be undone."

Red "Delete" button and gray "Cancel" button

Implement Rule Status Toggle (FR-16)
Each rule card should have a toggle switch showing the current status. Active rules show green toggle switched to ON position. Inactive rules show gray toggle switched to OFF position.

When I click the toggle:

If turning ON: Switch animates to green, rule becomes active

If turning OFF: Switch animates to gray, rule becomes inactive

A small toast notification appears saying "Rule status updated"

Inactive rules should appear slightly faded or have a visual indicator that they're not running, but still be visible for editing.

PART 2: FIX DARK MODE FOR ADMIN TABS
The admin tabs (Device Management, Room Management, User Management) currently have white backgrounds with black text instead of following dark mode properly. Fix this completely.

Update Device Management Tab for Dark Mode
When dark mode is enabled, the Device Management page should have:

Background color: dark charcoal (#111827)

Cards: slightly lighter dark color (#1F2937) with subtle borders

Text: Primary text in light gray (#F9FAFB), secondary text in medium gray (#9CA3AF)

Input fields: dark background (#1F2937) with light text and lighter borders

Buttons: Primary blue buttons remain blue but with adjusted contrast

Table rows: alternating dark shades for better readability

Icons: white or light gray instead of black

The device table or grid should show:

Device Name column

Device Type column with icons

Room column

Status column with online/offline indicators (green dot should still be bright green)

Added Date column

Actions column with edit and delete icons

In dark mode, the online green dot should remain bright green to stand out, and offline gray dot should be a lighter gray. Delete icons should remain red but with good contrast against dark background.

Update Room Management Tab for Dark Mode
Room Management page in dark mode should have:

Room cards with dark background (#1F2937)

Room name in white text

Device count in light gray

Edit and delete icons visible on hover with proper contrast

Add Room button (blue) stands out clearly

Each room card should show:

Room icon (living room, bedroom, kitchen, office icons)

Room name (e.g., "Living Room")

Device count (e.g., "5 devices")

Edit icon (pencil) and Delete icon (trash) that appear on hover

When clicking a room card, the detailed room view should also respect dark mode with proper background and text colors throughout.

Update User Management Tab for Dark Mode
User Management page in dark mode should have:

Member list with dark background rows

User avatar with proper visibility

User name and email in white/light gray text

Role tags (Owner, Family, Guest) with appropriate colors that work in dark mode

Status indicators (Active/Pending) with colors that contrast well

Invite Member button in blue

Remove member icon in red that's visible

Role tags should be:

Owner: Purple tag with white text

Family: Blue tag with white text

Guest: Gray tag with white text

Status indicators:

Active: Green dot with "Active" text

Pending: Yellow dot with "Pending" text

Ensure Dark Mode Toggle Works Globally
Create a dark mode toggle in the user settings or as a sun/moon icon in the header. When clicked, every single page including all admin tabs should instantly switch between light and dark themes. The transition should be smooth.

Test that all components respect the dark mode colors:

Sidebar (already should have dark version)

Header

Cards and containers

Forms and inputs

Modals

Dropdowns

Tables

Charts and graphs

Toast notifications

All admin tabs

PART 3: FIX ADMIN TAB FUNCTIONALITY
Fix Device Management Tab
Fix Add Device Modal:

Redesign the Add Device modal to have a proper backdrop. When opened, the main application content should be visible but dimmed with a semi-transparent black overlay at 50% opacity. The modal should be centered with white background (or dark background in dark mode), rounded corners, and a close button.

The modal should have two tabs: "QR Code" and "Manual Entry". In the Manual Entry tab:

Device ID field: text input with placeholder "Enter device ID (e.g., LIGHT-001)"

Device Name field: text input with placeholder "Enter display name"

Device Type dropdown: Light, Fan, RGB Light, Temperature Sensor, Humidity Sensor, Motion Sensor

Room dropdown: All existing rooms plus "Unassigned" option

Add Device button (blue)

Cancel button (gray)

After filling fields and clicking Add Device:

Modal closes

Success toast appears: "Living Room Light added successfully"

New device appears immediately in:

Control tab under the selected room

Room tab when viewing that room's details

Device Management list

Any device dropdowns throughout the app

Create a sample device called "Office Light" in the Office room to test this flow.

Fix Device Persistence:

All devices added should remain in the system when navigating between tabs. If I add a device in Device Management, then go to Control tab, then back to Device Management, the device should still be there. The app should maintain state globally.

Fix Room Management Tab
Fix Add Room Modal:

Create a proper modal with backdrop similar to Add Device. Include:

Room Name field: text input with placeholder "Enter room name"

Room Icon selector: Grid of icons (living room, bedroom, kitchen, office, bathroom, dining)

Create Room button (blue)

Cancel button (gray)

After adding a room:

Modal closes

Success toast: "Home Office room created successfully"

New room appears in:

Room Management grid

All room dropdowns when adding devices

Dashboard's Active Rooms section (if it has devices)

Fix Room Persistence:

New rooms should persist across tab navigation. If I create a room, go to Control tab, then back to Room Management, the room should still be there.

Fix User Management Tab
Fix Invite Member Modal:

Create proper modal with:

Email field: text input with placeholder "Enter email address"

Role dropdown: Owner, Family, Guest (default Family)

Optional message field: text area

Send Invitation button (blue)

Cancel button (gray)

After sending invitation:

Modal closes

Success toast: "Invitation sent to guest@example.com"

New member appears in members list with role and status "Active" (for demo)

Fix Member Persistence:

Added members should remain in the list when switching tabs. If I invite a member, go to Dashboard, then back to User Management, they should still be there.

PART 4: CREATE GUIDANCE DOCUMENTATION
Design a new "Documentation" or "Guide" section in the app accessible from the sidebar (for all users). Create these three documentation pages:

Page 1: Connecting IoT Devices to the Web App
Title: "Connecting Your Smart Home Devices"

Create a step-by-step visual guide with illustrations:

Step 1: Set Up Your Hardware

Image of YoloBit board with labels

Text: "Connect your YoloBit to power using USB-C cable"

Image showing sensor connections (DHT20, PIR, light sensor)

Text: "Attach your sensors to the appropriate pins"

Image showing output devices (fan, LED, LCD)

Text: "Connect your output devices (fan, RGB LED, LCD)"

Step 2: Configure WiFi on YoloBit

Screenshot of code editor

Code snippet showing:

python
import network
wlan = network.WLAN(network.STA_IF)
wlan.active(True)
wlan.connect("YourWiFiSSID", "YourWiFiPassword")
Text: "Update the code with your WiFi credentials"

Step 3: Connect to Adafruit IO

Screenshot of Adafruit IO dashboard

Text: "Create an Adafruit IO account and get your AIO key"

Code snippet showing MQTT connection:

python
from Adafruit_IO import MQTTClient
client = MQTTClient("dadn50", "YOUR_AIO_KEY")
client.connect()
Text: "Use the provided username 'dadn50' and your AIO key"

Step 4: Create Feeds for Each Device

Screenshot of Adafruit IO feed creation

List of required feeds:

temperature

humidity

light

pir (motion)

fan

rgb_light

lcd_display

Text: "Create these feeds in your Adafruit IO account"

Step 5: Publish Sensor Data

Code snippet showing publish:

python
# Read temperature from DHT20
temperature = dht20.read_temperature()
# Publish to Adafruit IO
client.publish("temperature", temperature)
Text: "Your YoloBit reads sensor data and publishes to Adafruit IO feeds"

Step 6: Subscribe to Control Commands

Code snippet showing subscribe:

python
def message(client, feed_id, payload):
    if feed_id == "fan":
        if payload == "ON":
            turn_fan_on()
        elif payload == "OFF":
            turn_fan_off()

client.on_message = message
client.subscribe("fan")
Text: "YoloBit listens for commands from the web app via MQTT"

Step 7: Data Flow Diagram

Create a visual diagram showing:

YoloBit with sensors → MQTT → Adafruit IO → Backend WebSocket → Web App

Web App → MQTT → Adafruit IO → YoloBit with actuators

Step 8: Testing Your Connection

Checklist with checkboxes:

YoloBit shows "Connected" on LCD

Adafruit IO feeds show data updating

Web app shows sensor values changing

Toggling devices in web app controls physical devices

Page 2: Push Notifications in the App
Title: "Understanding Push Notifications"

What Are Push Notifications?

Simple explanation: "Alerts that appear on your phone even when the app is closed"

Examples: Motion detected alerts, temperature warnings, device offline notifications

How Push Notifications Work in This App

Diagram showing:

IoT Device (sensor triggers) → Cloud Server → Firebase/APNS → Your Phone

Types of Notifications You'll Receive

Security Alerts (with warning icon):

"Motion detected in Living Room while you're away"

"Door opened at 2:30 AM"

Environmental Alerts (with temperature icon):

"Temperature exceeded 35°C in Bedroom"

"Smoke detected in Kitchen"

Device Status (with device icon):

"Bedroom fan went offline"

"Living Room light turned on by automation"

System Notifications (with info icon):

"New member joined your home"

"Automation rule 'Goodnight' activated"

Notification Settings

Screenshot of notification settings page

Options to enable/disable:

Motion alerts

Temperature alerts

Device offline alerts

Automation notifications

Quiet hours setting

Email notification option

Visual Examples

Mockup of phone notification shade showing:

"Motion detected in Living Room - 2 min ago"

"Temperature high in Bedroom - 35°C - 10 min ago"

"Fan offline - Check connection - 1 hour ago"

Page 3: Downloading and Running the Web App
Title: "Running the Smart Home Web App Locally"

Prerequisites

Checkbox list:

Node.js installed (version 16 or higher)

npm or yarn package manager

Git installed

Code editor (VS Code recommended)

Web browser (Chrome, Firefox, or Edge)

Step 1: Clone the Repository

Code block:

bash
git clone https://github.com/yourusername/smarthome-app.git
cd smarthome-app
Step 2: Install Dependencies

Code block:

bash
npm install
# or
yarn install
Text: "This installs all required packages including React, MQTT client, and UI libraries"

Step 3: Configure Environment Variables

Create a .env file in the root directory

Code block showing:

text
REACT_APP_ADAFRUIT_USERNAME=dadn50
REACT_APP_ADAFRUIT_KEY=your_aio_key_here
REACT_APP_MQTT_BROKER=io.adafruit.com
REACT_APP_MQTT_PORT=443
REACT_APP_API_URL=http://localhost:3001
Text: "Replace 'your_aio_key_here' with your actual Adafruit IO key"

Step 4: Start the Backend Server

Open a new terminal

Code block:

bash
cd backend
npm install
npm start
Expected output: "Backend server running on port 3001"

Step 5: Start the Frontend App

Open another new terminal

Code block:

bash
npm start
Expected: "Compiled successfully! - http://localhost:3000"

Step 6: Open in Browser

Text: "Open Chrome or Firefox and navigate to:"

Code block: http://localhost:3000

Screenshot of login page with annotation

Step 7: Login with Demo Credentials

Username: owner@example.com (Owner role)

Username: family@example.com (Family role)

Username: guest@example.com (Guest role)

Password for all: password123

Troubleshooting Common Issues

Table format:

Issue	Solution
"Module not found" errors	Run npm install again
Can't connect to Adafruit IO	Check AIO key in .env file
WebSocket connection fails	Ensure backend is running on port 3001
Device shows offline	Check YoloBit WiFi connection
No sensor data	Verify MQTT feed names match
Project Structure Overview

Tree diagram showing:

text
smarthome-app/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Dashboard, Control, History, etc.
│   ├── context/        # App state management
│   ├── services/       # MQTT and API services
│   └── utils/          # Helper functions
├── backend/            # WebSocket server
├── public/             # Static files
└── package.json        # Dependencies
Next Steps for Development

Link to contribution guidelines

Link to API documentation

Link to hardware setup guide

PART 5: ADDITIONAL ENHANCEMENTS
Add Automation Rule Templates
Create a "Templates" section in the Automation page with pre-built rules:

Welcome Home: IF motion detected AND time sunset-sunrise THEN turn on lights

Goodnight: IF time 11:00 PM THEN turn off all lights, set fan to low

Energy Saver: IF no motion for 30 minutes THEN turn off lights and fan

High Temperature Alert: IF temperature > 35°C THEN send notification

Add Rule Testing Feature
Add a "Test Rule" button when creating/editing rules that simulates the condition being met to verify the action works.

Add Automation Logs
Create an "Automation History" tab showing when rules were triggered, what action was taken, and timestamps.

Add Visual Feedback for Active Rules
When a rule triggers in real-time, show a small toast notification: "⚡ Hot Weather Fan activated - Living Room temperature 31°C"