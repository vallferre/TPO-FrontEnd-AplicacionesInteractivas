// src/features/products/ProductDetails.jsx
import React, { useState, useEffect } from "react";
import "./ProductDetails.css";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import SingleProduct from "./SingleProduct.jsx";
import FavoriteButton from "../../../components/ui/FavoriteButton";
import RatingCard from "../../../components/cards/RatingCard.jsx";
import BackButton from "../../../components/ui/BackButton";
import { toast } from "react-toastify";
import {
  fetchProductById,
  fetchRelatedProducts,
  fetchRatings,
} from "../../../redux/thunks/ProductThunk";
import {
  selectProduct,
  selectRelatedProducts,
  selectRatings,
  selectLoading,
  selectError,
} from "../../../redux/slices/ProductSelectors";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = localStorage.getItem("jwtToken");

  const [currentImage, setCurrentImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // Datos de Redux
  const product = useSelector(selectProduct);
  const relatedProducts = useSelector(selectRelatedProducts) || [];
  const { average = 0, counts = {}, list: productRatings = [] } =
    useSelector(selectRatings) || {};
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);

  // Cargar producto, ratings y relacionados
  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
      dispatch(fetchRelatedProducts(id));
      dispatch(fetchRatings(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (product?.stock > 0) setQuantity(1);
  }, [product]);

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

  const imageIds = product?.imageIds || [];

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (!token) {
      toast.info("Iniciá sesión para agregar productos al carrito.");
      navigate("/login");
      return;
    }

    try {
      const res = await fetch(`http://localhost:8080/cart/add`, {
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
    <div>
      <div className="back-button-container">
        <BackButton to="/products" />
      </div>

      <div className="product-details-page">
        <h1>Detalle del producto</h1>
        <div className="product-details">
          <div className="image-carousel-container" style={{ position: "relative" }}>
            {/* Botón favorito */}
            <div
              className="btn-favorite--dynamic"
              style={{ position: "absolute", top: "12px", right: "12px", zIndex: 10 }}
              onClick={(e) => e.stopPropagation()}
            >
              <FavoriteButton productId={id} productName={product?.name} token={token} />
            </div>

            {/* Flecha izquierda */}
            {imageIds?.length > 1 && (
              <button
                className="carousel-arrow left"
                onClick={() =>
                  setCurrentImage((prev) =>
                    prev === 0 ? imageIds.length - 1 : prev - 1
                  )
                }
              >
                ‹
              </button>
            )}

            {/* Imagen actual */}
            {imageIds?.length > 0 ? (
              <img
                src={`http://localhost:8080/images/${imageIds[currentImage]}`}
                alt={product?.name}
                className="productImageSpecial"
              />
            ) : (
              <div className="no-image-placeholder">{product?.name}</div>
            )}

            {/* Flecha derecha */}
            {imageIds?.length > 1 && (
              <button
                className="carousel-arrow right"
                onClick={() =>
                  setCurrentImage((prev) =>
                    prev === imageIds.length - 1 ? 0 : prev + 1
                  )
                }
              >
                ›
              </button>
            )}
          </div>

          <div className="product-info">
            <h1 className="product-title">{product?.name}</h1>

            {/* Estrellas visuales con promedio */}
            <div className="star-container">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={`star ${
                    i < (average > 0 ? Math.round(average) : 5) ? "filled" : ""
                  }`}
                >
                  ★
                </span>
              ))}
              <span style={{ marginLeft: "0.5rem" }}>
                ({average > 0 ? average.toFixed(1) : 5})
              </span>
            </div>

            <h4 className="product-owner">Vendedor/a: {product?.ownerName}</h4>

            <div className="product-price-stock">
              <span className="product-price">${product?.price}</span>
              <span
                className={`product-stock ${product?.stock > 0 ? "in-stock" : "out-of-stock"}`}
              >
                {product?.stock > 0 ? "En stock" : "Sin stock"}
              </span>
            </div>

            {product?.stock > 0 && (
              <div className="quantity-selector">
                <label htmlFor="quantity">Cantidad:</label>
                <select
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                >
                  {Array.from({ length: product?.stock || 0 }, (_, i) => i + 1).map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              disabled={product?.stock <= 0}
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
            {product?.description?.trim()?.length > 0
              ? product.description
              : "El vendedor no incluyó descripción del producto."}
          </p>
        </div>

        {/* Calificación y opiniones */}
        <div className="product-description-section rating-opinions-container">
          {/* Calificación */}
          <div className="rating-column">
            <h2>Calificación</h2>
            <div className="rating-histogram">
              {[5, 4, 3, 2, 1].map((star) => (
                <div key={star} className="rating-row">
                  <span className="star-row">{star} </span>
                  {[...Array(star)].map((_, i) => (
                    <span key={i} className="star filled">
                      ★
                    </span>
                  ))}
                  <span className="rating-count"> ({counts?.[star] || 0})</span>
                </div>
              ))}
            </div>
          </div>

          {/* Opiniones */}
          <div className="opinions-column">
            <h2>Opiniones</h2>
            <div className="ratings-list">
              {productRatings?.length > 0 ? (
                productRatings.slice(0, 3).map((r, idx) => (
                  <RatingCard
                    key={idx}
                    userName={r?.username}
                    value={r?.value}
                    comment={r?.comment}
                  />
                ))
              ) : (
                <p>No hay opiniones para este producto aún.</p>
              )}
            </div>
          </div>
        </div>

        {relatedProducts?.length > 0 && (
          <div className="related-products">
            <h2>A otras personas también les gustó:</h2>
            <div className="related-products-grid">
              {relatedProducts.map((p) => (
                <SingleProduct
                  key={p?.id}
                  id={p?.id}
                  name={p?.name}
                  image={p?.imageIds?.[0] || null}
                  price={p?.price}
                  details={p?.details}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
