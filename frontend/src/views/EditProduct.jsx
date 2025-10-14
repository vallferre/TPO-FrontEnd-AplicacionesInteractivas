import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../components/EditProduct.css";

const EditProduct = () => {
  const { id } = useParams(); // ruta tipo /edit/:id
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]); // 🔹 categorías dinámicas
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔹 Obtener producto
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const resProduct = await fetch(`http://localhost:8080/products/id/${id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!resProduct.ok) throw new Error(`Error: ${resProduct.status}`);
        const data = await resProduct.json();
        console.log("Fetched product:", data);
        setProduct(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // 🔹 Obtener categorías
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:8080/categories", {
          headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) throw new Error("Error al cargar categorías");
        const data = await res.json();
        setCategories(data.content || []);
      } catch (err) {
        console.error("Error cargando categorías:", err);
      }
    };

    fetchCategories();
  }, []);

  // 🔹 Manejar el submit del formulario (PUT con token)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("jwtToken");
    if (!token) {
      alert("⚠️ No se encontró el token. Iniciá sesión nuevamente.");
      return;
    }

    const updatedProduct = {
      name: e.target.name.value,
      description: e.target.description.value,
      category: { id: e.target.category.value },
      price: parseFloat(e.target.price.value),
      discount: parseInt(e.target.discount.value),
      quantity: parseInt(e.target.quantity.value),
    };

    console.log("Updating product:", updatedProduct);

    try {
      const res = await fetch(`http://localhost:8080/products/${id}`, {
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
            <div className="form-group">
              <label htmlFor="name">Product Name</label>
              <input id="name" name="name" type="text" defaultValue={product.name || ""} />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                rows="4"
                defaultValue={product.description || ""}
              ></textarea>
            </div>

            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select id="category" name="category" defaultValue={product.category?.id || ""}>
                <option value="">Seleccionar categoría</option>
                {Array.isArray(categories) &&
                  categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.description}
                    </option>
                  ))}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="price">Price</label>
                <div className="price-wrapper">
                  <span className="currency">$</span>
                  <input
                    id="price"
                    name="price"
                    type="text"
                    defaultValue={product.price?.toFixed(2) || ""}
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
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="quantity">Quantity</label>
              <input
                id="quantity"
                name="quantity"
                type="number"
                defaultValue={product.quantity || 0}
              />
            </div>

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
