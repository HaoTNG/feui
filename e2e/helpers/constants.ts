export const TEST_USER = {
  email: 'thanh.nguyen422005@gmail.com',
  password: 'password123',
};

export const API_BASE_URL = 'http://localhost:8080';

export const ROUTES = {
  login: '/auth/login',
  auth: '/auth',
  dashboard: '/',
  homes: '/homes',
  automation: '/automation',
  hubManagement: '/hub-management',
  roomManagement: '/room-management',
};

export const SELECTORS = {
  emailInput: '#email',
  passwordInput: '#password',
  loginButton: 'button[type="submit"]',
  logoutButton: 'button:has-text("Logout"), button:has-text("Sign out")',
  toast: '[data-sonner-toast]',
  errorMessage: '.text-red-600',
  wsStatusBadge: '[data-testid="ws-status"]',
};

export const TEST_TIMEOUTS = {
  navigation: 10000,
  api: 5000,
  websocket: 15000,
};
