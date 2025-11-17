// src/features/thunks/ProductThunk.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getProductById, getRelatedProducts, getProductRatings } from "../../services/ProductService";

const API_BASE = import.meta.env?.VITE_API_URL || "http://localhost:8080";

// ----------------- EXISTENTES -----------------
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

// ----------------- NUEVO: Crear + subir imágenes (axios) -----------------
/**
 * Espera: { token, form, files }
 * - form: { name, description, price, stock, discount|null, categories: string[] }
 * - files: File[]
 * Retorna: el producto creado ({ id, ... })
 */
export const createProductWithImages = createAsyncThunk(
  "product/createWithImages",
  async ({ token, form, files }, { rejectWithValue }) => {
    // 1) Crear producto
    const { data: created } = await axios.post(
      `${API_BASE}/products/create`,
      form,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const productId = created?.id ?? created?.productId ?? created;
    if (!productId) {
      return rejectWithValue("No se pudo obtener el ID del producto.");
    }

    // 2) Subir imágenes (secuencial para poder interceptar errores por archivo)
    for (const f of files) {
      const fd = new FormData();
      fd.append("file", f);

      await axios.post(`${API_BASE}/products/${productId}/images`, fd, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
    }

    return { id: productId };
  }
);

