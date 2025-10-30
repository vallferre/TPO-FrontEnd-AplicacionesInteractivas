import { createAsyncThunk } from "@reduxjs/toolkit";
import { getProductById, getRelatedProducts, getProductRatings } from "../../services/ProductService";

export const fetchProductById = createAsyncThunk(
  "product/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      return await getProductById(id);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchRelatedProducts = createAsyncThunk(
  "product/fetchRelated",
  async (id, { rejectWithValue }) => {
    try {
      return await getRelatedProducts(id);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchRatings = createAsyncThunk(
  "product/fetchRatings",
  async (id, { rejectWithValue }) => {
    try {
      return await getProductRatings(id);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);
