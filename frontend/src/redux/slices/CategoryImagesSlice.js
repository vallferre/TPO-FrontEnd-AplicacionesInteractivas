// src/redux/slices/CategoryImagesSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";

/* ========== FETCH IMAGEN POR CATEGORÍA ========== */
export const fetchCategoryImage = createAsyncThunk(
  "categoryImages/fetchByCategoryId",
  async (categoryId) => {
    const { data } = await axios.get(
      `${API_BASE}/categories/${categoryId}/image`,
      { responseType: "blob" }
    );
    const imageUrl = URL.createObjectURL(data);
    return { categoryId, imageUrl };
  }
);

/* ========== SUBIR/CREAR UNA IMAGEN ========== */
export const createCategoryImage = createAsyncThunk(
  "categoryImages/create",
  async ({ token, categoryId, fileImage }) => {
    const formData = new FormData();
    formData.append("image", fileImage);

    await axios.post(`${API_BASE}/categories/${categoryId}/image`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return { categoryId };
  }
);

/* ========== ELIMINAR UNA IMAGEN ========== */
export const deleteCategoryImage = createAsyncThunk(
  "categoryImages/delete",
  async ({ token, categoryId }) => {
    await axios.delete(`${API_BASE}/categories/${categoryId}/image`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return { categoryId };
  }
);

const initialState = {
  byId: {},
  loading: false,
  uploading: false,
  deleting: false,
  error: null,
  lastUploadInfo: null,
};

const categoryImagesSlice = createSlice({
  name: "categoryImages",
  initialState,
  reducers: {
    clearCategoryImages: (state) => {
      Object.values(state.byId).forEach((url) => {
        if (url && url.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      });
      state.byId = {};
      state.loading = false;
      state.uploading = false;
      state.deleting = false;
      state.error = null;
      state.lastUploadInfo = null;
    },
    clearSingleCategoryImage: (state, action) => {
      const categoryId = action.payload;
      const prevUrl = state.byId[categoryId];
      if (prevUrl && prevUrl.startsWith("blob:")) {
        URL.revokeObjectURL(prevUrl);
      }
      delete state.byId[categoryId];
    },
  },
  extraReducers: (builder) => {
    builder
      /* ========== FETCH IMAGEN POR CATEGORÍA ========== */
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
          action.payload ||
          action.error?.message ||
          "Error al obtener la imagen de categoría";
      })

      /* ========== CREAR/SUBIR IMAGEN ========== */
      .addCase(createCategoryImage.pending, (state) => {
        state.uploading = true;
        state.error = null;
      })
      .addCase(createCategoryImage.fulfilled, (state, action) => {
        state.uploading = false;
        state.lastUploadInfo = {
          categoryId: action.payload?.categoryId,
          timestamp: Date.now(),
        };
      })
      .addCase(createCategoryImage.rejected, (state, action) => {
        state.uploading = false;
        state.error =
          action.payload ||
          action.error?.message ||
          "Error al subir la imagen";
      })

      /* ========== ELIMINAR IMAGEN ========== */
      .addCase(deleteCategoryImage.pending, (state) => {
        state.deleting = true;
        state.error = null;
      })
      .addCase(deleteCategoryImage.fulfilled, (state, action) => {
        state.deleting = false;
        const { categoryId } = action.payload || {};

        if (categoryId && state.byId[categoryId]) {
          const prevUrl = state.byId[categoryId];
          if (prevUrl && prevUrl.startsWith("blob:")) {
            URL.revokeObjectURL(prevUrl);
          }
          delete state.byId[categoryId];
        }
      })
      .addCase(deleteCategoryImage.rejected, (state, action) => {
        state.deleting = false;
        state.error =
          action.payload ||
          action.error?.message ||
          "Error al eliminar la imagen";
      });
  },
});

export const { clearCategoryImages, clearSingleCategoryImage } = categoryImagesSlice.actions;
export default categoryImagesSlice.reducer;