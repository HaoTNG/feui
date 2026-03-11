Hello Figma AI, I need you to fix multiple issues and add new features to my smart home web application. Please follow these instructions carefully to update the design and functionality.

PART 1: SIDEBAR TOGGLE FUNCTIONALITY
Add a toggle button that can collapse and expand the left sidebar. This will give users more screen space when they want to focus on content.

Create a new button positioned at the top of the sidebar, near the logo or user avatar. The button should have a double arrow icon pointing left when the sidebar is expanded, and pointing right when the sidebar is collapsed. When I click this button, the sidebar should smoothly animate to a collapsed state showing only icons without labels, and the main content area should expand to fill the extra space. When I click again, it should expand back to the full sidebar with labels visible.

The collapsed sidebar should still show all navigation icons but with tooltips that appear on hover showing the page names. The user avatar in the collapsed state should show only the avatar image without the name and dropdown arrow. The logo should be hidden or replaced with a smaller icon version.

Make sure this sidebar state persists across all pages. If I collapse the sidebar on the Dashboard page and navigate to the Control page, it should remain collapsed. The toggle state should be remembered for the entire session.

PART 2: FIX NOTIFICATION DROPDOWN POSITION
The notification dropdown currently appears aligned to the left of the bell icon, which causes it to overlap with the sidebar. This needs to be completely repositioned.

Change the notification dropdown to align to the right side of the bell icon instead of the left. The dropdown should appear anchored to the right edge of the bell icon and expand toward the left, so it floats over the main content area rather than over the sidebar. Add a small arrow pointing up from the bell icon to the dropdown to visually connect them.

The dropdown should have a minimum width of 360 pixels to show notification content comfortably. Add a subtle shadow and border radius to make it stand out from the background. Make sure the z-index is high enough (at least 70) to appear above all other content including the sidebar.

When I click the bell icon, any existing notification dropdown should close first before opening the new one. Clicking outside the dropdown should close it.

PART 3: CONNECT ROOM TAB TO DEVICE STATE CHANGES
The Room tab currently shows device states that don't update when devices are controlled from the Control tab. This needs to be fixed so all views reflect the same device states.

Every device in the system should have a single source of truth for its state. When I toggle the Living Room light to ON in the Control tab, that change should immediately reflect everywhere the Living Room light appears including in the Room tab's detailed view, in the Dashboard's Active Rooms section, and anywhere else the device is shown.

Create a global state simulation where all device states are synchronized across the entire prototype. When I click the On button for any device in any location, every instance of that device in the entire app should update to show the On state with a green indicator. When I adjust a brightness slider, every instance showing that device's brightness should update to the new value.

Test this by having the Living Room light appear in multiple places. In the Control tab under Living Room section, in the Room tab when I click into Living Room details, and in the Dashboard's Active Rooms section. Turning it on in any of these locations should update all others simultaneously.

PART 4: FIX OWNER'S TAB MODAL AND ADD FUNCTIONALITY
The Add Device, Add Room, and Add Member modals are currently buggy with full-screen overlays that don't work properly. After adding items, they don't appear in the dashboard. Redesign the entire modal experience.

Fix the Modal Design
Create new modal components that appear centered on the screen with a semi-transparent backdrop behind them. The backdrop should be black with 50 percent opacity and should cover the entire screen behind the modal. The modal itself should be white with rounded corners, a subtle shadow, and a maximum width of 500 pixels. It should have a close button in the top right corner.

When the modal opens, the background content should be visible but dimmed and not interactive. Clicking the backdrop should close the modal without taking any action. The modal should animate in with a slight scale and fade effect.

Fix Add Device Flow
When I click Add Device in the Device Management page, the modal should open with two tabs for QR Code and Manual Entry. In the Manual Entry tab, include fields for Device ID as a text input, Device Type as a dropdown with options like Light, Fan, RGB Light, Temperature Sensor, Humidity Sensor, and Motion Sensor. Then a Room dropdown showing all existing rooms, with an option for Assign to room later. Add a blue Add Device button and a gray Cancel button.

After I fill in the fields and click Add Device, the modal should close and a success toast notification should appear saying Device added successfully. The new device should immediately appear in the Control tab under the selected room, in the Room tab's detailed view for that room, and in the Device Management list.

Create a sample new device called Office Light of type Light assigned to the Office room to test this flow. When added, it should show up in all relevant locations with an Off state by default.

Fix Add Room Flow
When I click Add Room in the Room Management page, open a simpler modal with just a Room Name field and optional Room Icon selector with preset icons like living room, bedroom, kitchen, and office. Add a blue Create Room button.

After creating a room, it should appear in the Room Management grid, in the room selector dropdowns throughout the app when adding devices, and in the Dashboard's Active Rooms section if it has any devices.

Create a sample new room called Home Office to test this flow.

Fix Invite Member Flow
When I click Invite Member in the User Management page, open a modal with Email field and Role dropdown containing Owner, Family, and Guest options. Add a message saying An invitation email will be sent to this address. Include a blue Send Invitation button.

After sending, the new member should appear in the members list with a Pending status until they accept. For demo purposes, show them as Active with their selected role.

Create a sample new member with email guest@example.com and role Guest to test this flow.

PART 5: CONNECT DASHBOARD COMPONENTS TO ACTUAL DATA
The Dashboard tab currently shows empty Recent Activity and static Active Rooms that don't update based on actions. Fix both of these.

Fix Recent Activity Bar
The Recent Activity section on the Dashboard should show the most recent 3 to 5 activities from the full Activity Log. Every time I perform an action in the Control tab like turning on a light or adjusting a fan speed, that action should immediately appear in both the full Activity Log and the Dashboard's Recent Activity section.

Create a shared activity data source that all views pull from. When I turn on the Living Room light, a new activity entry should be created with the time stamp just now, an icon showing a light bulb, the text You turned on Living Room light, and a green success indicator. This entry should appear at the top of the Recent Activity list on the Dashboard and also at the top of the full Activity Log in the History tab.

The Recent Activity section should show a maximum of 5 most recent entries and include a View All link at the bottom that navigates to the full History tab.

Fix Active Rooms Section
The Active Rooms section on the Dashboard should show real-time device states for each room. When I turn on devices in the Control tab, the corresponding room cards on the Dashboard should update immediately.

For each room card, show a summary of key devices. The Living Room card should show the state of the Living Room light, the fan, and the temperature reading. When I toggle the light on in Control, the Living Room card should instantly show the light as On with a green dot.

Make the room cards clickable. Clicking a room card should navigate to the detailed room view in the Room tab, showing all devices in that room with their current states.

PART 6: APPLY ALL VISUAL ENHANCEMENTS
Now transform the entire app's appearance based on the color recommendations to make it more visually appealing.

Update Color Palette
Add new color variables to the theme including primary light in a soft blue, primary dark in a deeper blue, and primary soft as a very light blue background. Add accent purple with hex code 8B5CF6 and accent purple light with EDE9FE. Add accent teal with 14B8A6 and accent teal light with CCFBF1.

Create gradient variables including a primary gradient that goes from blue to purple, a success gradient from green to teal, and a sunset gradient from amber to red.

Add shadow variables including card shadow with subtle depth and card shadow hover with a blue tint for interactive elements.

Enhance Device Cards
Redesign all device cards with device-specific styling. Light device cards should have a warm amber-tinted background and a glowing effect when turned on. Fan device cards should have a cool blue-tinted background. Temperature sensor cards should have a subtle red gradient. Each card should have a colored left border matching its device type.

Add status dots with animations. Online devices should have a green dot that pulses gently. Offline devices should have a gray dot without animation.

Add hover effects to all cards. When hovering, cards should lift slightly with a smooth transition and the device icon should scale up a bit.

Improve Typography
Update heading styles to create better visual hierarchy. Main page titles should use the primary gradient for color and have slightly negative letter spacing. Section headers should have a left border in the primary color and include a View All link on the right that animates on hover.

Add Ambient Backgrounds
Add subtle gradient orbs to the background. A blue orb should appear in the top right corner with very low opacity. A green orb should appear in the bottom left corner. These should be fixed position and not interfere with content.

Create Glass Morphism Effects
For the guest dashboard, use glass morphism with backdrop blur on cards to make them stand out against the gradient background. The guest countdown timer should have a semi-transparent background with blur.

Add Micro-interactions
All buttons should have hover effects that lift them slightly. Click effects should include a ripple animation. Toggle switches should have smooth transitions between states. Sliders should show a glowing effect on the filled portion when dragged.

Visual Permission Indicators
For Family members viewing automation rules, add a small View Only badge in the top right corner of each rule card. For Guest users, add a green Guest Access badge to rooms they're allowed to control. Hide all restricted elements completely rather than just disabling them.

PART 7: CREATE THE COMPLETE PROTOTYPE FLOW
Connect all screens with proper navigation. Start from the login screen with Owner credentials pre-filled for demo purposes. After login, show the Dashboard with all the enhanced visual elements.

Test the sidebar toggle across all pages. Test notification dropdown positioning. Test device state synchronization between Control tab, Room tab, and Dashboard. Test all add modals to ensure they work properly and added items appear everywhere they should. Test the activity logging system to ensure every action creates a log entry in both places.

Create a dark mode toggle in the user settings that switches the entire prototype between light and dark themes instantly using the dark mode color variables.

Add a role switcher in Settings that lets you switch between Owner, Family, and Guest roles to test all permission levels. When switching to Guest, the interface should simplify to the single-page guest dashboard with only allowed rooms visible. When switching to Family, automation rules should become read-only with the View Only badge. When switching to Owner, everything should be fully accessible.

PART 8: ADD REALISTIC SAMPLE DATA
Populate the app with realistic sample data to demonstrate all features:

Create a family with Owner named John, Family member named Sarah, and Guest named Visitor.

Create rooms including Living Room with 5 devices, Bedroom with 3 devices, Kitchen with 2 devices, and Office with 2 devices.

Create devices including Living Room Light that's RGB capable, Living Room Fan with 3 speed settings, Living Room Temperature Sensor, Bedroom Light, Bedroom Fan, Kitchen Light, and Office Light.

Create sample automation rules including If temperature exceeds 30 degrees then turn on Living Room fan, and If motion detected after sunset then turn on Living Room light at 50 percent brightness.

Create sample activity log entries with various timestamps including actions from today, yesterday, and last week to demonstrate the date filtering.

Create sample notifications including motion detected alerts, temperature warnings, and device offline alerts with some marked as read and some unread.

FINAL CHECKLIST
Before completing, verify that:

Sidebar toggle works on all pages and persists state

Notification dropdown appears to the right, not overlapping sidebar

Device states are synchronized between Control tab, Room tab, and Dashboard

Add Device modal works and new device appears everywhere

Add Room modal works and new room appears in all dropdowns

Invite Member modal works and new member appears in members list

Recent Activity on Dashboard shows real actions from Control tab

Active Rooms on Dashboard updates when device states change

All visual enhancements are applied consistently

Dark mode toggle switches entire theme

Role switcher changes permissions and UI appropriately

Guest dashboard shows simplified interface with time-limited access

Family automation rules show read-only with badge

All modals have proper backdrop and close functionality

The app should now feel responsive, visually appealing, and fully functional with all features working together seamlessly.