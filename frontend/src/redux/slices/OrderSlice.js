import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const URL = "http://localhost:8080";

export const checkoutOrder = createAsyncThunk(
  "cart/checkout",
  async ({ token }) => {
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

export const getOrderById = createAsyncThunk(
  "order/getById",
  async ({ orderId, token }) => {
    const { data } = await axios.get(`${URL}/orders/${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  }
);

export const getUserOrders = createAsyncThunk(
  "order/getUserOrders",
  async ({ page = 0, sortOrder = "desc", token }) => {
    const { data } = await axios.get(
      `${URL}/orders/user?page=${page}&size=10&sort=${sortOrder}`,
      {
        headers: {
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
    currentOrder: null,
    orders: [],
    totalPages: 1,
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
        state.error = action.error?.message;
      });

    builder
      .addCase(getOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(getOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message;
      });

    builder
      .addCase(getUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        const pageData = action.payload;
        state.orders = Array.isArray(pageData.content)
          ? pageData.content
          : Array.isArray(pageData)
          ? pageData
          : [];
        state.totalPages = pageData.totalPages ?? 1;
      })
      .addCase(getUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearOrder } = orderSlice.actions;
export default orderSlice.reducer;
