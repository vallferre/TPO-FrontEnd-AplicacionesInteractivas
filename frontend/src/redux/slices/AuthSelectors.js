// src/features/auth/authSelectors.js
export const selectAuth = (state) => state.auth;
export const selectIsLoggedIn = (state) => state.auth.isLoggedIn;
export const selectUser = (state) => state.auth.user;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;
export const selectToken = (state) => state.auth.token;

export const selectUserAvatar = (state) => state.auth.avatar;
export const selectUserRole = (state) => state.auth.role;