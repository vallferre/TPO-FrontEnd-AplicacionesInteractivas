import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CategoryMultiSelect from "../components/CategoryMultiSelect";
import "../components/EditProduct.css";

const API_BASE = "http://localhost:8080";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]); // categorías seleccionadas del producto
  const [allCategories, setAllCategories] = useState([]); // todas las categorías disponibles
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔹 Obtener el producto
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const resProduct = await fetch(`${API_BASE}/products/id/${id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!resProduct.ok) throw new Error(`Error: ${resProduct.status}`);
        const data = await resProduct.json();
        setProduct(data);

        // Cargar categorías actuales del producto
        if (data.categories && Array.isArray(data.categories)) {
          setCategories(data.categories);
        }
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // 🔹 Obtener todas las categorías
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_BASE}/categories`, {
          headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) throw new Error("Error al cargar categorías");
        const data = await res.json();
        setAllCategories(data.content || data || []); // por si cambia el formato
      } catch (err) {
        console.error("Error cargando categorías:", err);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("jwtToken");
    if (!token) {
      alert("⚠️ No se encontró el token. Iniciá sesión nuevamente.");
      return;
    }

    if (categories.length === 0) {
      alert("Debe seleccionar al menos una categoría.");
      return;
    }

    // Convertimos el array de objetos a array de strings (IDs o nombres)
    const selectedCategoryStrings = categories.map(cat => cat.id); // o cat.description si tu backend quiere nombres

    const updatedProduct = {
      name: e.target.name.value.trim(),
      description: e.target.description.value.trim(),
      categories: selectedCategoryStrings, // 👈 ahora es un array de strings
      price: parseFloat(e.target.price.value),
      discount: parseInt(e.target.discount.value),
      quantity: parseInt(e.target.quantity.value),
    };

    try {
      const res = await fetch(`${API_BASE}/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedProduct),
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(`Error al actualizar producto: ${msg}`);
      }

      alert("✅ Producto actualizado correctamente");
      navigate(-1);
    } catch (err) {
      console.error("Error actualizando producto:", err);
      alert("❌ Hubo un error al actualizar el producto");
    }
  };


  if (loading) return <p>Cargando producto...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!product) return <p>No se encontró el producto.</p>;

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
                defaultValue={product.name || ""}
                required
                pattern="^[A-Za-z0-9\\s]{1,100}$"
                title="Solo letras, números y espacios (máx 100 caracteres)"
              />
            </div>

            {/* Descripción */}
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                rows="4"
                defaultValue={product.description || ""}
                required
                maxLength={500}
                title="Máx 500 caracteres"
              ></textarea>
            </div>

            {/* Categorías */}
            <div className="form-group full">
              <label>Categorías</label>
              <CategoryMultiSelect
                selected={categories}
                onChange={setCategories}
                apiBase={API_BASE}
                allCategories={allCategories}
              />
              {categories.length === 0 && (
                <p className="error">Debe seleccionar al menos una categoría.</p>
              )}
            </div>

            {/* Precio y descuento */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="price">Price</label>
                <div className="price-wrapper">
                  <span className="currency">$</span>
                  <input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    defaultValue={product.price?.toFixed(2) || ""}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="discount">Discount (%)</label>
                <input
                  id="discount"
                  name="discount"
                  type="number"
                  defaultValue={product.discount || 0}
                  required
                  min={0}
                  max={99}
                />
              </div>
            </div>

            {/* Cantidad */}
            <div className="form-group">
              <label htmlFor="quantity">Quantity</label>
              <input
                id="quantity"
                name="quantity"
                type="number"
                defaultValue={product.quantity || 0}
                required
                min={0}
              />
            </div>

            {/* Fotos */}
            <div className="form-group">
              <label>Photos</label>
              <div className="upload-box">
                <span className="upload-icon">📷</span>
                <p>
                  <label htmlFor="photo-upload" className="upload-link">
                    Upload a file
                    <input id="photo-upload" type="file" multiple hidden />
                  </label>
                  &nbsp;or drag and drop
                </p>
                <p className="upload-note">PNG, JPG, GIF up to 10MB</p>
              </div>
            </div>

            {/* Botones */}
            <div className="form-actions">
              <button
                type="button"
                className="btn cancel"
                onClick={() => navigate(-1)}
              >
                Cancel
              </button>
              <button type="submit" className="btn save">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default EditProduct;