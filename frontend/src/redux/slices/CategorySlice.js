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

// Crear categoría con imagen
export const createCategory = createAsyncThunk(
  "categories/create",
  async ({ token, description, fileImage }) => {
    const formData = new FormData();
    formData.append("description", description);
    if (fileImage) formData.append("file", fileImage);

    const res = await axios.post(BASE_URL, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  }
);

// Actualizar categoría + imagen opcional
export const updateCategory = createAsyncThunk(
  "categories/update",
  async ({ token, id, description, fileImage }) => {
    const formData = new FormData();
    formData.append("description", description);
    if (fileImage) formData.append("file", fileImage);

    const res = await axios.put(`${BASE_URL}/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  }
);

// Eliminar categoría
export const deleteCategory = createAsyncThunk(
  "categories/delete",
  async ({ token, id }, { rejectWithValue }) => {
    const res = await axios.delete(`${BASE_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    // Si llegó acá, se eliminó bien
    return id;
  }
);

/* ──────────────────────────────────────────────── */
/*                SLICE                             */
/* ──────────────────────────────────────────────── */

const categorySlice = createSlice({
  name: "categories",
  initialState: {
    items: [],
    images: {}, 
    pageInfo: null,
    selected: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCategoryImage(state, action) {
      const id = action.payload;
      if (state.images[id]) {
        URL.revokeObjectURL(state.images[id]); // liberar memoria
        delete state.images[id];
      }
    },
  },
  extraReducers: (builder) => {
    builder
      /* Fetch All */
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
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
      .addCase(createCategory.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })

      /* Update */
      .addCase(updateCategory.fulfilled, (state, action) => {
        const idx = state.items.findIndex((c) => c.id === action.payload.id);
        if (idx >= 0) state.items[idx] = action.payload;
      })

      /* Delete */
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.items = state.items.filter((c) => c.id !== action.payload);
      });
  },
});

export const { clearCategoryImage } = categorySlice.actions;
export default categorySlice.reducer;