// src/redux/slices/ProductSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";

/* =====================================================
   FETCH PRODUCTS GENERAL (SIN TOKEN)
===================================================== */
export const fetchProducts = createAsyncThunk(
  "product/fetchAll",
  async () => {
    const { data } = await axios.get(`${API_BASE}/products`);
    return Array.isArray(data.content) ? data.content : data;
  }
);

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
   RELATED PRODUCTS
===================================================== */
export const fetchRelatedProducts = createAsyncThunk(
  "product/fetchRelated",
  async ({ categories, excludeProductId }, { rejectWithValue }) => {
    const allRelated = [];

    for (const cat of categories) {
      // Si es objeto con id, usar el id. Si es string, buscar el id por descripción
      let categoryId;

      if (typeof cat === "object" && cat.id) {
        categoryId = cat.id;
      } else {
        // Es un string (descripción), buscar el ID
        const description = typeof cat === "string" ? cat : cat.description;
        const { data: categoryData } = await axios.get(
          `${API_BASE}/categories/by-description/${encodeURIComponent(description)}`
        );
        categoryId = categoryData.id;
      }

      const { data } = await axios.get(
        `${API_BASE}/products/by-category/${categoryId}`
      );
      const products = Array.isArray(data.content) ? data.content : data;
      allRelated.push(...products);
    }

    // Eliminar duplicados y excluir el producto actual
    const uniqueProducts = allRelated.filter(
      (product, index, self) =>
        product.id !== excludeProductId &&
        self.findIndex((p) => p.id === product.id) === index
    );

    // Mezclar aleatoriamente y tomar 5
    const shuffled = uniqueProducts.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 5);
  }
);

/* =====================================================
   RATINGS DEL PRODUCTO (ANTES ESTABA EN ProductService)
===================================================== */
export const fetchRatings = createAsyncThunk(
  "rating/fetchByProduct",
  async ({ productId, token }) => {
    const { data } = await axios.get(
      `${API_BASE}/ratings/by-product/${productId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return { productId, ratings: data };
  }
);

/* =====================================================
   FETCH AVERAGE RATING
===================================================== */
export const fetchAverageRating = createAsyncThunk(
  "rating/fetchAverage",
  async (productId) => {
    const { data } = await axios.get(
      `${API_BASE}/ratings/average/${productId}`
    );
    return { productId, average: data };
  }
);

/* =====================================================
   FETCH COUNTS (GROUPED BY STARS)
===================================================== */
export const fetchRatingCounts = createAsyncThunk(
  "rating/fetchCounts",
  async (productId) => {
    const results = {};

    for (let value = 1; value <= 5; value++) {
      const { data } = await axios.get(
        `${API_BASE}/ratings/count-by-value/${productId}/${value}`
      );
      results[value] = data;
    }

    return { productId, counts: results };
  }
);

/* =====================================================
   FETCH LIST OF RATINGS (COMMENTS)
===================================================== */
export const fetchProductRatings = createAsyncThunk(
  "rating/fetchList",
  async (productId) => {
    const { data } = await axios.get(
      `${API_BASE}/ratings/by-product/${productId}`
    );
    return { productId, list: data };
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
    payload
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
    return updated;
  }
);

/* =====================================================
   USER PRODUCTS (MIS PRODUCTOS)
===================================================== */

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

    return data;
  }
);

/* =====================================================
Eliminar un producto del usuario
=====================================================*/
export const deleteUserProduct = createAsyncThunk(
  "product/deleteUserProduct",
  async ({ token, id }) => {
    await axios.delete(`${API_BASE}/products/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return id;
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
  products: [],
  product: null,
  related: [],
  ratings: {
    average: 0,
    counts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    list: []
  },
  // === FAVORITES PRODUCTS ===
  favoriteProducts: [],
  favoriteProductsLoading: false,
  favoriteProductsError: null,

  // para vista de "Mis Productos"
  userProducts: [],         
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
      // === FETCH GENERAL PRODUCTS ===
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;

        // TOP 5 POR DESCUENTO
        state.topDiscounts = [...action.payload]
          .sort((a, b) => b.discountPercentage - a.discountPercentage)
          .slice(0, 5);
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

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

            // === RATINGS: AVERAGE ===
      .addCase(fetchAverageRating.fulfilled, (state, action) => {
        state.ratings.average = action.payload.average;
      })

      // === RATINGS: COUNTS BY VALUE ===
      .addCase(fetchRatingCounts.fulfilled, (state, action) => {
        state.ratings.counts = action.payload.counts;
      })

      // === RATINGS: LIST ===
      .addCase(fetchProductRatings.fulfilled, (state, action) => {
        state.ratings.list = action.payload.list;
      })

      // === CREATE PRODUCT ===
      .addCase(createProduct.pending, (state) => {
        state.creating = true;
        state.createError = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.creating = false;
        //state.product = action.payload;
        state.products = [...state.products, action.payload];
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