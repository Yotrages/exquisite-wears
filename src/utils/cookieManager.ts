/**
 * Secure Cookie Manager
 * Handles token storage in secure HTTP-only cookies (when available)
 * Falls back to sessionStorage for development
 */

const COOKIE_NAME = 'auth_token';
const COOKIE_EXPIRY_DAYS = 7;

/**
 * Set authentication token in secure cookie
 * In production: Uses secure, HTTP-only cookies
 * In development: Uses sessionStorage as fallback
 */
export const setAuthToken = (token: string): void => {
  if (typeof window === 'undefined') return;

  try {
    // Try to use cookie (secure in production)
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + COOKIE_EXPIRY_DAYS);
    
    const cookieValue = `${COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; Max-Age=${COOKIE_EXPIRY_DAYS * 24 * 60 * 60}`;
    const isSecure = window.location.protocol === 'https:';
    const sameSite = 'SameSite=Strict';
    const secure = isSecure ? 'Secure;' : '';
    
    document.cookie = `${cookieValue}; ${secure} ${sameSite}`;
    
    // Also use sessionStorage as backup (won't persist across browser close)
    sessionStorage.setItem(COOKIE_NAME, token);
  } catch (error) {
    console.warn('Failed to set secure cookie, using sessionStorage:', error);
    sessionStorage.setItem(COOKIE_NAME, token);
  }
};

/**
 * Get authentication token from secure storage
 */
export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;

  try {
    // First try to get from sessionStorage (more reliable)
    const token = sessionStorage.getItem(COOKIE_NAME);
    if (token) return token;

    // Fall back to reading from cookies
    const name = `${COOKIE_NAME}=`;
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');
    
    for (let cookie of cookieArray) {
      cookie = cookie.trim();
      if (cookie.indexOf(name) === 0) {
        return cookie.substring(name?.length);
      }
    }
    
    return null;
  } catch (error) {
    console.warn('Failed to get auth token:', error);
    return null;
  }
};

/**
 * Remove authentication token from secure storage
 */
export const removeAuthToken = (): void => {
  if (typeof window === 'undefined') return;

  try {
    // Remove from sessionStorage
    sessionStorage.removeItem(COOKIE_NAME);
    
    // Remove from cookies by setting expiry to past
    document.cookie = `${COOKIE_NAME}=; Max-Age=-99999; Path=/;`;
  } catch (error) {
    console.warn('Failed to remove auth token:', error);
  }
};

/**
 * Check if token exists and is valid
 */
export const hasAuthToken = (): boolean => {
  return getAuthToken() !== null;
};

/**
 * Invalidate token on 401 Unauthorized
 */
export const invalidateToken = (): void => {
  removeAuthToken();
};
