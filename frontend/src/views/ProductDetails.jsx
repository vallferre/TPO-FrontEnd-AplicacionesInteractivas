import React, { useState, useEffect } from "react";
import "../assets/ProductDetails.css";
import { useParams, useNavigate } from "react-router-dom";
import SingleProduct from "./SingleProduct.jsx";
import FavoriteButton from "../components/FavoriteButton";
import RatingCard from "../components/RatingCard.jsx";
import { toast } from "react-toastify";

const ProductDetails = () => {
  const { id } = useParams();
  const token = localStorage.getItem("jwtToken");
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // ⭐ estados para ratings
  const [averageRating, setAverageRating] = useState(0);
  const [ratingCounts, setRatingCounts] = useState({
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  });
  const [productRatings, setProductRatings] = useState([]);

  const API_BASE = "http://localhost:8080";

  const options = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  };

  useEffect(() => {
    const fetchProductAndRelated = async () => {
      try {
        // Producto
        const resProduct = await fetch(`${API_BASE}/products/id/${id}`, options);
        if (!resProduct.ok) throw new Error(`Error: ${resProduct.status}`);
        const data = await resProduct.json();
        setProduct(data);
        if (data.stock > 0) setQuantity(1);

        // Productos relacionados
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

        // 🔹 Promedio de rating
        try {
          const resAvg = await fetch(`${API_BASE}/ratings/average/${id}`);
          if (resAvg.ok) setAverageRating(await resAvg.json());
        } catch (err) {
          console.error("Error fetching average rating:", err);
        }

        // 🔹 Cantidad por valor 5→1
        const counts = {};
        await Promise.all([5, 4, 3, 2, 1].map(async (val) => {
          try {
            const res = await fetch(`${API_BASE}/ratings/count-by-value/${id}/${val}`);
            if (res.ok) counts[val] = await res.json();
            else counts[val] = 0;
          } catch (err) {
            counts[val] = 0;
          }
        }));
        setRatingCounts(counts);

        // 🔹 Opiniones
        try {
          const resOpinions = await fetch(`${API_BASE}/ratings/by-product/${id}`);
          if (resOpinions.ok) {
            const ratingsData = await resOpinions.json();
            // Espera [{userName, value, comment}, ...]
            setProductRatings(ratingsData);
          }
        } catch (err) {
          console.error("Error fetching product ratings:", err);
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
    return <div className="product-loading"><p>Cargando producto...</p></div>;

  if (error)
    return <div className="product-error"><p>{error}</p></div>;

  if (!product)
    return <div className="product-error"><p>Producto no encontrado.</p></div>;

  const imageIds = product.imageIds || [];

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (!token) {
      toast.info("Iniciá sesión para agregar productos al carrito.");
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
        body: JSON.stringify({ productId: id, quantity }),
      });
      if (!res.ok) throw new Error(`Failed to add product: ${res.status}`);
      toast.success(`${product?.name || "Producto"} agregado al carrito!`);
    } catch (err) {
      console.error("Error adding to cart:", err);
      toast.error("Error al agregar al carrito. Intenta nuevamente.");
    }
  };

  return (
    <div className="product-details-page">
      <div className="product-details">
        <div className="image-carousel-container">
          <div
            className="btn-favorite--dynamic"
            style={{ position: "absolute", top: "12px", right: "12px", zIndex: 10 }}
            onClick={(e) => e.stopPropagation()}
          >
            <FavoriteButton productId={id} productName={product.name} token={token} />
          </div>
          {imageIds.length > 0 ? (
            <img
              src={`${API_BASE}/images/${imageIds[currentImage]}`}
              alt={product.name}
              className="productImageSpecial"
            />
          ) : (
            <div className="no-image-placeholder">{product.name}</div>
          )}
        </div>

        <div className="product-info">
          <h1 className="product-title">{product.name}</h1>

          {/* ⭐ Estrellas visuales con promedio */}
          <div className="star-container">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={`star ${i < (averageRating > 0 ? Math.round(averageRating) : 5) ? "filled" : ""}`}
              >
                ★
              </span>
            ))}
            <span style={{ marginLeft: "0.5rem" }}>
              ({averageRating > 0 ? averageRating.toFixed(1) : 5})
            </span>
          </div>

          <div className="product-price-stock">
            <span className="product-price">${product.price}</span>
            <span
              className={`product-stock ${product.stock > 0 ? "in-stock" : "out-of-stock"}`}
            >
              {product.stock > 0 ? "En stock" : "Sin stock"}
            </span>
          </div>

          {product.stock > 0 && (
            <div className="quantity-selector">
              <label htmlFor="quantity">Cantidad:</label>
              <select
                id="quantity"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
              >
                {Array.from({ length: product.stock }, (_, i) => i + 1).map((num) => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>
          )}

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
          {product.description?.trim().length > 0
            ? product.description
            : "El vendedor no incluyó descripción del producto."}
        </p>
      </div>

      {/* ⭐ Calificación y opiniones */}
      <div className="product-description-section rating-opinions-container">
        {/* Calificación */}
        <div className="rating-column">
          <h2>Calificación</h2>
          <div className="rating-histogram">
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="rating-row">
                <span className="star-row">{star} </span>
                {[...Array(star)].map((_, i) => (
                  <span key={i} className="star filled">★</span>
                ))}
                <span className="rating-count"> ({ratingCounts[star] || 0})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Opiniones */}
        <div className="opinions-column">
          <h2>Opiniones</h2>
          <div className="ratings-list">
            {productRatings.length > 0 ? (
              productRatings.map((r, idx) => (
                <RatingCard
                  key={idx}
                  userName={r.userName}
                  value={r.value}
                  comment={r.comment}
                />
              ))
            ) : (
              <p>No hay opiniones para este producto aún.</p>
            )}
          </div>
        </div>
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