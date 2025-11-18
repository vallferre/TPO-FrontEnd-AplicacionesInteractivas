// src/redux/thunks/ProductThunk.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {
  getRelatedProducts,
  getProductRatings,
} from "../../services/ProductService";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";

/* ========== PRODUCTO POR ID (YA NO USA ProductService) ========== */

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

/* ========== RELACIONADOS Y RATINGS (pueden seguir usando ProductService) ========== */

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

/* ========== CREATE CON IMÁGENES (para CreateProduct) ========== */

export const createProductWithImages = createAsyncThunk(
  "product/createWithImages",
  async ({ token, form, files }, { rejectWithValue }) => {
    try {
      const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

      // Crear producto
      const { data: created } = await axios.post(
        `${API_BASE}/products/create`,
        form,
        {
          headers: {
            "Content-Type": "application/json",
            ...authHeader,
          },
        }
      );

      const productId = created?.id;
      if (!productId) {
        return rejectWithValue("No se pudo obtener el ID del producto creado");
      }

      // Subir imágenes secuencialmente
      for (const file of files) {
        const fd = new FormData();
        fd.append("file", file);

        await axios.post(`${API_BASE}/products/${productId}/images`, fd, {
          headers: {
            ...authHeader,
            "Content-Type": "multipart/form-data",
          },
        });
      }

      return created;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

/* ========== UPDATE CON IMÁGENES (para EditProduct) ========== */

export const updateProductWithImages = createAsyncThunk(
  "product/updateWithImages",
  async (
    {
      token,
      id,
      payload, // { name, description, price, discount?, quantity?, stock?, categories? }
      newImages, // File[]
      imagesToDelete, // number[]
      originalStock,
      originalDiscount,
    },
    { rejectWithValue }
  ) => {
    try {
      const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

      // 1) Borrar imágenes marcadas
      for (const imgId of imagesToDelete) {
        await axios.delete(`${API_BASE}/images/${imgId}`, {
          headers: authHeader,
        });
      }

      // 2) Actualizar producto
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

      // 3) Subir nuevas imágenes
      for (const file of newImages) {
        const fd = new FormData();
        fd.append("file", file);

        await axios.post(`${API_BASE}/products/${id}/images`, fd, {
          headers: {
            ...authHeader,
            "Content-Type": "multipart/form-data",
          },
        });
      }

      // 4) Notificar si cambió stock o descuento
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

      if (Number(sentQuantity) !== originalStock || sentDiscount !== originalDiscount) {
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
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);
