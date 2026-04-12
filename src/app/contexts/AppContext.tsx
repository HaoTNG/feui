import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { 
  homeService, 
  roomService, 
  deviceService, 
  userService,
  memberService,
  authService,
  websocketService,
  // mockWebSocketService // TEMPORARILY DISABLED FOR API TESTING
} from "../api";
// import { initializeMockData } from "../api/services/mockDataInitializer"; // TEMPORARILY DISABLED FOR API TESTING
import type { UserProfile, ModuleType, Module as APIModule, Device as APIDevice } from "../types/api";
import type { WebSocketData, WebSocketMessage } from "../api/services/websocketService";

export type UserRole = "owner" | "family" | "guest";
export type HomeType = "apartment" | "house" | "condo" | "townhouse" | "other";

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

// Re-export module and device types from API types
export type Module = APIModule;
export type Device = APIDevice;

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

interface AppContextType {
  // Homes
  homes: Home[];
  selectedHomeId: string | null;
  setSelectedHomeId: (homeId: string) => void;
  addHome: (home: Home) => void;
  updateHome: (id: string, updates: Partial<Home>) => void;
  deleteHome: (id: string) => void;
  getCurrentHome: () => Home | null;
  homesLoading: boolean;
  homesError: Error | null;
  
  // Devices (with nested modules)
  devices: Device[];
  updateDevice: (id: string, updates: Partial<Device>) => void;
  addDevice: (device: Device) => void;
  deleteDevice: (id: string) => void;
  devicesLoading: boolean;
  devicesError: Error | null;
  
  // Rooms
  rooms: Room[];
  addRoom: (room: Room) => void;
  deleteRoom: (id: string) => void;
  updateRoom: (id: string, updates: Partial<Room>) => void;
  roomsLoading: boolean;
  roomsError: Error | null;
  
  // Activities (frontend-only)
  activities: Activity[];
  addActivity: (activity: Omit<Activity, "id" | "timestamp" | "date" | "time">) => void;
  
  // Notifications (frontend-only)
  notifications: Notification[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  unreadNotificationCount: number;
  
  // Automation (frontend-only)
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
  login: (email: string, password: string, rememberMe: boolean) => Promise<boolean>;
  logout: () => Promise<void>;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  authLoading: boolean;
  authError: Error | null;
  
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
  getCurrentTemperature: () => number;
  
  // User Profile
  userProfile: UserProfile;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  updateUserProfileAsync: (updates: Partial<UserProfile>) => Promise<any>;
  userProfileLoading: boolean;
  
  // WebSocket
  websocketConnected: boolean;
  websocketData: WebSocketData[];
  websocketStatus: 'connected' | 'disconnected' | 'error' | 'connecting';
  
  // Toast notifications
  showToast: (message: string, type: "success" | "error" | "info") => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Keep these mock data for frontend-only features
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
  },
  {
    id: "2",
    name: "Goodnight Mode",
    condition: "IF Time = 10:00 PM",
    action: "Turn off all lights",
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
    condition: "IF Motion detected AND Time between 11:00 PM and 6:00 AM",
    action: "Send notification",
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
    action: "Turn on Bedroom Light",
    enabled: true,
    conditionType: "time",
    conditionValue: "07:00",
    actionType: "turn_on",
    schedule: {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"]
    }
  },
];

export function AppProvider({ children }: { children: ReactNode }) {
  // API-driven state - will be populated from services
  const [homes, setHomes] = useState<Home[]>([]);
  const [selectedHomeId, setSelectedHomeId] = useState<string | null>(null);
  const [devices, setDevices] = useState<Device[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  
  // Frontend-only state - mock data
  const [activities, setActivities] = useState<Activity[]>(initialActivities);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>(initialAutomationRules);
  
  // UI state
  const [theme, setThemeState] = useState<"light" | "dark" | "auto">("light");
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  
  // Loading states
  const [homesLoading, setHomesLoading] = useState(true);
  const [homesError, setHomesError] = useState<Error | null>(null);
  const [devicesLoading, setDevicesLoading] = useState(false);
  const [devicesError, setDevicesError] = useState<Error | null>(null);
  const [roomsLoading, setRoomsLoading] = useState(false);
  const [roomsError, setRoomsError] = useState<Error | null>(null);
  const [authLoading, setAuthLoading] = useState(true); // Track when auth state is initialized
  const [authError, setAuthError] = useState<Error | null>(null);
  const [userProfileLoading, setUserProfileLoading] = useState(false);
  
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
    return null;
  });
  
  const [guestAccess, setGuestAccess] = useState<GuestAccess>({ 
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    allowedRooms: ["living-room", "kitchen"]
  });

  // DEMO-SIMULATION-REMOVE-LATER: Temperature simulation
  const [temperatureSimulation, setTemperatureSimulation] = useState<TemperatureSimulation>({ enabled: false, value: 24.5 });
  
  // User Profile
  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: "",
    name: "",
    email: "",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    avatar: "",
    role: "family",
  });

  // WebSocket state
  const [websocketConnected, setWebsocketConnected] = useState(false);
  const [websocketStatus, setWebsocketStatus] = useState<'connected' | 'disconnected' | 'error' | 'connecting'>('disconnected');
  const [websocketData, setWebsocketData] = useState<WebSocketData[]>([]);

  const isDarkMode = theme === "dark";
  
  // Validate token on app mount - only restore user state, don't redirect yet
  useEffect(() => {
    const validateToken = async () => {
      const authToken = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      const savedUser = localStorage.getItem('smartHome_user') || sessionStorage.getItem('smartHome_user');
      
      // If no token or user stored, just mark auth as initialized
      if (!authToken || !savedUser) {
        console.log('[AppContext] No stored token found');
        setAuthLoading(false);
        return;
      }
      
      try {
        setAuthLoading(true);
        console.log('[AppContext] Restoring user from storage...');
        
        // Restore user state from storage
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        console.log('[AppContext] User restored:', parsedUser.email);
        
        // Token will be validated when fetchUserProfile runs
      } catch (error) {
        console.error('[AppContext] Failed to restore user:', error);
        setAuthLoading(false);
      }
    };
    
    validateToken();
  }, []); // Run only once on mount
  
  // Fetch homes on mount
  useEffect(() => {
    const fetchHomes = async () => {
      if (!user?.isAuthenticated) {
        setHomesLoading(false);
        return;
      }
      
      try {
        setHomesLoading(true);
        console.log('[AppContext] Fetching homes...');
        const homesData = await homeService.getHomes();
        console.log('[AppContext] Homes fetched:', homesData);
        setHomes(homesData || []);
        setHomesError(null);
        
        // Set first home as selected if available
        if (homesData && homesData.length > 0 && !selectedHomeId) {
          const defaultHome = homesData.find(h => h.isDefault) || homesData[0];
          console.log('[AppContext] Setting default home:', defaultHome.id);
          setSelectedHomeId(defaultHome.id);
        }
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        setHomesError(err);
        console.error("[AppContext] Failed to fetch homes:", err);
      } finally {
        setHomesLoading(false);
      }
    };
    
    fetchHomes();
  }, [user?.isAuthenticated]);
  
  // Fetch rooms when selected home changes
  useEffect(() => {
    const fetchRooms = async () => {
      if (!selectedHomeId) {
        setRooms([]);
        return;
      }
      
      try {
        setRoomsLoading(true);
        console.log('[AppContext] Fetching rooms for home:', selectedHomeId);
        const roomsData = await roomService.getRoomsByHome(selectedHomeId);
        console.log('[AppContext] Rooms fetched:', roomsData);
        
        // Use mock data if API returns empty
        // TEMPORARILY DISABLED FOR API TESTING
        // if (!roomsData || roomsData.length === 0) {
        //   console.log('[AppContext] No rooms from API, using mock data');
        //   const { rooms: mockRoomsData } = initializeMockData();
        //   setRooms(mockRoomsData);
        // } else {
        setRooms(roomsData || []);
        // }
        setRoomsError(null);
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        setRoomsError(err);
        console.error("[AppContext] Failed to fetch rooms:", err);
        
        // Fall back to mock data on error
        // TEMPORARILY DISABLED FOR API TESTING
        // console.log('[AppContext] Falling back to mock rooms data');
        // const { rooms: mockRoomsData } = initializeMockData();
        setRooms([]);
      } finally {
        setRoomsLoading(false);
      }
    };
    
    fetchRooms();
  }, [selectedHomeId]);
  
  // Fetch devices when selected home changes
  useEffect(() => {
    const fetchDevices = async () => {
      if (!selectedHomeId) {
        setDevices([]);
        return;
      }
      
      try {
        setDevicesLoading(true);
        console.log('[AppContext] Fetching devices for home:', selectedHomeId);
        const devicesData = await deviceService.getDevicesByHome(selectedHomeId);
        console.log('[AppContext] Devices fetched:', devicesData);
        
        // Use mock data if API returns empty
        // TEMPORARILY DISABLED FOR API TESTING
        // if (!devicesData || devicesData.length === 0) {
        //   console.log('[AppContext] No devices from API, using mock data');
        //   const { devices: mockDevicesData } = initializeMockData();
        //   setDevices(mockDevicesData);
        // } else {
        setDevices(devicesData || []);
        // }
        setDevicesError(null);
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        setDevicesError(err);
        console.error("[AppContext] Failed to fetch devices:", err);
        
        // Fall back to mock data on error
        // TEMPORARILY DISABLED FOR API TESTING
        // console.log('[AppContext] Falling back to mock devices data');
        // const { devices: mockDevicesData } = initializeMockData();
        setDevices([]);
      } finally {
        setDevicesLoading(false);
      }
    };
    
    fetchDevices();
  }, [selectedHomeId]);
  
  // Fetch user profile when authenticated - validates token
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user?.isAuthenticated) {
        setAuthLoading(false);
        return;
      }
      
      try {
        setUserProfileLoading(true);
        setAuthLoading(true);
        const userData = await userService.getCurrentUser();
        if (userData) {
          setUserProfile({
            id: userData.id,
            name: userData.name,
            email: userData.email,
            isActive: userData.isActive,
            createdAt: new Date(userData.createdAt),
            updatedAt: new Date(userData.updatedAt),
            role: user?.role || "family",
            avatar: userData.name?.substring(0, 2).toUpperCase() || "U"
          });
          console.log('[AppContext] User profile loaded successfully');
        }
        setAuthLoading(false);
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        const statusCode = (error as any)?.statusCode;
        const message = (error as any)?.message;
        
        // Token invalid (401) or network error - logout
        if (statusCode === 401 || message?.includes('Network Error') || message?.includes('CORS')) {
          console.warn('[AppContext] Token invalid or expired - logging out');
          // Clear everything
          localStorage.removeItem('authToken');
          sessionStorage.removeItem('authToken');
          localStorage.removeItem('smartHome_user');
          sessionStorage.removeItem('smartHome_user');
          setUser(null);
          setHomes([]);
          setDevices([]);
          setRooms([]);
          setSelectedHomeId(null);
        }
        setAuthLoading(false);
      } finally {
        setUserProfileLoading(false);
      }
    };
    
    fetchUserProfile();
  }, [user?.isAuthenticated]);
  
  // Setup WebSocket connection when user is authenticated
  useEffect(() => {
    if (!user?.isAuthenticated) {
      // Disconnect WebSocket if user logs out
      setWebsocketStatus('disconnected');
      setWebsocketConnected(false);
      // mockWebSocketService.stop(); // DISABLED
      return;
    }

    // TEMPORARILY DISABLED MOCK WEBSOCKET FOR API TESTING
    // All WebSocket mock data broadcasts have been disabled
    // to keep console clean and test real API calls
    setWebsocketStatus('disconnected');
    setWebsocketConnected(false);
    return;

    /*
    // ORIGINAL CODE (DISABLED)
    // Start mock WebSocket simulation immediately
    setWebsocketStatus('connecting');
    // Start mock WebSocket simulation
    mockWebSocketService.start();
    setWebsocketConnected(true);
    setWebsocketStatus('connected');

    // Handle incoming WebSocket messages
    const unsubscribeMessage = mockWebSocketService.onMessage((message: WebSocketMessage) => {
      console.log('[AppContext] Received WebSocket message:', message);
      
      // Store the data
      setWebsocketData((prev) => {
        // Keep last 100 messages
        const newData = [...prev, message.data];
        return newData.slice(-100);
      });

      // Process specific message types and update state
      if (message.type === 'device' && message.data.deviceId) {
        // Update device status
        setDevices((prevDevices) =>
          prevDevices.map((device) =>
            device.id === message.data.deviceId
              ? {
                  ...device,
                  status: message.data.status || device.status,
                  ...(message.data.modules && { modules: message.data.modules })
                }
              : device
          )
        );
      } else if (message.type === 'module' && message.data.moduleId && message.data.deviceId) {
        // Update module status within a device
        setDevices((prevDevices) =>
          prevDevices.map((device) =>
            device.id === message.data.deviceId
              ? {
                  ...device,
                  modules: device.modules?.map((module) =>
                    module.id === message.data.moduleId
                      ? {
                          ...module,
                          status: message.data.status || module.status,
                          temperature: message.data.temperature ?? module.temperature,
                          humidity: message.data.humidity ?? module.humidity,
                          value: message.data.value ?? module.value,
                        }
                      : module
                  ),
                }
              : device
          )
        );
      } else if (message.type === 'room' && message.data.roomId) {
        // Update room stats
        setRooms((prevRooms) =>
          prevRooms.map((room) =>
            room.id === message.data.roomId
              ? {
                  ...room,
                  temperature: message.data.temperature ?? room.temperature,
                  humidity: message.data.humidity ?? room.humidity,
                  lightLevel: message.data.lightLevel ?? room.lightLevel,
                  temperatureTrend: message.data.temperatureTrend ?? room.temperatureTrend,
                  humidityStatus: message.data.humidityStatus ?? room.humidityStatus,
                  lightStatus: message.data.lightStatus ?? room.lightStatus,
                }
              : room
          )
        );
      }

      // Add activity log for important events
      // Note: addActivity is defined later, can be moved here if needed
      if (message.type === 'alert' || message.type === 'event') {
        console.log('[AppContext] Alert/Event activity:', message.data);
      }
    });

    // Cleanup function - unsubscribe from messages when user logs out
    return () => {
      console.log('[AppContext] Cleaning up WebSocket connection...');
      unsubscribeMessage();
      mockWebSocketService.stop();
    };
    */
  }, [user?.isAuthenticated]);
  
  // Login function - now async and uses authService
  const login = async (email: string, password: string, rememberMe: boolean): Promise<boolean> => {
    try {
      setAuthLoading(true);
      setAuthError(null);
      
      console.log('[AppContext] Logging in with:', email);
      const result = await authService.login(email, password);
      console.log('[AppContext] Login result:', result);
      
      const userData = {
        isAuthenticated: true,
        role: result.user.role as UserRole || 'family' as UserRole,
        email: result.user.email,
        name: result.user.name || email.split('@')[0],
      };
      
      console.log('[AppContext] Setting user:', userData);
      setUser(userData);
      
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem('smartHome_user', JSON.stringify(userData));
      
      if (rememberMe) {
        sessionStorage.removeItem('smartHome_user');
      } else {
        localStorage.removeItem('smartHome_user');
      }
      
      setAuthLoading(false);
      return true;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      setAuthError(err);
      setAuthLoading(false);
      throw err;
    }
  };
  
  // Logout function - now async and uses authService
  const logout = async (): Promise<void> => {
    try {
      setAuthLoading(true);
      await authService.logout();
      setUser(null);
      setHomes([]);
      setDevices([]);
      setRooms([]);
      setSelectedHomeId(null);
      localStorage.removeItem('smartHome_user');
      sessionStorage.removeItem('smartHome_user');
      setAuthLoading(false);
    } catch (error) {
      console.error("Logout error:", error);
      setAuthLoading(false);
    }
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

  // Device functions
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
    return temperatureSimulation.enabled ? temperatureSimulation.value : devices.find(d => d.modules?.some(m => m.type === "temperature"))?.modules?.find(m => m.type === "temperature")?.temperature || 24.5;
  };

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUserProfile(prev => ({ ...prev, ...updates }));
  };

  // Update user profile via API
  const updateUserProfileAsync = async (updates: Partial<UserProfile>) => {
    try {
      console.log('[AppContext] Updating user profile via API:', updates);
      
      // Map frontend UserProfile to API UpdateUserRequest
      const apiRequest = {
        name: updates.name,
        avatar: updates.avatar,
      };
      
      const result = await userService.updateProfile(apiRequest);
      console.log('[AppContext] User profile updated:', result);
      
      // Update local state with result
      setUserProfile(prev => ({
        ...prev,
        email: result.email,
        name: result.name,
        isActive: result.isActive,
        updatedAt: new Date(result.updatedAt),
      }));
      
      return result;
    } catch (error) {
      console.error('[AppContext] Failed to update user profile:', error);
      throw error;
    }
  };

  return (
    <AppContext.Provider
      value={{
        // Homes
        homes,
        selectedHomeId: selectedHomeId || null,
        setSelectedHomeId,
        addHome: (home) => setHomes(prev => [...prev, home]),
        updateHome: (id, updates) => setHomes(prev => prev.map(h => h.id === id ? { ...h, ...updates } : h)),
        deleteHome: (id) => setHomes(prev => prev.filter(h => h.id !== id)),
        getCurrentHome: () => homes.find(h => h.id === selectedHomeId) || null,
        homesLoading,
        homesError,
        
        // Devices (with nested modules)
        devices,
        updateDevice,
        addDevice,
        deleteDevice,
        devicesLoading,
        devicesError,
        
        // Rooms
        rooms,
        addRoom,
        deleteRoom,
        updateRoom,
        roomsLoading,
        roomsError,
        
        // Activities (frontend-only)
        activities,
        addActivity,
        
        // Notifications (frontend-only)
        notifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        unreadNotificationCount,
        
        // Automation (frontend-only)
        automationRules,
        toggleAutomationRule,
        addAutomationRule,
        updateAutomationRule,
        deleteAutomationRule,
        
        // Theme
        theme,
        setTheme,
        isDarkMode,
        
        // Sidebar
        sidebarCollapsed,
        setSidebarCollapsed,
        toggleSidebar: () => setSidebarCollapsed(!sidebarCollapsed),
        
        // Authentication
        user: user,
        login: login,
        logout: logout,
        userRole: user?.role || 'family',
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
        authLoading,
        authError,
        
        // Guest access
        guestAccess,
        setGuestAccess,
        
        // Permissions
        canAddDevices,
        canManageMembers,
        canCreateAutomation,
        canViewCameras,
        hasFullAccess,
        
        // Temperature simulation
        temperatureSimulation,
        setTemperatureSimulation,
        getCurrentTemperature,
        
        // User Profile
        userProfile,
        updateUserProfile,
        updateUserProfileAsync,
        userProfileLoading,
        
        // WebSocket
        websocketConnected,
        websocketData,
        websocketStatus,
        
        // Toast
        showToast,
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