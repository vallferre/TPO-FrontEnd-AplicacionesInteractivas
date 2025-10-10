// src/views/AdminCreateCategory.jsx
import React, { useState } from "react";
import "../components/Categories.css"; // CSS exclusivo de esta vista

const AdminCreateCategory = () => {
  const [name, setName] = useState("");
  const [touched, setTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [serverSuccess, setServerSuccess] = useState("");

  const error = !name.trim() ? "El nombre de la categoría es obligatorio." : null;
  const isValid = !error && !submitting;

  const onSubmit = async (e) => {
    e.preventDefault();
    setTouched(true);
    setServerError("");
    setServerSuccess("");

    if (!isValid) return;

    try {
      setSubmitting(true);

      const token = localStorage.getItem("jwtToken"); // <-- JWT del login
      if (!token) {
        setServerError("No estás autenticado. Iniciá sesión con una cuenta ADMIN.");
        return;
        }

      // El backend espera { "description": "NombreCategoria" }
      const payload = { description: name.trim() };

      const res = await fetch("/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // protegido: solo ADMIN
        },
        body: JSON.stringify(payload),
      });

      if (res.status === 201 || res.ok) {
        const data = await res.json();
        setServerSuccess(`Categoría creada: ${data.description || name.trim()}`);
        setName("");
        setTouched(false);
      } else {
        // Intentamos leer mensaje del backend
        let msg = "Error al crear la categoría.";
        try {
          const text = await res.text();
          if (text) msg = text;
        } catch (_) {}
        if (res.status === 409) {
          // conflicto/duplicado (si tu backend usa 409 para duplicados)
          msg = msg || "La categoría ya existe.";
        } else if (res.status === 400) {
          msg = msg || "Solicitud inválida.";
        } else if (res.status === 403) {
          msg = "No tenés permisos (requiere ROLE_ADMIN).";
        } else if (res.status === 401) {
          msg = "No estás autenticado. Iniciá sesión.";
        }
        setServerError(msg);
      }
    } catch (err) {
      setServerError("No se pudo conectar con el servidor.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="categories-page">
      {/* mantiene el mismo offset de navbar que el resto */}
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
                {serverSuccess && <p className="success">{serverSuccess}</p>}
              </div>

              <div className="actions">
                <button
                  type="submit"
                  className="dotted-btn"
                  disabled={!isValid}
                  title={!isValid ? "Completá el nombre" : "Crear categoría"}
                >
                  {submitting ? "Creando..." : "Crear categoría"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminCreateCategory;
