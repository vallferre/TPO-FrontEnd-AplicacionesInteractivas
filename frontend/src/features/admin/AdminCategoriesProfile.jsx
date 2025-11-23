import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import {
  fetchCategories,
  fetchCategoryImage,
  deleteCategory,
} from "../../redux/slices/CategorySlice";

import {
  selectCategories,
  selectCategoriesLoading,
  selectCategoriesError,
} from "../../redux/slices/CategorySelector";

import "../auth/views/UserProducts.css";
import "../../components/ui/DeleteConfirmationModal.css";

// Componente para mostrar la imagen de cada categoría
const CategoryImage = ({ category, imageUrl }) => {
  const fallback = `https://via.placeholder.com/300x200?text=${encodeURIComponent(category.description)}`;

  return (
    <img
      src={imageUrl || fallback}
      alt={category.description}
      style={{ width: "100px", height: "60px", objectFit: "cover" }}
      onError={(e) => (e.target.src = fallback)}
    />
  );
};

// Modal de confirmación de borrado
const DeleteConfirmationModal = ({ isOpen, onConfirm, onCancel, categoryName }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2>Eliminar Categoría</h2>
        <p>
          ¿Estás seguro de que querés eliminar <strong>"{categoryName}"</strong>?<br />
          Esta acción no se puede deshacer.
        </p>
        <div className="modal-buttons">
          <button className="btn-cancel" onClick={onCancel}>Cancelar</button>
          <button className="btn-confirm" onClick={onConfirm}>Eliminar</button>
        </div>
      </div>
    </div>
  );
};

// Componente principal
const AdminCategoriesProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const token = useSelector((state) => state.auth.token);
  const categories = useSelector(selectCategories) || [];
  const loading = useSelector(selectCategoriesLoading);
  const error = useSelector(selectCategoriesError);
  const images = useSelector((state) => state.categories.images);

  // Fetch de categorías
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Fetch de imágenes para cada categoría
  useEffect(() => {
    categories.forEach((cat) => {
      if (cat.id && !images[cat.id]) {
        dispatch(fetchCategoryImage(cat.id));
      }
    });
  }, [dispatch, categories, images]);

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

  const handleConfirmDelete = () => {
    if (!selectedCategory) return;

    dispatch(deleteCategory({ token, id: selectedCategory.id }))
      .unwrap()
      .then(() => {
        setModalOpen(false);
        setSelectedCategory(null);
      })
      .catch(() => {
        toast.error(`No se puede eliminar una categoría que ya está en uso, pruebe editarla.`);
      });
  };

  const handleEdit = (id) => navigate(`/categories/edit/${id}`);

  if (!token) {
    return <p className="error">No hay token, inicia sesión</p>;
  }

  return (
    <div className="user-products-container">
      <div className="user-products-header">
        <h1>Categorías</h1>
        <div className="user-products-subheader">
          <p>Administrar todas las categorías de productos</p>
          <button className="create-btn" onClick={handleCreate}>
            <span className="material-symbols-outlined">add</span>
            Crear Categoría
          </button>
        </div>
      </div>

      {loading && <p>Cargando categorías...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && categories.length === 0 ? (
        <div className="empty-products">
          <p>No se encontraron categorías.</p>
        </div>
      ) : (
        <div className="products-table-wrapper">
          <table className="products-table">
            <thead>
              <tr>
                <th>Imagen</th>
                <th>Descripción</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr
                  key={category.id}
                  className="product-row"
                  onClick={(e) => handleRowClick(e, category.id)}
                >
                  <td>
                    <CategoryImage
                      category={category}
                      imageUrl={images[category.id]}
                    />
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