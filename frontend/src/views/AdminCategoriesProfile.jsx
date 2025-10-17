import React, { useState, useEffect } from "react";
import "../components/UserProducts.css";
import "../components/DeleteConfirmationModal.css";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:8080";

// Componente para mostrar la imagen de cada categoría
const CategoryImage = ({ category }) => {
  const [imageUrl, setImageUrl] = useState(
    `https://via.placeholder.com/300x200?text=${encodeURIComponent(category.description)}`
  );

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const res = await fetch(`${API_BASE}/categories/${category.id}/image`);
        if (!res.ok) throw new Error("Error cargando imagen");

        const blob = await res.blob();
        setImageUrl(URL.createObjectURL(blob));
      } catch (err) {
        console.error(err);
      }
    };

    fetchImage();

    return () => {
      if (imageUrl.startsWith("blob:")) URL.revokeObjectURL(imageUrl);
    };
  }, [category.fileImageId]);

  return (
    <img
      src={imageUrl}
      alt={category.description}
      style={{ width: "100px", height: "60px", objectFit: "cover" }}
    />
  );
};

// Modal de confirmación de borrado
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

// Componente principal
const AdminCategoriesProfile = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const token = localStorage.getItem("jwtToken");

  // Fetch de categorías
  useEffect(() => {
    if (!token) {
      setError("No hay token, inicia sesión");
      setLoading(false);
      return;
    }

    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_BASE}/categories`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error(`Error: ${res.status}`);

        const data = await res.json();

        // Formatear categorías y asegurarse de tener fileImageId si el backend lo devuelve
        const formatted = (data.content || []).map((c) => ({
          id: c.id,
          description: c.description || "No description",
          fileImageId: c.image?.id || null, // importante para el fetch de la imagen
        }));

        setCategories(formatted);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [token]);

  // Navegación y acciones
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

  const handleEdit = (id) => navigate(`/categories/edit/${id}`);

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
                    <CategoryImage category={category} />
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
        categoryName={selectedCategory?.description || ""}
      />
    </div>
  );
};

export default AdminCategoriesProfile;
