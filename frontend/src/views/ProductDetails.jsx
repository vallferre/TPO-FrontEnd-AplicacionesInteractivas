import React, { useState, useEffect } from "react";
import "../components/ProductDetails.css";
import { useParams } from "react-router-dom";
import SingleProduct from "./SingleProduct.jsx";

const ProductDetails = () => {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const options = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  };

  useEffect(() => {
    const fetchProductAndRelated = async () => {
      try {
        // Obtener producto principal
        const resProduct = await fetch(`http://localhost:8080/products/id/${id}`, options);
        if (!resProduct.ok) throw new Error(`Error: ${resProduct.status}`);
        const data = await resProduct.json();
        setProduct(data);

        // Si tiene categorías, obtener todas las categorías
        if (data.categories?.length > 0) {
          const resCategories = await fetch("http://localhost:8080/categories", options);
          if (!resCategories.ok) throw new Error(`Error fetching categories: ${resCategories.status}`);
          const categoriesData = await resCategories.json();
          const allCategories = categoriesData.content || [];

          // Mapear nombres de categorías del producto a sus IDs
          const productCategoryIds = data.categories
            .map((catName) => {
              const catObj = allCategories.find((c) => c.description === catName);
              return catObj ? catObj.id : null;
            })
            .filter((id) => id !== null);

          // Traer productos relacionados de cada categoría
          const relatedMap = new Map(); // evitar duplicados
          await Promise.all(
            productCategoryIds.map(async (catId) => {
              try {
                const res = await fetch(`http://localhost:8080/products/by-category/${catId}`, options);
                if (!res.ok) return;
                const related = await res.json(); // lista de ProductResponse
                related.forEach((p) => {
                  if (p.id !== data.id && p.stock > 0 && !relatedMap.has(p.id)) {
                    relatedMap.set(p.id, p);
                  }
                });
              } catch (err) {
                console.error(`Error fetching products for category ${catId}:`, err);
              }
            })
          );

          // Tomar máximo 5 productos
          setRelatedProducts(Array.from(relatedMap.values()).slice(0, 5));
        }
      } catch (err) {
        console.error(err);
        setError("Hubo un error al cargar el producto.");
      } finally {
        setLoading(false);
      }
    };

    fetchProductAndRelated();
  }, [id]);

  if (loading)
    return (
      <div className="product-loading">
        <p>Cargando producto...</p>
      </div>
    );

  if (error)
    return (
      <div className="product-error">
        <p>{error}</p>
      </div>
    );

  if (!product)
    return (
      <div className="product-error">
        <p>Producto no encontrado.</p>
      </div>
    );

  return (
    <div className="product-details-page">
      <div className="product-details">
        <div className="product-image-container">
          <img
            src={product.imageIds?.[0] || "/placeholder.png"}
            alt={product.name}
            className="product-image"
          />
        </div>

        <div className="product-info">
          <h1 className="product-title">{product.name}</h1>

          <div className="product-price-stock">
            <span className="product-price">${product.price}</span>
            <span
              className={`product-stock ${
                product.stock > 0 ? "in-stock" : "out-of-stock"
              }`}
            >
              {product.stock > 0 ? "En stock" : "Sin stock"}
            </span>
          </div>

          <button
            disabled={product.stock <= 0}
            className="add-to-cart-btn"
            onClick={() => alert("Producto agregado al carrito")}
          >
            Agregar al carrito
          </button>
        </div>
      </div>

      {/* Sección de descripción */}
      <div className="product-description-section">
        <h2>Descripción</h2>
        <p>
          {product.description && product.description.trim().length > 0
            ? product.description
            : "El vendedor no incluyó descripción del producto."}
        </p>
      </div>

      {/* Productos relacionados */}
      {relatedProducts.length > 0 && (
        <div className="related-products">
          <h2>A otras personas también les gustó:</h2>
          <div className="related-products-grid">
            {relatedProducts.map((p) => (
              <SingleProduct
                key={p.id}
                id={p.id}
                name={p.name}
                image={p.imageIds?.[0] || null}
                price={p.price}
                details={p.details}
              />
            ))}
          </div>
        </div>
      )}
    </div>

  );
};

export default ProductDetails;