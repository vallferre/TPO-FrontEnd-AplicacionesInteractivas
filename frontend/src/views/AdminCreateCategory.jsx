// src/views/AdminCreateCategory.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../components/Categories.css";
import { toast } from "react-toastify";
import Toaster from "../components/Toaster"; // ✅ nuevo import

const API_BASE = "http://localhost:8080";

const AdminCreateCategory = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [touched, setTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const error = !name.trim() ? "El nombre de la categoría es obligatorio." : null;
  const isValid = !error && !submitting;

  const onSubmit = async (e) => {
    e.preventDefault();
    setTouched(true);
    setServerError("");
    if (!isValid) return;

    try {
      setSubmitting(true);

      const token = localStorage.getItem("jwtToken");
      if (!token) {
        setServerError("No estás autenticado. Iniciá sesión con una cuenta ADMIN.");
        return;
      }

      const payload = { description: name.trim() };

      const res = await fetch(`${API_BASE}/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.status === 201 || res.ok) {
        let createdDesc = name.trim();
        try {
          const data = await res.json();
          if (data?.description) createdDesc = data.description;
        } catch {}

        toast.success(`✅ Categoría "${createdDesc}" creada con éxito`, {
          closeButton: true,
          autoClose: 3000,
        });

        // Espera a que se vea el popup, luego redirige
        setTimeout(() => navigate("/"), 3200);
        return;
      }

      // Errores del servidor
      let msg = "Error al crear la categoría.";
      try {
        const text = await res.text();
        if (text) msg = text;
      } catch {}
      if (res.status === 409) msg = "La categoría ya existe.";
      else if (res.status === 400) msg = "Solicitud inválida.";
      else if (res.status === 403) msg = "No tenés permisos (requiere ROLE_ADMIN).";
      else if (res.status === 401) msg = "No estás autenticado. Iniciá sesión.";
      setServerError(msg);
      toast.error(msg, { closeButton: true, autoClose: 3000 });
    } catch {
      setServerError("No se pudo conectar con el servidor.");
      toast.error("No se pudo conectar con el servidor.", {
        closeButton: true,
        autoClose: 3000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="categories-page">
      <main className="main with-nav-offset">
        <div className="create-container">
          <h1 className="form-title">Crear categoría</h1>
          <p className="form-subtitle">Ingresá el nombre de la nueva categoría.</p>

          <div className="form-card">
            <form className="single-field-grid" onSubmit={onSubmit} noValidate>
              <div className="form-group">
                <label htmlFor="cat-name">Nombre de la categoría *</label>
                <input
                  id="cat-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={() => setTouched(true)}
                  placeholder="Ej: Zapatillas, Figuras, Comics…"
                  disabled={submitting}
                />
                {touched && error && <p className="error">{error}</p>}
                {serverError && <p className="error">{serverError}</p>}
              </div>

              <div className="actions">
                <button
                  type="submit"
                  className="dotted-btn"
                  disabled={!isValid}
                  title={!isValid ? "Completá el nombre" : "Crear categoría"}
                >
                  {submitting ? "Creando..." : "CREAR CATEGORÍA"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* ✅ Se usa el componente reusable */}
      <Toaster />
    </div>
  );
};

export default AdminCreateCategory;
