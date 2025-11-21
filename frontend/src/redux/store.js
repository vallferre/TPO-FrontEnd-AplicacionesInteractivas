import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

import authReducer from "./slices/AuthSlice.js";
import productReducer from "./slices/ProductSlice.js";
import cartReducer from "./slices/CartSlice.js";
import favoritesReducer from "./slices/FavoritesSlice.js";
import ratingReducer from "./slices/RatingSlice.js";
import orderReducer from "./slices/OrderSlice.js";
import productImagesReducer from "./slices/ProductImageSlice.js";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "user"],  // solo lo esencial
  blacklist: ["images"],
};

const rootReducer = combineReducers({
  auth: authReducer,
  products: productReducer,
  cart: cartReducer,
  favorites: favoritesReducer,
  rating: ratingReducer,
  order: orderReducer,
  productImages: productImagesReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoreActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/PAUSE",
          "persist/FLUSH",
          "persist/PURGE",
          "persist/REGISTER",
        ],
      },
    }),
});

export const persistor = persistStore(store);

export default store;
