import { createSlice } from "@reduxjs/toolkit";
import { checkoutOrder } from "../thunks/OrderThunk";

const orderSlice = createSlice({
  name: "order",
  initialState: {
    currentOrder: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearOrder: (state) => {
      state.currentOrder = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkoutOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkoutOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(checkoutOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error during checkout";
      });
  },
});

export const { clearOrder } = orderSlice.actions;
export default orderSlice.reducer;
