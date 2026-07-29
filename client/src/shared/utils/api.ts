import * as SecureStore from 'expo-secure-store';

// ⚠️ IMPORTANTE: Cambiar esta IP por la IP de tu PC en la red local
// para que Expo Go en tu celular pueda conectarse al backend.
// En producción, usar la URL de tu servidor (ej: https://api.tuapp.com)
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.100.4:8080/api/v1';
const BASE_URL = API_URL;

// Timeout para requests (5 segundos)
const FETCH_TIMEOUT = 5000;

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

async function fetchWithTimeout(url: string, options: RequestInit, timeout = FETCH_TIMEOUT) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Tiempo de espera agotado. Verifica tu conexión a internet.');
    }
    throw new Error('Error de conexión. Verifica que el servidor esté activo.');
  }
}

export const apiClient = {
  get: async (endpoint: string) => {
    const headers = await getHeaders();
    try {
      const response = await fetchWithTimeout(`${BASE_URL}${endpoint}`, { headers });
      if (!response.ok) {
        const err = await response.json().catch(() => ({ error: `Error ${response.status}` }));
        throw new Error(err.error || `Error al obtener datos`);
      }
      return response.json();
    } catch (e) {
      throw e;
    }
  },
  post: async (endpoint: string, body: any) => {
    const headers = await getHeaders();
    try {
      const response = await fetchWithTimeout(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({ error: 'Error en la petición' }));
        throw new Error(err.error || 'Error al procesar la solicitud');
      }
      return response.json();
    } catch (e) {
      throw e;
    }
  },
  delete: async (endpoint: string) => {
    const headers = await getHeaders();
    try {
      const response = await fetchWithTimeout(`${BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers,
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({ error: 'Error al eliminar' }));
        throw new Error(err.error || 'Error al eliminar el recurso');
      }
      return response.json();
    } catch (e) {
      throw e;
    }
  },
  patch: async (endpoint: string, body: any) => {
    const headers = await getHeaders();
    try {
      const response = await fetchWithTimeout(`${BASE_URL}${endpoint}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({ error: 'Error en la petición' }));
        throw new Error(err.error || 'Error al procesar la solicitud');
      }
      return response.json();
    } catch (e) {
      throw e;
    }
  },
};