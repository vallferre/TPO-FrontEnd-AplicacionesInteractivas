// src/views/CreateProduct.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import "./CreateProduct.css";
import CategoryMultiSelect from "../components/CategoryMultiSelect";
import ImageUploader from "../../../components/common/ImageUploader";

import { createProduct } from "../../../redux/slices/ProductSlice.js";
import { uploadProductImages } from "../../../redux/slices/ProductImageSlice.js";
import { selectProductCreating } from "../../../redux/slices/ProductSelectors";
import { selectImageUploading } from "../../../redux/slices/ProductImageSelectors";

const API_BASE = "http://localhost:8080"; // para CategoryMultiSelect

const CreateProduct = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 🔹 Token desde Redux
  const token = useSelector((s) => s.auth.token);

  // estados de loading opcionales
  const creating = useSelector(selectProductCreating);
  const uploadingImages = useSelector(selectImageUploading);

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

  const MAX_IMAGE_SIZE = 1 * 1024 * 1024; // 1MB

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error("Necesitás iniciar sesión para crear productos.");
      return;
    }

    setTouched({
      name: true,
      desc: true,
      price: true,
      stock: true,
      discount: true,
      categories: true,
    });

    if (!isValid) return;

    // Validar imágenes antes de enviar (lógica en JSX, no en thunks)
    if (imageFiles.length === 0) {
      toast.error("Debés subir al menos una imagen del producto.");
      return;
    }
    for (const file of imageFiles) {
      if (file.size > MAX_IMAGE_SIZE) {
        toast.error(
          `La imagen "${file.name}" es demasiado grande. Máximo permitido: 1MB.`
        );
        return;
      }
      if (file.size === 0) {
        toast.error(`La imagen "${file.name}" no es válida.`);
        return;
      }
    }

    // Armar form para backend (sin lógica en el thunk)
    const form = {
      name: name.trim(),
      description: desc.trim(),
      price: Number(price),
      stock: Number(stock),
      discount: String(discount).trim() === "" ? null : Number(discount),
      categories: categories.map((c) => c.description),
    };

    try {
      // 1) Crear producto (PRIMER DISPATCH)
      const createAction = await dispatch(createProduct({ token, form })
      );

      if (createAction.meta.requestStatus === "rejected") {
        const msg =
          createAction.payload ||
          createAction.error?.message ||
          "Error al crear el producto.";
        toast.error(msg);
        return;
      }

      const created = createAction.payload;
      const productId = created?.id;

      if (!productId) {
        toast.error("No se pudo obtener el ID del producto creado.");
        return;
      }

      // 2) Subir imágenes (SEGUNDO DISPATCH)
      const uploadAction = await dispatch(uploadProductImages({ token, productId, files: imageFiles })
      );

      if (uploadAction.meta.requestStatus === "rejected") {
        const msg =
          uploadAction.payload ||
          uploadAction.error?.message ||
          "Error al subir las imágenes.";
        toast.error(msg);
        return;
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

      navigate("/products");
    } catch (err) {
      console.error(err);
      toast.error(err?.message || "Error al crear el producto.");
    }
  };

  const isSubmitting = creating || uploadingImages;

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
                  rows={20}
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

              {/* Categorías */}
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
                  disabled={!isValid || isSubmitting}
                  title={
                    !isValid
                      ? "Completá los campos obligatorios"
                      : "Crear producto"
                  }
                >
                  {isSubmitting ? "Publicando..." : "Publicar producto"}
                </button>
              </div>

              {!token && (
                <p className="error" style={{ marginTop: ".5rem" }}>
                  Debés iniciar sesión para publicar.
                </p>
              )}
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateProduct;
