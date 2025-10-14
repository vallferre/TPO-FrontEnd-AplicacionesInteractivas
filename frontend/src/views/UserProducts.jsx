import React, { useState, useEffect } from "react";
import "../components/UserProducts.css";
import "../components/DeleteConfirmationModal.css";
import { useNavigate } from "react-router-dom";

const DeleteConfirmationModal = ({ isOpen, onConfirm, onCancel, productName }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2>Delete Product</h2>
        <p>
          Are you sure you want to delete <strong>{productName}</strong>?<br />
          This action cannot be undone.
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
        const formatted = data.map((p) => ({
          id: p.id,
          name: p.name,
          img: p.imageIds?.[0] || null,
          status: p.status || "Active",
          statusClass:
            p.status === "Active"
              ? "status-active"
              : p.status === "Pending"
              ? "status-pending"
              : "status-sold",
        }));
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
    // 🔹 Evitamos que botones dentro de la fila disparen la navegación
    if (e.target.closest(".edit-btn") || e.target.closest(".delete-btn")) return;
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

      console.log("Response status:", response.status);
      console.log("Response body:", await response.text());

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
        <h1>My Products</h1>
        <button className="create-btn" onClick={handleCreate}>
          <span className="material-symbols-outlined">add</span>
          Create Product
        </button>
      </div>

      {loading && <p>Cargando productos...</p>}
      {error && <p className="error">{error}</p>}

      <div className="products-table-wrapper">
        <table className="products-table">
          <thead>
            <tr>
              <th>Product</th>
              <th className="text-center">Actions</th>
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
                  <div className="product-info">
                    <div className="product-img-wrapper">
                      {product.img ? (
                        <img
                          src={product.img}
                          alt={product.name}
                          className="product-img"
                        />
                      ) : (
                        <div className="product-img placeholder">No image</div>
                      )}
                    </div>
                    <span className="product-name">{product.name}</span>
                  </div>
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
