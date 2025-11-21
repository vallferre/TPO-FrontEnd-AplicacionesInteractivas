// src/redux/slices/ProductImageSelectors.js
import { createSelector } from '@reduxjs/toolkit';

export const selectImageUploading = (state) => state.productImages.uploading;
export const selectImageUploadError = (state) => state.productImages.error;
export const selectLastImageUploadInfo = (state) =>
  state.productImages.lastUploadInfo;

export const selectProductImagesById = createSelector( (state) => state.productImages.items, (_, productId) => productId, (items, productId) => items[productId] || [] );