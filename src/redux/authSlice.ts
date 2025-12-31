import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getAuthToken } from "../utils/cookieManager";

interface User {
  _id?: string;
  email?: string;
  username?: string;
  name?: string;
  password?: string;
  isAdmin?: boolean;
  avatar?: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  token: null,
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'authSlice',
  initialState,
  reducers: {
    // Manual login
    loginSuccess: (state, action: PayloadAction<{ token: string; user: User }>) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.error = null;
      state.loading = false;
      // Persist to localStorage
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },

    // OAuth login
    oauthLoginSuccess: (state, action: PayloadAction<{ token: string; user: User }>) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.error = null;
      state.loading = false;
      // Persist to localStorage
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },

    // Logout
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      // Clear localStorage
      localStorage.removeItem('user');
    },

    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    // Set error
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    // Restore from localStorage
    restoreAuth: (state) => {
      const token = getAuthToken();
      const user = localStorage.getItem('user');
      if (token && user) {
        try {
          state.token = token;
          state.user = JSON.parse(user);
          state.isAuthenticated = true;
        } catch (err) {
          console.error('Failed to parse stored user data:', err);
          localStorage.removeItem('user');
          state.isAuthenticated = false;
        }
      }
    },

    // Update user profile
    updateUserProfile: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      if (state.user) {
        localStorage.setItem('user', JSON.stringify(action.payload));
      }
    },
  },
});

export const { loginSuccess, oauthLoginSuccess, logout, setLoading, setError, restoreAuth, updateUserProfile } = authSlice.actions;
export default authSlice.reducer;
