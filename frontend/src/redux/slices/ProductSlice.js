// src/redux/slices/ProductSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";

/* =====================================================
   GET PRODUCT BY ID
===================================================== */
export const fetchProductById = createAsyncThunk(
  "product/fetchById",
  async (id) => {
    const { data } = await axios.get(`${API_BASE}/products/id/${id}`);
    return data;
  }
);

/* =====================================================
   RELATED PRODUCTS (ANTES ESTABA EN ProductService)
===================================================== */
export const fetchRelatedProducts = createAsyncThunk(
  "product/fetchRelated",
  async (categories) => {
    const chosen =
      categories[Math.floor(Math.random() * categories.length)];

    const description =
      typeof chosen === "string" ? chosen : chosen.description;

    const { data: categoryData } = await axios.get(
      `${API_BASE}/categories/by-description/${description}`
    );

    const { data } = await axios.get(
      `${API_BASE}/products/by-category/${categoryData.id}`
    );

    return data;
  }
);

/* =====================================================
   RATINGS DEL PRODUCTO (ANTES ESTABA EN ProductService)
===================================================== */
export const fetchRatings = createAsyncThunk(
  "product/fetchRatings",
  async (id) => {
    const { data } = await axios.get(
      `${API_BASE}/ratings/by-product/${id}`
    );
    return data;
  }
);

/* =====================================================
   CREATE PRODUCT
===================================================== */
export const createProduct = createAsyncThunk(
  "product/create",
  async ({ token, form }) => {
    const { data } = await axios.post(
      `${API_BASE}/products/create`,
      form,
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

/* =====================================================
   UPDATE PRODUCT + NOTIFICATION
===================================================== */
export const updateProductWithImages = createAsyncThunk(
  "product/updateWithImages",
  async ({
    token,
    id,
    payload,
    originalStock,
    originalDiscount,
  }) => {
    // 1) Actualizar producto
    const { data: updated } = await axios.put(
      `${API_BASE}/products/${id}`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Producto actualizado en el servidor:", updated);

    // 2) Detectar cambios
    const sentQuantity = payload.hasOwnProperty("quantity")
      ? payload.quantity
      : originalStock;

    const sentDiscount = payload.hasOwnProperty("discount")
      ? payload.discount
      : originalDiscount;

    // 3) Si cambió stock o descuento → notificar
    if (
      Number(sentQuantity) !== originalStock ||
      sentDiscount !== originalDiscount
    ) {
      await axios.post(
        `${API_BASE}/api/notifications/product/${id}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
    }

    return updated;
  }
);

/* =====================================================
   USER PRODUCTS (MIS PRODUCTOS)
===================================================== */

/**
 * Lista de productos del usuario logueado
 * (GET /products/filter-by-username)
 * 🔹 Devuelve el data crudo, SIN formateo.
 */
export const fetchUserProducts = createAsyncThunk(
  "product/fetchUserProducts",
  async (token) => {
    const { data } = await axios.get(
      `${API_BASE}/products/filter-by-username`,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return data; // sin map, sin status, sin img
  }
);

/**
 * Eliminar un producto del usuario
 * (DELETE /products/{id})
 */
export const deleteUserProduct = createAsyncThunk(
  "product/deleteUserProduct",
  async ({ token, id }) => {
    await axios.delete(`${API_BASE}/products/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return id; // devolvemos el id borrado
  }
);

/* =====================================================
   GET MULTIPLE PRODUCTS BY IDS (para Favoritos)
===================================================== */
export const fetchProductsByIds = createAsyncThunk(
  "product/fetchByIds",
  async ({ token, ids }) => {
    const { data } = await axios.post(
      `${API_BASE}/products/by-ids`,
      ids,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return data; // lista de ProductResponse
  }
);


/* =====================================================
   SLICE
===================================================== */

const initialState = {
  product: [],
  related: [],
  ratings: { average: 0, counts: {}, list: [] },

  // === FAVORITES PRODUCTS ===
  favoriteProducts: [],
  favoriteProductsLoading: false,
  favoriteProductsError: null,

  // para vista de "Mis Productos"
  userProducts: [],          // 🔹 crudos desde la API
  userProductsLoading: false,
  userProductsError: null,

  loading: false,
  relatedLoading: false,
  error: null,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    clearProduct: (state) => {
      state.product = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // === PRODUCT BY ID ===
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
        state.error = action.error.message;
      })

      // === RELATED PRODUCTS ===
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
        state.error = action.error.message;
      })

      // === RATINGS ===
      .addCase(fetchRatings.fulfilled, (state, action) => {
        state.ratings = action.payload;
      })

      // === CREATE PRODUCT ===
      .addCase(createProduct.pending, (state) => {
        state.creating = true;
        state.createError = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.creating = false;
        state.product = action.payload;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.creating = false;
        state.createError = action.error.message;
      })

      // === UPDATE PRODUCT ===
      .addCase(updateProductWithImages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProductWithImages.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.product = action.payload;
        }
      })
      .addCase(updateProductWithImages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // === USER PRODUCTS (LIST) ===
      .addCase(fetchUserProducts.pending, (state) => {
        state.userProductsLoading = true;
        state.userProductsError = null;
      })
      .addCase(fetchUserProducts.fulfilled, (state, action) => {
        state.userProductsLoading = false;
        state.userProducts = action.payload; // crudos
      })
      .addCase(fetchUserProducts.rejected, (state, action) => {
        state.userProductsLoading = false;
        state.userProductsError = action.error.message;
      })

      // === FAVORITE PRODUCTS (GET BY IDS) ===
      .addCase(fetchProductsByIds.pending, (state) => {
        state.favoriteProductsLoading = true;
        state.favoriteProductsError = null;
      })
      .addCase(fetchProductsByIds.fulfilled, (state, action) => {
        state.favoriteProductsLoading = false;
        state.favoriteProducts = action.payload; // lista completa de productos
      })
      .addCase(fetchProductsByIds.rejected, (state, action) => {
        state.favoriteProductsLoading = false;
        state.favoriteProductsError = action.error.message;
      })

      // === DELETE USER PRODUCT ===
      .addCase(deleteUserProduct.fulfilled, (state, action) => {
        const id = action.payload;
        state.userProducts = state.userProducts.filter(
          (p) => p.id !== id
        );
      });
  },
});

export const { clearProduct } = productSlice.actions;
export default productSlice.reducer;
