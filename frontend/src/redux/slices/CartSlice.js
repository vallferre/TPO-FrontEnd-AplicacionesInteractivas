import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = "http://localhost:8080/cart";

const headers = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

// ------------------- THUNKS -------------------

// Obtener carrito
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async ({ token }, thunkAPI) => {
    const res = await axios.get(API, headers(token));
    return res.data;
  }
);

// Agregar producto (cantidad 1 por defecto)
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, token, quantity = 1 }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        API + "/add",
        { productId, quantity },
        headers(token)
      );
      return res.data;

    } catch (error) {
      const status = error.response?.status;
      const data = error.response?.data;

      // ===================
      // 403 Forbidden Cases
      // ===================
      if (status === 403) {
        // CASO 1: Forbidden sin cuerpo → intentar agregar su propio producto
        if (!data || Object.keys(data).length === 0) {
          return rejectWithValue("No puedes agregar tu propio producto al carrito.");
        }

        // CASO 2: JSON de Spring Security (admin o sin permisos)
        if (data?.message === "Access Denied") {
          return rejectWithValue("No tienes permisos para realizar esta acción.");
        }

        // fallback por seguridad
        return rejectWithValue("Acceso denegado.");
      }

      // ===================
      // Otros errores
      // ===================
      const message =
        data?.message ||
        data?.error ||
        "No se pudo agregar el producto al carrito.";

      return rejectWithValue(message);
    }
  }
);



// Quitar unidades de un producto
export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async ({ productId, number = 1, token }, thunkAPI) => {
    const res = await axios.delete(`${API}/remove/${productId}?number=${number}`, headers(token));
    return res.data;
  }
);

// Vaciar carrito
export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async ({ token }, thunkAPI) => {
    await axios.delete(`${API}/clear`, headers(token));
    return { items: [], total: 0 };
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
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.total = action.payload.total;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "No se pudo cargar el carrito";
      })

      // ADD
      .addCase(addToCart.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.total = action.payload.total;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.error = action.error.message || "No se pudo agregar producto";
      })

      // REMOVE
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.total = action.payload.total;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.error = action.error.message || "No se pudo eliminar producto";
      })

      // CLEAR
      .addCase(clearCart.fulfilled, (state, action) => {
        state.items = [];
        state.total = 0;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.error = action.error.message || "No se pudo vaciar carrito";
      });
  },
});

export default CartSlice.reducer;
