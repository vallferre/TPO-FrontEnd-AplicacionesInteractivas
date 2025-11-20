// src/views/EditProduct.jsx 
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./EditProduct.css";
import CategoryMultiSelect from "../components/CategoryMultiSelect";
import ImageUploader from "../../../components/common/ImageUploader";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchProductById,
  updateProductWithImages,
} from "../../../redux/slices/ProductSlice";

import {
  fetchProductImages,
  deleteProductImages,
  uploadProductImages,
} from "../../../redux/slices/ProductImageSlice";

const API_BASE = "http://localhost:8080";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 🔹 token desde Redux
  const token = useSelector((state) => state.auth.token);

  // 🔹 imágenes desde Redux
  const productImages = useSelector(
    (state) => state.productImages.items || []
  );

  // Campos base
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(""); // string
  const [discountStr, setDiscountStr] = useState(""); // string (permite vacío)

  // stock como string y vacío (placeholder muestra el actual)
  const [stockStr, setStockStr] = useState("");

  // Originales
  const [originalStock, setOriginalStock] = useState(0);
  const [originalDiscount, setOriginalDiscount] = useState(null);

  // Categorías
  const [originalCategories, setOriginalCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  // Imágenes (solo frontend)
  const [newImages, setNewImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);

  // Estado
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const MAX_IMAGE_SIZE = 1 * 1024 * 1024;

  /* ---------- helpers para categorías (solo GET local) ---------- */

  const fetchAllCategories = async () => {
    const res = await fetch(`${API_BASE}/categories`, {
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) throw new Error(`Error categorías: ${res.status}`);
    const data = await res.json();
    return data.content || [];
  };

  /* ---------- carga inicial usando Redux para el producto + imágenes ---------- */

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");

      try {
        const [productAction, catsList] = await Promise.all([
          dispatch(fetchProductById(id)),
          fetchAllCategories(),
        ]);

        // Si falló el fetch del producto
        if (!fetchProductById.fulfilled.match(productAction)) {
          console.error("Error al cargar producto:", productAction.error);
          setError("No se pudo cargar el producto.");
          return;
        }

        const product = productAction.payload;

        // 🔹 IMÁGENES DESDE REDUX
        const imagesAction = await dispatch(fetchProductImages(id));
        if (!fetchProductImages.fulfilled.match(imagesAction)) {
          console.error("Error al cargar imágenes:", imagesAction.error);
          // no cortamos el flujo, solo logueamos
        }

        setName(product.name ?? "");
        setDescription(product.description ?? "");
        setPrice(String(product.price ?? ""));

        const disc = product.discount;
        setDiscountStr(
          disc === null || disc === undefined ? "" : String(disc)
        );
        setOriginalDiscount(
          disc === null || disc === undefined ? null : Number(disc)
        );

        const currentQty = Number(product.quantity ?? product.stock ?? 0);
        setOriginalStock(Number.isFinite(currentQty) ? currentQty : 0);

        // input stock vacío (placeholder con originalStock)
        setStockStr("");

        const prodCats = Array.isArray(product.categories)
          ? product.categories
          : [];
        const mappedOriginals = prodCats
          .map((desc) => catsList.find((c) => c.description === desc))
          .filter(Boolean);

        setOriginalCategories(mappedOriginals);
        setSelectedCategories(mappedOriginals);
      } catch (e) {
        console.error(e);
        setError("No se pudo cargar el producto.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id, dispatch]);

  // Categorías
  const handleCategoriesChange = (picked) => {
    const merged = [
      ...originalCategories,
      ...picked.filter((c) => !originalCategories.some((o) => o.id === c.id)),
    ];
    setSelectedCategories(merged);
  };

  // Imágenes
  const handleMarkImageForDeletion = (imageId) => {
    setImagesToDelete((prev) => [...prev, imageId]);
  };

  /* ---------- submit ---------- */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error("⚠️ Iniciá sesión nuevamente.");
      return;
    }

    const totalImagesAfterDelete =
      productImages.length - imagesToDelete.length + newImages.length;
    if (totalImagesAfterDelete === 0) {
      toast.error(
        "⚠️ Debe haber al menos una imagen antes de guardar el producto."
      );
      return;
    }

    for (const file of newImages) {
      if (file.size > MAX_IMAGE_SIZE) {
        toast.error(
          `La imagen "${file.name}" es demasiado grande. Máximo permitido: ${
            MAX_IMAGE_SIZE / 1024 / 1024
          }MB.`
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

    // Payload base
    const payload = {
      name: name.trim(),
      description: description.trim(),
      price: price === "" ? undefined : Number(price),
      ...(newOnly.length > 0 && {
        categories: newOnly.map((c) => c.description),
      }),
    };

    // Descuento
    const discTrim = String(discountStr ?? "").trim();
    if (discTrim !== "") {
      const parsedDisc = Number(discTrim);
      if (!Number.isFinite(parsedDisc) || parsedDisc < 0 || parsedDisc > 99) {
        toast.error("Descuento inválido (0-99).");
        return;
      }
      payload.discount = parsedDisc;
    }

    // Stock
    const stockTrim = String(stockStr ?? "").trim();
    if (stockTrim !== "") {
      const parsedQty = parseInt(stockTrim, 10);
      if (!Number.isFinite(parsedQty) || parsedQty < 0) {
        toast.error("Cantidad inválida.");
        return;
      }
      if (parsedQty !== originalStock) {
        payload.quantity = parsedQty;
        payload.stock = parsedQty;
      }
    }

    // Limpiar undefined
    Object.keys(payload).forEach(
      (k) => payload[k] === undefined && delete payload[k]
    );

    setSaving(true);

    // 1) Eliminar imágenes marcadas
    if (imagesToDelete.length > 0) {
      const deleteAction = await dispatch(
        deleteProductImages({
          token,
          imageIds: imagesToDelete,
        })
      );

      if (deleteProductImages.rejected.match(deleteAction)) {
        console.error("Error al eliminar imágenes:", deleteAction.error);
        toast.error("Hubo un error al eliminar las imágenes");
        setSaving(false);
        return;
      }
    }

    // 2) Actualizar producto (PUT + notificación)
    const updateAction = await dispatch(
      updateProductWithImages({
        token,
        id,
        payload,
        originalStock,
        originalDiscount,
      })
    );

    if (updateProductWithImages.rejected.match(updateAction)) {
      console.error("Error al actualizar producto:", updateAction.error);
      toast.error("Hubo un error al actualizar el producto");
      setSaving(false);
      return;
    }

    // 3) Subir nuevas imágenes
    if (newImages.length > 0) {
      const uploadAction = await dispatch(
        uploadProductImages({
          token,
          productId: id,
          files: newImages,
        })
      );

      if (uploadProductImages.rejected.match(uploadAction)) {
        console.error("Error al subir imágenes:", uploadAction.error);
        toast.error("Hubo un error al subir las nuevas imágenes");
        setSaving(false);
        return;
      }
    }

    toast.success("Producto actualizado correctamente");
    setSaving(false);
    navigate(-1);
  };

  if (loading) return <p>Cargando producto...</p>;
  if (error) return <p className="error">{error}</p>;

  const totalImagesAfterDelete =
    productImages.length - imagesToDelete.length + newImages.length;
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
                  value={discountStr}
                  onChange={(e) => setDiscountStr(e.target.value)}
                  min={0}
                  max={99}
                  placeholder="Dejar vacío para no modificar"
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
                value={stockStr}
                onChange={(e) => setStockStr(e.target.value)}
                min={0}
                placeholder={String(originalStock)}
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
                Las categorías ya asignadas están bloqueadas y no se vuelven a
                enviar al guardar.
              </p>
            </div>

            {/* Imágenes existentes */}
            <div className="form-group">
              <label>Fotos existentes</label>
              <p className="muted" style={{ marginTop: ".025rem" }}>
                Las imágenes ya cargadas, al ser eliminadas, no podrán ser
                recuperadas hasta guardar.
              </p>

              {productImages.length === 0 ? (
                <p className="muted">Aún no hay imágenes cargadas</p>
              ) : (
                <div className="thumbs-grid">
                  {productImages
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
              <button
                type="submit"
                className="btn save"
                disabled={saving || noImages}
              >
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
