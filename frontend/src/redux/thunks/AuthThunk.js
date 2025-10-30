// src/features/auth/authThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  apiLogin,
  apiRegister,
  apiFetchCurrentUser,
  apiSendWelcomeNotification,
} from "../../services/AuthService";
import { clearAuthState } from "../slices/AuthSlice";

const API_BASE = "http://localhost:8080";

// 🔹 LOGIN
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue, dispatch }) => {
    try {
      const data = await apiLogin(credentials);
      if (data.access_token) {
        localStorage.setItem("jwtToken", data.access_token);
        // Cargar usuario inmediatamente después del login
        await dispatch(fetchCurrentUser(data.access_token));
      }
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// 🔹 REGISTER
export const registerUser = createAsyncThunk(
  "auth/register",
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const data = await apiRegister(payload);
      if (data.access_token) {
        localStorage.setItem("jwtToken", data.access_token);
        await apiSendWelcomeNotification(data.access_token);
        await dispatch(fetchCurrentUser(data.access_token));
      }
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// 🔹 FETCH CURRENT USER
export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchUser",
  async (tokenArg, { getState, rejectWithValue }) => {
    try {
      const token = tokenArg || getState().auth.token;
      if (!token) throw new Error("No hay token disponible");

      const user = await apiFetchCurrentUser(token);

      // Intentar obtener imagen del usuario
      const imageRes = await fetch(`${API_BASE}/users/${user.id}/image`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (imageRes.ok) {
        const blob = await imageRes.blob();
        user.image = URL.createObjectURL(blob);
      } else {
        user.image =
          "https://cdn-icons-png.flaticon.com/512/149/149071.png";
      }

      return user;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// 🔹 LOGOUT
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { dispatch }) => {
    // si el backend requiere invalidar el token, hacelo acá
    dispatch(clearAuthState());
    return true;
  }
);
