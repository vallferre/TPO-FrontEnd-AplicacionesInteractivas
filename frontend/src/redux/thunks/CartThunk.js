import { createAsyncThunk } from "@reduxjs/toolkit";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";

export const fetchCartThunk = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("jwtToken");
      if (!token) return rejectWithValue("No token found. Please log in.");

      const res = await fetch(`${API_BASE}/cart`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        if (res.status === 404) return { items: [], total: 0 };
        throw new Error(`Error ${res.status}: Failed to fetch cart`);
      }

      const data = await res.json();
      if (!data || !Array.isArray(data.items)) return { items: [], total: 0 };

      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ➕ Agregar producto (ya lo tenés, solo lo dejamos para que quede todo junto)
export const addToCartThunk = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, quantity = 1 }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("jwtToken");
      if (!token) return rejectWithValue("No token found. Please log in.");

      const res = await fetch(`${API_BASE}/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const message = errorData.message || "Insufficient stock";
        return rejectWithValue(message);
      }

      const updated = await fetch(`${API_BASE}/cart`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!updated.ok) throw new Error("Failed to fetch updated cart");
      return await updated.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ➖ Eliminar una unidad
export const removeFromCartThunk = createAsyncThunk(
  "cart/removeFromCart",
  async (productId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("jwtToken");
      if (!token) return rejectWithValue("No token found. Please log in.");

      const res = await fetch(`${API_BASE}/cart/remove/${productId}?number=1`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to remove product");

      // Devuelve carrito actualizado
      const updated = await fetch(`${API_BASE}/cart`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return await updated.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ❌ Eliminar todas las unidades de un producto
export const deleteProductThunk = createAsyncThunk(
  "cart/deleteProduct",
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("jwtToken");
      if (!token) return rejectWithValue("No token found. Please log in.");

      const res = await fetch(
        `${API_BASE}/cart/remove/${productId}?number=${quantity}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to delete product");

      const updated = await fetch(`${API_BASE}/cart`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return await updated.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);