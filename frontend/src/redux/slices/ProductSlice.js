// src/redux/slices/ProductSlice.js
import { createSlice } from "@reduxjs/toolkit";
import {
  fetchProductById,
  fetchRelatedProducts,
  fetchRatings,
  createProduct,
  updateProductWithImages,
} from "../thunks/ProductThunk";

const initialState = {
  product: null,
  related: [],
  ratings: { average: 0, counts: {}, list: [] },
  loading: false,
  relatedLoading: false,
  error: null,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    clearProduct: (state) => {
      state.product = null;
    },
  },
  extraReducers: (builder) => {
    builder
      /* ========= OBTENER PRODUCTO POR ID ========= */
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
        state.error = action.payload || action.error?.message || "Error al cargar producto";
      })

      /* ========= PRODUCTOS RELACIONADOS ========= */
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
        state.error =
          action.payload || action.error?.message || "Error al cargar relacionados";
      })

      /* ========= RATINGS ========= */
      .addCase(fetchRatings.fulfilled, (state, action) => {
        state.ratings = action.payload;
      })

      /* ========= CREAR PRODUCTO CON IMÁGENES ========= */
      .addCase(createProduct.pending, (state) => {
        state.creating = true;
        state.createError = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.creating = false;
        state.product = action.payload || null;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.creating = false;
        state.createError =
          action.payload ||
          action.error?.message ||
          "Error al crear el producto";
      })

      /* ========= EDITAR PRODUCTO CON IMÁGENES ========= */
      .addCase(updateProductWithImages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProductWithImages.fulfilled, (state, action) => {
        state.loading = false;
        // si devuelve el producto actualizado se guarda
        if (action.payload) {
          state.product = action.payload;
        }
      })
      .addCase(updateProductWithImages.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || action.error?.message || "Error al actualizar el producto";
      });
  },
});

export const { clearProduct } = productSlice.actions;
export default productSlice.reducer;
