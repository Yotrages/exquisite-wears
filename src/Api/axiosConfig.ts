import axios from 'axios';
import { getAuthToken, removeAuthToken } from '../utils/cookieManager';

const API_BASE = import.meta.env.VITE_API_BASE;

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor: Add token to all requests if available
 * Uses secure cookie storage instead of localStorage
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response interceptor: Handle errors and token expiry
 * - 401: Token expired or invalid, clear and redirect to login
 * - 403: Forbidden (no permissions)
 * - 5xx: Server errors
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      removeAuthToken();
      
      // Token will be cleared by removeAuthToken() above
      // Redux state will be cleared when user navigates to login
      
      // Redirect to login if not already there
      if (window.location.pathname !== '/login') {
        window.location.href = `/login?redirect=${window.location.pathname}`;
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
