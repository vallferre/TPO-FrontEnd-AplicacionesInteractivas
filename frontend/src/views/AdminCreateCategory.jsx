import React, { useState } from "react";
import "../components/Categories.css"; // nuevo CSS exclusivo de esta vista

const AdminCreateCategory = () => {
  const [name, setName] = useState("");
  const [touched, setTouched] = useState(false);

  const error = !name.trim() ? "El nombre de la categoría es obligatorio." : null;
  const isValid = !error;

  const onSubmit = (e) => {
    e.preventDefault();
    setTouched(true);
    if (!isValid) return;

    const payload = { name: name.trim() };
    console.log("Nueva categoría lista para enviar ✅", payload);
    alert(`Categoría creada: ${payload.name}`);

    setName("");
    setTouched(false);
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
                />
                {touched && error && <p className="error">{error}</p>}
              </div>

              <div className="actions">
                <button
                  type="submit"
                  className="dotted-btn"
                  disabled={!isValid}
                  title={!isValid ? "Completá el nombre" : "Crear categoría"}
                >
                  Crear categoría
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
