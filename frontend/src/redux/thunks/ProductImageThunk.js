/*
// src/redux/thunks/ProductImageThunk.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";


// * Obtiene las imágenes de un producto.

export const fetchProductImages = createAsyncThunk(
  "productImages/fetchByProduct",
  async (productId, { rejectWithValue }) => {
    const { data } = await axios.get(`${API_BASE}/products/${productId}/images`);
    return Array.isArray(data) ? data : [];
    }
);


// * Sube las imágenes de un producto ya creado.
// * No hace validaciones de tamaño/etc. Eso queda en el JSX.

export const uploadProductImages = createAsyncThunk(
  "productImages/upload",
  async ({ token, productId, files }, { rejectWithValue }) => {

    const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

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

    return { productId, count: files.length };
    }
);


// * Elimina un conjunto de imágenes por id.

export const deleteProductImages = createAsyncThunk(
  "productImages/deleteMany",
  async ({ token, imageIds }, { rejectWithValue }) => {

    const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

    for (const imgId of imageIds) {
    await axios.delete(`${API_BASE}/images/${imgId}`, {
        headers: {
        ...authHeader,
        },
    });
    }

    return { deletedIds: imageIds };
    }
);
*/
