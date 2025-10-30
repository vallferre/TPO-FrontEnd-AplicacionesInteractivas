import {configureStore} from '@reduxjs/toolkit';
//import postReducer from './postSlice.js';
import authReducer from './slices/AuthSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export default store;