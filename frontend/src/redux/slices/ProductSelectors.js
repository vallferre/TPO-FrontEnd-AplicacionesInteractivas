// src/redux/slices/ProductSelectors.js
export const selectProducts = (state) => state.products.products;
export const selectProduct = (state) => state.products.product;
export const selectRelatedProducts = (state) => state.products.related;
export const selectRelatedLoading = (state) => state.products.relatedLoading;
export const selectRatings = (state) => state.products.ratings;
export const selectLoading = (state) => state.products.loading;
export const selectError = (state) => state.products.error;
export const selectStock = (state) => state.products.product.stock;

export const selectTopDiscounts = (state) => state.product.topDiscounts;

// nuevos para el flujo de creación
export const selectProductCreating = (state) => state.products.creating;
export const selectProductCreateError = (state) => state.products.createError;

// (opcional) helper: id del producto actual (incluye el recién creado)
export const selectCurrentProductId = (state) =>
  state.products.product?.id ?? null;
