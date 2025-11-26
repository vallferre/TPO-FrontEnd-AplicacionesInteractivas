// src/views/EditCategory.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import "./EditCategory.css";

import {
  fetchCategoryById,
  updateCategory,
} from "../../redux/slices/CategorySlice";

import {
  fetchCategoryImage,
  createCategoryImage,
  deleteCategoryImage,
  clearSingleCategoryImage,
} from "../../redux/slices/CategoryImagesSlice";

import { selectCategoryImageById } from "../../redux/slices/CategoryImagesSelector";

import ImageUploader from "../../components/common/ImageUploader";

// Modal de confirmación para eliminar imagen
const DeleteImageModal = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2>Eliminar Imagen</h2>
        <p>
          ¿Estás seguro de que querés eliminar la imagen de esta categoría?<br />
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

const EditCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const token = useSelector((state) => state.auth.token);
  const category = useSelector((state) => state.categories.selected);
  const categoryImage = useSelector((state) => selectCategoryImageById(state, id));
  const loading = useSelector((state) => state.categories.loading);
  const error = useSelector((state) => state.categories.error);

  const [modalOpen, setModalOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deletingImage, setDeletingImage] = useState(false);

  // Cargar categoría e imagen
  useEffect(() => {
    if (id) {
      dispatch(fetchCategoryById(id))
        .unwrap()
        .catch((err) => {
          toast.error("Error al cargar la categoría");
        });

      dispatch(fetchCategoryImage(id))
        .unwrap()
        .catch(() => {
          // Silenciar error si no hay imagen
        });
    }
  }, [dispatch, id]);

  // Mostrar error del estado si existe
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // Actualizar estado local cuando carga la categoría
  useEffect(() => {
    if (category) {
      setDescription(category.description || "");
    }
  }, [category]);

  const handleFileChange = (files) => {
    setNewImage(files[0] || null);
  };

  const handleDeleteClick = () => {
    setModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    setModalOpen(false);
    setDeletingImage(true);

    try {
      await dispatch(deleteCategoryImage({ token, categoryId: id })).unwrap();
      toast.success("Imagen eliminada correctamente");
      dispatch(clearSingleCategoryImage(id));
    } catch (err) {
      toast.error(err?.message || "Error al eliminar la imagen");
    } finally {
      setDeletingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!description.trim()) {
      toast.error("La descripción es requerida");
      return;
    }

    setSaving(true);

    try {
      // 1. Actualizar categoría
      await dispatch(updateCategory({
        token,
        id,
        description,
      })).unwrap();

      // 2. Si hay nueva imagen, subirla
      if (newImage) {
        await dispatch(createCategoryImage({
          token,
          categoryId: id,
          fileImage: newImage,
        })).unwrap();

        // Limpiar cache y refrescar
        dispatch(clearSingleCategoryImage(id));
        dispatch(fetchCategoryImage(id));
      }

      toast.success("Categoría actualizada correctamente");
      navigate(-1);
    } catch (err) {
      toast.error(err?.message || err || "Error al actualizar la categoría");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Cargando categoría...</p>;

  return (
    <div className="edit-category-page">
      <main className="edit-category-main">
        <div className="edit-category-container">
          <h2>Editar Categoría</h2>

          <form onSubmit={handleSubmit} className="edit-category-form">
            {/* Descripción */}
            <div className="form-group">
              <label htmlFor="description">Descripción</label>
              <input
                id="description"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                maxLength={100}
              />
            </div>

            {/* Imagen existente */}
            {categoryImage && (
              <div className="form-group">
                <label>Imagen actual</label>
                <div className="thumb-card">
                  <img
                    src={categoryImage}
                    alt="category-image"
                    onError={(e) =>
                      (e.currentTarget.src =
                        "https://via.placeholder.com/200x200?text=No+image")
                    }
                  />
                </div>
                <button
                  type="button"
                  onClick={handleDeleteClick}
                  disabled={deletingImage || saving}
                  className="delete-image-btn"
                >
                  {deletingImage ? "Eliminando..." : "Eliminar imagen"}
                </button>
              </div>
            )}

            {/* Nueva imagen */}
            <div className="form-group">
              <label>{categoryImage ? "Reemplazar imagen" : "Agregar imagen"}</label>
              <ImageUploader onImagesChange={handleFileChange} multiple={false} />
              {newImage && <p>Se reemplazará la imagen existente al guardar.</p>}
            </div>

            {/* Acciones */}
            <div className="form-actions">
              <button
                type="button"
                onClick={() => navigate(-1)}
                disabled={saving}
              >
                Cancelar
              </button>
              <button type="submit" disabled={saving}>
                {saving ? "Guardando..." : "Guardar Cambios"}
              </button>
            </div>
          </form>

          {/* Modal de confirmación */}
          <DeleteImageModal
            isOpen={modalOpen}
            onConfirm={handleConfirmDelete}
            onCancel={() => setModalOpen(false)}
          />
        </div>
      </main>
    </div>
  );
};

export default EditCategory;