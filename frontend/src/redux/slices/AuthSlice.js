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

// Fetch user avatar (BLOB)
export const fetchUserAvatar = createAsyncThunk(
  "auth/fetchUserAvatar",
  async (_, { getState }) => {
    const token = getState().auth.token;
    const user = getState().auth.user;

    const response = await axios.get(
      `${API_BASE}/users/${user.id}/image`,
      {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",

        // Axios NO lanzará error en 404 ni 204
        validateStatus: (status) => status < 500,
      }
    );

    // Si el usuario NO tiene imagen
    if (response.status === 404 || response.status === 204) {
      return null;   // Avatar nulo → no error
    }

    // Si tiene imagen
    return URL.createObjectURL(response.data);
  }
);

// Fetch user role
export const fetchUserRole = createAsyncThunk(
  "auth/fetchUserRole",
  async (_, { getState }) => {
    const token = getState().auth.token;

    const { data } = await axios.get(`${API_BASE}/users/role`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return data.role;
  }
);

//Edit
export const updateUserProfile = createAsyncThunk(
  "auth/updateUserProfile",
  async ({ formData, profileImage }, { getState }) => {

    const token = getState().auth.token;

    const submitData = new FormData();
    submitData.append(
      "user",
      new Blob([JSON.stringify(formData)], { type: "application/json" })
    );

    if (profileImage) {
      submitData.append("fileImage", profileImage);
    }

    // PUT al back
    const { data } = await axios.put(
      `${API_BASE}/users/edit`,
      submitData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return data;
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
  avatar: null,
  role: null,
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

      // Avatar
    builder
      .addCase(fetchUserAvatar.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchUserAvatar.fulfilled, (state, action) => {
        state.avatar = action.payload;
      })
      .addCase(fetchUserAvatar.rejected, (state, action) => {
        state.avatar = null;
      });


    // Role
    builder
      .addCase(fetchUserRole.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchUserRole.fulfilled, (state, action) => {
        state.role = action.payload;
      })
      .addCase(fetchUserRole.rejected, (state, action) => {
        state.role = null;
      });

    // Update Profile
    builder
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state) => {
        state.loading = false;
        state.userUpdated = true;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
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