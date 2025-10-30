import {configureStore} from '@reduxjs/toolkit';
//import postReducer from './postSlice.js';
import authReducer from './slices/AuthSlice.js';
import productReducer from './slices/ProductSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
  },
});

export default store;