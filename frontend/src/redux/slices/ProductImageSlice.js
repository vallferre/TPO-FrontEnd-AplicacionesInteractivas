// src/redux/slices/ProductImageSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";


export const fetchProductImages = createAsyncThunk(
  "productImages/fetchByProduct",
  async (productId, { rejectWithValue }) => {
    const { data } = await axios.get(`${API_BASE}/products/${productId}/images`);
    return Array.isArray(data) ? data : [];
    }
);


export const uploadProductImages = createAsyncThunk(
  "productImages/upload",
  async ({ token, productId, files }) => {
    for (const file of files) {
      const fd = new FormData();
      fd.append("file", file);

      await axios.post(`${API_BASE}/products/${productId}/images`, fd, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
    }
    return { productId, count: files.length };
  }
);



export const deleteProductImages = createAsyncThunk(
  "productImages/deleteMany",
  async ({ token, imageIds }) => {

    for (const imgId of imageIds) {
      await axios.delete(`${API_BASE}/images/${imgId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    return { deletedIds: imageIds };
  }
);


const initialState = {
  items: [],          // 🔹 lista de imágenes del producto actual
  loading: false,     // para el fetch
  uploading: false,
  deleting: false,
  error: null,
  lastUploadInfo: null, // {productId, count}
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
      state.items = [];
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
        state.loading = false;
        state.items = action.payload || [];
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
        state.lastUploadInfo = action.payload || null;
        // Opcionalmente podrías hacer un refetch después en el componente.
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
        const deletedIds = action.payload?.deletedIds || [];
        if (deletedIds.length > 0) {
          state.items = state.items.filter(
            (img) => !deletedIds.includes(img.id)
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
