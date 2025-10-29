import {configureStore} from '@reduxjs/toolkit';
import postReducer from './postSlice.js';

export const store = configureStore({
  reducer: {
    posts: postReducer,
  },
});