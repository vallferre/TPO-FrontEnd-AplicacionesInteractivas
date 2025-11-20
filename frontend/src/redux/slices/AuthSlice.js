import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE = "http://localhost:8080";


// THUNK 


// Login
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials) => {
    const { data } = await axios.post(`${API_BASE}/auth/login`, credentials);
    return data; // { access_token }
  }
);

// Register
export const registerUser = createAsyncThunk(
  "auth/register",
  async (payload) => {
    const { data } = await axios.post(`${API_BASE}/auth/register`, payload);
    return data; // { access_token }
  }
);

// Fetch User (requiere token ya guardado)
export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchUser",
  async (_, { getState }) => {
    const token = getState().auth.token;

    const { data: user } = await axios.get(`${API_BASE}/users/`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return user;
  }
);

// Logout (solo limpia estado)
export const logoutUser = createAsyncThunk("auth/logout", async () => {
  return true;
});



// SLICE

const initialState = {
  token: null,
  user: null,
  isLoggedIn: false,
  loading: false,
  error: null,
  userUpdated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},

  extraReducers: (builder) => {

    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.access_token;
        state.isLoggedIn = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });


    // Register

    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.access_token;
        state.isLoggedIn = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });


    // Fetch User

    builder
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
        state.error = action.error.message;
      });


    // Logout

    builder.addCase(logoutUser.fulfilled, (state) => {
      state.token = null;
      state.user = null;
      state.isLoggedIn = false;
      state.loading = false;
      state.error = null;
      state.userUpdated = false;
    });
  },
});

export default authSlice.reducer;