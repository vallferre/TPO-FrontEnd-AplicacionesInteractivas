// src/views/EditCategory.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import {
  fetchCategoryById,
  updateCategory,
  clearCategoryImage,
} from "../../redux/slices/CategorySlice";

import {
  fetchCategoryImage,
} from "../../redux/slices/CategoryImagesSlice";

import ImageUploader from "../../components/common/ImageUploader";

const EditCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const token = useSelector((state) => state.auth.token);
  const category = useSelector((state) => state.categories.selected);
  const categoryImage = useSelector((state) => state.categories.images[id]);
  const loading = useSelector((state) => state.categories.loading);
  const error = useSelector((state) => state.categories.error);

  const [description, setDescription] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [saving, setSaving] = useState(false);

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
        .catch((err) => {
          toast.error("Error al cargar la imagen");
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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!description.trim()) {
      toast.error("La descripción es requerida");
      return;
    }

    setSaving(true);

    dispatch(updateCategory({
      token,
      id,
      description,
      fileImage: newImage,
    }))
      .unwrap()
      .then(() => {
        toast.success("Categoría actualizada correctamente");
        
        // Si se subió una nueva imagen, limpiar cache y refrescar
        if (newImage) {
          dispatch(clearCategoryImage(id));
          dispatch(fetchCategoryImage(id));
        }
        
        navigate(-1);
      })
      .catch((err) => {
        toast.error(err?.message || err || "Error al actualizar la categoría");
      })
      .finally(() => {
        setSaving(false);
      });
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
        </div>
      </main>
    </div>
  );
};

export default EditCategory;