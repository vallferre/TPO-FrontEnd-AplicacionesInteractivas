import React, { useState, useEffect } from "react";
import "../components/CreateProduct.css";
import ImageUploader from "../components/ImageUploader";

const CreateProduct = () => {
  // Form state
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [discount, setDiscount] = useState("");
  const [categoryInput, setCategoryInput] = useState("");
  const [categories, setCategories] = useState([]);

  // Imagenes (File[])
  const [images, setImages] = useState([]);

  // UX/validación
  const [touched, setTouched] = useState({});
  const markTouched = (field) => setTouched((t) => ({ ...t, [field]: true }));

  // Validaciones
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

  // Categorías
  const addCategory = () => {
    const raw = categoryInput.trim();
    if (!raw) return;
    const parts = raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    // Tip: tu backend busca por description capitalizada (Primera letra mayúscula).
    const normalized = parts.map(
      (n) => n.charAt(0).toUpperCase() + n.slice(1).toLowerCase()
    );
    const unique = Array.from(new Set([...categories, ...normalized]));
    setCategories(unique);
    setCategoryInput("");
  };

  const removeCategory = (cat) =>
    setCategories(categories.filter((c) => c !== cat));

  const onCategoriesKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addCategory();
    }
  };

  // Imagenes (vienen de ImageUploader)
  const handleImagesChange = (filesArray) => {
    setImages(filesArray);
  };

  // Submit: 1) crea producto con auth  2) sube imágenes una por request con "file"
  const onSubmit = async (e) => {
    e.preventDefault();

    // Mostrar errores si hay
    setTouched({
      name: true,
      desc: true,
      price: true,
      stock: true,
      discount: true,
      categories: true,
    });
    if (!isValid) return;

    const token = localStorage.getItem("authToken"); // ajustá si usás otro storage/clave
    if (!token) {
      alert("No se encontró token de sesión. Iniciá sesión para crear productos.");
      return;
    }

    // 1) Crear producto
    const productPayload = {
      name: name.trim(),
      description: desc.trim(),
      price: Number(price),
      stock: Number(stock),
      discount: String(discount).trim() === "" ? null : Number(discount),
      categories, // array de strings capitalizados
    };

    let createdProductId = null;

    try {
      const res = await fetch("/products/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Imprescindible para @AuthenticationPrincipal
        },
        body: JSON.stringify(productPayload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Error al crear producto (HTTP ${res.status})`);
      }

      const data = await res.json();
      // Suponemos que el backend devuelve el producto creado con "id"
      createdProductId = data.id;
      if (!createdProductId) {
        throw new Error("El backend no devolvió un id de producto.");
      }
    } catch (err) {
      console.error(err);
      alert(
        `No se pudo crear el producto.\nDetalle: ${err.message || "Error desconocido"}`
      );
      return;
    }

    // 2) Subir imágenes (una request por archivo, con @RequestParam("file"))
    //    Endpoint que compartiste: POST /products/{productId}/images
    try {
      for (const file of images) {
        const fd = new FormData();
        fd.append("file", file); // IMPORTANTE: nombre "file" exacto

        const up = await fetch(`/products/${createdProductId}/images`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`, // también necesita auth
          },
          body: fd,
        });

        if (!up.ok) {
          const msg = await up.text();
          throw new Error(
            msg || `Error subiendo imagen: ${file.name} (HTTP ${up.status})`
          );
        }
      }

      alert("✅ Producto creado y todas las imágenes subidas con éxito.");
      // Reset opcional
      setName("");
      setDesc("");
      setPrice("");
      setStock("");
      setDiscount("");
      setCategoryInput("");
      setCategories([]);
      setImages([]);
      setTouched({});
    } catch (err) {
      console.error(err);
      alert(
        `El producto se creó (id ${createdProductId}), pero hubo errores subiendo imágenes.\nDetalle: ${err.message || "Error desconocido"}`
      );
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

              {/* Categorías */}
              <div className="form-group full">
                <label htmlFor="category">Categorías * (agregá varias)</label>
                <div className="category-input">
                  <input
                    id="category"
                    type="text"
                    value={categoryInput}
                    onChange={(e) => setCategoryInput(e.target.value)}
                    onKeyDown={onCategoriesKeyDown}
                    onBlur={() => markTouched("categories")}
                    placeholder="Escribí una categoría y presioná Enter o coma"
                  />
                  <button
                    type="button"
                    className="btn-add"
                    onClick={addCategory}
                  >
                    Agregar
                  </button>
                </div>
                {categories.length > 0 && (
                  <div className="chips">
                    {categories.map((c) => (
                      <span className="chip" key={c}>
                        {c}
                        <button
                          type="button"
                          className="chip-close"
                          aria-label={`Quitar ${c}`}
                          onClick={() => removeCategory(c)}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                {touched.categories && errors.categories && (
                  <p className="error">{errors.categories}</p>
                )}
              </div>

              {/* Imágenes */}
              <div className="form-group full">
                <label>Fotos del producto</label>
                <ImageUploader onImagesChange={handleImagesChange} />
              </div>

              {/* Botón publicar */}
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
