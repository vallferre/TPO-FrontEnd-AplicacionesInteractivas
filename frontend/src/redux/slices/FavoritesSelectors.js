// redux/slices/FavoritesSelectors.js
// Selectors puros: devuelven exactamente lo que hay en state.favorites

export const selectFavorites = (state) => state.favorites.items;
export const selectFavoritesLoading = (state) => state.favorites.loading;
export const selectFavoritesError = (state) => state.favorites.error;
