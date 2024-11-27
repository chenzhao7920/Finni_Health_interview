import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isAuthenticated: false,
    user: null,
    loading: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      const { uid, email, accessToken } = action.payload;
      state.user = { uid, email, accessToken };
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
    },
    logout: (state) => {
      state.user = null;
    },
  },
});

// Export actions
export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;

// Export reducer
export default authSlice.reducer;
