// src/views/EditProduct.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../assets/EditProduct.css";
import CategoryMultiSelect from "../components/CategoryMultiSelect";
import ImageUploader from "../components/ImageUploader";
import {toast} from "react-toastify"

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
  const [stock, setStock] = useState(0);

  // Categorías
  const [originalCategories, setOriginalCategories] = useState([]); // [{id, description}] bloqueadas
  const [selectedCategories, setSelectedCategories] = useState([]); // originales + nuevas

  // Imágenes
  const [existingImages, setExistingImages] = useState([]); // [{id, filename, ...}]
  const [newImages, setNewImages] = useState([]); // File[]

  // Estado
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Helpers fetch
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
        setPrice(String(product.price ?? "")); // sin pattern para evitar falsos errores
        setDiscount(Number(product.discount ?? 0));
        setStock(Number(product.quantity ?? product.stock ?? 0));

        // Mapear categorías del producto (strings) -> objetos {id, description}
        const prodCats = Array.isArray(product.categories) ? product.categories : [];
        const mappedOriginals = prodCats
          .map((desc) => catsList.find((c) => c.description === desc))
          .filter(Boolean);

        setOriginalCategories(mappedOriginals);
        setSelectedCategories(mappedOriginals); // al inicio = solo originales

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

  // CategoryMultiSelect: nunca permitir quitar originales
  const handleCategoriesChange = (picked) => {
    // picked: arreglo devuelto por el selector (posibles nuevas)
    const merged = [
      ...originalCategories,
      ...picked.filter((c) => !originalCategories.some((o) => o.id === c.id)),
    ];
    setSelectedCategories(merged);
  };

  // Imágenes
  const handleRemoveExistingImage = async (imageId) => {
    try {
      const res = await fetch(`${API_BASE}/images/${imageId}`, {
        method: "DELETE",
        headers: { ...authHeaders(), "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error(`Error al eliminar (HTTP ${res.status})`);
      setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
    } catch (err) {
      console.error(err);
      alert("No se pudo eliminar la imagen.");
    }
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
        headers: { ...authHeaders() }, // NO setear Content-Type con FormData
        body: fd,
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(
          `Error subiendo "${file.name}" (HTTP ${res.status}) ${text || ""}`
        );
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("jwtToken");
    if (!token) {
      alert("⚠️ Iniciá sesión nuevamente.");
      return;
    }

    // Solo categorías NUEVAS (las que no están en originalCategories)
    const newOnly = selectedCategories.filter(
      (c) => !originalCategories.some((o) => o.id === c.id)
    );

    const payload = {
      name: name.trim(),
      description: description.trim(),
      price: Number(price),
      discount: Number(discount) || 0,
      stock: Number.isFinite(Number(stock)) ? parseInt(stock, 10) : 0,
      // Solo mandamos 'categories' si hay nuevas → evita el 400 del backend
      ...(newOnly.length > 0 && {
        categories: newOnly.map((c) => c.description),
      }),
    };

    try {
      setSaving(true);

      // 1) actualizar producto
      const res = await fetch(`${API_BASE}/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders(),
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(`Error al actualizar: ${msg || res.status}`);
      }

      // 2) subir nuevas imágenes
      if (newImages.length > 0) {
        await uploadNewImagesSequential(id, newImages);
      }

      toast.success("Producto actualizado correctamente");
      navigate(-1);
    } catch (err) {
      console.error(err);
      alert(err.message || "Hubo un error al actualizar el producto");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Cargando producto...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="edit-page">
      <main className="edit-main">
        <div className="edit-container">
          <div className="edit-header">
            <h2>Edit Product</h2>
            <p>Update the details of your product below.</p>
          </div>

          <form className="edit-form" onSubmit={handleSubmit}>
            {/* Nombre */}
            <div className="form-group">
              <label htmlFor="name">Product Name</label>
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
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                rows="4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                maxLength={500}
              />
            </div>

            {/* Precio y descuento */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="price">Price ($)</label>
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
                <label htmlFor="discount">Discount (%)</label>
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
              <label htmlFor="quantity">Quantity</label>
              <input
                id="quantity"
                name="quantity"
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                min={0}
              />
            </div>

            {/* Categorías */}
            <div className="form-group">

              {/* Wrapper que oculta la lista gris interna del multiselect SOLO aquí */}
              <div className="cms-hide-selected">
                <CategoryMultiSelect
                    apiBase={API_BASE}
                    selected={selectedCategories}
                    onChange={handleCategoriesChange}
                    lockedIds={originalCategories.map(c => c.id)} // ✅ bloqueadas
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
                Las imágenes ya cargadas, al ser eliminadas, no podrán ser recuperadas.
              </p>
              
              {existingImages.length === 0 ? (
                <p className="muted">No images uploaded yet.</p>
              ) : (
                <div className="thumbs-grid">
                  {existingImages.map((img) => (
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
                        onClick={() => handleRemoveExistingImage(img.id)}
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
                <>
                  <p className="muted" style={{ marginTop: ".5rem" }}>
                    Aún no guardadas — se subirán al guardar.
                  </p>
                </>
              )}
            </div>

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
              <button type="submit" className="btn save" disabled={saving}>
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
