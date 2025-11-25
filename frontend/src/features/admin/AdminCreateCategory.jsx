import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { createCategory } from "../../redux/slices/CategorySlice";
import { createCategoryImage } from "../../redux/slices/CategoryImagesSlice";

import "../../features/products/components/Categories.css";
import Toaster from "../../components/ui/Toaster";
import ImageUploader from "../../components/common/ImageUploader";

const AdminCreateCategory = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const token = useSelector((state) => state.auth.token);

  const [description, setDescription] = useState("");
  const [touched, setTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  const error = !description.trim() ? "La descripción es obligatoria." : null;
  const isValid = !error && !submitting;

  const onSubmit = async (e) => {
    e.preventDefault();
    setTouched(true);

    if (!isValid) return;

    if (!token) {
      toast.error("No estás autenticado. Iniciá sesión como ADMIN.");
      return;
    }

    setSubmitting(true);

    try {
      // 1. Crear la categoría
      const result = await dispatch(createCategory({
        token,
        description: description.trim(),
      })).unwrap();

      const newCategoryId = result?.id;

      // 2. Si hay imagen, subirla
      if (imageFile && newCategoryId) {
        await dispatch(createCategoryImage({
          token,
          categoryId: newCategoryId,
          fileImage: imageFile,
        })).unwrap();
      }

      toast.success(`Categoría "${description.trim()}" creada con éxito`);
      setTimeout(() => navigate("/profile/categories"), 2000);
    } catch (err) {
      toast.error(err?.message || err || "Error al crear la categoría.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="categories-page">
      <main className="main with-nav-offset">
        <div className="create-container">
          <h1 className="form-title">Crear categoría</h1>
          <p className="form-subtitle">Ingresá la descripción y una imagen para la categoría.</p>

          <div className="form-card">
            <form className="single-field-grid" onSubmit={onSubmit} noValidate>
              <div className="form-group">
                <label htmlFor="cat-description">Descripción *</label>
                <input
                  id="cat-description"
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  onBlur={() => setTouched(true)}
                  placeholder="Ej: Zapatillas, Figuras, Comics…"
                  disabled={submitting}
                />
              </div>

              <div className="form-group full">
                <label>Imagen de la categoría</label>
                <ImageUploader
                  maxImages={1}
                  onImagesChange={(files) => setImageFile(files[0] || null)}
                />
                <p className="helper">Solo se permite una imagen por categoría.</p>
              </div>

              {touched && error && <p className="error">{error}</p>}

              <div className="actions">
                <button
                  type="submit"
                  className="dotted-btn"
                  disabled={!isValid}
                  title={!isValid ? "Completá la descripción" : "Crear categoría"}
                >
                  {submitting ? "Creando..." : "CREAR CATEGORÍA"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Toaster />
    </div>
  );
};

export default AdminCreateCategory;