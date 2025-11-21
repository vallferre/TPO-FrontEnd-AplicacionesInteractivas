// src/redux/slices/CartSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = "http://localhost:8080/cart";

const headers = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

// ------------------- THUNKS -------------------

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async ({ token }, thunkAPI) => {
    try {
      const res = await axios.get(`${API}`, headers(token));
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue("No se pudo cargar el carrito");
    }
  }
);

export const increaseQuantity = createAsyncThunk(
  "cart/increase",
  async ({ productId, token }, thunkAPI) => {
    try {
      const res = await axios.post(
        `${API}/increase`,
        { productId },
        headers(token)
      );
      return res.data;
    } catch {
      return thunkAPI.rejectWithValue("Stock insuficiente");
    }
  }
);

export const decreaseQuantity = createAsyncThunk(
  "cart/decrease",
  async ({ productId, token }, thunkAPI) => {
    try {
      const res = await axios.post(
        `${API}/decrease`,
        { productId },
        headers(token)
      );
      return res.data;
    } catch {
      return thunkAPI.rejectWithValue("Error al disminuir cantidad");
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "cart/delete",
  async ({ productId, token }, thunkAPI) => {
    try {
      const res = await axios.post(
        `${API}/delete`,
        { productId },
        headers(token)
      );
      return res.data;
    } catch {
      return thunkAPI.rejectWithValue("No se pudo eliminar el producto");
    }
  }
);

// ------------------- SLICE -------------------

const CartSlice = createSlice({
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

      // FETCH
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.total = action.payload.total;
        state.error = null;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE OPERATIONS (INCREASE / DECREASE / DELETE)
      .addCase(increaseQuantity.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.total = action.payload.total;
      })
      .addCase(decreaseQuantity.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.total = action.payload.total;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.total = action.payload.total;
      });
  },
});

export default CartSlice.reducer;
