import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const URL = "http://localhost:8080";

export const checkoutOrder = createAsyncThunk(
  "cart/checkout",
  async ({ token }) => {
    if (!token) throw new Error("No token found");

    const { data } = await axios.post(
      `${URL}/cart/checkout`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState: {
    currentOrder: [],
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
        state.currentOrder = [...state.currentOrder, action.payload];
      })
      .addCase(checkoutOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error during checkout";
      });
  },
});

export const { clearOrder } = orderSlice.actions;
export default orderSlice.reducer;
