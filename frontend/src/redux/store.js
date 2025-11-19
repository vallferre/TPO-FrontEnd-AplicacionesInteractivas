import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/AuthSlice.js";
import productReducer from "./slices/ProductSlice.js";
import cartReducer from "./slices/CartSlice.js";
import favoritesReducer from "./slices/FavoritesSlice.js";
import ratingReducer from "./slices/RatingSlice.js";
import orderReducer from "./slices/OrderSlice.js";
import productImagesReducer from "./slices/ProductImageSlice.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    cart: cartReducer,
    favorites: favoritesReducer,
    rating: ratingReducer,
    order: orderReducer,
    productImages: productImagesReducer,

  },
});

export default store;
