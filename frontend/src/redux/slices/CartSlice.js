import { createSlice } from "@reduxjs/toolkit";
import {
  fetchCartThunk,
  addToCartThunk,
  removeFromCartThunk,
  deleteProductThunk,
} from "../thunks/CartThunk";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    total: 0,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 🛒 FETCH CART
      .addCase(fetchCartThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCartThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || [];
        state.total = action.payload.total || 0;
      })
      .addCase(fetchCartThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch cart";
      })

      // ➕ ADD TO CART
      .addCase(addToCartThunk.fulfilled, (state, action) => {
        state.items = action.payload.items || [];
        state.total = action.payload.total || 0;
      })
      .addCase(addToCartThunk.rejected, (state, action) => {
        state.error = action.payload || "Error adding to cart";
      })

      // ➖ REMOVE ONE
      .addCase(removeFromCartThunk.fulfilled, (state, action) => {
        state.items = action.payload.items || [];
        state.total = action.payload.total || 0;
      })
      .addCase(removeFromCartThunk.rejected, (state, action) => {
        state.error = action.payload || "Error removing product";
      })

      // ❌ DELETE PRODUCT
      .addCase(deleteProductThunk.fulfilled, (state, action) => {
        state.items = action.payload.items || [];
        state.total = action.payload.total || 0;
      })
      .addCase(deleteProductThunk.rejected, (state, action) => {
        state.error = action.payload || "Error deleting product";
      });
  },
});

export default cartSlice.reducer;
