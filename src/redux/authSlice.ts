import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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
  token: localStorage.getItem('token') || localStorage.getItem('auth_token') || null,
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null,
  isAuthenticated: !!(localStorage.getItem('token') || localStorage.getItem('auth_token')),
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
    },

    // OAuth login
    oauthLoginSuccess: (state, action: PayloadAction<{ token: string; user: User }>) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.error = null;
      state.loading = false;
    },

    // Logout
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
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
      const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
      const user = localStorage.getItem('user');
      if (token && user) {
        state.token = token;
        state.user = JSON.parse(user);
        state.isAuthenticated = true;
      }
    },
  },
});

export const { loginSuccess, oauthLoginSuccess, logout, setLoading, setError, restoreAuth } = authSlice.actions;
export default authSlice.reducer;
