import { createSlice } from "@reduxjs/toolkit";
import { fetchProductById, fetchRelatedProducts, fetchRatings } from "../thunks/ProductThunk";

const initialState = {
  product: null,
  related: [],
  ratings: { average: 0, counts: {}, list: [] }, // ✅ counts empieza como objeto
  loading: false,
  relatedLoading: false, // Nueva flag
  error: null,
};


const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    clearProduct: (state) => { state.product = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductById.pending, (state) => { 
        state.loading = true; 
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Productos relacionados
      .addCase(fetchRelatedProducts.pending, (state) => {
        state.relatedLoading = true; // Usa la flag específica
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
      .addCase(fetchRatings.fulfilled, (state, action) => {
        state.ratings = action.payload;
      });
  }
});

export const { clearProduct } = productSlice.actions;
export default productSlice.reducer;
