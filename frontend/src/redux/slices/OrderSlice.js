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

export const getOrderById = createAsyncThunk(
  "order/getById",
  async ({ orderId, token }) => {
    if (!token) throw new Error("No token found");

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
  async ({ page, sortOrder, token }) => {
    if (!token) throw new Error("No token found");

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
    currentOrder: [],
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
        state.currentOrder = [...state.currentOrder, action.payload];
      })
      .addCase(checkoutOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error during checkout";
      });

    // GET ORDER BY ID
    builder
      .addCase(getOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = [...state.currentOrder, action.payload];
      })
      .addCase(getOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || "Error fetching order details";
      });

    builder
      .addCase(getUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = [...state.currentOrder, action.payload.content];
        state.totalPages = action.payload.totalPages;
      })
      .addCase(getUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearOrder } = orderSlice.actions;
export default orderSlice.reducer;
