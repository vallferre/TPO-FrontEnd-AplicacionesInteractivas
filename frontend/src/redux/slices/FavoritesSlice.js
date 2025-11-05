// src/features/favorites/favoritesSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { fetchFavorites } from "../thunks/FavoritesThunk";

const favoritesSlice = createSlice({
  name: "favorites",
  initialState: {
    favoriteIds: [],
    loading: false,
    error: null,
  },
  reducers: {
    removeFavorite: (state, action) => {
      state.favoriteIds = state.favoriteIds.filter(
        (id) => id !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.favoriteIds = action.payload;
        state.loading = false;
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.error = action.payload || "Error al cargar favoritos";
        state.loading = false;
      });
  },
});

export const { removeFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;
