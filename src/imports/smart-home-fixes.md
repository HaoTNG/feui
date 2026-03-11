Hello Figma AI, I need you to fix four specific problems in my smart home web application. Please follow these precise instructions to update the design and functionality.

ISSUE 1: NOTIFICATION DROPDOWN POSITION IS WRONG
The notification dropdown currently appears centered or in the wrong position. I need the dropdown to have its root anchor point on the left side of the bell icon, with the content panel extending to the right.

When I click the bell icon in the top header, the notification dropdown should appear with its left edge aligned to the left edge of the bell icon. The panel should then expand toward the right, so all the notification content appears to the right of the bell icon. This means the dropdown will extend over the main content area, not over the left sidebar.

The dropdown should have a width of 380 pixels. The top of the dropdown should align with the bottom of the bell icon with a small gap of 4 pixels. Add a small triangular arrow at the top of the dropdown that points up to the bell icon, positioned on the left side of the dropdown to match the left alignment.

Inside the dropdown, create a header that says Notifications with a Mark all as read link in blue on the right side. Below the header, show a list of notifications. Each notification should have an icon on the left, the notification message, and a timestamp showing how long ago. Unread notifications should have a blue dot on the left side.

Sample notifications to include:

Motion detected in Living Room with a person icon, showing 5 minutes ago, unread with blue dot

Temperature exceeded 30°C in Bedroom with a warning icon in yellow, showing 15 minutes ago, unread

Bedroom fan went offline with a gray offline icon, showing 1 hour ago, marked as read with no blue dot

Goodnight mode activated with a robot icon, showing 2 hours ago, read

At the bottom of the dropdown, add a View all notifications link that would navigate to a full notifications page in the real app.

When I click the bell icon, the dropdown should open. Clicking the bell icon again should close it. Clicking anywhere outside the dropdown should also close it. The bell icon should show a red badge with the number 3 representing unread notifications.

ISSUE 2: ROOM TAB DOESN'T TRACK DEVICE STATE CHANGES
The Room tab currently shows device states that are frozen and don't update when I change devices in the Control tab. This needs to be fixed so all device states are synchronized across the entire application.

Create a unified device state system that works throughout the prototype. Every device in the app should have a single state that is shared everywhere that device appears.

Start by creating these sample devices with their initial states:

Living Room Light: OFF

Living Room Fan: OFF with speed 0

Bedroom Light: ON

Kitchen Light: OFF

Living Room Temperature Sensor: showing 24.5°C

Bedroom Temperature Sensor: showing 23.2°C

In the Control tab, when I click the ON button for the Living Room Light, that device's state should immediately change to ON everywhere in the app. In the Room tab, when I navigate to the Living Room detail view, the Living Room Light should show as ON with a green indicator. In the Dashboard's Active Rooms section, the Living Room card should show the light as ON. If I have the Living Room light listed anywhere else, it should also show as ON.

Test this synchronization by creating multiple views of the same device:

In the Control tab under Living Room section, show the Living Room Light card with a toggle button

In the Room tab, create a detailed Living Room view that shows all Living Room devices including the light

In the Dashboard's Active Rooms section, create a Living Room card that shows a summary including the light status

When I click the toggle on the Living Room Light in the Control tab, both the Room tab detail view and the Dashboard card should update instantly to show the new state. The button in Control should also update to show the correct state.

Do the same for the Living Room Fan. When I adjust the fan speed slider in Control, the speed indicator should update in the Room tab detail view and in any other location showing the fan.

For sensor devices that don't have controls, show their readings consistently everywhere. The Living Room temperature showing 24.5°C should appear the same in Control, in Room tab, and on Dashboard.

ISSUE 3: OWNER'S MODALS ARE BUGGY AND ADDED ITEMS DON'T APPEAR
The Add Device, Add Room, and Add Member modals have two problems: they make the background completely disappear leaving only the modal visible, and after adding items they don't appear anywhere in the dashboard. Fix both issues.

Fix the Modal Backdrop
Redesign all modals to have a proper overlay. When any modal opens, the main application content should remain visible but be dimmed with a semi-transparent black overlay at 50 percent opacity. The modal itself should appear centered on top of this dimmed background. The user should be able to see the blurred app content behind the modal, not a blank background.

The modal should have a white background, rounded corners of 12 pixels, a subtle shadow, and a maximum width of 500 pixels. Add a close button in the top right corner as an X icon. Clicking this close button should close the modal without saving. Clicking anywhere on the dimmed backdrop should also close the modal.

Fix Add Device Functionality
Create the Add Device modal with two tabs: QR Code and Manual Entry. The QR Code tab should show a square camera view area with a message saying Position QR code in frame. The Manual Entry tab should have:

Device ID field: text input with placeholder Enter device ID

Device Type dropdown: options including Light, Fan, RGB Light, Temperature Sensor, Humidity Sensor, Motion Sensor

Room dropdown: list of all existing rooms including Living Room, Bedroom, Kitchen, Office, plus an option for Assign to room later

Add Device button in blue at the bottom

Cancel button in gray outline

When I fill in the fields with Device ID as LIGHT-001, select Type as Light, select Room as Living Room, and click Add Device, the modal should close and a green success toast notification should appear at the top right saying Living Room Light added successfully.

Most importantly, the new device should immediately appear in the Control tab under the Living Room section as a new card named Living Room Light with an OFF state. It should also appear in the Room tab when viewing Living Room details, and in the Device Management list if that exists.

Fix Add Room Functionality
Create the Add Room modal with:

Room Name field: text input with placeholder Enter room name

Room Icon selector: grid of preset icons including living room, bedroom, kitchen, office, bathroom icons

Create Room button in blue

Cancel button in gray

When I enter Home Office as the room name, select the office icon, and click Create Room, the modal should close with a success toast saying Home Office room created successfully.

The new room should immediately appear in the Room Management grid as a new card. It should also appear in all room dropdowns throughout the app, including when adding devices. In the Dashboard's Active Rooms section, if the new room has no devices yet, it should show an empty state or not appear until devices are added to it.

Fix Invite Member Functionality
Create the Invite Member modal with:

Email field: text input with placeholder Enter email address

Role dropdown: options for Owner, Family, Guest with default set to Family

Optional message field: text area with placeholder Add a personal message (optional)

Send Invitation button in blue

Cancel button in gray

When I enter guest@example.com as email, select Guest as role, and click Send Invitation, the modal should close with a success toast saying Invitation sent to guest@example.com.

The new member should appear in the User Management members list with the role Guest and status showing as Active for demo purposes. In the real app this would be Pending, but for the prototype show them as Active so we can test role-based permissions.

ISSUE 4: DASHBOARD COMPONENTS DON'T SHOW REAL DATA
The Recent Activity bar and Active Rooms bar on the Dashboard tab are currently empty or static. They need to be connected to the actual actions and device states in the app.

Fix Recent Activity Bar
The Recent Activity section on the Dashboard should show the 3 to 5 most recent actions performed anywhere in the app. Every time I interact with a device in the Control tab, that action should create a new entry that appears both here and in the full History tab.

Create a shared activity log that records every action. When I perform these actions, create corresponding log entries:

When I turn ON the Living Room Light, create a log entry showing:

Time: just now

Icon: light bulb icon

Description: You turned on Living Room light

Result: green checkmark for success

When I turn OFF the Bedroom Fan, create a log entry showing:

Time: just now

Icon: fan icon

Description: You turned off Bedroom fan

Result: green checkmark

When I adjust Living Room Fan speed to 3, create a log entry showing:

Time: just now

Icon: fan with speed lines

Description: You set Living Room fan to speed 3

Result: green checkmark

When I change Living Room RGB light to purple, create a log entry showing:

Time: just now

Icon: RGB icon

Description: You changed Living Room RGB to purple

Result: green checkmark

The Recent Activity bar on Dashboard should show these entries in reverse chronological order with the newest first. It should show only the 5 most recent entries. At the bottom of the bar, add a View All link that would navigate to the full History tab.

Fix Active Rooms Bar
The Active Rooms section on the Dashboard should show all rooms that have devices, with a summary of each room's key devices and their current states.

Create room cards for:

Living Room: show Living Room Light status (ON or OFF), Living Room Fan status with speed, and temperature reading

Bedroom: show Bedroom Light status and temperature reading

Kitchen: show Kitchen Light status

Office: show Office Light status (once added)

Each room card should show the room name, a small icon, and 2 to 3 key device summaries. For the Living Room, display:

Light bulb icon with ON or OFF text in green or gray

Fan icon with speed level or OFF

Thermometer icon with temperature like 24.5°C

When I change any device state in the Control tab, the corresponding room card on Dashboard should update immediately. If I turn ON the Kitchen Light in Control, the Kitchen card should instantly show the light as ON with a green indicator.

Make the room cards clickable. Clicking a Living Room card should navigate to the detailed Living Room view in the Room tab, showing all devices in that room with their current states.