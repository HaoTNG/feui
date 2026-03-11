import { useState } from "react";
import { Book, Wifi, Bell, Download, ChevronRight, Check } from "lucide-react";
import { useApp } from "../contexts/AppContext";

type GuidePage = "iot-connection" | "push-notifications" | "running-app";

export function Guide() {
  const { isDarkMode } = useApp();
  const [activePage, setActivePage] = useState<GuidePage>("iot-connection");

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className={`rounded-xl shadow-sm border sticky top-6 ${
            isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          }`}>
            <div className="p-4">
              <h2 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}>
                <Book className="w-5 h-5" />
                Documentation
              </h2>
              <nav className="space-y-1">
                <button
                  onClick={() => setActivePage("iot-connection")}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
                    activePage === "iot-connection"
                      ? "bg-blue-600 text-white"
                      : isDarkMode
                      ? "text-gray-300 hover:bg-gray-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Wifi className="w-4 h-4" />
                    IoT Connection
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setActivePage("push-notifications")}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
                    activePage === "push-notifications"
                      ? "bg-blue-600 text-white"
                      : isDarkMode
                      ? "text-gray-300 hover:bg-gray-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Bell className="w-4 h-4" />
                    Push Notifications
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setActivePage("running-app")}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
                    activePage === "running-app"
                      ? "bg-blue-600 text-white"
                      : isDarkMode
                      ? "text-gray-300 hover:bg-gray-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Running the App
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </nav>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          {activePage === "iot-connection" && <IoTConnectionGuide />}
          {activePage === "push-notifications" && <PushNotificationsGuide />}
          {activePage === "running-app" && <RunningAppGuide />}
        </div>
      </div>
    </div>
  );
}

function IoTConnectionGuide() {
  const { isDarkMode } = useApp();

  return (
    <div className={`rounded-xl shadow-sm border p-8 ${
      isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
    }`}>
      <h1 className={`text-3xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
        Connecting Your Smart Home Devices
      </h1>
      <p className={`mb-8 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
        Learn how to connect YoloBit IoT devices to your smart home web app
      </p>

      {/* Step 1 */}
      <Section title="Step 1: Set Up Your Hardware" number={1}>
        <StepContent>
          <p>Connect your YoloBit board and sensors:</p>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>Connect YoloBit to power using USB-C cable</li>
            <li>Attach DHT20 temperature/humidity sensor to appropriate pins</li>
            <li>Connect PIR motion sensor</li>
            <li>Connect light sensor</li>
            <li>Attach output devices (fan, LED, LCD display)</li>
          </ul>
        </StepContent>
      </Section>

      {/* Step 2 */}
      <Section title="Step 2: Configure WiFi on YoloBit" number={2}>
        <StepContent>
          <p className="mb-3">Update your code with WiFi credentials:</p>
          <CodeBlock>
{`import network

wlan = network.WLAN(network.STA_IF)
wlan.active(True)
wlan.connect("YourWiFiSSID", "YourWiFiPassword")

# Wait for connection
while not wlan.isconnected():
    pass

print("Connected to WiFi")
print("IP Address:", wlan.ifconfig()[0])`}
          </CodeBlock>
        </StepContent>
      </Section>

      {/* Step 3 */}
      <Section title="Step 3: Connect to Adafruit IO" number={3}>
        <StepContent>
          <p className="mb-3">Set up MQTT connection with Adafruit IO:</p>
          <ol className="list-decimal list-inside space-y-2">
            <li>Create an Adafruit IO account at <code className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 rounded text-sm">io.adafruit.com</code></li>
            <li>Get your AIO key from the dashboard</li>
            <li>Use the provided username 'dadn50' and your AIO key</li>
          </ol>
          <CodeBlock>
{`from Adafruit_IO import MQTTClient

# Adafruit IO configuration
AIO_USERNAME = "dadn50"
AIO_KEY = "YOUR_AIO_KEY_HERE"

# Create MQTT client
client = MQTTClient(AIO_USERNAME, AIO_KEY)
client.connect()`}
          </CodeBlock>
        </StepContent>
      </Section>

      {/* Step 4 */}
      <Section title="Step 4: Create Feeds for Each Device" number={4}>
        <StepContent>
          <p className="mb-3">Create these feeds in your Adafruit IO dashboard:</p>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              <code className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm">temperature</code>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              <code className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm">humidity</code>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              <code className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm">light</code>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              <code className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm">pir</code> (motion)
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              <code className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm">fan</code>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              <code className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm">rgb_light</code>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              <code className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm">lcd_display</code>
            </li>
          </ul>
        </StepContent>
      </Section>

      {/* Step 5 */}
      <Section title="Step 5: Publish Sensor Data" number={5}>
        <StepContent>
          <p className="mb-3">Read sensor data and publish to Adafruit IO:</p>
          <CodeBlock>
{`import time
from dht20 import DHT20

# Initialize DHT20 sensor
dht20 = DHT20()

while True:
    # Read temperature and humidity
    temperature = dht20.read_temperature()
    humidity = dht20.read_humidity()
    
    # Publish to Adafruit IO
    client.publish("temperature", temperature)
    client.publish("humidity", humidity)
    
    # Wait 10 seconds before next reading
    time.sleep(10)`}
          </CodeBlock>
        </StepContent>
      </Section>

      {/* Step 6 */}
      <Section title="Step 6: Subscribe to Control Commands" number={6}>
        <StepContent>
          <p className="mb-3">Listen for commands from the web app:</p>
          <CodeBlock>
{`def message_handler(client, feed_id, payload):
    """Handle incoming MQTT messages"""
    if feed_id == "fan":
        if payload == "ON":
            turn_fan_on()
        elif payload == "OFF":
            turn_fan_off()
    elif feed_id == "rgb_light":
        # Parse color value and set RGB LED
        set_rgb_color(payload)

# Set message handler
client.on_message = message_handler

# Subscribe to control feeds
client.subscribe("fan")
client.subscribe("rgb_light")
client.subscribe("lcd_display")

# Start listening
client.loop_background()`}
          </CodeBlock>
        </StepContent>
      </Section>

      {/* Step 7 */}
      <Section title="Step 7: Data Flow Diagram" number={7}>
        <StepContent>
          <div className={`p-6 rounded-lg border-2 border-dashed ${
            isDarkMode ? "border-gray-600 bg-gray-700" : "border-gray-300 bg-gray-50"
          }`}>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className={`px-4 py-2 rounded-lg ${isDarkMode ? "bg-blue-900/30 text-blue-300" : "bg-blue-100 text-blue-900"}`}>
                  YoloBit + Sensors
                </div>
                <ChevronRight className="w-5 h-5" />
                <div className={`px-4 py-2 rounded-lg ${isDarkMode ? "bg-purple-900/30 text-purple-300" : "bg-purple-100 text-purple-900"}`}>
                  MQTT Protocol
                </div>
                <ChevronRight className="w-5 h-5" />
                <div className={`px-4 py-2 rounded-lg ${isDarkMode ? "bg-green-900/30 text-green-300" : "bg-green-100 text-green-900"}`}>
                  Adafruit IO
                </div>
                <ChevronRight className="w-5 h-5" />
                <div className={`px-4 py-2 rounded-lg ${isDarkMode ? "bg-orange-900/30 text-orange-300" : "bg-orange-100 text-orange-900"}`}>
                  Web App
                </div>
              </div>
              <div className="text-center">
                <span className="text-2xl">⬇️ ⬆️</span>
                <p className={`text-sm mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                  Bidirectional communication: sensors send data up, web app sends commands down
                </p>
              </div>
            </div>
          </div>
        </StepContent>
      </Section>

      {/* Step 8 */}
      <Section title="Step 8: Testing Your Connection" number={8}>
        <StepContent>
          <p className="mb-3">Verify everything is working:</p>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <input type="checkbox" className="mt-1" />
              <span>YoloBit shows "Connected" on LCD display</span>
            </li>
            <li className="flex items-start gap-2">
              <input type="checkbox" className="mt-1" />
              <span>Adafruit IO feeds show data updating in real-time</span>
            </li>
            <li className="flex items-start gap-2">
              <input type="checkbox" className="mt-1" />
              <span>Web app dashboard displays current sensor values</span>
            </li>
            <li className="flex items-start gap-2">
              <input type="checkbox" className="mt-1" />
              <span>Toggling devices in web app controls physical devices</span>
            </li>
            <li className="flex items-start gap-2">
              <input type="checkbox" className="mt-1" />
              <span>Automation rules trigger correctly based on sensor data</span>
            </li>
          </ul>
        </StepContent>
      </Section>
    </div>
  );
}

function PushNotificationsGuide() {
  const { isDarkMode } = useApp();

  return (
    <div className={`rounded-xl shadow-sm border p-8 ${
      isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
    }`}>
      <h1 className={`text-3xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
        Understanding Push Notifications
      </h1>
      <p className={`mb-8 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
        Learn how push notifications keep you updated about your smart home
      </p>

      <Section title="What Are Push Notifications?" number={1}>
        <StepContent>
          <p className="mb-4">
            Push notifications are alerts that appear on your device even when the app is closed. 
            They keep you informed about important events in your smart home.
          </p>
          <div className={`p-4 rounded-lg ${isDarkMode ? "bg-blue-900/20" : "bg-blue-50"}`}>
            <p className={`text-sm ${isDarkMode ? "text-blue-300" : "text-blue-900"}`}>
              <strong>Examples:</strong> Motion detected alerts, temperature warnings, device offline notifications
            </p>
          </div>
        </StepContent>
      </Section>

      <Section title="How Push Notifications Work" number={2}>
        <StepContent>
          <div className={`p-6 rounded-lg border-2 border-dashed ${
            isDarkMode ? "border-gray-600 bg-gray-700" : "border-gray-300 bg-gray-50"
          }`}>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-center">
                <div className={`px-4 py-2 rounded-lg ${isDarkMode ? "bg-blue-900/30 text-blue-300" : "bg-blue-100 text-blue-900"}`}>
                  IoT Device<br/>(Sensor Triggers)
                </div>
              </div>
              <ChevronRight className="w-5 h-5 hidden md:block" />
              <div className="text-center">
                <div className={`px-4 py-2 rounded-lg ${isDarkMode ? "bg-purple-900/30 text-purple-300" : "bg-purple-100 text-purple-900"}`}>
                  Cloud Server
                </div>
              </div>
              <ChevronRight className="w-5 h-5 hidden md:block" />
              <div className="text-center">
                <div className={`px-4 py-2 rounded-lg ${isDarkMode ? "bg-green-900/30 text-green-300" : "bg-green-100 text-green-900"}`}>
                  Firebase/APNS
                </div>
              </div>
              <ChevronRight className="w-5 h-5 hidden md:block" />
              <div className="text-center">
                <div className={`px-4 py-2 rounded-lg ${isDarkMode ? "bg-orange-900/30 text-orange-300" : "bg-orange-100 text-orange-900"}`}>
                  Your Phone
                </div>
              </div>
            </div>
          </div>
        </StepContent>
      </Section>

      <Section title="Types of Notifications" number={3}>
        <StepContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <NotificationExample
              title="Security Alerts"
              icon="⚠️"
              examples={[
                "Motion detected in Living Room while you're away",
                "Door opened at 2:30 AM"
              ]}
            />
            <NotificationExample
              title="Environmental Alerts"
              icon="🌡️"
              examples={[
                "Temperature exceeded 35°C in Bedroom",
                "Smoke detected in Kitchen"
              ]}
            />
            <NotificationExample
              title="Device Status"
              icon="💡"
              examples={[
                "Bedroom fan went offline",
                "Living Room light turned on by automation"
              ]}
            />
            <NotificationExample
              title="System Notifications"
              icon="ℹ️"
              examples={[
                "New member joined your home",
                "Automation rule 'Goodnight' activated"
              ]}
            />
          </div>
        </StepContent>
      </Section>

      <Section title="Notification Settings" number={4}>
        <StepContent>
          <p className="mb-4">Customize which notifications you receive:</p>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="w-4 h-4" />
              <span>Motion alerts</span>
            </li>
            <li className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="w-4 h-4" />
              <span>Temperature alerts</span>
            </li>
            <li className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="w-4 h-4" />
              <span>Device offline alerts</span>
            </li>
            <li className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" />
              <span>Automation notifications</span>
            </li>
            <li className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" />
              <span>Email notifications</span>
            </li>
          </ul>
        </StepContent>
      </Section>
    </div>
  );
}

function RunningAppGuide() {
  const { isDarkMode } = useApp();

  return (
    <div className={`rounded-xl shadow-sm border p-8 ${
      isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
    }`}>
      <h1 className={`text-3xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
        Running the Smart Home Web App Locally
      </h1>
      <p className={`mb-8 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
        Step-by-step guide to download and run the application on your computer
      </p>

      <Section title="Prerequisites" number={1}>
        <StepContent>
          <p className="mb-3">Make sure you have these installed:</p>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <Check className="w-5 h-5 text-green-500 mt-0.5" />
              <span>Node.js (version 16 or higher)</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-5 h-5 text-green-500 mt-0.5" />
              <span>npm or yarn package manager</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-5 h-5 text-green-500 mt-0.5" />
              <span>Git installed</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-5 h-5 text-green-500 mt-0.5" />
              <span>Code editor (VS Code recommended)</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-5 h-5 text-green-500 mt-0.5" />
              <span>Web browser (Chrome, Firefox, or Edge)</span>
            </li>
          </ul>
        </StepContent>
      </Section>

      <Section title="Step 1: Clone the Repository" number={2}>
        <StepContent>
          <CodeBlock>
{`git clone https://github.com/yourusername/smarthome-app.git
cd smarthome-app`}
          </CodeBlock>
        </StepContent>
      </Section>

      <Section title="Step 2: Install Dependencies" number={3}>
        <StepContent>
          <CodeBlock>
{`npm install
# or
yarn install`}
          </CodeBlock>
          <p className={`mt-3 text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            This installs all required packages including React, MQTT client, and UI libraries
          </p>
        </StepContent>
      </Section>

      <Section title="Step 3: Configure Environment Variables" number={4}>
        <StepContent>
          <p className="mb-3">Create a <code className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm">.env</code> file in the root directory:</p>
          <CodeBlock>
{`REACT_APP_ADAFRUIT_USERNAME=dadn50
REACT_APP_ADAFRUIT_KEY=your_aio_key_here
REACT_APP_MQTT_BROKER=io.adafruit.com
REACT_APP_MQTT_PORT=443
REACT_APP_API_URL=http://localhost:3001`}
          </CodeBlock>
          <p className={`mt-3 text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            Replace 'your_aio_key_here' with your actual Adafruit IO key
          </p>
        </StepContent>
      </Section>

      <Section title="Step 4: Start the Backend Server" number={5}>
        <StepContent>
          <p className="mb-3">Open a new terminal and run:</p>
          <CodeBlock>
{`cd backend
npm install
npm start`}
          </CodeBlock>
          <div className={`mt-3 p-3 rounded-lg ${isDarkMode ? "bg-green-900/20" : "bg-green-50"}`}>
            <p className={`text-sm ${isDarkMode ? "text-green-300" : "text-green-900"}`}>
              ✅ Expected output: "Backend server running on port 3001"
            </p>
          </div>
        </StepContent>
      </Section>

      <Section title="Step 5: Start the Frontend App" number={6}>
        <StepContent>
          <p className="mb-3">Open another terminal and run:</p>
          <CodeBlock>
{`npm start`}
          </CodeBlock>
          <div className={`mt-3 p-3 rounded-lg ${isDarkMode ? "bg-green-900/20" : "bg-green-50"}`}>
            <p className={`text-sm ${isDarkMode ? "text-green-300" : "text-green-900"}`}>
              ✅ Expected: "Compiled successfully! - http://localhost:3000"
            </p>
          </div>
        </StepContent>
      </Section>

      <Section title="Step 6: Open in Browser" number={7}>
        <StepContent>
          <p className="mb-3">Navigate to:</p>
          <div className={`p-4 rounded-lg text-center text-xl font-mono ${
            isDarkMode ? "bg-blue-900/30 text-blue-300" : "bg-blue-100 text-blue-900"
          }`}>
            http://localhost:3000
          </div>
        </StepContent>
      </Section>

      <Section title="Step 7: Login with Demo Credentials" number={8}>
        <StepContent>
          <div className="space-y-4">
            <div className={`p-4 rounded-lg ${isDarkMode ? "bg-purple-900/20 border border-purple-800" : "bg-purple-50 border border-purple-200"}`}>
              <p className="font-semibold mb-2">Owner Role:</p>
              <p className="text-sm">Email: <code>owner@example.com</code></p>
              <p className="text-sm">Password: <code>password123</code></p>
            </div>
            <div className={`p-4 rounded-lg ${isDarkMode ? "bg-blue-900/20 border border-blue-800" : "bg-blue-50 border border-blue-200"}`}>
              <p className="font-semibold mb-2">Family Role:</p>
              <p className="text-sm">Email: <code>family@example.com</code></p>
              <p className="text-sm">Password: <code>password123</code></p>
            </div>
            <div className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-700 border border-gray-600" : "bg-gray-50 border border-gray-200"}`}>
              <p className="font-semibold mb-2">Guest Role:</p>
              <p className="text-sm">Email: <code>guest@example.com</code></p>
              <p className="text-sm">Password: <code>password123</code></p>
            </div>
          </div>
        </StepContent>
      </Section>

      <Section title="Troubleshooting Common Issues" number={9}>
        <StepContent>
          <div className="overflow-x-auto">
            <table className={`w-full ${isDarkMode ? "text-gray-300" : "text-gray-900"}`}>
              <thead className={`border-b-2 ${isDarkMode ? "border-gray-600" : "border-gray-300"}`}>
                <tr>
                  <th className="text-left py-2 px-3">Issue</th>
                  <th className="text-left py-2 px-3">Solution</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDarkMode ? "divide-gray-700" : "divide-gray-200"}`}>
                <tr>
                  <td className="py-2 px-3">"Module not found" errors</td>
                  <td className="py-2 px-3">Run <code className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm">npm install</code> again</td>
                </tr>
                <tr>
                  <td className="py-2 px-3">Can't connect to Adafruit IO</td>
                  <td className="py-2 px-3">Check AIO key in .env file</td>
                </tr>
                <tr>
                  <td className="py-2 px-3">WebSocket connection fails</td>
                  <td className="py-2 px-3">Ensure backend is running on port 3001</td>
                </tr>
                <tr>
                  <td className="py-2 px-3">Device shows offline</td>
                  <td className="py-2 px-3">Check YoloBit WiFi connection</td>
                </tr>
                <tr>
                  <td className="py-2 px-3">No sensor data</td>
                  <td className="py-2 px-3">Verify MQTT feed names match</td>
                </tr>
              </tbody>
            </table>
          </div>
        </StepContent>
      </Section>

      <Section title="Project Structure" number={10}>
        <StepContent>
          <CodeBlock>
{`smarthome-app/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Dashboard, Control, History, etc.
│   ├── contexts/       # App state management
│   ├── services/       # MQTT and API services
│   └── utils/          # Helper functions
├── backend/            # WebSocket server
├── public/             # Static files
└── package.json        # Dependencies`}
          </CodeBlock>
        </StepContent>
      </Section>
    </div>
  );
}

// Helper Components
function Section({ title, number, children }: { title: string; number: number; children: React.ReactNode }) {
  const { isDarkMode } = useApp();
  
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
          {number}
        </div>
        <h2 className={`text-xl font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
          {title}
        </h2>
      </div>
      {children}
    </div>
  );
}

function StepContent({ children }: { children: React.ReactNode }) {
  const { isDarkMode } = useApp();
  
  return (
    <div className={`ml-11 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
      {children}
    </div>
  );
}

function CodeBlock({ children }: { children: string }) {
  const { isDarkMode } = useApp();
  
  return (
    <pre className={`p-4 rounded-lg overflow-x-auto text-sm ${
      isDarkMode ? "bg-gray-900 text-gray-300" : "bg-gray-900 text-gray-100"
    }`}>
      <code>{children}</code>
    </pre>
  );
}

function NotificationExample({ title, icon, examples }: { title: string; icon: string; examples: string[] }) {
  const { isDarkMode } = useApp();
  
  return (
    <div className={`p-4 rounded-lg border ${isDarkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-200"}`}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl">{icon}</span>
        <h4 className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>{title}</h4>
      </div>
      <ul className={`space-y-2 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
        {examples.map((example, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="text-blue-600">•</span>
            <span>"{example}"</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Guide;
