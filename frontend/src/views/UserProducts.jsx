import React, { useState, useEffect } from "react";
import "../assets/UserProducts.css";
import "../assets/DeleteConfirmationModal.css";
import { useNavigate } from "react-router-dom";
import "../index.css";

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
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const token = localStorage.getItem("jwtToken");

  useEffect(() => {
    if (!token) {
      setError("No hay token, inicia sesión");
      setLoading(false);
      return;
    }

    const URL = "http://localhost:8080/products/filter-by-username";

    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    fetch(URL, options)
      .then((res) => {
        if (!res.ok) throw new Error(`Error: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const formatted = data.map((p) => {
          const stock = Number(p.stock ?? p.quantity ?? 0);

          let statusText = stock > 0 ? stock : "Sold-Out";
          let statusClass = stock > 0 ? "status-active" : "status-soldout";

          return {
            id: p.id,
            name: p.name,
            img: p.imageIds?.[0] ? `${API_BASE}/images/${p.imageIds[0]}` : null,
            status: statusText,
            statusClass,
          };
        });
        setProducts(formatted);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [token]);

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
      const response = await fetch(
        `http://localhost:8080/products/${selectedProduct.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Error al eliminar el producto");

      setProducts((prev) => prev.filter((p) => p.id !== selectedProduct.id));
      setModalOpen(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Error al eliminar el producto. Revisa consola.");
    }
  };

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
                          <div className="up-thumb-placeholder">No image</div>
                        )}
                      </div>
                      <span className="up-product-name">{product.name}</span>
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
                      <span className="material-symbols-outlined">delete</span>
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
