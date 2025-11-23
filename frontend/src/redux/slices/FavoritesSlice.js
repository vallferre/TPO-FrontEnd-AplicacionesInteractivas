// redux/slices/FavoritesSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE = "http://localhost:8080/users/favorites";

// ----------------------------------------------------------
// THUNKS
// ----------------------------------------------------------

export const fetchFavorites = createAsyncThunk(
  "favorites/fetchFavorites",
  async (token, { rejectWithValue }) => {
    try {
      const res = await axios.get(API_BASE, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Normalización: todos los IDs en un único array numérico
      return res.data.flatMap((fr) =>
        fr.favoriteProductIds.map((id) => Number(id))
      );
    } catch (err) {
      return rejectWithValue("No se pudieron cargar los favoritos");
    }
  }
);

export const addFavorite = createAsyncThunk(
  "favorites/addFavorite",
  async ({ token, productId }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        API_BASE,
        { productId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // ID del favorito agregado
      return Number(res.data.favoriteProductIds[0]);
    } catch (err) {
      return rejectWithValue("No se pudo agregar a favoritos");
    }
  }
);

export const deleteFavorite = createAsyncThunk(
  "favorites/deleteFavorite",
  async ({ token, productId }, { rejectWithValue }) => {
    try {
      await axios.delete(API_BASE, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data: { productId },
      });

      return Number(productId);
    } catch (err) {
      return rejectWithValue("No se pudo eliminar de favoritos");
    }
  }
);

// ----------------------------------------------------------
// INITIAL STATE
// ----------------------------------------------------------

const initialState = {
  items: [], // IDs numéricos
  loaded: false,
  loading: false,
  error: null,
};

// ----------------------------------------------------------
// SLICE
// ----------------------------------------------------------

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      // ===============================================
      // FETCH FAVORITES
      // ===============================================
      .addCase(fetchFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.loaded = true;
        state.items = action.payload; // array de IDs
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ===============================================
      // ADD FAVORITE
      // ===============================================
      .addCase(addFavorite.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addFavorite.fulfilled, (state, action) => {
        state.loading = false;

        const id = action.payload;
        if (!state.items.includes(id)) {
          state.items.push(id);
        }
      })
      .addCase(addFavorite.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ===============================================
      // DELETE FAVORITE
      // ===============================================
      .addCase(deleteFavorite.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFavorite.fulfilled, (state, action) => {
        state.loading = false;

        const id = action.payload;
        state.items = state.items.filter((x) => x !== id);
      })
      .addCase(deleteFavorite.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default favoritesSlice.reducer;
