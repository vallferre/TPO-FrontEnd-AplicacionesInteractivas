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
} from "../../../redux/slices/ProductSlice.js";

import {
  selectProduct,
  selectRelatedProducts,
  selectRatings,
  selectLoading,
  selectError,
  selectRelatedLoading,
} from "../../../redux/slices/ProductSelectors";

import { addToCart, fetchCart } from "../../../redux/slices/CartSlice";
import { fetchProductImages } from "../../../redux/slices/ProductImageSlice.js";
import { selectProductImagesById } from "../../../redux/slices/ProductImageSelectors.js";
import { selectToken } from "../../../redux/slices/AuthSelectors.js";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector(selectToken);

  const [currentImage, setCurrentImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // === PRODUCTO ===
  const product = useSelector(selectProduct);
  const relatedProducts = useSelector(selectRelatedProducts) || [];
  const { average = 0, counts = {}, list: productRatings = [] } =
    useSelector(selectRatings) || {};
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const relatedLoading = useSelector(selectRelatedLoading);

  // === IMÁGENES ===
  const images = useSelector((state) => selectProductImagesById(state, id));
  const imageLoading = useSelector((state) => state.productImages.loading);
  const imageError = useSelector((state) => state.productImages.error);

  // ==== CARGA DEL PRODUCTO, RATINGS E IMÁGENES ====
  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
      dispatch(fetchRatings(id));
      dispatch(fetchProductImages(id));
    }
  }, [id, dispatch]);

// ==== PRODUCTOS RELACIONADOS ====
useEffect(() => {
  if (product?.categories?.length > 0 && product?.id) {
    dispatch(fetchRelatedProducts({
      categories: product.categories,
      excludeProductId: product.id
    }));
  }
}, [dispatch, product?.id, product?.categories]);

  // ==== RESET QUANTITY ====
  useEffect(() => {
    if (product?.stock > 0) setQuantity(1);
  }, [product]);

  // ==== AGREGAR AL CARRITO ====
  const handleAddToCart = () => {
    if (!token) {
      toast.info("Debes iniciar sesión para agregar productos al carrito.");
      navigate("/login");
      return;
    }

    dispatch(addToCart({ productId: id, token, quantity }))
      .unwrap()
      .then(() => {
        toast.success(`${product?.name || "Producto"} agregado al carrito!`);
        dispatch(fetchCart({ token }));
      })
      .catch((err) => {
        console.error("Error al agregar al carrito:", err);
        toast.error(err || "No se pudo agregar al carrito");
      });
  };

  // ==== LOADING Y ERROR ====
  if (loading) return <p>Cargando producto...</p>;
  if (error) return <p>{error}</p>;
  if (!product) return <p>Producto no encontrado.</p>;

  const imageIds = images.map((img) => img.id);

  return (
    <div>
      <div className="back-button-container">
        <BackButton to="/products" />
      </div>

      <div className="product-details-page">
        <h1>Detalle del producto</h1>
        <div className="product-details">
          {/* ===== IMÁGENES ===== */}
          <div className="image-carousel-container" style={{ position: "relative" }}>
            {/* Botón favorito */}
            <div
              className="btn-favorite--dynamic"
              style={{ position: "absolute", top: "12px", right: "12px", zIndex: 10 }}
              onClick={(e) => e.stopPropagation()}
            >
              <FavoriteButton productId={id} productName={product?.name} token={token} />
            </div>

            {/* Flechas */}
            {imageIds.length > 1 && (
              <button
                className="carousel-arrow left"
                onClick={() =>
                  setCurrentImage((prev) => (prev === 0 ? imageIds.length - 1 : prev - 1))
                }
              >
                ‹
              </button>
            )}

            {imageLoading ? (
              <p>Cargando imágenes...</p>
            ) : imageError ? (
              <p>Error cargando imágenes</p>
            ) : imageIds.length > 0 ? (
              <img
                src={images[currentImage].url}
                alt={product?.name}
                className="productImageSpecial"
              />
            ) : (
              <div className="no-image-placeholder">{product?.name}</div>
            )}

            {imageIds.length > 1 && (
              <button
                className="carousel-arrow right"
                onClick={() =>
                  setCurrentImage((prev) => (prev === imageIds.length - 1 ? 0 : prev + 1))
                }
              >
                ›
              </button>
            )}
          </div>

          {/* ===== INFO PRODUCTO ===== */}
          <div className="product-info">
            <h1 className="product-title">{product?.name}</h1>

            {/* Rating */}
            <div className="star-container">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={`star ${i < (average > 0 ? Math.round(average) : 5) ? "filled" : ""}`}
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
              <span className={`product-stock ${product?.stock > 0 ? "in-stock" : "out-of-stock"}`}>
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
                  {Array.from({ length: product?.stock }, (_, i) => i + 1).map((num) => (
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
              {product?.stock <= 0 ? "Sin stock" : "Agregar al carrito"}
            </button>
          </div>
        </div>

        {/* ===== DESCRIPCIÓN ===== */}
        <div className="product-description-section">
          <h2>Descripción</h2>
          <p>
            {product?.description?.trim()?.length > 0
              ? product.description
              : "El vendedor no incluyó descripción del producto."}
          </p>
        </div>

        {/* ===== CALIFICACIONES Y OPINIONES ===== */}
        <div className="product-description-section rating-opinions-container">
          <div className="rating-column">
            <h2>Calificación</h2>
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

          <div className="opinions-column">
            <h2>Opiniones</h2>
            {productRatings?.length > 0 ? (
              productRatings.slice(0, 3).map((r, idx) => (
                <RatingCard key={idx} userName={r?.username} value={r?.value} comment={r?.comment} />
              ))
            ) : (
              <p>No hay opiniones aún.</p>
            )}
          </div>
        </div>

        {/* ===== PRODUCTOS RELACIONADOS ===== */}
        {relatedProducts?.length > 0 && (
          <div className="related-products">
            <h2>A otras personas también les gustó:</h2>
            <div className="related-products-grid">
              {relatedProducts.map((p) => (
                <SingleProduct
                  key={p?.id}
                  product = {p}
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
