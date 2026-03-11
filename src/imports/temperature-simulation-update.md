Hello Figma AI, I need you to fix three specific problems in my smart home web application. Please follow these precise instructions to update the design and functionality.

TASK 1: FIX TEMPERATURE SIMULATION TO WORK PROPERLY WITH AUTOMATION AND MAKE IT EASILY REMOVABLE LATER

Step 1: Understand the Current Problem
The temperature simulation control currently exists but doesn't actually apply the simulated temperature to the real-time system. When I move the slider to 30 degrees, the temperature display changes but the automation rules don't trigger based on this new value. Also, when I navigate away from the dashboard and come back, the simulated value resets. This makes it impossible to test if automation rules are working correctly.

Step 2: Redesign the Temperature Simulation Control
Locate the temperature reading on the main dashboard, likely inside a sensor card showing temperature, humidity, and other readings. Next to the current temperature value, you'll see a small gear icon or slider icon that expands a control panel. Remove that entire existing control and replace it with this new implementation.

Create a new temperature simulation panel that appears directly below the temperature reading when I click a new "Test Mode" button. The button should be a small pill-shaped toggle located to the right of the temperature value, labeled "Test" with a small flask icon.

When I click this Test button, expand a panel downward with these components:

At the top of the panel, add a switch labeled "Enable Simulation Mode" with the switch defaulting to OFF. The switch should use the app's primary blue color when turned ON.

Below the switch, when Simulation Mode is ON, reveal additional controls:

Add a temperature slider ranging from 15 degrees Celsius to 35 degrees Celsius. The slider track should be 300 pixels wide, with the primary blue color filling the track up to the current value. Above the slider thumb, display the current selected value in a bubble with white text on blue background, 28pt font weight 600 showing the number and a small degree symbol and C.

Below the slider, add plus and minus buttons on either side of a readout showing the current value. The plus and minus buttons should be circular with 36 pixel diameter, gray outline, and when clicked they increase or decrease the value by 0.5 degrees.

Below these controls, add a small note in italic gray text: "Simulated values override real sensor data for testing purposes only."

Step 3: Connect Simulation to Global Temperature State
Create a unified temperature state system that works throughout the prototype. There are three temperature sources in the app:

Real sensor data (default): showing 24.5 degrees in Living Room, 23.2 degrees in Bedroom

Simulated data: user-defined value when simulation is enabled

Override indicator: visual cue that simulation is active

When Simulation Mode is turned ON with a value of 30 degrees, EVERY temperature display in the entire app should update to show 30 degrees:

The main temperature reading on the dashboard should change to 30 degrees with a purple color instead of the normal blue

Add a small pill badge next to the temperature that says "Simulating" with a purple background and white text

The Living Room temperature sensor card should show 30 degrees with the same purple color and badge

The Bedroom temperature sensor card should show 30 degrees with the same purple color and badge

Any other room with a temperature sensor should show 30 degrees

The temperature value used by automation rules should visually appear as 30 degrees

Step 4: Connect Simulation to Automation Rules
Navigate to the Automation tab where IF-THEN rules are displayed. Create a sample automation rule for testing:

Rule name: "High Temperature Alert"
Condition: IF temperature exceeds 28 degrees
Action: Send notification and turn on Living Room fan

When Simulation Mode is OFF and real temperature is 24.5 degrees, this rule should show as "Inactive" or "Conditions not met" with gray status.

When I turn Simulation Mode ON and set temperature to 30 degrees (above 28), this rule should immediately show as "Active" or "Conditions met" with green status. The Living Room fan card anywhere in the app should automatically turn ON to reflect the rule action. The fan icon should show as spinning with speed set to medium, and the fan card should have a blue tint background indicating it's ON.

Create another rule for testing:

Rule name: "Low Temperature Alert"
Condition: IF temperature drops below 20 degrees
Action: Send notification

When I set simulation to 18 degrees, this rule should activate and the previous high temperature rule should deactivate. The fan should turn OFF automatically.

Step 5: Make Simulation State Persistent
When I navigate from the Dashboard to the Control tab and back to Dashboard, the simulation settings should remain as I set them. If I set Simulation Mode to ON with 30 degrees, go to Room Management, then come back to Dashboard, the temperature should still show 30 degrees with the purple badge.

Add a small indicator somewhere in the header, maybe near the user profile, that shows "Test Mode Active" with a purple dot when simulation is enabled. This reminds me that I'm viewing simulated data.

Step 6: Design for Easy Removal Later
Create a clear separation between simulation code and real sensor code that will make it easy for developers to remove later.

Add a comment layer attached to the simulation panel that says: "FOR DEMO PURPOSES ONLY - DELETE THIS ENTIRE PANEL AND ALL SIMULATION REFERENCES WHEN CONNECTING TO REAL IOT SYSTEM"

Create a single source of truth for temperature data that can be toggled. Design it as a variable layer that developers can understand: either use "realSensorData" or "simulatedData" as the active source. When they're ready to connect to real IoT, they can simply delete the simulation toggle and all simulation-related UI components, and the app will default to using only real sensor data.

Wrap all simulation-specific UI elements in a clearly marked group called "DEMO-SIMULATION-REMOVE-LATER" so developers can delete the entire group at once.

TASK 2: FIX DARK MODE FOR USER PROFILE WINDOW

Step 1: Identify the Current Problem
Currently, when dark mode is enabled globally, the user profile window that appears when clicking on the profile picture or name shows incorrect colors. The background is white (should be dark gray) and the text is black (should be light gray or white). This breaks the dark mode consistency.

Step 2: Redesign User Profile Dropdown for Dark Mode
Locate the user profile element in the top header or sidebar bottom. When I click on the profile picture or name, a dropdown panel appears. Redesign this entire panel with proper dark mode support.

The profile dropdown should have these specifications in both modes:

In Light Mode:

Background: white

Text color: dark gray #1F2937

Border: light gray with 10 percent opacity

Shadow: subtle with Y offset 4px, blur 12px, black at 10 percent opacity

Hover states: light gray background at 5 percent opacity

In Dark Mode:

Background: dark gray #1F2937

Text color: light gray #F9FAFB

Border: white with 10 percent opacity

Shadow: subtle with Y offset 4px, blur 12px, black at 30 percent opacity

Hover states: white background at 5 percent opacity

Step 3: Design the Profile Dropdown Content
The dropdown should have these elements with proper dark mode styling:

At the top, show the user's profile picture, 48 by 48 pixels, circular with a border of 2 pixels in light gray for light mode and white with 20 percent opacity for dark mode.

Next to the profile picture, show:

User name: "John Smith" in 16pt weight 600

User role: "Owner" in 12pt with 60 percent opacity, with a small badge icon

Add a divider line that in light mode is light gray, in dark mode is white with 10 percent opacity.

Below the divider, add menu items:

"View Profile" with a user icon

"Account Settings" with a gear icon

"Notification Preferences" with a bell icon

"Dark Mode Toggle" with sun/moon icon

Each menu item should have:

Icon on the left, 18 by 18 pixels

Text label

Right arrow icon on the right for items that navigate to another page

Hover state with background color at 10 percent opacity (light gray in light mode, white in dark mode)

Add another divider, then:

"Help & Support" with question mark icon

"Sign Out" with logout icon, using red text and red icon at 80 percent opacity

Step 4: Test Dark Mode Switching
Create a dark mode toggle switch somewhere in the app, probably in Settings or in this profile dropdown. When I flip this switch from light to dark, the entire app interface should change colors accordingly. The profile dropdown specifically should transform from white background with dark text to dark background with light text. All icons should also invert appropriately or use the correct color variables.

The transition between modes should be smooth with a 0.2 second ease-in-out animation on all color properties.

TASK 3: FIX USER PROFILE SAVE FUNCTIONALITY AND IMAGE UPLOAD

Step 1: Redesign the Full Profile Page
When I click "View Profile" from the dropdown, it should navigate to a full Profile Settings page. Create this page with these specifications:

Page title "Profile Settings" at the top left in 24pt weight 600.

Below the title, create a two-column layout:

Left column: Profile photo section (30 percent width)

Right column: Personal information form (70 percent width)

Step 2: Design Profile Photo Upload Section
In the left column, create a profile photo card with:

Current profile photo displayed large at 160 by 160 pixels, circular

Below the photo, a "Change Photo" button with camera icon, using primary blue outline style, padding 8 pixels 16 pixels, border radius 20 pixels

Below the button, small helper text "Click to upload. JPG, PNG or GIF. Max 2MB" in 12pt with 50 percent opacity

Make the "Change Photo" button functional in the prototype. When clicked, it should open a file upload simulation:

Create a simple modal that appears saying "Select an image to upload" with:

A square area showing image preview (initially empty with a camera icon)

"Choose File" button that simulates selecting a file

"Upload" button in primary blue

"Cancel" button in gray outline

For demo purposes, when I click "Choose File" and then "Upload", the modal should close and the large profile photo on the profile page should change to a new sample image. Provide 3-4 sample profile photos in the design assets that I can cycle through to demonstrate this functionality. Label these as "demo-avatar-1.png", "demo-avatar-2.png", etc.

After changing the photo, a green success toast notification should appear at the top right saying "Profile photo updated successfully".

Step 3: Design Personal Information Form
In the right column, create a form card with these fields:

Full Name field:

Label: "Full Name" in 14pt weight 500

Input field: white background in light mode, dark gray in dark mode, border radius 8 pixels, padding 12 pixels, border light gray

Default value: "John Smith"

Placeholder: "Enter your full name"

Email Address field:

Label: "Email Address"

Input field with default value "john.smith@example.com"

Field should be disabled/locked with a lock icon on the right since email cannot be changed

Helper text below: "Email cannot be changed" in 12pt gray

Phone Number field:

Label: "Phone Number"

Input field with default value "+1 (555) 123-4567"

Placeholder: "Enter your phone number"

Role field:

Label: "Your Role"

Display-only field showing "Owner" with a badge icon, since role is assigned by system

Time Zone field:

Label: "Time Zone"

Dropdown selector showing "(GMT-08:00) Pacific Time" as selected value

When clicked, shows a dropdown with common time zones

Language field:

Label: "Language"

Dropdown selector showing "English (US)" as selected value

Step 4: Make Form Fields Save Properly
Create a working form prototype where changes persist. When I edit the Full Name field from "John Smith" to "Jonathan Smith", and click the "Save Changes" button at the bottom of the form, several things should happen:

First, a green success toast notification appears at the top right saying "Profile updated successfully".

Second, the name "Jonathan Smith" should now appear everywhere in the app:

In the profile dropdown next to the profile picture

In the welcome banner on the dashboard that says "Welcome back, Jonathan"

In the profile page itself showing the updated name

In any other location that displays the user's name

Third, if I navigate away from the profile page to Dashboard or Control tab and then come back to Profile, the name should still show as "Jonathan Smith", not revert to the original.

Test the same for Phone Number. When I change from "+1 (555) 123-4567" to "+1 (555) 987-6543" and click Save, the new number should display consistently and persist through navigation.

Step 5: Add Form Validation Feedback
Add real-time validation indicators:

For Full Name field:

If I delete the entire name, show a red error message below the field: "Name is required"

The field border should turn red

The Save button should be disabled until valid

For Phone Number field:

If I enter letters instead of numbers, show a red error message: "Please enter a valid phone number"

The field border should turn red

The Save button should be disabled until valid

When all fields are valid, the Save button should be enabled with primary blue background. When clicked, it should show a loading state with a spinner for 1 second before showing the success toast.

Step 6: Add Cancel and Discard Functionality
Add a "Cancel" button next to Save that's gray outline style. If I make changes to any field and then click Cancel without saving, a small confirmation dialog should appear:

"Discard changes?" with:

"Keep Editing" button in gray outline

"Discard" button in red

If I click Discard, all fields should revert to their last saved values. If I click Keep Editing, the dialog closes and I continue editing.

Step 7: Ensure Dark Mode Works on Profile Page
Test that the entire profile page respects dark mode settings:

Form card background: white in light mode, dark gray in dark mode

Input field backgrounds: white in light mode, slightly lighter dark gray in dark mode

Text colors: dark in light mode, light in dark mode

Borders: light gray in light mode, white with 10 percent opacity in dark mode

Buttons: primary blue remains blue but adjust text color as needed

Error states: red remains red but ensure good contrast in dark mode

The profile photo upload modal should also respect dark mode with appropriate background and text colors.