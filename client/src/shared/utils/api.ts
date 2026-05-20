import * as SecureStore from 'expo-secure-store';

// Cambiar localhost por la IP de tu PC para que el celular pueda conectarse
const LOCAL_IP = '192.168.100.94';
const BASE_URL = `http://${LOCAL_IP}:8080/api/v1`;

async function getHeaders() {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  const token = await SecureStore.getItemAsync('userToken');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export const apiClient = {
  get: async (endpoint: string) => {
    const headers = await getHeaders();
    console.log(`[API] GET ${BASE_URL}${endpoint}`);
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, { headers });
      if (!response.ok) {
          const err = await response.json();
          throw new Error(err.error || `GET ${endpoint} failed`);
      }
      return response.json();
    } catch (e) {
      console.error(`[API ERROR] GET ${endpoint}:`, e);
      throw e;
    }
  },
  post: async (endpoint: string, body: any) => {
    const headers = await getHeaders();
    console.log(`[API] POST ${BASE_URL}${endpoint}`, body);
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });
      if (!response.ok) {
          const err = await response.json();
          throw new Error(err.error || 'Request failed');
      }
      return response.json();
    } catch (e) {
      console.error(`[API ERROR] POST ${endpoint}:`, e);
      throw e;
    }
  },
  delete: async (endpoint: string) => {
    const headers = await getHeaders();
    console.log(`[API] DELETE ${BASE_URL}${endpoint}`);
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers,
      });
      if (!response.ok) {
          const err = await response.json();
          throw new Error(err.error || 'Delete failed');
      }
      return response.json();
    } catch (e) {
      console.error(`[API ERROR] DELETE ${endpoint}:`, e);
      throw e;
    }
  },
};
