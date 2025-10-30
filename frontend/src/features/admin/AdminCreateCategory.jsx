import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../features/products/components/Categories.css";
import { toast } from "react-toastify";
import Toaster from "../../components/ui/Toaster";
import ImageUploader from "../../components/common/ImageUploader"; // ⚠️ Asegurate de tener este componente

const API_BASE = "http://localhost:8080";

const AdminCreateCategory = () => {
  const navigate = useNavigate();
  const [description, setDescription] = useState("");
  const [touched, setTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [imageFile, setImageFile] = useState(null); // solo una imagen

  const error = !description.trim() ? "La descripción es obligatoria." : null;
  const isValid = !error && !submitting;

  const token = localStorage.getItem("jwtToken");

  const authHeaders = () => ({
    Authorization: `Bearer ${token}`,
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    setTouched(true);
    setServerError("");
    if (!isValid) return;

    if (!token) {
      toast.error("No estás autenticado. Iniciá sesión como ADMIN.", { closeButton: true });
      return;
    }

    try {
      setSubmitting(true);

      // Usamos FormData para enviar descripción + imagen juntos
      const fd = new FormData();
      fd.append("description", description.trim());
      if (imageFile) fd.append("file", imageFile);

      const res = await fetch(`${API_BASE}/categories`, {
        method: "POST",
        headers: {
          ...authHeaders(),
          // NO poner Content-Type, lo maneja automáticamente FormData
        },
        body: fd,
      });

      if (!res.ok) {
        let msg = `Error al crear la categoría (HTTP ${res.status})`;
        const txt = await res.text();
        if (txt) msg = txt;
        throw new Error(msg);
      }

      const data = await res.json();
      toast.success(`✅ Categoría "${description.trim()}" creada con éxito`, {
        closeButton: true,
        autoClose: 2500,
      });

      // Redirigir al listado
      setTimeout(() => navigate("/profile/categories"), 2000);

    } catch (err) {
      console.error(err);
      setServerError(err.message);
      toast.error(err.message || "Error al crear la categoría.", { closeButton: true, autoClose: 3000 });
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
              {serverError && <p className="error">{serverError}</p>}

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
