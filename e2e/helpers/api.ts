import { APIRequestContext } from '@playwright/test';
import { API_BASE_URL, TEST_USER } from './constants';

export async function loginViaApi(request: APIRequestContext): Promise<string> {
  const response = await request.post(`${API_BASE_URL}/auth/login`, {
    data: {
      email: TEST_USER.email,
      password: TEST_USER.password,
    },
  });

  if (!response.ok()) {
    throw new Error(`Login failed: ${response.status()}`);
  }

  const data = await response.json();
  return data.token;
}

export async function createHome(
  request: APIRequestContext,
  token: string,
  name: string
): Promise<{ id: string; name: string }> {
  const response = await request.post(`${API_BASE_URL}/homes`, {
    headers: { Authorization: `Bearer ${token}` },
    data: { name },
  });

  if (!response.ok()) {
    throw new Error(`Create home failed: ${response.status()}`);
  }

  return response.json();
}

export async function deleteHome(
  request: APIRequestContext,
  token: string,
  homeId: string
): Promise<void> {
  const response = await request.delete(`${API_BASE_URL}/homes/${homeId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok() && response.status() !== 404) {
    throw new Error(`Delete home failed: ${response.status()}`);
  }
}

export async function getHomes(
  request: APIRequestContext,
  token: string
): Promise<Array<{ id: string; name: string }>> {
  const response = await request.get(`${API_BASE_URL}/homes`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok()) {
    throw new Error(`Get homes failed: ${response.status()}`);
  }

  return response.json();
}

export async function createRoom(
  request: APIRequestContext,
  token: string,
  homeId: string,
  name: string
): Promise<{ id: string; name: string }> {
  const response = await request.post(`${API_BASE_URL}/homes/${homeId}/rooms`, {
    headers: { Authorization: `Bearer ${token}` },
    data: { name },
  });

  if (!response.ok()) {
    throw new Error(`Create room failed: ${response.status()}`);
  }

  return response.json();
}

export async function deleteRoom(
  request: APIRequestContext,
  token: string,
  homeId: string,
  roomId: string
): Promise<void> {
  const response = await request.delete(
    `${API_BASE_URL}/homes/${homeId}/rooms/${roomId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!response.ok() && response.status() !== 404) {
    throw new Error(`Delete room failed: ${response.status()}`);
  }
}

export async function getDevices(
  request: APIRequestContext,
  token: string,
  homeId: string
): Promise<Array<{ id: string; name: string; firmwareId: string }>> {
  const response = await request.get(`${API_BASE_URL}/homes/${homeId}/devices`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok()) {
    throw new Error(`Get devices failed: ${response.status()}`);
  }

  return response.json();
}

export async function createDevice(
  request: APIRequestContext,
  token: string,
  homeId: string,
  data: { name: string; firmwareId: string; roomId?: string }
): Promise<{ id: string; name: string }> {
  const response = await request.post(`${API_BASE_URL}/homes/${homeId}/devices`, {
    headers: { Authorization: `Bearer ${token}` },
    data,
  });

  if (!response.ok()) {
    throw new Error(`Create device failed: ${response.status()}`);
  }

  return response.json();
}

export async function deleteDevice(
  request: APIRequestContext,
  token: string,
  homeId: string,
  deviceId: string
): Promise<void> {
  const response = await request.delete(
    `${API_BASE_URL}/homes/${homeId}/devices/${deviceId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!response.ok() && response.status() !== 404) {
    throw new Error(`Delete device failed: ${response.status()}`);
  }
}
