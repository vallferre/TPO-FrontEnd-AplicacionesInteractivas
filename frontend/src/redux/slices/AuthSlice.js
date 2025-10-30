// src/features/auth/authSlice.js
import { createSlice } from "@reduxjs/toolkit";
import {
  loginUser,
  registerUser,
  fetchCurrentUser,
  logoutUser,
} from "../thunks/AuthThunk";

const tokenLocal = localStorage.getItem("jwtToken");

const initialState = {
  token: tokenLocal || null,
  user: null,
  isLoggedIn: !!tokenLocal,
  loading: false,
  error: null,
  userUpdated: false, // 🔹 útil para actualizar navbar, perfil, etc.
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
      state.isLoggedIn = !!state.token;
    },
    clearAuthState(state) {
      state.token = null;
      state.user = null;
      state.isLoggedIn = false;
      state.loading = false;
      state.error = null;
      state.userUpdated = false;
      localStorage.removeItem("jwtToken");
    },
    markUserUpdated(state) {
      // 🔹 cuando cambia imagen, nombre, etc.
      state.userUpdated = !state.userUpdated;
    },
  },
  extraReducers: (builder) => {
    builder
      // 🔹 LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.access_token;
        state.isLoggedIn = true;
        localStorage.setItem("jwtToken", action.payload.access_token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // 🔹 REGISTER
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.access_token;
        state.isLoggedIn = true;
        localStorage.setItem("jwtToken", action.payload.access_token);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // 🔹 FETCH CURRENT USER
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isLoggedIn = true;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // 🔹 LOGOUT
      .addCase(logoutUser.fulfilled, (state) => {
        state.token = null;
        state.user = null;
        state.isLoggedIn = false;
        state.loading = false;
        localStorage.removeItem("jwtToken");
      });
  },
});

export const { setUser, clearAuthState, markUserUpdated } = authSlice.actions;
export default authSlice.reducer;
