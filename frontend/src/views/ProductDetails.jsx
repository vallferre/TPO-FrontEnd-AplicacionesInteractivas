import React, { useState, useEffect } from "react";
import "../components/ProductDetails.css";
import { useParams } from "react-router-dom";
import SingleProduct from "./SingleProduct.jsx";
import { toast } from "react-toastify";


const ProductDetails = () => {
  const { id } = useParams();
  const token = localStorage.getItem("jwtToken");

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);

  const API_BASE = "http://localhost:8080";

  const options = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  };

  useEffect(() => {
    const fetchProductAndRelated = async () => {
      try {
        const resProduct = await fetch(`${API_BASE}/products/id/${id}`, options);
        if (!resProduct.ok) throw new Error(`Error: ${resProduct.status}`);
        const data = await resProduct.json();
        setProduct(data);

        if (data.categories?.length > 0) {
          const resCategories = await fetch(`${API_BASE}/categories`, options);
          if (!resCategories.ok)
            throw new Error(`Error fetching categories: ${resCategories.status}`);
          const categoriesData = await resCategories.json();
          const allCategories = categoriesData.content || [];

          const productCategoryIds = data.categories
            .map((catName) => {
              const catObj = allCategories.find((c) => c.description === catName);
              return catObj ? catObj.id : null;
            })
            .filter((id) => id !== null);

          const relatedMap = new Map();
          await Promise.all(
            productCategoryIds.map(async (catId) => {
              try {
                const res = await fetch(`${API_BASE}/products/by-category/${catId}`, options);
                if (!res.ok) return;
                const related = await res.json();
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

  const imageIds = product.imageIds || [];
  const imageUrl =
    imageIds.length > 0
      ? `${API_BASE}/images/${imageIds[currentImage]}`
      : "https://via.placeholder.com/600x400?text=Sin+imagen";

  const handlePrev = () => {
    setCurrentImage((prev) => (prev === 0 ? imageIds.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentImage((prev) => (prev === imageIds.length - 1 ? 0 : prev + 1));
  };
  const handleAddToCart = async (e) => {
      e.stopPropagation();
      if (!token) {
        toast.info("Please log in to add products to the cart.");
        navigate("/login");
        return;
      }
  
      try {
        const res = await fetch(`${API_BASE}/cart/add`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ productId: id, quantity: 1 }),
        });
  
        if (!res.ok) throw new Error(`Failed to add product: ${res.status}`);
        toast.success(`${product?.name || "Product"} added to cart!`);
      } catch (err) {
        console.error("Error adding to cart:", err);
        toast.error("Failed to add product to cart. Please try again.");
      }
    };

  return (
    <div className="product-details-page">
      <div className="product-details">
        <div className="image-carousel-container">
          {imageIds.length > 1 && (
            <>
              <button className="carousel-btn left" onClick={handlePrev}>
                ❮
              </button>
              <button className="carousel-btn right" onClick={handleNext}>
                ❯
              </button>
            </>
          )}

          <img
            src={imageUrl}
            alt={product.name}
            className="productImageSpecial"
            onError={(e) => {
              e.currentTarget.src =
                "https://via.placeholder.com/600x400?text=Sin+imagen";
            }}
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
            onClick={handleAddToCart}
          >
            Agregar al carrito
          </button>
        </div>
      </div>

      <div className="product-description-section">
        <h2>Descripción</h2>
        <p>
          {product.description && product.description.trim().length > 0
            ? product.description
            : "El vendedor no incluyó descripción del producto."}
        </p>
      </div>

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