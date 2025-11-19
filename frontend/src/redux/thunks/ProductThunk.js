/*

// src/redux/thunks/ProductThunk.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {
  getRelatedProducts,
  getProductRatings,
} from "../../services/ProductService";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";

// ========== PRODUCTO POR ID (YA NO USA ProductService) ========== 

export const fetchProductById = createAsyncThunk(
  "product/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_BASE}/products/id/${id}`);
      return data; // objeto producto
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// ========== RELACIONADOS Y RATINGS (pueden seguir usando ProductService) ========== 

export const fetchRelatedProducts = createAsyncThunk(
  "products/fetchRelated",
  async (categories, { rejectWithValue }) => {
    try {
      return await getRelatedProducts(categories);
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

// ========== CREATE CON IMÁGENES (para CreateProduct) ========== 

export const createProduct = createAsyncThunk(
  "product/create",
  async ({ token, form }, { rejectWithValue }) => {
    try {
      const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

      const { data } = await axios.post(`${API_BASE}/products/create`, form, {
        headers: {
          "Content-Type": "application/json",
          ...authHeader,
        },
      });

      return data; // producto creado { id, name, ... }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Error al crear el producto";
      return rejectWithValue(msg);
    }
  }
);

// ========== UPDATE SOLO PRODUCTO (+ NOTIFICACIÓN) ========== 

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
    try {
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
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Error al actualizar el producto";
      return rejectWithValue(msg);
    }
  }
);
*/
