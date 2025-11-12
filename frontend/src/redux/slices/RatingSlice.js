import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Cambiá la URL base según tu backend
const BASE_URL = "http://localhost:8080/api/ratings";


// Obtener ratings de un producto
export const fetchRatingsByProduct = createAsyncThunk(
  "ratings/fetchByProduct",
  async (productId) => {
    const response = await axios.get(`${BASE_URL}/product/${productId}`);
    return response.data; 
  }
);

// Agregar o actualizar un rating
export const addOrUpdateRating = createAsyncThunk(
  "ratings/addOrUpdate",
  async ({ productId, userId, value, comment }, { getState }) => {
    const token = getState().auth.token; // 👈 lo saca del estado global
    const response = await axios.post(
      `${BASE_URL}/add`,
      { productId, userId, value, comment },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }
);


// Obtener promedio de un producto
export const fetchAverageRating = createAsyncThunk(
  "ratings/fetchAverage",
  async (productId) => {
    const response = await axios.get(`${BASE_URL}/average/${productId}`);
    return { productId, average: response.data };
  }
);

// Obtener cantidad total de ratings
export const fetchRatingCount = createAsyncThunk(
  "ratings/fetchCount",
  async (productId) => {
    const response = await axios.get(`${BASE_URL}/count/${productId}`);
    return { productId, count: response.data };
  }
);

// -----------------------------------------

const ratingSlice = createSlice({
  name: "ratings",
  initialState: {
    ratingsByProduct: {}, // { [productId]: [ratings] }
    averages: {}, // { [productId]: average }
    counts: {}, // { [productId]: totalRatings }
    status: "idle", //
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Obtener ratings
      .addCase(fetchRatingsByProduct.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchRatingsByProduct.fulfilled, (state, action) => {
        const productId = action.meta.arg;
        state.ratingsByProduct[productId] = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchRatingsByProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // Agregar o actualizar rating
      .addCase(addOrUpdateRating.fulfilled, (state, action) => {
        const rating = action.payload;
        const productId = rating.product.id;

        if (!state.ratingsByProduct[productId]) {
          state.ratingsByProduct[productId] = [];
        }

        const index = state.ratingsByProduct[productId].findIndex(
          (r) => r.user.id === rating.user.id
        );

        if (index !== -1) {
          // actualizar existente
          state.ratingsByProduct[productId][index] = rating;
        } else {
          // agregar nuevo
          state.ratingsByProduct[productId].push(rating);
        }
      })

      // Promedio
      .addCase(fetchAverageRating.fulfilled, (state, action) => {
        const { productId, average } = action.payload;
        state.averages[productId] = average;
      })

      // Conteo total
      .addCase(fetchRatingCount.fulfilled, (state, action) => {
        const { productId, count } = action.payload;
        state.counts[productId] = count;
      });
  },
});

export default ratingSlice.reducer;
