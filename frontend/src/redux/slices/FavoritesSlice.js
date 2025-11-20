// redux/slices/FavoritesSlice.js
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE = "http://localhost:8080/users/favorites";

const initialState = {
  items: [],           // IDs numéricos de favoritos
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

// ----------------------------------------------------------
// ACCIONES ASYNC CON AXIOS
// ----------------------------------------------------------

export const fetchFavorites = (token) => async (dispatch) => {
  dispatch(startLoading());

  try {
    const res = await axios.get(API_BASE, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // res.data = array de FavoriteResponse
    const normalized = res.data.flatMap((fr) =>
      fr.favoriteProductIds.map((id) => Number(id))
    );

    dispatch(setFavorites(normalized));
  } catch (err) {
    dispatch(setError("No se pudieron cargar los favoritos"));
  }
};

export const addFavorite = ({ token, productId }) => async (dispatch) => {
  dispatch(startLoading());

  try {
    const res = await axios.post(
      API_BASE,
      { productId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    // res.data.favoriteProductIds → array con IDs del usuario
    const addedId = Number(res.data.favoriteProductIds[0]);

    dispatch(addFavoriteLocal(addedId));
    dispatch(finishLoading());
  } catch (err) {
    dispatch(setError("No se pudo agregar a favoritos"));
  }
};

export const deleteFavorite = ({ token, productId }) => async (dispatch) => {
  dispatch(startLoading());

  try {
    await axios.delete(API_BASE, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      data: { productId },
    });

    // Primero modificar el estado
    dispatch(removeFavoriteLocal(productId));

    // Después cortar loading
    dispatch(finishLoading());
  } catch (err) {
    dispatch(setError("No se pudo eliminar de favoritos"));
  }
};

export default slice.reducer;
