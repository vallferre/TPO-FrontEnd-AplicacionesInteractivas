import React, { useState, useEffect } from "react";
import "../components/CreateProduct.css";
import ImageUpload from "../components/ImageUpload"; // usa styled-components

const CreateProduct = () => {

  useState(() => {
    document.title = "Create product";
  })

  
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [discount, setDiscount] = useState("");
  const [categoryInput, setCategoryInput] = useState("");
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [touched, setTouched] = useState({});

  // Limpieza de ObjectURLs al desmontar o al cambiar
  useEffect(() => {
    return () => {
      images.forEach((img) => URL.revokeObjectURL(img.url));
    };
  }, [images]);

  // ---- categorías
  const addCategory = () => {
    const raw = categoryInput.trim();
    if (!raw) return;
    const parts = raw.split(",").map((s) => s.trim()).filter(Boolean);
    const unique = Array.from(new Set([...categories, ...parts]));
    setCategories(unique);
    setCategoryInput("");
  };
  const removeCategory = (cat) => setCategories(categories.filter((c) => c !== cat));
  const onCategoriesKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addCategory();
    }
  };

  // ---- imágenes con ImageUpload (acumula + multiple)
  const onFilesChange = (e) => {
    const files = Array.from(e.target.files || []);
    const mapped = files.map((f, idx) => ({
      file: f,
      url: URL.createObjectURL(f),
      key: `${f.name}-${f.size}-${f.lastModified}-${idx}`,
    }));
    setImages((prev) => {
      const byKey = new Map(prev.map((i) => [i.key, i]));
      mapped.forEach((m) => {
        if (!byKey.has(m.key)) byKey.set(m.key, m);
      });
      return Array.from(byKey.values());
    });
    // permite volver a elegir el mismo archivo en el mismo input
    e.target.value = "";
  };

  const removeImage = (key) => {
    setImages((prev) => {
      const toRemove = prev.find((i) => i.key === key);
      if (toRemove) URL.revokeObjectURL(toRemove.url);
      return prev.filter((i) => i.key !== key);
    });
  };

  const markTouched = (field) => setTouched((t) => ({ ...t, [field]: true }));

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
    categories: categories.length === 0 ? "Agregá al menos una categoría." : null,
  };

  const isValid =
    !errors.name &&
    !errors.desc &&
    !errors.price &&
    !errors.stock &&
    !errors.discount &&
    !errors.categories;

  const onSubmit = (e) => {
    e.preventDefault();
    setTouched({
      name: true,
      desc: true,
      price: true,
      stock: true,
      discount: true,
      categories: true,
    });
    if (!isValid) return;

    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("description", desc.trim());
    formData.append("price", Number(price));
    formData.append("stock", Number(stock));
    if (String(discount).trim() !== "") formData.append("discount", Number(discount));
    categories.forEach((c) => formData.append("categories[]", c));
    images.forEach((img) => formData.append("images", img.file));

    alert("Producto listo para enviar ✅ (ver consola)");
    console.log("FormData:", {
      name, desc, price, stock, discount, categories,
      images: images.map((i) => i.file.name),
    });
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
                {touched.name && errors.name && <p className="error">{errors.name}</p>}
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
                {touched.desc && errors.desc && <p className="error">{errors.desc}</p>}
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
                {touched.price && errors.price && <p className="error">{errors.price}</p>}
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
                {touched.stock && errors.stock && <p className="error">{errors.stock}</p>}
              </div>

              {/* Descuento */}
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
                  <button type="button" className="btn-add" onClick={addCategory}>
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

              {/* Imágenes usando ImageUpload */}
              <div className="form-group full">
                <label>Fotos del producto</label>
                {/* Asegurate de que en ImageUpload.jsx el input tenga 'multiple' */}
                <ImageUpload onChange={onFilesChange} />
                {images.length > 0 && (
                  <div className="preview-grid">
                    {images.map((img) => (
                      <div className="preview" key={img.key}>
                        <img src={img.url} alt={img.file.name} />
                        <button
                          type="button"
                          className="remove-image-btn"
                          onClick={() => removeImage(img.key)}
                          aria-label="Quitar imagen"
                          title="Quitar imagen"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <p className="helper">Podés subir varias imágenes (JPG, PNG, WEBP).</p>
              </div>

              {/* Publicar */}
              <div className="actions full">
                <button
                  type="submit"
                  className="submit-btn dotted-btn"
                  disabled={!isValid}
                  title={!isValid ? "Completá los campos obligatorios" : "Crear producto"}
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
