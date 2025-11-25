// src/redux/slices/CategoryImagesSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";

// THUNK: trae la imagen de una categoría y genera la URL blob
export const fetchCategoryImage = createAsyncThunk(
  "categoryImages/fetchByCategoryId",
  async (categoryId) => {
    const res = await axios.get(`${API_BASE}/categories/${categoryId}/image`, {
      responseType: "blob",
    });

    const imageUrl = URL.createObjectURL(res.data);
    return { categoryId, imageUrl };
  }
);

const categoryImagesSlice = createSlice({
  name: "categoryImages",
  initialState: {
    byId: {},       // { [categoryId]: imageUrl }
    loading: false,
    error: null,
  },
  reducers: {
    clearCategoryImages: (state) => {
      Object.values(state.byId).forEach((url) => {
        if (url && url.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      });
      state.byId = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategoryImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategoryImage.fulfilled, (state, action) => {
        state.loading = false;
        const { categoryId, imageUrl } = action.payload;

        const prevUrl = state.byId[categoryId];
        if (prevUrl && prevUrl.startsWith("blob:")) {
          URL.revokeObjectURL(prevUrl);
        }

        state.byId[categoryId] = imageUrl;
      })
      .addCase(fetchCategoryImage.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error?.message || "Error al cargar la imagen de categoría";
      });
  },
});

export const { clearCategoryImages } = categoryImagesSlice.actions;

// Selector
export const selectCategoryImageById = (state, categoryId) =>
  state.categoryImages.byId[categoryId];

export default categoryImagesSlice.reducer;
