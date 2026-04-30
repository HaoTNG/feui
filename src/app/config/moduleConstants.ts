/**
 * Module Constants
 * Hardcoded module IDs from the backend
 * These IDs are used to control specific devices
 */

export const MODULE_IDS = {
  // Lighting
  LED_RGB: '25073539-8463-467b-bf92-b78b1e07af86',
  
  // Sensors
  MOTION_SENSOR: '1c574eea-402d-4c26-bc96-023e36bec1d9',
  LIGHT_SENSOR: '7e1292e7-c1e0-4022-903d-bf9b33a81f15',
  HUMIDITY_SENSOR: 'cb8da9d0-2845-46f9-9941-9386f3173b94',
  TEMPERATURE_SENSOR: 'f859fb5b-5670-4c7f-8d86-e9aecf580cad',
  
  // Display & Control
  LCD_DISPLAY: '85458537-4b19-41c1-8080-47c315ddaa62',
  FAN: '0e911952-e33b-4e5f-8a97-50053f47e76c',
} as const;

export type ModuleIdKey = keyof typeof MODULE_IDS;

/**
 * Get module ID by key
 */
export const getModuleId = (key: ModuleIdKey): string => {
  return MODULE_IDS[key];
};

/**
 * Module control actions
 */
export const MODULE_ACTIONS = {
  OFF: 0,
  ON: 1,
  TOGGLE_ON: 1,
  TOGGLE_OFF: 0,
} as const;

/**
 * Fan speed levels
 */
export const FAN_SPEEDS = {
  OFF: 0,
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
} as const;

/**
 * Brightness levels (0-100)
 */
export const BRIGHTNESS_LEVELS = {
  OFF: 0,
  DIM: 25,
  MEDIUM: 50,
  BRIGHT: 75,
  FULL: 100,
} as const;

export default {
  MODULE_IDS,
  MODULE_ACTIONS,
  FAN_SPEEDS,
  BRIGHTNESS_LEVELS,
  getModuleId,
};
