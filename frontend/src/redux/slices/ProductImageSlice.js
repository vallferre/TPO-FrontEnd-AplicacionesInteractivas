// src/redux/slices/ProductImageSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { uploadProductImages } from "../thunks/ProductImageThunk";

const initialState = {
  uploading: false,
  error: null,
  lastUploadInfo: null, // {productId, count}
};

const productImageSlice = createSlice({
  name: "productImages",
  initialState,
  reducers: {
    clearImageState(state) {
      state.uploading = false;
      state.error = null;
      state.lastUploadInfo = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadProductImages.pending, (state) => {
        state.uploading = true;
        state.error = null;
      })
      .addCase(uploadProductImages.fulfilled, (state, action) => {
        state.uploading = false;
        state.lastUploadInfo = action.payload || null;
      })
      .addCase(uploadProductImages.rejected, (state, action) => {
        state.uploading = false;
        state.error =
          action.payload ||
          action.error?.message ||
          "Error al subir las imágenes";
      });
  },
});

export const { clearImageState } = productImageSlice.actions;
export default productImageSlice.reducer;
