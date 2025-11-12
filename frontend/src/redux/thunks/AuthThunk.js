// src/features/auth/authThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE = "http://localhost:8080";

// 🔹 LOGIN
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { dispatch }) => {
    const { data } = await axios.post(`${API_BASE}/auth/login`, credentials);
    if (data?.access_token) {
      await dispatch(fetchCurrentUser(data.access_token));
    }
    return data; // { access_token }
  }
);

// 🔹 REGISTER
export const registerUser = createAsyncThunk(
  "auth/register",
  async (payload, { dispatch }) => {
    const { data } = await axios.post(`${API_BASE}/auth/register`, payload);

    if (data?.access_token) {
      // Notificación de bienvenida (si falla no bloquea)
      axios.post(
        `${API_BASE}/api/notifications/welcome`,
        {},
        { headers: { Authorization: `Bearer ${data.access_token}` } }
      ).catch(() => {});

      await dispatch(fetchCurrentUser(data.access_token));
    }
    return data; // { access_token }
  }
);

// 🔹 TRAER USUARIO
export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchUser",
  async (forcedToken, { getState }) => {
    const token = forcedToken || getState().auth.token;
    if (!token) throw new Error("No hay token disponible");

    const { data: user } = await axios.get(`${API_BASE}/users/`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Imagen opcional (si falla, asigna un placeholder)
    await axios
      .get(`${API_BASE}/users/${user.id}/image`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      })
      .then((res) => {
        user.image = URL.createObjectURL(res.data);
      })
      .catch(() => {
        user.image = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
      });

    return user; // { id, username, ... , image }
  }
);

// 🔹 LOGOUT (el slice limpia el estado en fulfilled)
export const logoutUser = createAsyncThunk("auth/logout", async () => {
  return true;
});
