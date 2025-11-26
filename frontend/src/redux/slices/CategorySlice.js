import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://localhost:8080/categories";

/*                ASYNC THUNKS                     */

// Traer categorías paginadas
// ===== Acción async interna: fetch general de categorías =====
export const fetchCategories = createAsyncThunk(
  "categories/fetchAll",
  async () => {
    const res = await axios.get(`${BASE_URL}`);
    const data = res.data;
    return Array.isArray(data.content) ? data.content : [];
  }
);

// Traer una categoría por ID
export const fetchCategoryById = createAsyncThunk(
  "categories/fetchById",
  async (id) => {
    const res = await axios.get(`${BASE_URL}/${id}`);
    return res.data;
  }
);

// Crear categoría
export const createCategory = createAsyncThunk(
  "categories/create",
  async ({ token, description }) => {
    const res = await axios.post(
      BASE_URL,
      { description },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  }
);

// Actualizar categoría
export const updateCategory = createAsyncThunk(
  "categories/update",
  async ({ token, id, description }) => {
    const res = await axios.put(
      `${BASE_URL}/${id}`,
      { description },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  }
);

// Eliminar categoría
export const deleteCategory = createAsyncThunk(
  "categories/delete",
  async ({ token, id }) => {
    await axios.delete(`${BASE_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Si llegó acá, se eliminó bien
    return id;
  }
);

/* ────────────────────────────────────────────── */
/*                SLICE                             */
/* ────────────────────────────────────────────── */

const categorySlice = createSlice({
  name: "categories",
  initialState: {
    items: [],
    pageInfo: null,
    selected: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      /* Fetch All */
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        const data = action.payload;
        state.items = Array.isArray(data.content) ? data.content : data;
        state.pageInfo = data;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      /* Fetch By ID */
      .addCase(fetchCategoryById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategoryById.fulfilled, (state, action) => {
        state.loading = false;
        state.selected = action.payload;
      })
      .addCase(fetchCategoryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      /* Create */
      .addCase(createCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      /* Update */
      .addCase(updateCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.items.findIndex((c) => c.id === action.payload.id);
        if (idx >= 0) state.items[idx] = action.payload;
        if (state.selected?.id === action.payload.id) {
          state.selected = action.payload;
        }
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      /* Delete */
      .addCase(deleteCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((c) => c.id !== action.payload);
        if (state.selected?.id === action.payload) {
          state.selected = null;
        }
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default categorySlice.reducer;