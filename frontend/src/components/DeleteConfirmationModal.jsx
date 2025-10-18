import React from "react";
import "../assets/DeleteConfirmationModal.css";

const DeleteConfirmationModal = ({ isOpen, onConfirm, onCancel, productName }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2>Delete Product</h2>
        <p>Are you sure you want to delete <strong>{productName}</strong>? This action cannot be undone.</p>
        <div className="modal-buttons">
          <button className="btn-cancel" onClick={onCancel}>Cancel</button>
          <button className="btn-confirm" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
