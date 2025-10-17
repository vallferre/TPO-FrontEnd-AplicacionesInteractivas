import React, { useState, useEffect } from "react";
import "../components/UserProducts.css";
import "../components/DeleteConfirmationModal.css";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:8080";

const DeleteConfirmationModal = ({ isOpen, onConfirm, onCancel, categoryName }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2>Delete Category</h2>
        <p>
          Are you sure you want to delete <strong>"{categoryName}"</strong>?<br />
          This action cannot be undone.
        </p>
        <div className="modal-buttons">
          <button className="btn-cancel" onClick={onCancel}>Cancel</button>
          <button className="btn-confirm" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
};

const AdminCategoriesProfile = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const token = localStorage.getItem("jwtToken");

  useEffect(() => {
    if (!token) {
      setError("No hay token, inicia sesión");
      setLoading(false);
      return;
    }

    const URL = `${API_BASE}/categories`;

    fetch(URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Error: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const formatted = (data.content || []).map((c) => ({
            id: c.id,
            description: c.description || "No description",
            imageUrl: c.image ? `http://localhost:8080/categories/images/${c.image.id}` : null,
        }));

        setCategories(formatted);
        })

      .catch((err) => {
        console.error(err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [token]);

  const handleCreate = () => navigate("/categories/create");

  const handleRowClick = (e, id) => {
    if (e.target.closest(".edit-btn") || e.target.closest(".delete-btn")) return;
    navigate(`/categories/edit/${id}`);
  };

  const handleDeleteClick = (e, category) => {
    e.stopPropagation();
    setSelectedCategory(category);
    setModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedCategory) return;

    try {
      const response = await fetch(`${API_BASE}/categories/${selectedCategory.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Error al eliminar la categoría");

      setCategories((prev) => prev.filter((c) => c.id !== selectedCategory.id));
      setModalOpen(false);
      setSelectedCategory(null);
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Error al eliminar la categoría. Revisa consola.");
    }
  };

  return (
    <div className="user-products-container">
      <div className="user-products-header">
        <h1>Categories</h1>
        <div className="user-products-subheader">
          <p>Manage all product categories</p>
          <button className="create-btn" onClick={handleCreate}>
            <span className="material-symbols-outlined">add</span>
            Create Category
          </button>
        </div>
      </div>

      {loading && <p>Loading categories...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && categories.length === 0 ? (
        <div className="empty-products">
          <p>No categories found.</p>
        </div>
      ) : (
        <div className="products-table-wrapper">
          <table className="products-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Description</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category, idx) => (
                <tr
                  key={idx}
                  className="product-row"
                  onClick={(e) => handleRowClick(e, category.id)}
                >
                  <td>
                    <span className="up-product-name">{category.name}</span>
                  </td>
                  <td>
                    <span className="up-product-desc">{category.description}</span>
                  </td>
                  <td className="text-center actions-cell">
                    <button
                      className="edit-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(category.id);
                      }}
                    >
                      <span className="material-symbols-outlined">edit</span>
                    </button>

                    <button
                      className="delete-btn"
                      onClick={(e) => handleDeleteClick(e, category)}
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
        categoryName={selectedCategory?.name || ""}
      />
    </div>
  );
};

export default AdminCategoriesProfile;
