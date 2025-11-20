// src/views/UserProducts.jsx
import React, { useState, useEffect } from "react";
import "./UserProducts.css";
import "../../../components/ui/DeleteConfirmationModal.css";
import { useNavigate } from "react-router-dom";
import "../../../index.css";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchUserProducts,
  deleteUserProduct,
} from "../../../redux/slices/ProductSlice";

const API_BASE = "http://localhost:8080";

const DeleteConfirmationModal = ({
  isOpen,
  onConfirm,
  onCancel,
  productName,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2>Eliminar Producto</h2>
        <p>
          Seguro que quieres eliminar <strong>"{productName}"</strong>?<br />
          Esta acción no puede ser deshecha.
        </p>
        <div className="modal-buttons">
          <button className="btn-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn-confirm" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const UserProducts = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const token = useSelector((state) => state.auth.token);

  // 🔹 OJO: usamos "products" (plural), como en tu store
  const rawProductsFromStore = useSelector(
    (state) => state.products?.userProducts
  );
  const loadingFromStore = useSelector(
    (state) => state.products?.userProductsLoading
  );
  const reduxErrorFromStore = useSelector(
    (state) => state.products?.userProductsError
  );

  // Normalizamos fuera del selector (así no creamos [] nuevos dentro)
  const rawProducts = rawProductsFromStore || [];
  const loading = loadingFromStore ?? false;
  const reduxError = reduxErrorFromStore ?? null;

  // error local para el caso "no hay token"
  const [localError, setLocalError] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const error = localError || reduxError;

  useEffect(() => {
    if (!token) {
      setLocalError("No hay token, inicia sesión");
      return;
    }

    setLocalError(null);
    dispatch(fetchUserProducts(token));
  }, [token, dispatch]);

  const handleCreate = () => navigate("/create");
  const handleEdit = (productId) => navigate(`/edit/${productId}`);

  const handleRowClick = (e, id) => {
    if (e.target.closest(".edit-btn") || e.target.closest(".delete-btn"))
      return;
    navigate(`/edit/${id}`);
  };

  const handleDeleteClick = (e, product) => {
    e.stopPropagation();
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedProduct) return;

    try {
      await dispatch(
        deleteUserProduct({ token, id: selectedProduct.id })
      );

      setModalOpen(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Error al eliminar el producto. Revisa consola.");
    }
  };

  // 🔹 Formateo de productos (igual que tenías antes)
  const products = rawProducts.map((p) => {
    const stock = Number(p.stock ?? p.quantity ?? 0);

    const statusText = stock > 0 ? stock : "Sold-Out";
    const statusClass = stock > 0 ? "status-active" : "status-soldout";

    return {
      id: p.id,
      name: p.name,
      img: p.imageIds?.[0]
        ? `${API_BASE}/images/${p.imageIds[0]}`
        : null,
      status: statusText,
      statusClass,
    };
  });

  return (
    <div className="user-products-container">
      <div className="user-products-header">
        <h1>Mis Productos</h1>
        <div className="user-products-subheader">
          <p>Administra y segui tus productos.</p>
          <button className="create-btn" onClick={handleCreate}>
            <span className="material-symbols-outlined">add</span>
            Crear Producto
          </button>
        </div>
      </div>

      {loading && <p>Cargando productos...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && products.length === 0 ? (
        <div className="empty-products">
          <p>No tienes ningun producto aún.</p>
        </div>
      ) : (
        <div className="products-table-wrapper">
          <table className="products-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Stock</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, idx) => (
                <tr
                  key={idx}
                  className="product-row"
                  onClick={(e) => handleRowClick(e, product.id)}
                >
                  <td>
                    <div className="up-product-info">
                      <div className="up-product-thumb">
                        {product.img ? (
                          <img src={product.img} alt={product.name} />
                        ) : (
                          <div className="up-thumb-placeholder">
                            No image
                          </div>
                        )}
                      </div>
                      <span className="up-product-name">
                        {product.name}
                      </span>
                    </div>
                  </td>

                  <td>
                    <span className={`status-badge ${product.statusClass}`}>
                      {product.status}
                    </span>
                  </td>

                  <td className="text-center actions-cell">
                    <button
                      className="edit-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(product.id);
                      }}
                    >
                      <span className="material-symbols-outlined">edit</span>
                    </button>

                    <button
                      className="delete-btn"
                      onClick={(e) => handleDeleteClick(e, product)}
                    >
                      <span className="material-symbols-outlined">
                        delete
                      </span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <DeleteConfirmationModal
        isOpen={modalOpen}
        onConfirm={handleConfirmDelete}
        onCancel={() => setModalOpen(false)}
        productName={selectedProduct?.name || ""}
      />
    </div>
  );
};

export default UserProducts;
