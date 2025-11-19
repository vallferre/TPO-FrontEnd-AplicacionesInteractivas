// src/redux/slices/ProductImageSelectors.js
export const selectImageUploading = (state) => state.productImages.uploading;
export const selectImageUploadError = (state) => state.productImages.error;
export const selectLastImageUploadInfo = (state) =>
  state.productImages.lastUploadInfo;
