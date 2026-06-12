import * as SecureStore from 'expo-secure-store';

// ⚠️ IMPORTANTE: Cambiar esta IP por la IP de tu PC en la red local
// para que Expo Go en tu celular pueda conectarse al backend.
// Ejemplo: '192.168.1.100'
const LOCAL_IP = '192.168.100.251';
const BASE_URL = `http://${LOCAL_IP}:8080/api/v1`;

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
    console.log(`[API] GET ${BASE_URL}${endpoint}`);
    try {
      const response = await fetchWithTimeout(`${BASE_URL}${endpoint}`, { headers });
      if (!response.ok) {
        const err = await response.json().catch(() => ({ error: `Error ${response.status}` }));
        throw new Error(err.error || `Error al obtener datos`);
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
      console.error(`[API ERROR] POST ${endpoint}:`, e);
      throw e;
    }
  },
  delete: async (endpoint: string) => {
    const headers = await getHeaders();
    console.log(`[API] DELETE ${BASE_URL}${endpoint}`);
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
      console.error(`[API ERROR] DELETE ${endpoint}:`, e);
      throw e;
    }
  },
};
