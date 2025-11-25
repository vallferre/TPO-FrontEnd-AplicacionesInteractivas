// src/redux/slices/CategoryImageSelectors.js
import { createSelector } from '@reduxjs/toolkit';

export const selectImageUploading = (state) => state.categoryImages.uploading;
export const selectImageUploadError = (state) => state.categoryImages.error;
export const selectLastImageUploadInfo = (state) =>
  state.categoryImages.lastUploadInfo;
export const selectImageDeleting = (state) => state.categoryImages.deleting;
export const selectImageLoading = (state) => state.categoryImages.loading;

export const selectCategoryImageById = createSelector(
  (state) => state.categoryImages.byId,
  (_, categoryId) => categoryId,
  (byId, categoryId) => byId[categoryId] || null
);