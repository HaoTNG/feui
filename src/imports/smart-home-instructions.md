Ahhh! Now I understand perfectly! You want me to **roleplay as a human giving pure text instructions to Figma AI** to build the entire smart home webapp. No tables, no code blocks, just natural language commands.

Got it! Here we go...

---

# INSTRUCTIONS FOR FIGMA AI

Hello Figma AI, I need you to design a complete smart home web application based on my project requirements. Please follow these instructions carefully to create all the screens and components.

---

## FIRST, SET UP THE DESIGN SYSTEM

Please create a new Figma file called "Smart Home Web App" and set up the foundation.

Create a color palette with these exact colors. Use a blue as the primary brand color, something like a rich blue around hex 2563EB. For success states like when devices are turned on, use a vibrant green like 10B981. For warning states and alerts, use an amber yellow like F59E0B. For danger states like errors or the off position, use a red like EF4444. For all the neutral colors, create a scale from white all the way to almost black. The background of the app should be a light gray, something like F9FAFB. Cards and containers should be white with subtle shadows. Text should be dark gray, not pure black, for better readability. Also create status indicator colors, a bright green for online devices and a medium gray for offline devices.

Now set up the typography. Use the Inter font family throughout the entire app because it's clean and modern. For the largest headlines, make them 32 pixels bold and dark gray. Section titles should be 24 pixels bold. Card titles should be 20 pixels semibold. Body text for most content should be 16 pixels regular. For smaller text like timestamps and metadata, use 14 pixels with a lighter gray color. Button labels should be 14 pixels medium weight and white.

Create a consistent spacing system. Use multiples of 4 pixels for everything. The main content area should have padding of 24 pixels on each side. Cards should have padding of 20 pixels inside. Between sections, use 32 pixels of spacing. Between related items inside a card, use 16 pixels. Between elements in a list, use 12 pixels. Icons should be 24 by 24 pixels for most actions, and 20 by 20 for smaller indicators.

Design some core components that we'll reuse everywhere. Create a button component with three states, default, hover, and disabled. The primary button should be blue with white text. A secondary button should have a white background with a gray border and dark text. A danger button for delete actions should be red with white text. All buttons should have rounded corners of 8 pixels.

Create card components with a white background, a subtle shadow, and rounded corners of 12 pixels. Cards can have headers with titles and optional action buttons. The content inside should have consistent padding.

Create form elements. Input fields should have a light gray border, rounded corners of 8 pixels, and padding of 12 pixels inside. When focused, the border should turn blue. Add placeholder text in a lighter gray. Checkboxes and radio buttons should be custom styled in the primary blue color. Dropdown selects should match the input field styling.

Now create the navigation components. A sidebar navigation that runs vertically on the left side of the app. It should be white with a subtle right border. Each navigation item should have an icon and a label. The active item should have a light blue background and the primary blue icon and text. Inactive items should be gray. At the bottom of the sidebar, include a user menu with the user's avatar, name, and a dropdown arrow.

A top header bar should contain the current page title on the left, and on the right, a notifications icon with a badge showing unread count, and the user avatar. The header should have a light bottom border.

---

## NOW DESIGN THE AUTHENTICATION SCREENS

Create a login screen first. The background should be a subtle gradient from light gray to white. Center a card in the middle of the screen that's about 400 pixels wide. At the top of the card, place the app logo and the words Smart Home. Below that, add a headline that says Welcome Back and a subheading that says Log in to your account.

Add an email input field with the label Email and placeholder text of your email address. Below that, add a password input field with the label Password and placeholder of your password. Include a small eye icon inside the field on the right that toggles password visibility. Below the password field, add a row with a remember me checkbox on the left and a Forgot Password link on the right that's blue and clickable.

Add a large blue button that says Log In and fills the full width of the card. Below the button, add text that says Don't have an account with a Sign Up link next to it in blue.

Now create the registration screen. It should have a similar layout but with more fields. Include fields for full name, email address, password, and confirm password. Add password requirements text in small gray font below the password field, showing that the password must be at least 8 characters and include a number. Add a checkbox for agreeing to the terms of service and privacy policy. Then a full width button that says Create Account. At the bottom, add text saying Already have an account with a Log In link.

Create a forgot password screen with just an email field and a Send Reset Link button. Also create a reset password screen with new password and confirm password fields.

---

## DESIGN THE MAIN DASHBOARD SCREEN

This is the home screen that FE1 will handle, but we need it for context. After login, the user lands on the dashboard. The sidebar is visible on the left with icons for Dashboard, Devices, Control, History, Rooms, and Settings. Dashboard is highlighted as active.

The main content area starts with a header that says Good morning, [User Name] with today's date below it. Below the header, create a summary row of environmental metrics. Design four small cards side by side. The first shows temperature with a large thermometer icon, the current temperature in big bold text like 24.5°C, and a small indicator like Feeling warm. The second shows humidity with a water drop icon, 65% humidity, and Normal range. The third shows light level with a sun icon, 450 lux, and Bright. The fourth shows air quality with a leaf icon, 42 AQI, and Good.

Below the metrics row, create a section called Active Rooms. Display three room cards in a row. Each room card shows the room name like Living Room at the top, a small illustration or icon of a room, and then three device summaries stacked vertically. For the living room, show a light bulb with the text Living Room Light and an on indicator in green. Show a fan with Fan and speed level 2. Show a temperature sensor with 24.5°C. Each device row should have a small icon and the status.

Below the rooms section, create a recent activity feed. Title it Recent Activity with a View All link on the right. Then show a list of activities with icons. Each activity row should have a time stamp like 10 minutes ago, an icon representing the action, and descriptive text like You turned on the Living Room light. Use different icons for different action types. Also include automated activities like Temperature exceeded 30°C with a warning icon in yellow.

---

## DESIGN THE DEVICE CONTROL SCREEN

This is your main screen as FE2. Create a new page called Device Control. The sidebar remains with Control now highlighted as active. The main header should say Device Control with a small description saying Manage and control all your smart devices.

Below the header, create a room selector as a row of pills or chips. The first pill should be All Devices selected in blue. Then pills for each room, Living Room, Bedroom, Kitchen, and Office in gray. When clicked, they would filter the devices below.

Now create the device grid. Use a three column layout for device cards. Each device card should be a white card with rounded corners and a subtle shadow.

Design the light bulb card first. At the top left, have an icon of a light bulb. At the top right, show the room name like Living Room in small gray text. The main content shows the device name as Living Room Light in bold. Below that, show the current status as On with a green dot next to it. Below the status, include a brightness slider that shows 80% with a sun icon on the left and a sun icon on the right. The slider track should be light gray with the left portion filled in blue to 80%. At the bottom of the card, have two buttons side by side, an On button in blue and an Off button in gray outline.

Design the fan card similarly but with fan specific controls. Fan icon at top, room name at top right, device name as Bedroom Fan, status showing On with speed level 2. Instead of a brightness slider, show a speed slider with a fan icon on left and a fan with waves icon on right. The slider filled to 40% for medium speed. Below that, show three speed preset buttons, Low, Medium, High, with Medium highlighted in blue. Bottom buttons for On and Off.

Design the RGB light card which is more complex. RGB icon at top, room name, device name as Living Room RGB. Status showing On. Below that, show the current color as a small circle filled with purple and the text Purple. Then show a color picker area that's a gradient square of all colors, with a circular handle that can be dragged. Below the color picker, show brightness slider. At the bottom, On and Off buttons.

Design the sensor cards which are different because they can't be controlled, only monitored. For the temperature sensor card, use a thermometer icon, room name, device name as Temperature Sensor. Show the current reading as 24.5°C in large bold text. Below that, show a mini temperature chart that just shows a simple line graph of recent readings. Add min and max indicators for the day, like Min 22°C and Max 26°C.

Do similar sensor cards for humidity showing percentage, and light sensor showing lux with a small sun icon.

Make sure every card has consistent padding, typography, and spacing. When a device is offline, the card should look different. Create an offline version of the light card where the bulb icon is gray, the status shows Offline with a gray dot, and all controls are disabled and grayed out with a message saying Device not responding.

---

## DESIGN THE ACTIVITY LOG SCREEN

This is your second main screen as FE2. Create a new page called Activity Log. The sidebar has History highlighted as active. The header says Activity Log with a description showing View all device activities and system events.

Above the log list, create a filter bar. Start with a date range selector that looks like a button showing This Week with a calendar icon and a dropdown arrow. Next to it, add a device filter dropdown showing All Devices. Then add an action type filter showing All Actions. These filters allow users to narrow down the log entries.

Below the filters, add a search bar with a search icon and placeholder text saying Search activities.

Now design the log entries as a timeline. Each day should have a date header like Today, March 25, 2024 in bold with a light gray line extending to the right. Below the date header, show each log entry for that day.

Each log entry should be a white card with a left border colored based on the action type. For user actions, use a blue border. For system events, use a gray border. For alerts and warnings, use a yellow border. For errors, use a red border.

Inside the log card, arrange the content in a row. On the far left, show the time like 03:45 PM in small gray text. Next to that, show an icon representing the action, a person icon for user actions, a robot icon for automation, a warning icon for alerts. Then the main content showing what happened, like You turned on the Living Room light. In smaller text below, show additional details like via Mobile App. On the far right, show the result with a checkmark icon in green for success or an x icon in red for failure.

Create a sample of different log types. A user action log showing John turned off the Bedroom fan. An automation log showing Auto rule Temperature > 30°C triggered fan ON. An alert log showing Motion detected in Living Room at 03:42 AM. A system log showing Device Bedroom sensor went offline. A threshold alert showing Temperature exceeded 30°C with a warning icon.

At the bottom of the page, add pagination controls with Previous and Next buttons and page numbers.

---

## DESIGN THE DEVICE MANAGEMENT SCREEN FOR ADMIN

Create a new page called Device Management. This is for FR-08 and FR-09 where admins add and remove devices. The header says Device Management with an Add Device button in blue on the right side.

Below the header, show tabs for All Devices and Unassigned Devices. All Devices is selected by default.

The main area shows a table or card grid of all devices. If using a table, columns should include Device Name, Type, Room, Status, Added Date, and Actions. In the Actions column, have an edit icon and a delete icon in red.

When the admin clicks the Add Device button, a modal dialog should appear. Title it Add New Device. The modal should have two tabs at the top, QR Code and Manual Entry. In the QR Code tab, show a large square area representing the camera view with a message saying Position QR code in frame. Below that, add a note saying Alternatively, you can enter Device ID manually.

In the Manual Entry tab, show a form with fields for Device ID as a text input with placeholder Enter device ID. Below that, a dropdown for Device Type with options like Light, Fan, Sensor, RGB Light. Then a dropdown for Room with all existing rooms listed. Add a checkbox that says Assign to room later if they want to leave it unassigned. At the bottom, a blue Add Device button and a gray Cancel button.

After adding a device, show a success message that appears as a toast notification in the top right corner saying Device added successfully with a green checkmark.

For deleting a device, when the admin clicks the red delete icon, show a confirmation modal. Title it Delete Device with a warning icon. The message should say Are you sure you want to delete Living Room Light? This action cannot be undone. At the bottom, a red Delete button and a gray Cancel button.

---

## DESIGN THE ROOM MANAGEMENT SCREEN

Create a new page called Room Management. The header says Rooms with an Add Room button in blue on the right. Below the header, show a grid of room cards.

Each room card should show the room name like Living Room at the top, a small icon, and the count of devices in that room like 8 devices. In the bottom corner, have an edit icon and a delete icon that appear on hover.

When clicking Add Room, show a simple modal with a field for Room Name and a blue Create Room button.

When editing a room, show a similar modal but with the name pre-filled and an update button.

When deleting a room that has devices, show a special modal warning that the room has devices. Ask the admin what to do with the devices, with radio buttons for Move all devices to another room and Move to unassigned. If choosing to move to another room, show a dropdown of other rooms. Then a red Delete Room button.

---

## DESIGN THE USER MANAGEMENT SCREEN

Create a page called User Management only visible to admins. The header says Manage Members with an Invite Member button in blue. Below the header, show a list of current members.

Each member row should show the user's avatar, name, email, role showing either Admin or Member with a colored tag, status showing Active or Pending, and actions with a remove member icon in red.

When clicking Invite Member, show a modal with an email field and a role dropdown defaulting to Member. Add a message saying An invitation email will be sent to this address. A blue Send Invitation button.

---

## DESIGN THE USER PROFILE SCREEN

Create a profile page accessible from the user menu. The header says My Profile. Below, show a two column layout. On the left, show the user's avatar large with a change photo link below it. On the right, show a form with fields for Display Name, Email, and Phone Number. Email should be disabled since it can't be changed. At the bottom, a blue Save Changes button.

Below that, create a separate Change Password section with fields for Current Password, New Password, and Confirm New Password. Add password requirements hint. A blue Update Password button.

---

## DESIGN RESPONSIVE BEHAVIOR

Now create artboards for different screen sizes. First duplicate the dashboard screen and create a tablet version at 768 pixels wide. On tablet, the sidebar should collapse to show only icons without labels. The metrics row should wrap to two rows with two cards each. The room cards should switch to two columns instead of three.

Create a mobile version at 375 pixels wide. On mobile, the sidebar should be hidden behind a hamburger menu icon in the top header. The metrics row should stack vertically with each card full width. Room cards should stack in a single column. The device control grid should switch to single column. Filters on the log screen should stack vertically with full width dropdowns.

---

## CREATE INTERACTIVE PROTOTYPE

Now connect all these screens with interactions. Start from the login screen, connect the login button to the dashboard screen. Connect the sign up link to the register screen. Connect the dashboard sidebar navigation to each corresponding screen. When clicking on a device card on the dashboard, navigate to the detailed control view for that device. When clicking the notifications icon, show a dropdown panel with recent notifications. When clicking the user avatar, show the profile menu with links to profile and logout.

For the control screen, make the toggle buttons interactive. When clicking the On button, the button should turn blue and the Off button should become gray outline. The status should update to On with a green dot. The slider should be draggable to change the percentage.

For the log screen, make the filters clickable showing dropdown menus. Make the load more button trigger additional log entries appearing.

---

## FINAL TOUCHES

Add all necessary icons throughout the app. Use a consistent icon set like Feather Icons or Material Icons. Make sure all interactive elements have hover states. Buttons should darken slightly on hover. Cards should have a subtle lift effect. Links should turn the primary blue color on hover.

Add placeholder content with realistic sample data. Use actual names like John's Home instead of just Home. Use real room names. Use realistic sensor values like 24.5°C that fluctuate slightly.

Add loading states for components that would fetch data. Show skeleton screens with animated gray gradients where content would load.

Add empty states for when no data exists. If a user has no devices yet, show a friendly illustration with a message saying No devices yet and a prominent Add Your First Device button.

---

That completes the entire smart home web application design. All screens follow the use cases and requirements provided, with special focus on the device control and activity log screens that FE2 is responsible for. The design system ensures consistency throughout, and the prototype interactions demonstrate how the app will work in real life.