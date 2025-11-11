import { configureStore } from "@reduxjs/toolkit";
//import postReducer from './postSlice.js';
import authReducer from "./slices/AuthSlice.js";
import productReducer from "./slices/ProductSlice.js";
import cartReducer from "./slices/CartSlice.js";
import favoritesReducer from "./slices/FavoritesSlice.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    cart: cartReducer,
    favorites: favoritesReducer,
    rating: ratingReducer,
    order: orderReducer,
  },
});

export default store;
