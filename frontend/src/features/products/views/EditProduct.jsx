// src/views/EditProduct.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./EditProduct.css";
import CategoryMultiSelect from "../components/CategoryMultiSelect";
import ImageUploader from "../../../components/common/ImageUploader";
import { toast } from "react-toastify";

const API_BASE = "http://localhost:8080";

function authHeaders() {
  const t = localStorage.getItem("jwtToken");
  return t ? { Authorization: `Bearer ${t}` } : {};
}

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Campos base
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState(0);

  // ⚠️ mantener stock como string para permitir vacío
  const [stock, setStock] = useState("0");

  // Guardar valores originales para detectar cambios
  const [originalStock, setOriginalStock] = useState(0);
  const [originalDiscount, setOriginalDiscount] = useState(0);

  // Categorías
  const [originalCategories, setOriginalCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  // Imágenes
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);

  // Estado
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const MAX_IMAGE_SIZE = 1 * 1024 * 1024;

  // Fetchers
  const fetchProduct = async () => {
    const res = await fetch(`${API_BASE}/products/id/${id}`, {
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) throw new Error(`Error producto: ${res.status}`);
    return res.json();
  };

  const fetchAllCategories = async () => {
    const res = await fetch(`${API_BASE}/categories`, {
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) throw new Error(`Error categorías: ${res.status}`);
    const data = await res.json();
    return data.content || [];
  };

  const fetchExistingImages = async () => {
    const res = await fetch(`${API_BASE}/products/${id}/images`, {
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) return [];
    return res.json();
  };

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");

        const [product, catsList, imgs] = await Promise.all([
          fetchProduct(),
          fetchAllCategories(),
          fetchExistingImages(),
        ]);

        setName(product.name ?? "");
        setDescription(product.description ?? "");
        setPrice(String(product.price ?? ""));
        setDiscount(Number(product.discount ?? 0));

        const currentQty = Number(product.quantity ?? product.stock ?? 0);
        setStock(String(Number.isFinite(currentQty) ? currentQty : 0));

        // Guardamos valores originales
        setOriginalStock(currentQty);
        setOriginalDiscount(Number(product.discount ?? 0));

        const prodCats = Array.isArray(product.categories) ? product.categories : [];
        const mappedOriginals = prodCats
          .map((desc) => catsList.find((c) => c.description === desc))
          .filter(Boolean);

        setOriginalCategories(mappedOriginals);
        setSelectedCategories(mappedOriginals);
        setExistingImages(Array.isArray(imgs) ? imgs : []);
      } catch (e) {
        console.error(e);
        setError("No se pudo cargar el producto.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  // Categories
  const handleCategoriesChange = (picked) => {
    const merged = [
      ...originalCategories,
      ...picked.filter((c) => !originalCategories.some((o) => o.id === c.id)),
    ];
    setSelectedCategories(merged);
  };

  // Images
  const handleMarkImageForDeletion = (imageId) => {
    setImagesToDelete((prev) => [...prev, imageId]);
  };

  const handleRemoveNewImage = (idx) => {
    setNewImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const uploadNewImagesSequential = async (productId, files) => {
    for (const file of files) {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch(`${API_BASE}/products/${productId}/images`, {
        method: "POST",
        headers: { ...authHeaders() },
        body: fd,
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Error subiendo "${file.name}" (HTTP ${res.status}) ${text || ""}`);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("jwtToken");
    if (!token) {
      toast.error("⚠️ Iniciá sesión nuevamente.");
      return;
    }

    const totalImagesAfterDelete =
      existingImages.length - imagesToDelete.length + newImages.length;
    if (totalImagesAfterDelete === 0) {
      toast.error("⚠️ Debe haber al menos una imagen antes de guardar el producto.");
      return;
    }

    for (const file of newImages) {
      if (file.size > MAX_IMAGE_SIZE) {
        toast.error(
          `La imagen "${file.name}" es demasiado grande. Máximo permitido: ${MAX_IMAGE_SIZE / 1024 / 1024}MB.`
        );
        return;
      }
      if (file.size === 0) {
        toast.error(`La imagen "${file.name}" no es válida.`);
        return;
      }
    }

    const newOnly = selectedCategories.filter(
      (c) => !originalCategories.some((o) => o.id === c.id)
    );

    // 🧠 Construimos el payload con cantidad opcional:
    const payload = {
      name: name.trim(),
      description: description.trim(),
      price: Number(price),
      discount: Number(discount) || 0,
      ...(newOnly.length > 0 && { categories: newOnly.map((c) => c.description) }),
    };

    // Si el input de stock NO está vacío, enviamos "quantity"
    const stockTrim = String(stock ?? "").trim();
    if (stockTrim !== "") {
      const parsed = parseInt(stockTrim, 10);
      if (!Number.isFinite(parsed) || parsed < 0) {
        toast.error("Cantidad inválida.");
        return;
      }
      payload.quantity = parsed; // ✅ el backend suele esperar 'quantity'
    }
    // Si está vacío, NO tocamos la cantidad → no se duplica ni se pisa

    try {
      setSaving(true);

      // Primero eliminar imágenes marcadas
      for (const imgId of imagesToDelete) {
        await fetch(`${API_BASE}/images/${imgId}`, {
          method: "DELETE",
          headers: authHeaders(),
        });
      }

      // Actualizar producto
      const res = await fetch(`${API_BASE}/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(`Error al actualizar: ${msg || res.status}`);
      }

      // Subir nuevas imágenes
      if (newImages.length > 0) {
        await uploadNewImagesSequential(id, newImages);
      }

      // Notificar si cambió stock o descuento (solo si se envió quantity)
      const sentQuantity = Object.prototype.hasOwnProperty.call(payload, "quantity")
        ? payload.quantity
        : originalStock;

      if (Number(sentQuantity) !== originalStock || Number(discount) !== originalDiscount) {
        try {
          await fetch(`${API_BASE}/api/notifications/product/${id}`, {
            method: "POST",
            headers: { "Content-Type": "application/json", ...authHeaders() },
          });
        } catch (err) {
          console.error("Error notificando usuarios:", err);
        }
      }

      toast.success("Producto actualizado correctamente");
      navigate(-1);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Hubo un error al actualizar el producto");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Cargando producto...</p>;
  if (error) return <p className="error">{error}</p>;

  const totalImagesAfterDelete =
    existingImages.length - imagesToDelete.length + newImages.length;
  const noImages = totalImagesAfterDelete === 0;

  return (
    <div className="edit-page">
      <main className="edit-main">
        <div className="edit-container">
          <div className="edit-header">
            <h2>Editar Producto</h2>
            <p>Actualice los detalles de su producto a continuación.</p>
          </div>

          <form className="edit-form" onSubmit={handleSubmit}>
            {/* Nombre */}
            <div className="form-group">
              <label htmlFor="name">Nombre del Producto</label>
              <input
                id="name"
                name="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                maxLength={100}
                title="Máx 100 caracteres"
              />
            </div>

            {/* Descripción */}
            <div className="form-group">
              <label htmlFor="description">Descripción</label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                maxLength={500}
              />
            </div>

            {/* Precio y descuento */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="price">Precio ($)</label>
                <div className="price-wrapper">
                  <input
                    id="price"
                    name="price"
                    type="text"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Ej: 199.99"
                    title="Solo números positivos, opcional hasta 2 decimales"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="discount">Descuento (%)</label>
                <input
                  id="discount"
                  name="discount"
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  min={0}
                  max={99}
                />
              </div>
            </div>

            {/* Stock */}
            <div className="form-group">
              <label htmlFor="quantity">Cantidad</label>
              <input
                id="quantity"
                name="quantity"
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                min={0}
                placeholder="Dejar vacío para no modificar"
              />
            </div>

            {/* Categorías */}
            <div className="form-group">
              <div className="cms-hide-selected">
                <CategoryMultiSelect
                  apiBase={API_BASE}
                  selected={selectedCategories}
                  onChange={handleCategoriesChange}
                  lockedIds={originalCategories.map((c) => c.id)}
                />
              </div>
              <p className="muted" style={{ marginTop: ".4rem" }}>
                Las categorías ya asignadas están bloqueadas y no se vuelven a enviar al guardar.
              </p>
            </div>

            {/* Imágenes existentes */}
            <div className="form-group">
              <label>Fotos existentes</label>
              <p className="muted" style={{ marginTop: ".025rem" }}>
                Las imágenes ya cargadas, al ser eliminadas, no podrán ser recuperadas hasta guardar.
              </p>

              {existingImages.length === 0 ? (
                <p className="muted">Aún no hay imágenes cargadas</p>
              ) : (
                <div className="thumbs-grid">
                  {existingImages
                    .filter((img) => !imagesToDelete.includes(img.id))
                    .map((img) => (
                      <div key={img.id} className="thumb-card">
                        <img
                          src={`${API_BASE}/images/${img.id}`}
                          alt={img.filename || `image-${img.id}`}
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://via.placeholder.com/200x200?text=No+image";
                          }}
                        />
                        <button
                          type="button"
                          className="thumb-remove"
                          onClick={() => handleMarkImageForDeletion(img.id)}
                          title="Eliminar imagen"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Imágenes nuevas */}
            <div className="form-group">
              <label>Nuevas fotos</label>
              <ImageUploader onImagesChange={setNewImages} />
              {newImages.length > 0 && (
                <p className="muted" style={{ marginTop: ".5rem" }}>
                  Aún no guardadas — se subirán al guardar.
                </p>
              )}
            </div>

            {noImages && (
              <p className="error" style={{ marginBottom: ".5rem" }}>
                ⚠️ Debe haber al menos una imagen antes de guardar.
              </p>
            )}

            {/* Acciones */}
            <div className="form-actions">
              <button
                type="button"
                className="btn cancel"
                onClick={() => navigate(-1)}
                disabled={saving}
              >
                Cancel
              </button>
              <button type="submit" className="btn save" disabled={saving || noImages}>
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default EditProduct;
