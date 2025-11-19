// src/redux/slices/ProductSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getRelatedProducts,getProductRatings } from "../../services/ProductService";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";

/* ========== PRODUCTO POR ID (YA NO USA ProductService) ========== */

export const fetchProductById = createAsyncThunk(
  "product/fetchById",
  async (id, { rejectWithValue }) => {
    const { data } = await axios.get(`${API_BASE}/products/id/${id}`);
    return data; // objeto producto
  }
);

/* ========== RELACIONADOS Y RATINGS (pueden seguir usando ProductService) ========== */

export const fetchRelatedProducts = createAsyncThunk(
  "products/fetchRelated",
  async (categories, { rejectWithValue }) => {
    return await getRelatedProducts(categories);
    }
);

export const fetchRatings = createAsyncThunk(
  "product/fetchRatings",
  async (id, { rejectWithValue }) => {
    return await getProductRatings(id);
  } 
);

/* ========== CREATE CON IMÁGENES (para CreateProduct) ========== */

export const createProduct = createAsyncThunk(
  "product/create",
  async ({ token, form }, { rejectWithValue }) => {
    const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

    const { data } = await axios.post(`${API_BASE}/products/create`, form, {
      headers: {
        "Content-Type": "application/json",
        ...authHeader,
      },
    });

    return data; // producto creado { id, name, ... }
    }
);

/* ========== UPDATE SOLO PRODUCTO (+ NOTIFICACIÓN) ========== */

export const updateProductWithImages = createAsyncThunk(
  "product/updateWithImages",
  async (
    {
      token,
      id,
      payload, // { name, description, price, discount?, quantity?, stock?, categories? }
      originalStock,
      originalDiscount,
    },
    { rejectWithValue }
  ) => {
    const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

    // 1) Actualizar producto
    const { data: updated } = await axios.put(
      `${API_BASE}/products/${id}`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          ...authHeader,
        },
      }
    );

    // 2) Notificar si cambió stock o descuento
    const sentQuantity = Object.prototype.hasOwnProperty.call(
      payload,
      "quantity"
    )
      ? payload.quantity
      : originalStock;

    const sentDiscount = Object.prototype.hasOwnProperty.call(
      payload,
      "discount"
    )
      ? payload.discount
      : originalDiscount;

    if (
      Number(sentQuantity) !== originalStock ||
      sentDiscount !== originalDiscount
    ) {
      try {
        await axios.post(
          `${API_BASE}/api/notifications/product/${id}`,
          {},
          {
            headers: {
              "Content-Type": "application/json",
              ...authHeader,
            },
          }
        );
      } catch (notifyErr) {
        console.error("Error notificando usuarios:", notifyErr);
      }
    }

    return updated;
  }
);



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
