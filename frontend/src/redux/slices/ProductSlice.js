import { createSlice } from "@reduxjs/toolkit";
import { fetchProductById, fetchRelatedProducts, fetchRatings } from "./productThunks";

const initialState = {
  product: null,
  related: [],
  ratings: { average: 0, counts: {}, list: [] },
  loading: false,
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
      .addCase(fetchProductById.pending, (state) => { state.loading = true; })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchRelatedProducts.fulfilled, (state, action) => {
        state.related = action.payload;
      })
      .addCase(fetchRatings.fulfilled, (state, action) => {
        state.ratings = action.payload;
      });
  }
});

export const { clearProduct } = productSlice.actions;
export default productSlice.reducer;
