/**
 * API Response & Request Types
 * Mapping frontend types to backend API contract
 */

// ============================================================
// COMMON/SHARED TYPES
// ============================================================

/** API Standard Response Wrapper */
export interface ApiResponse<T = any> {
  statusCode: number;
  message: string;
  data: T | null;
}

/** Standard error response */
export interface ApiErrorResponse {
  statusCode: number;
  message: string;
  data: null;
}

// ============================================================
// 1. AUTHENTICATION
// ============================================================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user: UserInfo;
}

export interface UserInfo {
  id: string;
  email: string;
  name: string;
  isActive: boolean;
}

// ============================================================
// 2. USER MANAGEMENT
// ============================================================

export interface User {
  id: string;
  email: string;
  name: string;
  isActive: boolean;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}

export interface UpdateUserRequest {
  name?: string;
  avatar?: string;
}

// ============================================================
// 3. HOME MANAGEMENT
// ============================================================

export interface HomeDTO {
  id: string;
  name: string;
  ownerUserId: string;
  ownerName: string;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}

export interface CreateHomeRequest {
  name: string;
}

export interface UpdateHomeRequest {
  name?: string;
}

// ============================================================
// 4. HOME MEMBERS
// ============================================================

export type MemberRole = "OWNER" | "MEMBER";
export type MemberStatus = "ACTIVE" | "PENDING" | "INACTIVE";

export interface HomeMember {
  userId: string;
  homeId: string;
  userName: string;
  userEmail: string;
  role: MemberRole;
  status: MemberStatus;
  joinedAt: string; // ISO 8601
}

export interface AddMemberRequest {
  email: string;
}

// ============================================================
// 5. ROOM MANAGEMENT
// ============================================================

export interface RoomDTO {
  id: string;
  name: string;
  homeId: string;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}

export interface CreateRoomRequest {
  name: string;
}

export interface UpdateRoomRequest {
  name?: string;
}

// ============================================================
// 6. DEVICE MANAGEMENT
// ============================================================

export interface DeviceDTO {
  id: string;
  firmwareId: string;
  name: string;
  homeId: string;
  roomId: string | null; // null = Unassigned
  roomName: string; // "Unassigned" if null
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}

export interface CreateDeviceRequest {
  name: string;
  firmwareId: string;
  roomId?: string | null;
}

export interface UpdateDeviceNameRequest {
  name: string;
}

export interface MoveDeviceRequest {
  roomId: string | null; // null to move to Unassigned
}

export interface SendCommandRequest {
  command: string;
  value: any;
}

/**
 * Device Commands - Enum của các command types
 */
export enum DeviceCommand {
  POWER = "POWER",
  SET_BRIGHTNESS = "SET_BRIGHTNESS",
  SET_TEMPERATURE = "SET_TEMPERATURE",
  SET_SPEED = "SET_SPEED",
  SET_COLOR = "SET_COLOR",
}

export interface DeviceState {
  power?: boolean;
  brightness?: number;
  temperature?: number;
  speed?: number;
  color?: string;
  [key: string]: any;
}

// ============================================================
// 7. MODULE MANAGEMENT
// ============================================================

export type ModuleType =
  | "TEMPERATURE"
  | "HUMIDITY"
  | "LIGHT_SENSOR"
  | "MOTION"
  | "LIGHT"
  | "FAN"
  | "AC"
  | "WATER_HEATER";

export interface ModuleDTO {
  id: string;
  name: string;
  type: ModuleType;
  deviceChannelId: string;
  deviceId: string;
  createdAt: string; // ISO 8601
}

export interface AddModuleRequest {
  name: string;
  type: ModuleType;
  channelId: string;
}

export interface UpdateModuleNameRequest {
  name: string;
}

// ============================================================
// MAPPED/TRANSFORMED TYPES (For Frontend Use)
// ============================================================

/**
 * Frontend Home Model
 * Combines HomeDTO with additional computed properties
 */
export interface Home {
  id: string;
  name: string;
  ownerUserId: string;
  ownerName: string;
  createdAt: Date;
  updatedAt: Date;
  // Computed properties (populated by frontend)
  roomCount?: number;
  deviceCount?: number;
  isDefault?: boolean;
}

/**
 * Frontend Room Model
 * Combines RoomDTO with additional properties
 */
export interface Room {
  id: string;
  name: string;
  homeId: string;
  createdAt: Date;
  updatedAt: Date;
  // Computed properties
  deviceCount?: number;
  // Environmental stats (if available from IoT data)
  temperature?: number;
  humidity?: number;
  lightLevel?: number;
}

/**
 * Frontend Device Model
 * Combines DeviceDTO with module data and state
 */
export interface Device {
  id: string;
  firmwareId: string;
  name: string;
  homeId: string;
  roomId: string | null;
  roomName: string;
  createdAt: Date;
  updatedAt: Date;
  // Module/Sensor data
  modules?: Module[];
  // Current state
  state?: DeviceState;
  // Status
  status?: "online" | "offline";
}

/**
 * Frontend Module/Component Model
 * Combines ModuleDTO with data
 */
export interface Module {
  id: string;
  name: string;
  type: ModuleType;
  deviceChannelId: string;
  deviceId: string;
  createdAt: Date;
  // Current value (populated from IoT)
  value?: number | boolean | string;
  // For display
  displayValue?: string;
  unit?: string;
}

/**
 * Frontend User Profile Model
 */
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  // Frontend specific
  avatar?: string;
  role?: "owner" | "family" | "guest";
}

/**
 * Frontend Activity Model
 * (Not from backend, generated by frontend for local logging)
 */
export interface Activity {
  id: string;
  timestamp: Date;
  date: string;
  time: string;
  type: "user" | "automation" | "alert" | "system" | "rule-change" | "environment";
  homeId?: string;
  deviceId?: string;
  deviceName?: string;
  action: string;
  detail: string;
  success: boolean;
  automationRuleName?: string;
  triggeredBy?: "user" | "automation" | "system";
}

// ============================================================
// CONVERSION/ADAPTER TYPES
// ============================================================

/**
 * Helper interface for converting between API DTOs and Frontend models
 */
export interface DTOAdapterConfig {
  includeComputedProperties?: boolean;
  timezone?: string;
}

// ============================================================
// UNION & HELPER TYPES
// ============================================================

export type EntityId = string; // UUID
export type HomeId = string;
export type RoomId = string;
export type DeviceId = string;
export type ModuleId = string;
export type UserId = string;

// ============================================================
// PAGINATION (For Future Use)
// ============================================================

export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ============================================================
// API CLIENT CONFIG
// ============================================================

export interface ApiClientConfig {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
  useMock?: boolean;
}

export interface ApiErrorDetail {
  statusCode: number;
  message: string;
  path?: string;
  timestamp?: string;
}
