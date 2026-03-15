/**
 * API Module Index
 * Central export point for all API infrastructure and services
 */

// HTTP Client
export { apiClient, apiRequest } from './client';

// Endpoints
export { default as API_ENDPOINTS } from './endpoints';

// Services
export {
  authService,
  userService,
  homeService,
  roomService,
  deviceService,
  moduleService,
  memberService,
} from './services';

// Types
export type * from '../types/api';

// Converters
export {
  convertDTOToHome,
  convertDTOToRoom,
  convertDTOToDevice,
  convertDTOToModule,
  convertUserInfoToProfile,
  getUnitForModuleType,
  formatModuleValue,
} from '../utils/converters';
