// src/redux/slices/CartSelectors.js

export const selectCartItems = (state) => state.cart.items || [];
export const selectCartTotal = (state) => state.cart.total || 0;
export const selectCartLoading = (state) => state.cart.loading;
export const selectCartError = (state) => state.cart.error;
