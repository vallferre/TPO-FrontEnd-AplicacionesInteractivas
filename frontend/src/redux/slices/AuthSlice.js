// src/features/auth/authSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { loginUser, registerUser, fetchCurrentUser, logoutUser } from "../thunks/AuthThunk";

const initialState = {
  token: null,
  user: {},            // <- objeto, no null
  isLoggedIn: false,
  loading: false,
  error: null,
  userUpdated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    markUserUpdated(state) {
      state.userUpdated = !state.userUpdated;
    },
  },
  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload?.access_token || null;
        state.isLoggedIn = !!state.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || "Error al iniciar sesión";
      })

      // REGISTER
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload?.access_token || null;
        state.isLoggedIn = !!state.token;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || "Error al registrarse";
      })

      // FETCH CURRENT USER
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload || {};
        state.isLoggedIn = !!state.token;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || "No se pudo obtener el usuario";
      })

      // LOGOUT
      .addCase(logoutUser.fulfilled, (state) => {
        state.token = null;
        state.user = {};
        state.isLoggedIn = false;
        state.loading = false;
        state.error = null;
        state.userUpdated = false;
      });
  },
});

export const { markUserUpdated } = authSlice.actions;
export default authSlice.reducer;
