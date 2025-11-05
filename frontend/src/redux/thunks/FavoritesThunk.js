// src/features/favorites/favoritesThunk.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import { getFavorites } from "../../services/FavoritesService";

export const fetchFavorites = createAsyncThunk(
  "favorites/fetchFavorites",
  async (_, { rejectWithValue }) => {
    try {
      const favorites = await getFavorites();
      return favorites;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
