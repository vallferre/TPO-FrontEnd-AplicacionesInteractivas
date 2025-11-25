import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";

export const fetchUserAvatar = createAsyncThunk(
  "userImage/fetchAvatar",
  async (_, { getState, rejectWithValue }) => {
    const { token, user } = getState().auth;

    if (!token || !user?.id) {
      return rejectWithValue("Usuario no logueado");
    }

    const response = await axios.get(
      `${API_BASE}/users/${user.id}/image`,
      {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      }
    );

    return URL.createObjectURL(response.data);

    }
);


const initialState = {
  avatar: null,
  loading: false,
  error: null,
};

const userImageSlice = createSlice({
  name: "userImage",
  initialState,
  reducers: {
    clearAvatar(state) {
      state.avatar = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserAvatar.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserAvatar.fulfilled, (state, action) => {
        state.loading = false;
        state.avatar = action.payload;
      })
      .addCase(fetchUserAvatar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAvatar } = userImageSlice.actions;
export default userImageSlice.reducer;
