// src/redux/slices/ProductImageSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";

/* ========== FETCH IMÁGENES POR PRODUCTO ========== */
export const fetchProductImages = createAsyncThunk(
  "productImages/fetchByProduct",
  async (productId) => {
    const { data } = await axios.get(
      `${API_BASE}/products/${productId}/images`
    );
    return Array.isArray(data) ? data : [];
  }
);

/* ========== SUBIR UNA IMAGEN ========== */
export const uploadProductImages = createAsyncThunk(
  "productImages/upload",
  async ({ token, productId, formData }) => {
    await axios.post(`${API_BASE}/products/${productId}/images`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return { productId };
  }
);


/* ========== ELIMINAR UNA IMAGEN ========== */
export const deleteProductImages = createAsyncThunk(
  "productImages/deleteMany",
  async ({ token, imageId, productId }) => {
    await axios.delete(`${API_BASE}/images/${imageId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return { deletedId: imageId, productId };
  }
);

const initialState = {
  items: {},
  loading: false,
  uploading: false,
  deleting: false,
  error: null,
  lastUploadInfo: null,
};

const productImageSlice = createSlice({
  name: "productImages",
  initialState,
  reducers: {
    clearImageState(state) {
      state.loading = false;
      state.uploading = false;
      state.deleting = false;
      state.error = null;
      state.lastUploadInfo = null;
      state.items = {};
    },
  },
  extraReducers: (builder) => {
    builder
      /* ========== FETCH IMÁGENES POR PRODUCTO ========== */
      .addCase(fetchProductImages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductImages.fulfilled, (state, action) => {
        const productId = action.meta.arg;
        state.items[productId] = action.payload.map((img) => ({
          ...img,
          url: `${API_BASE}/images/${img.id}`,
        }));
        state.loading = false;
      })
      .addCase(fetchProductImages.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ||
          action.error?.message ||
          "Error al obtener las imágenes";
      })

      /* ========== SUBIR IMÁGENES ========== */
      .addCase(uploadProductImages.pending, (state) => {
        state.uploading = true;
        state.error = null;
      })
      .addCase(uploadProductImages.fulfilled, (state, action) => {
        state.uploading = false;
        state.lastUploadInfo = {
          productId: action.payload?.productId,
          count: 1,
        };
      })
      .addCase(uploadProductImages.rejected, (state, action) => {
        state.uploading = false;
        state.error =
          action.payload ||
          action.error?.message ||
          "Error al subir las imágenes";
      })

      /* ========== ELIMINAR IMÁGENES ========== */
      .addCase(deleteProductImages.pending, (state) => {
        state.deleting = true;
        state.error = null;
      })
      .addCase(deleteProductImages.fulfilled, (state, action) => {
        state.deleting = false;
        const { deletedId, productId } = action.payload || {};

        if (
          deletedId &&
          state.items[productId] &&
          Array.isArray(state.items[productId])
        ) {
          state.items[productId] = state.items[productId].filter(
            (img) => img.id !== deletedId
          );
        }
      })
      .addCase(deleteProductImages.rejected, (state, action) => {
        state.deleting = false;
        state.error =
          action.payload ||
          action.error?.message ||
          "Error al eliminar las imágenes";
      });
  },
});

export const { clearImageState } = productImageSlice.actions;
export default productImageSlice.reducer;
