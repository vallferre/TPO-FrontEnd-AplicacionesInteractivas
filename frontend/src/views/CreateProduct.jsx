// src/views/CreateProduct.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import "../assets/CreateProduct.css";
import CategoryMultiSelect from "../components/CategoryMultiSelect";
import ImageUploader from "../components/ImageUploader";

const API_BASE = "http://localhost:8080"; // ajustá si cambia

// --- helpers auth ---
function getToken() {
  const t =
    typeof window !== "undefined" ? localStorage.getItem("jwtToken") : null;
  return t && t.trim().length > 0 ? t : null;
}

function authHeaders() {
  const t = getToken();
  if (!t) return {};
  // Diagnóstico: ver si hay token
  return { Authorization: `Bearer ${t}` };
}

const CreateProduct = () => {
  const navigate = useNavigate();

  // ---- estado del formulario
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [discount, setDiscount] = useState("");
  const [categories, setCategories] = useState([]); // [{id, description}]
  const [imageFiles, setImageFiles] = useState([]); // File[]

  const [touched, setTouched] = useState({});

  // ---- validaciones
  const errors = {
    name: !name.trim() ? "El nombre es obligatorio." : null,
    desc: !desc.trim() ? "La descripción es obligatoria." : null,
    price: !String(price).trim()
      ? "El precio es obligatorio."
      : Number(price) <= 0
      ? "El precio debe ser mayor a 0."
      : null,
    stock: !String(stock).trim()
      ? "El stock es obligatorio."
      : !Number.isFinite(Number(stock)) || Number(stock) < 0
      ? "El stock no puede ser negativo."
      : !Number.isInteger(Number(stock))
      ? "El stock debe ser un número entero."
      : null,
    discount:
      String(discount).trim() === ""
        ? null
        : Number(discount) < 0 || Number(discount) > 100
        ? "El descuento debe estar entre 0 y 100."
        : null,
    categories:
      categories.length === 0 ? "Agregá al menos una categoría." : null,
  };

  const isValid =
    !errors.name &&
    !errors.desc &&
    !errors.price &&
    !errors.stock &&
    !errors.discount &&
    !errors.categories;

  const markTouched = (field) =>
    setTouched((t) => ({ ...t, [field]: true }));

  // ---- API calls
  async function createProductOnServer() {
    const payload = {
      name: name.trim(),
      description: desc.trim(),
      price: Number(price),
      stock: Number(stock),
      discount: String(discount).trim() === "" ? null : Number(discount),
      // el backend espera nombres (description) de categorías
      categories: categories.map((c) => c.description),
    };

    const url = `${API_BASE}/products/create`;
    console.debug("[CreateProduct] POST", url, payload);

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      let msg = `Error al crear producto (HTTP ${res.status})`;
      try {
        const text = await res.text();
        if (text) msg = text;
      } catch {}
      throw new Error(msg);
    }

    // obtener id del body o del header Location
    let id = null;
    try {
      const body = await res.json();
      if (body && body.id != null) id = body.id;
    } catch {
      // ignore json parse error (quizá vino vacío)
    }
    if (!id) {
      const loc = res.headers.get("Location");
      if (loc) id = Number(loc.split("/").pop());
    }
    if (!id) throw new Error("No se pudo obtener el ID del producto.");

    return id;
  }

  async function uploadImagesSequential(productId, files) {
    for (const file of files) {
      const fd = new FormData();
      // tu backend espera @RequestParam("file")
      fd.append("file", file);

      const url = `${API_BASE}/products/${productId}/images`;

      const res = await fetch(url, {
        method: "POST",
        headers: {
          // NO setear Content-Type manual con FormData
          ...authHeaders(),
        },
        body: fd,
      });

      if (!res.ok) {
        let msg = `Error al subir imagen "${file.name}" (HTTP ${res.status})`;
        try {
          const txt = await res.text();
          if (txt) msg = txt;
        } catch {}
        throw new Error(msg);
      }
    }
  }

  // ---- submit
  const onSubmit = async (e) => {
    e.preventDefault();

    // Requiere sesión (token)
    const token = getToken();
    if (!token) {
      toast.error("Necesitás iniciar sesión para crear productos.");
      return;
    }

    // marcar todo tocado para mostrar errores si los hay
    setTouched({
      name: true,
      desc: true,
      price: true,
      stock: true,
      discount: true,
      categories: true,
    });
    if (!isValid) return;

    try {
      // 1) crear producto
      const productId = await createProductOnServer();

      // 2) subir imágenes (una por request)
      if (imageFiles.length > 0) {
        await uploadImagesSequential(productId, imageFiles);
      }

      toast.success("✅ Producto creado y fotos subidas.");

      // Reset
      setName("");
      setDesc("");
      setPrice("");
      setStock("");
      setDiscount("");
      setCategories([]);
      setImageFiles([]);
      setTouched({});

      // ➜ Redirigir al catálogo
      navigate("/products");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Error al crear el producto.");
    }
  };

  return (
    <div className="app">
      <main className="main">
        <div className="create-container">
          <h1 className="form-title">Publicar producto</h1>
          <p className="form-subtitle">
            Completá los campos obligatorios para crear tu publicación.
          </p>

          <div className="form-card">
            <form className="form-grid" onSubmit={onSubmit} noValidate>
              {/* Nombre */}
              <div className="form-group">
                <label htmlFor="name">Nombre del producto *</label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={() => markTouched("name")}
                  placeholder="Ej: Limited Edition Sneaker"
                />
                {touched.name && errors.name && (
                  <p className="error">{errors.name}</p>
                )}
              </div>

              {/* Descripción */}
              <div className="form-group full">
                <label htmlFor="desc">Descripción *</label>
                <textarea
                  id="desc"
                  rows={5}
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  onBlur={() => markTouched("desc")}
                  placeholder="Contá detalles del estado, medidas, materiales, etc."
                />
                {touched.desc && errors.desc && (
                  <p className="error">{errors.desc}</p>
                )}
              </div>

              {/* Precio */}
              <div className="form-group">
                <label htmlFor="price">Precio (USD) *</label>
                <input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  onBlur={() => markTouched("price")}
                  placeholder="Ej: 199.99"
                />
                {touched.price && errors.price && (
                  <p className="error">{errors.price}</p>
                )}
              </div>

              {/* Stock */}
              <div className="form-group">
                <label htmlFor="stock">Stock *</label>
                <input
                  id="stock"
                  type="number"
                  step="1"
                  min="0"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  onBlur={() => markTouched("stock")}
                  placeholder="Ej: 10"
                />
                {touched.stock && errors.stock && (
                  <p className="error">{errors.stock}</p>
                )}
              </div>

              {/* Descuento (opcional) */}
              <div className="form-group">
                <label htmlFor="discount">% Descuento (opcional)</label>
                <input
                  id="discount"
                  type="number"
                  step="1"
                  min="0"
                  max="100"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  onBlur={() => markTouched("discount")}
                  placeholder="Ej: 15"
                />
                {touched.discount && errors.discount && (
                  <p className="error">{errors.discount}</p>
                )}
              </div>

              {/* Categorías (selector con búsqueda) */}
              <div className="form-group full">
                <CategoryMultiSelect
                  selected={categories}
                  onChange={setCategories}
                  apiBase={API_BASE}
                />
                {touched.categories && errors.categories && (
                  <p className="error">{errors.categories}</p>
                )}
              </div>

              {/* Imágenes */}
              <div className="form-group full">
                <label>Fotos del producto</label>
                <ImageUploader onImagesChange={setImageFiles} />
                <p className="helper">
                  Subí una o más imágenes. Se enviarán luego de crear el
                  producto.
                </p>
              </div>

              {/* Submit */}
              <div className="actions full">
                <button
                  type="submit"
                  className="submit-btn dotted-btn"
                  disabled={!isValid}
                  title={
                    !isValid
                      ? "Completá los campos obligatorios"
                      : "Crear producto"
                  }
                >
                  Publicar producto
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateProduct;
