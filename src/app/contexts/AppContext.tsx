import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { initialHubs, initialModules } from "./hubsAndModulesData";

// Types
export type ModuleType = "temperature" | "humidity" | "light-sensor" | "fan" | "led" | "pir-motion" | "lcd-display";
export type ModuleStatus = "online" | "offline";
export type UserRole = "owner" | "family" | "guest";
export type HomeType = "apartment" | "house" | "condo" | "townhouse" | "other";
export type HubStatus = "online" | "offline";

export interface Home {
  id: string;
  name: string;
  type: HomeType;
  address?: string;
  icon: string; // Icon identifier
  isDefault: boolean;
  roomCount: number;
  deviceCount: number;
  createdAt: Date;
}

// YoloBit Hub - The actual device that connects to WiFi
export interface Hub {
  id: string; // User-friendly ID (e.g., "YB-2415A7")
  name: string; // User-given name (e.g., "Living Room Hub")
  homeId: string;
  room: string;
  status: HubStatus;
  icon: string;
  firmwareVersion: string;
  ipAddress?: string;
  macAddress?: string;
  wifiSignal?: number; // 0-100
  connectedSince?: Date;
  lastSeen: Date;
  moduleCount: number;
  onlineModuleCount: number;
  addedDate: Date;
}

// Module - Sensor or actuator connected to a hub
export interface Module {
  id: string;
  name: string;
  type: ModuleType;
  hubId: string; // Parent hub
  room: string; // Can be different from hub's room
  homeId: string;
  status: ModuleStatus;
  feed: string; // Adafruit IO feed name
  // Sensor values
  temperature?: number;
  humidity?: number;
  lux?: number;
  motion?: boolean;
  // Actuator states
  isOn?: boolean;
  speed?: number; // For fan
  color?: string; // For RGB LED
  brightness?: number;
  // Calibration
  calibrationOffset?: number;
  lastSeen?: Date;
  allowedForGuests?: boolean;
}

// Keep old Device type for backward compatibility but mark as deprecated
export type DeviceType = "light" | "fan" | "rgb-light" | "temperature" | "humidity" | "light-sensor";
export type DeviceStatus = "online" | "offline";

export interface Device {
  id: string;
  name: string;
  type: DeviceType;
  room: string;
  homeId: string;
  status: DeviceStatus;
  isOn?: boolean;
  brightness?: number;
  color?: string;
  speed?: number;
  temperature?: number;
  humidity?: number;
  lux?: number;
  allowedForGuests?: boolean;
  addedDate?: Date;
}

export interface Activity {
  id: string;
  timestamp: Date;
  date: string;
  time: string;
  type: "user" | "automation" | "alert" | "system" | "rule-change" | "environment";
  homeId?: string; // Link activity to a home
  deviceId?: string;
  deviceName?: string;
  action: string;
  detail: string;
  success: boolean;
  automationRuleName?: string; // Name of automation rule that triggered this
  triggeredBy?: "user" | "automation" | "system"; // Source of the action
  ruleAction?: "created" | "enabled" | "disabled" | "edited"; // For rule-change events
}

export interface Notification {
  id: string;
  type: "motion" | "temperature" | "offline" | "automation" | "member";
  message: string;
  timestamp: Date;
  timeAgo: string;
  isRead: boolean;
}

export interface Room {
  id: string;
  name: string;
  homeId: string; // Link room to a home
  deviceCount: number;
  allowedForGuests?: boolean; // New: indicates if guest can access this room
  // Environmental stats for each room
  temperature?: number;
  humidity?: number;
  lightLevel?: number;
  temperatureTrend?: "stable" | "rising" | "falling";
  humidityStatus?: "normal" | "high" | "low";
  lightStatus?: "bright" | "dim" | "normal";
}

export interface AutomationRule {
  id: string;
  name: string;
  condition: string;
  action: string;
  enabled: boolean;
  conditionType?: string;
  conditionValue?: string | number;
  conditionOperator?: string;
  actionType?: string;
  deviceId?: string;
  schedule?: {
    startTime?: string;
    endTime?: string;
    days?: string[];
  };
}

export interface GuestAccess {
  expiresAt: Date | null;
  allowedRooms: string[]; // Room IDs that guest can access
}

// DEMO-SIMULATION-REMOVE-LATER: Temperature simulation for testing
export interface TemperatureSimulation {
  enabled: boolean;
  value: number;
}

export interface UserProfile {
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  timeZone: string;
  language: string;
  avatar: string; // URL or initials
}

interface AppContextType {
  // Homes
  homes: Home[];
  selectedHomeId: string | null;
  setSelectedHomeId: (homeId: string) => void;
  addHome: (home: Home) => void;
  updateHome: (id: string, updates: Partial<Home>) => void;
  deleteHome: (id: string) => void;
  getCurrentHome: () => Home | null;
  
  // Hubs (YoloBit devices)
  hubs: Hub[];
  addHub: (hub: Hub) => void;
  updateHub: (id: string, updates: Partial<Hub>) => void;
  deleteHub: (id: string) => void;
  getHubsByHome: (homeId: string) => Hub[];
  getHubById: (id: string) => Hub | undefined;
  
  // Modules (sensors and actuators)
  modules: Module[];
  addModule: (module: Module) => void;
  updateModule: (id: string, updates: Partial<Module>) => void;
  deleteModule: (id: string) => void;
  getModulesByHub: (hubId: string) => Module[];
  getModulesByRoom: (room: string) => Module[];
  
  // Devices (deprecated - keeping for backward compatibility)
  devices: Device[];
  updateDevice: (id: string, updates: Partial<Device>) => void;
  addDevice: (device: Device) => void;
  deleteDevice: (id: string) => void;
  
  // Activities
  activities: Activity[];
  addActivity: (activity: Omit<Activity, "id" | "timestamp" | "date" | "time">) => void;
  
  // Notifications
  notifications: Notification[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  unreadNotificationCount: number;
  
  // Rooms
  rooms: Room[];
  addRoom: (room: Room) => void;
  deleteRoom: (id: string) => void;
  updateRoom: (id: string, updates: Partial<Room>) => void;
  
  // Automation
  automationRules: AutomationRule[];
  toggleAutomationRule: (id: string) => void;
  addAutomationRule: (rule: AutomationRule) => void;
  updateAutomationRule: (id: string, updates: Partial<AutomationRule>) => void;
  deleteAutomationRule: (id: string) => void;
  
  // Theme
  theme: "light" | "dark" | "auto";
  setTheme: (theme: "light" | "dark" | "auto") => void;
  isDarkMode: boolean;
  
  // Sidebar
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
  
  // Authentication & User
  user: {
    isAuthenticated: boolean;
    role: UserRole;
    email: string;
    name: string;
  } | null;
  login: (email: string, password: string, rememberMe: boolean) => boolean;
  logout: () => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  
  // Guest access
  guestAccess: GuestAccess;
  setGuestAccess: (access: GuestAccess) => void;
  
  // Permission helpers
  canAddDevices: boolean;
  canManageMembers: boolean;
  canCreateAutomation: boolean;
  canViewCameras: boolean;
  hasFullAccess: boolean;
  
  // DEMO-SIMULATION-REMOVE-LATER: Temperature simulation
  temperatureSimulation: TemperatureSimulation;
  setTemperatureSimulation: (simulation: TemperatureSimulation) => void;
  getCurrentTemperature: () => number; // Returns simulated temp if enabled, otherwise real temp
  
  // User Profile
  userProfile: UserProfile;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  
  // Toast notifications
  showToast: (message: string, type: "success" | "error" | "info") => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialHomes: Home[] = [
  {
    id: "home-1",
    name: "My Apartment",
    type: "apartment",
    address: "123 Main St, Apt 4B, New York, NY 10001",
    icon: "apartment",
    isDefault: true,
    roomCount: 4,
    deviceCount: 9,
    createdAt: new Date(2024, 0, 15),
  },
  {
    id: "home-2",
    name: "Beach House",
    type: "house",
    address: "456 Ocean Dr, Miami Beach, FL 33139",
    icon: "beach-house",
    isDefault: false,
    roomCount: 3,
    deviceCount: 5,
    createdAt: new Date(2025, 5, 20),
  },
];

const initialDevices: Device[] = [
  {
    id: "living-room-light",
    name: "Living Room Light",
    type: "light",
    room: "Living Room",
    homeId: "home-1",
    status: "online",
    isOn: true,
    brightness: 80,
    addedDate: new Date(2024, 1, 10),
  },
  {
    id: "bedroom-fan",
    name: "Bedroom Fan",
    type: "fan",
    room: "Bedroom",
    homeId: "home-1",
    status: "online",
    isOn: true,
    speed: 2,
    addedDate: new Date(2024, 1, 12),
  },
  {
    id: "living-room-rgb",
    name: "Living Room RGB",
    type: "rgb-light",
    room: "Living Room",
    homeId: "home-1",
    status: "online",
    isOn: true,
    color: "#8B5CF6",
    brightness: 70,
    addedDate: new Date(2024, 2, 5),
  },
  {
    id: "temperature-sensor",
    name: "Temperature Sensor",
    type: "temperature",
    room: "Living Room",
    homeId: "home-1",
    status: "online",
    temperature: 24.5,
    addedDate: new Date(2024, 1, 10),
  },
  {
    id: "humidity-sensor",
    name: "Humidity Sensor",
    type: "humidity",
    room: "Bedroom",
    homeId: "home-1",
    status: "online",
    humidity: 65,
    addedDate: new Date(2024, 1, 10),
  },
  {
    id: "light-sensor",
    name: "Light Sensor",
    type: "light-sensor",
    room: "Kitchen",
    homeId: "home-1",
    status: "online",
    lux: 450,
    addedDate: new Date(2024, 1, 15),
  },
  {
    id: "kitchen-light",
    name: "Kitchen Light",
    type: "light",
    room: "Kitchen",
    homeId: "home-1",
    status: "online",
    isOn: false,
    brightness: 0,
    addedDate: new Date(2024, 1, 20),
  },
  {
    id: "office-fan",
    name: "Office Fan",
    type: "fan",
    room: "Office",
    homeId: "home-1",
    status: "offline",
    isOn: false,
    speed: 0,
    addedDate: new Date(2024, 2, 1),
  },
  {
    id: "bedroom-light",
    name: "Bedroom Light",
    type: "light",
    room: "Bedroom",
    homeId: "home-1",
    status: "online",
    isOn: false,
    brightness: 0,
    addedDate: new Date(2024, 1, 18),
  },
];

const initialActivities: Activity[] = [
  {
    id: "1",
    timestamp: new Date(Date.now() - 60000 * 15),
    date: "Today",
    time: "15 min ago",
    type: "user",
    deviceId: "living-room-light",
    deviceName: "Living Room Light",
    action: "You turned on Living Room Light",
    detail: "via Web Dashboard",
    success: true,
  },
  {
    id: "2",
    timestamp: new Date(Date.now() - 60000 * 90),
    date: "Today",
    time: "1 hour ago",
    type: "user",
    deviceId: "bedroom-fan",
    deviceName: "Bedroom Fan",
    action: "You turned off Bedroom Fan",
    detail: "via Web Dashboard",
    success: true,
  },
  {
    id: "3",
    timestamp: new Date(Date.now() - 60000 * 180),
    date: "Today",
    time: "3 hours ago",
    type: "automation",
    deviceId: "bedroom-fan",
    deviceName: "Bedroom Fan",
    action: "Auto rule: Temperature > 30°C triggered fan ON",
    detail: "Bedroom Fan set to Speed 2",
    success: true,
  },
  {
    id: "4",
    timestamp: new Date(Date.now() - 60000 * 360),
    date: "Today",
    time: "6 hours ago",
    type: "alert",
    action: "Motion detected in Living Room",
    detail: "Security sensor triggered",
    success: true,
  },
  {
    id: "5",
    timestamp: new Date(Date.now() - 60000 * 480),
    date: "Today",
    time: "8 hours ago",
    type: "automation",
    action: "Morning routine activated",
    detail: "Lights turned on, temperature adjusted",
    success: true,
  },
];

const initialNotifications: Notification[] = [
  {
    id: "1",
    type: "motion",
    message: "Motion detected in Living Room",
    timestamp: new Date(Date.now() - 60000 * 5),
    timeAgo: "5 minutes ago",
    isRead: false,
  },
  {
    id: "2",
    type: "temperature",
    message: "Temperature exceeded 30°C in Bedroom",
    timestamp: new Date(Date.now() - 60000 * 15),
    timeAgo: "15 minutes ago",
    isRead: false,
  },
  {
    id: "3",
    type: "offline",
    message: "Office Fan went offline",
    timestamp: new Date(Date.now() - 60000 * 60),
    timeAgo: "1 hour ago",
    isRead: true,
  },
  {
    id: "4",
    type: "automation",
    message: "Goodnight mode activated",
    timestamp: new Date(Date.now() - 60000 * 120),
    timeAgo: "2 hours ago",
    isRead: true,
  },
  {
    id: "5",
    type: "member",
    message: "John accepted your invitation",
    timestamp: new Date(Date.now() - 60000 * 1440),
    timeAgo: "yesterday",
    isRead: true,
  },
];

const initialRooms: Room[] = [
  { 
    id: "living-room", 
    name: "Living Room", 
    homeId: "home-1",
    deviceCount: 3,
    temperature: 24.5,
    humidity: 65,
    lightLevel: 450,
    temperatureTrend: "stable",
    humidityStatus: "normal",
    lightStatus: "normal"
  },
  { 
    id: "bedroom", 
    name: "Bedroom", 
    homeId: "home-1",
    deviceCount: 3,
    temperature: 22.0,
    humidity: 55,
    lightLevel: 120,
    temperatureTrend: "stable",
    humidityStatus: "normal",
    lightStatus: "dim"
  },
  { 
    id: "kitchen", 
    name: "Kitchen", 
    homeId: "home-1",
    deviceCount: 2,
    temperature: 26.5,
    humidity: 70,
    lightLevel: 800,
    temperatureTrend: "rising",
    humidityStatus: "high",
    lightStatus: "bright"
  },
  { 
    id: "office", 
    name: "Office", 
    homeId: "home-1",
    deviceCount: 1,
    temperature: 23.5,
    humidity: 50,
    lightLevel: 350,
    temperatureTrend: "stable",
    humidityStatus: "normal",
    lightStatus: "normal"
  },
];

const initialAutomationRules: AutomationRule[] = [
  {
    id: "1",
    name: "Hot Weather Fan",
    condition: "IF Living Room Temperature > 30°C",
    action: "Turn on Living Room Fan",
    enabled: true,
    conditionType: "temperature",
    conditionOperator: ">",
    conditionValue: 30,
    actionType: "turn_on",
    deviceId: "bedroom-fan",
  },
  {
    id: "2",
    name: "Goodnight Mode",
    condition: "IF Time = 10:00 PM",
    action: "Turn off Living Room Light, Bedroom Light, Kitchen Light",
    enabled: true,
    conditionType: "time",
    conditionValue: "22:00",
    actionType: "turn_off",
    schedule: {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    }
  },
  {
    id: "3",
    name: "Motion Security",
    condition: "IF Motion detected in Living Room AND Time between 11:00 PM and 6:00 AM",
    action: "Send notification 'Motion detected while away'",
    enabled: false,
    conditionType: "motion",
    actionType: "notification",
    schedule: {
      startTime: "23:00",
      endTime: "06:00"
    }
  },
  {
    id: "4",
    name: "Morning Wake Up",
    condition: "IF Time = 7:00 AM",
    action: "Turn on Bedroom Light (brightness 50%)",
    enabled: true,
    conditionType: "time",
    conditionValue: "07:00",
    actionType: "turn_on",
    deviceId: "bedroom-light",
    schedule: {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"]
    }
  },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [homes, setHomes] = useState<Home[]>(initialHomes);
  const [selectedHomeId, setSelectedHomeId] = useState<string | null>(initialHomes[0].id);
  const [hubs, setHubs] = useState<Hub[]>(initialHubs);
  const [modules, setModules] = useState<Module[]>(initialModules);
  const [devices, setDevices] = useState<Device[]>(initialDevices);
  const [activities, setActivities] = useState<Activity[]>(initialActivities);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>(initialAutomationRules);
  const [theme, setThemeState] = useState<"light" | "dark" | "auto">("light");
  
  // Authentication State - Load from storage on mount
  const [user, setUser] = useState<{
    isAuthenticated: boolean;
    role: UserRole;
    email: string;
    name: string;
  } | null>(() => {
    const saved = localStorage.getItem('smartHome_user');
    if (saved) {
      return JSON.parse(saved);
    }
    const sessionSaved = sessionStorage.getItem('smartHome_user');
    if (sessionSaved) {
      return JSON.parse(sessionSaved);
    }
    return {
      isAuthenticated: true,
      role: 'owner' as UserRole,
      email: 'demo@example.com',
      name: 'Demo User'
    };
  });
  
  const [guestAccess, setGuestAccess] = useState<GuestAccess>({ 
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    allowedRooms: ["living-room", "kitchen"] // Guest can access Living Room and Kitchen
  });
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);

  // DEMO-SIMULATION-REMOVE-LATER: Temperature simulation
  const [temperatureSimulation, setTemperatureSimulation] = useState<TemperatureSimulation>({ enabled: false, value: 24.5 });
  
  // User Profile
  const [userProfile, setUserProfile] = useState<UserProfile>({
    fullName: "John Doe",
    email: "john.doe@example.com",
    phone: "+1234567890",
    role: "owner",
    timeZone: "UTC",
    language: "en",
    avatar: "JD"
  });

  const isDarkMode = theme === "dark";
  
  // Login function
  const login = (email: string, password: string, rememberMe: boolean) => {
    let role: UserRole = 'family';
    if (email.toLowerCase().includes('owner')) role = 'owner';
    else if (email.toLowerCase().includes('guest')) role = 'guest';
    
    const userData = {
      isAuthenticated: true,
      role,
      email,
      name: email.split('@')[0],
    };
    
    setUser(userData);
    
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem('smartHome_user', JSON.stringify(userData));
    
    if (rememberMe) {
      sessionStorage.removeItem('smartHome_user');
    } else {
      localStorage.removeItem('smartHome_user');
    }
    
    return true;
  };
  
  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('smartHome_user');
    sessionStorage.removeItem('smartHome_user');
  };
  
  // Session timeout warning (24 hours)
  useEffect(() => {
    if (!user?.isAuthenticated) return;
    
    const timeoutId = setTimeout(() => {
      const shouldStay = window.confirm(
        "Your session will expire in 30 minutes due to inactivity. Stay logged in?"
      );
      
      if (!shouldStay) {
        logout();
      }
    }, 23.5 * 60 * 60 * 1000); // 23.5 hours
    
    return () => clearTimeout(timeoutId);
  }, [user]);

  useEffect(() => {
    // Apply dark mode class to body
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  // Hub functions
  const addHub = (hub: Hub) => {
    setHubs((prev) => [...prev, hub]);
  };

  const updateHub = (id: string, updates: Partial<Hub>) => {
    setHubs((prev) => prev.map((hub) => (hub.id === id ? { ...hub, ...updates } : hub)));
  };

  const deleteHub = (id: string) => {
    setHubs((prev) => prev.filter((hub) => hub.id !== id));
    // Also delete all modules belonging to this hub
    setModules((prev) => prev.filter((module) => module.hubId !== id));
  };

  const getHubsByHome = (homeId: string) => {
    return hubs.filter((hub) => hub.homeId === homeId);
  };

  const getHubById = (id: string) => {
    return hubs.find((hub) => hub.id === id);
  };

  // Module functions
  const addModule = (module: Module) => {
    setModules((prev) => [...prev, module]);
  };

  const updateModule = (id: string, updates: Partial<Module>) => {
    setModules((prev) => prev.map((module) => (module.id === id ? { ...module, ...updates } : module)));
  };

  const deleteModule = (id: string) => {
    setModules((prev) => prev.filter((module) => module.id !== id));
  };

  const getModulesByHub = (hubId: string) => {
    return modules.filter((module) => module.hubId === hubId);
  };

  const getModulesByRoom = (room: string) => {
    return modules.filter((module) => module.room === room);
  };

  const updateDevice = (id: string, updates: Partial<Device>) => {
    setDevices((prev) =>
      prev.map((device) => (device.id === id ? { ...device, ...updates } : device))
    );
  };

  const addDevice = (device: Device) => {
    setDevices((prev) => [...prev, device]);
  };

  const deleteDevice = (id: string) => {
    setDevices((prev) => prev.filter((device) => device.id !== id));
  };

  const addActivity = (activity: Omit<Activity, "id" | "timestamp" | "date" | "time">) => {
    const now = new Date();
    const newActivity: Activity = {
      ...activity,
      id: Date.now().toString(),
      timestamp: now,
      date: "Today",
      time: "Just now",
    };
    setActivities((prev) => [newActivity, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, isRead: true } : notif))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, isRead: true })));
  };

  const unreadNotificationCount = notifications.filter((n) => !n.isRead).length;

  const addRoom = (room: Room) => {
    setRooms((prev) => [...prev, room]);
  };

  const deleteRoom = (id: string) => {
    setRooms((prev) => prev.filter((room) => room.id !== id));
  };

  const updateRoom = (id: string, updates: Partial<Room>) => {
    setRooms((prev) => prev.map((room) => (room.id === id ? { ...room, ...updates } : room)));
  };

  const toggleAutomationRule = (id: string) => {
    setAutomationRules((prev) =>
      prev.map((rule) => (rule.id === id ? { ...rule, enabled: !rule.enabled } : rule))
    );
  };

  const addAutomationRule = (rule: AutomationRule) => {
    setAutomationRules((prev) => [...prev, rule]);
  };

  const updateAutomationRule = (id: string, updates: Partial<AutomationRule>) => {
    setAutomationRules((prev) =>
      prev.map((rule) => (rule.id === id ? { ...rule, ...updates } : rule))
    );
  };

  const deleteAutomationRule = (id: string) => {
    setAutomationRules((prev) => prev.filter((rule) => rule.id !== id));
  };

  const setTheme = (newTheme: "light" | "dark" | "auto") => {
    setThemeState(newTheme);
  };

  const showToast = (message: string, type: "success" | "error" | "info") => {
    // This will be implemented with a toast notification system
    console.log(`${type.toUpperCase()}: ${message}`);
  };

  const canAddDevices = user?.role === "owner";
  const canManageMembers = user?.role === "owner";
  const canCreateAutomation = user?.role === "owner";
  const canViewCameras = user?.role === "owner" || user?.role === "family";
  const hasFullAccess = user?.role === "owner";

  const getCurrentTemperature = () => {
    return temperatureSimulation.enabled ? temperatureSimulation.value : devices.find(d => d.type === "temperature")?.temperature || 24.5;
  };

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUserProfile(prev => ({ ...prev, ...updates }));
  };

  return (
    <AppContext.Provider
      value={{
        homes,
        selectedHomeId,
        setSelectedHomeId,
        addHome: (home) => setHomes(prev => [...prev, home]),
        updateHome: (id, updates) => setHomes(prev => prev.map(h => h.id === id ? { ...h, ...updates } : h)),
        deleteHome: (id) => setHomes(prev => prev.filter(h => h.id !== id)),
        getCurrentHome: () => homes.find(h => h.id === selectedHomeId) || null,
        hubs,
        addHub,
        updateHub,
        deleteHub,
        getHubsByHome,
        getHubById,
        modules,
        addModule,
        updateModule,
        deleteModule,
        getModulesByHub,
        getModulesByRoom,
        devices,
        updateDevice,
        addDevice,
        deleteDevice,
        activities,
        addActivity,
        notifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        unreadNotificationCount,
        rooms,
        addRoom,
        deleteRoom,
        updateRoom,
        automationRules,
        toggleAutomationRule,
        addAutomationRule,
        updateAutomationRule,
        deleteAutomationRule,
        theme,
        setTheme,
        isDarkMode,
        // Authentication
        user: user,
        login: login,
        logout: logout,
        userRole: user?.role || 'owner',
        setUserRole: (role: UserRole) => {
          if (user) {
            const updatedUser = { ...user, role };
            setUser(updatedUser);
            if (localStorage.getItem('smartHome_user')) {
              localStorage.setItem('smartHome_user', JSON.stringify(updatedUser));
            }
            if (sessionStorage.getItem('smartHome_user')) {
              sessionStorage.setItem('smartHome_user', JSON.stringify(updatedUser));
            }
          }
        },
        guestAccess,
        setGuestAccess,
        canAddDevices,
        canManageMembers,
        canCreateAutomation,
        canViewCameras,
        hasFullAccess,
        showToast,
        sidebarCollapsed,
        setSidebarCollapsed,
        toggleSidebar: () => setSidebarCollapsed(!sidebarCollapsed),
        
        // DEMO-SIMULATION-REMOVE-LATER: Temperature simulation
        temperatureSimulation,
        setTemperatureSimulation,
        getCurrentTemperature,
        
        // User Profile
        userProfile,
        updateUserProfile,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}