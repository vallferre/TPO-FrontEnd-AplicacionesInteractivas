// src/features/products/productSelectors.js
export const selectProduct = (state) => state.products.product;
export const selectRelatedProducts = (state) => state.products.relatedProducts;
export const selectRatings = (state) => state.products.ratings; 
export const selectLoading = (state) => state.products.loading;
export const selectError = (state) => state.products.error;
