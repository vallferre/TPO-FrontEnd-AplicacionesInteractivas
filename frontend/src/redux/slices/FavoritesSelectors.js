// src/features/favorites/favoritesSelectors.js
export const selectFavorites = (state) => state.favorites.favoriteIds;
export const selectFavoritesLoading = (state) => state.favorites.loading;
export const selectFavoritesError = (state) => state.favorites.error;
