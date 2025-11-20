// redux/slices/FavoritesSlice.js
// redux/slices/FavoritesSlice.js
import { createSlice } from "@reduxjs/toolkit";

const API_BASE = "http://localhost:8080/users/favorites";

const initialState = {
  items: [],   // IDs de productos favoritos
  loaded: false,
  loading: false,
  error: null,
};

const slice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    startLoading(state) {
      state.loading = true;
      state.error = null;
    },
    finishLoading(state) {
      state.loading = false;
      state.error = null;
    },
    setFavorites(state, action) {
      state.items = action.payload;
      state.loaded = true;
      state.loading = false;
    },
    addFavoriteLocal(state, action) {
      const id = Number(action.payload);
      if (!state.items.includes(id)) {
        state.items.push(id);
      }
    },
    removeFavoriteLocal(state, action) {
      const id = Number(action.payload);
      state.items = state.items.filter((x) => x !== id);
    },
    setError(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  startLoading,
  finishLoading,
  setFavorites,
  addFavoriteLocal,
  removeFavoriteLocal,
  setError,
} = slice.actions;

// ------------------- ACCIONES ASYNC exportadas -------------------

export const fetchFavorites = (token) => async (dispatch) => {
  dispatch(startLoading());

  const res = await fetch(API_BASE, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    dispatch(setError("No se pudieron cargar los favoritos"));
    return;
  }

  const data = await res.json(); // array de FavoriteResponse

  const normalized = data.flatMap((fr) =>
    fr.favoriteProductIds.map((id) => Number(id))
  );

  dispatch(setFavorites(normalized));
};

export const addFavorite = ({ token, productId }) => async (dispatch) => {
  dispatch(startLoading());
  const res = await fetch(API_BASE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({productId: productId}),
  });

  if (!res.ok) {
    dispatch(setError("No se pudo agregar a favoritos"));
    return;
  }

  const data = await res.json(); // FavoriteResponse
  
  // data.favoriteProductIds es un array
  dispatch(addFavoriteLocal(data.favoriteProductIds[0]));
  dispatch(finishLoading());
};

export const deleteFavorite = ({ token, productId }) => async (dispatch) => {
  dispatch(startLoading());

  const res = await fetch(API_BASE, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ productId }),
  });

  if (!res.ok) {
    dispatch(setError("No se pudo eliminar de favoritos"));
    return;
  }

  dispatch(finishLoading());

  dispatch(removeFavoriteLocal(productId));
  
};

export default slice.reducer;
