// src/views/EditCategory.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
//import "../assets/EditCategory.css";
import ImageUploader from "../../components/common/ImageUploader";
import { toast } from "react-toastify";

const API_BASE = "http://localhost:8080";

function authHeaders() {
  const t = localStorage.getItem("jwtToken");
  return t ? { Authorization: `Bearer ${t}` } : {};
}

const EditCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Estado de la categoría
  const [description, setDescription] = useState("");
  const [existingImage, setExistingImage] = useState(null); // {id, filename}
  const [newImage, setNewImage] = useState(null); // File
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Traer datos actuales
  useEffect(() => {
    const loadCategory = async () => {
      try {
        setLoading(true);
        setError("");

        // Traer solo datos de categoría (sin imagen)
        const res = await fetch(`${API_BASE}/categories/${id}`);
        if (!res.ok) throw new Error("No se pudo cargar la categoría");

        const cat = await res.json(); // ahora esto debería funcionar
        setDescription(cat.description || "");

        // Solo guardamos el id de la imagen si existe
        if (cat.imageId) {
          setExistingImage({ id: cat.imageId, filename: cat.imageFilename });
        }
      } catch (err) {
        console.error(err);
        setError(err.message || "Error al cargar la categoría");
      } finally {
        setLoading(false);
      }
    };

    loadCategory();
  }, [id]);


  const handleFileChange = (files) => {
    setNewImage(files[0] || null); // solo una imagen
  };

  const handleRemoveExistingImage = () => {
    if (!existingImage) return;
    if (!window.confirm("¿Eliminar la imagen existente?")) return;
    setExistingImage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const formData = new FormData();
    formData.append("description", description);
    if (newImage) formData.append("file", newImage);

    try {
      const res = await fetch(`${API_BASE}/categories/${id}`, {
        method: "PUT",
        headers: { ...authHeaders() }, // NO Content-Type con FormData
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `HTTP ${res.status}`);
      }

      toast.success("Categoría actualizada correctamente");
      navigate(-1);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Error al actualizar la categoría");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Cargando categoría...</p>;
  if (error) return <p className="error">{error}</p>;

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
            {existingImage && (
              <div className="form-group">
                <label>Imagen actual</label>
                <div className="thumb-card">
                  <img
                    src={`${API_BASE}/categories/${existingImage.id}/image`}
                    alt={existingImage.filename || "category-image"}
                    onError={(e) =>
                      (e.currentTarget.src =
                        "https://via.placeholder.com/200x200?text=No+image")
                    }
                  />
                  <button
                    type="button"
                    onClick={handleRemoveExistingImage}
                    className="thumb-remove"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}

            {/* Nueva imagen */}
            <div className="form-group">
              <label>Nueva imagen</label>
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