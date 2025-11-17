// src/features/slices/ProductSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { fetchProductById, fetchRelatedProducts, fetchRatings, createProductWithImages } from "../thunks/ProductThunk";

const initialState = {
  product: null,
  related: [],
  ratings: { average: 0, counts: {}, list: [] },
  loading: false,
  relatedLoading: false,
  error: null,
  creating: false,          // 🔹 flag para crear
  createError: null,        // 🔹 error de creación
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    clearProduct: (state) => { state.product = null; },
  },
  extraReducers: (builder) => {
    builder
      // -------- Producto por id --------
      .addCase(fetchProductById.pending, (state) => { 
        state.loading = true; 
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // -------- Relacionados --------
      .addCase(fetchRelatedProducts.pending, (state) => {
        state.relatedLoading = true;
        state.error = null;
      })
      .addCase(fetchRelatedProducts.fulfilled, (state, action) => {
        state.relatedLoading = false;
        state.related = action.payload;
      })
      .addCase(fetchRelatedProducts.rejected, (state, action) => {
        state.relatedLoading = false;
        state.error = action.payload;
      })

      // -------- Ratings --------
      .addCase(fetchRatings.fulfilled, (state, action) => {
        state.ratings = action.payload;
      })

      // -------- Crear + imágenes --------
      .addCase(createProductWithImages.pending, (state) => {
        state.creating = true;
        state.createError = null;
      })
      .addCase(createProductWithImages.fulfilled, (state, action) => {
        state.creating = false;
        // Opcional: setear el último producto creado
        state.product = action.payload || null;
      })
      .addCase(createProductWithImages.rejected, (state, action) => {
        state.creating = false;
        state.createError = action.error?.message || "Error al crear producto";
      });
  }
});

export const { clearProduct } = productSlice.actions;
export default productSlice.reducer;
