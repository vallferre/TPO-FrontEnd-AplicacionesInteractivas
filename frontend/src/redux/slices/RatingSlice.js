// src/redux/slices/RatingSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";

/* =====================================================
   GET RATINGS OF PRODUCT
===================================================== */
export const fetchRatingsByProduct = createAsyncThunk(
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
   ADD OR UPDATE RATING
===================================================== */
export const addOrUpdateRating = createAsyncThunk(
  "rating/addOrUpdate",
  async ({ productId, value, comment, token }) => {
    const { data } = await axios.post(
      `${API_BASE}/ratings/add/${productId}`,
      { value, comment },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data; // rating guardado
  }
);

/* =====================================================
   SLICE
===================================================== */

const initialState = {
  ratingsByProduct: {}, // { [productId]: [ ...ratings ] }
  loading: false,
  error: null,
};

const ratingSlice = createSlice({
  name: "rating",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      /* === FETCH LIST === */
      .addCase(fetchRatingsByProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRatingsByProduct.fulfilled, (state, action) => {
        state.loading = false;
        const { productId, ratings } = action.payload;
        state.ratingsByProduct[productId] = ratings;
      })
      .addCase(fetchRatingsByProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      /* === ADD / UPDATE === */
      .addCase(addOrUpdateRating.fulfilled, (state, action) => {
        const newRating = action.payload; // { productId, userId, value, comment }
        const productId = newRating.productId;

        if (!state.ratingsByProduct[productId]) {
          state.ratingsByProduct[productId] = [];
        }

        const list = state.ratingsByProduct[productId];

        const index = list.findIndex(
          (r) => r.userId === newRating.userId
        );

        if (index !== -1) {
          list[index] = newRating;
        } else {
          list.push(newRating);
        }
      });
  },
});

export default ratingSlice.reducer;