import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import FavoriteButton from "../../../components/ui/FavoriteButton";
import { fetchProductById } from "../../../redux/slices/ProductSlice.js";
import { fetchProductImages } from "../../../redux/slices/ProductImageSlice.js";
import { selectImageUploading, selectImageUploadError, selectLastImageUploadInfo } from "../../../redux/slices/ProductImageSelectors.js";
import { selectProduct, selectLoading, selectError } from "../../../redux/slices/ProductSelectors.js";
//import { addToCartThunk } from "../../../redux/thunks/CartThunk.js";

import "./SingleProduct.css";

const SingleProduct = ({ product, onRemoveFavorite }) => {
  const dispatch = useDispatch();

  const loading = useSelector((state) => state.products.loading);
  const error = useSelector((state) => state.products.error);

  const productId = product?.id;
  const images = useSelector(
  state => (productId ? state.productImages.items[productId] : []) || []
);
  const mainImageUrl = images.length > 0 ? images[0].url : "/assets/no-image.jpg";


  useEffect(() => {
    if (product?.id) {
      dispatch(fetchProductById(product.id));
      dispatch(fetchProductImages(product.id));
    }
  }, [dispatch, product?.id]);


// ================================
// Handlers
// ================================
const handleCardClick = (e) => {
  if (
    e.target.closest(".btn-add--dynamic") ||
    e.target.closest(".btn-favorite--dynamic")
  ) return;
  navigate(`/product/${id}`);
};

const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (!token) {
      toast.info("Please log in to add products to the cart.");
      navigate("/login");
    return;
  }
};

// ================================
// Loading / Error UI
// ================================
if (loading) return <div className="product-card--dynamic loading">Cargando...</div>;
if (error) return <div className="product-card--dynamic error">{error}</div>;
if (!product) return <div className="product-card--dynamic loading">Cargando producto...</div>;

// ================================
// Render data
// ================================
const hasDiscount = product.finalPrice && product.finalPrice < product.price;

const discountPercentage = hasDiscount
? Math.round(((product.price - product.finalPrice) / product.price) * 100)
: 0;

//const mainImageUrl = product.imageIds?.[0]
//? `http://localhost:8080/images/${product.imageIds[0]}`
//: "/assets/no-image.jpg";



return (
<div
className="product-card--dynamic large-card"
onClick={handleCardClick}
style={{ position: "relative", height: "400px", display: "flex", flexDirection: "column" }}
>
{/* Favorite Button */}
<div
className="btn-favorite--dynamic"
style={{ position: "absolute", top: "12px", right: "12px", zIndex: 10 }}
onClick={(e) => e.stopPropagation()}
> <FavoriteButton
       productId={product.id}
       productName={product.name}
       onRemoveFavorite={onRemoveFavorite}
     /> </div>


  {/* Discount Tag */}
  {hasDiscount && (
    <div
      style={{
        position: "absolute",
        top: "12px",
        left: "12px",
        backgroundColor: "#10b981",
        color: "white",
        padding: "4px 8px",
        borderRadius: "4px",
        fontSize: "0.75rem",
        fontWeight: "600",
        zIndex: 10,
      }}
    >
      {discountPercentage}% OFF
    </div>
  )}

  {/* Product Image */}
  <div
    className="product-media--dynamic extra-large"
    style={{
      flex: "1 1 auto",
      minHeight: "0",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
    }}
  >
    <img
      src={mainImageUrl}
      alt={product.name}
      loading="lazy"
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
      onError={(e) => (e.target.src = "/assets/no-image.jpg")}
    />
  </div>

  {/* Info */}
  <div
    className="product-info--dynamic compact"
    style={{
      flex: "0 0 auto",
      padding: "1rem",
      minHeight: "120px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
    }}
  >
    <div>
      <h3
        className="product-name--dynamic"
        style={{
          margin: "0 0 0.5rem 0",
          fontSize: "1rem",
          lineHeight: "1.4",
          height: "2.8rem",
          overflow: "hidden",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
        }}
      >
        {product.name}
      </h3>

      <div className="price-container">
        {hasDiscount ? (
          <>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginBottom: "0.25rem",
              }}
            >
              <span
                style={{
                  fontSize: "0.875rem",
                  color: "#6b7280",
                  textDecoration: "line-through",
                  fontWeight: "400",
                }}
              >
                ${Number(product.price).toLocaleString()}
              </span>
              <span
                style={{
                  fontSize: "0.75rem",
                  color: "#10b981",
                  fontWeight: "600",
                  backgroundColor: "#ecfdf5",
                  padding: "2px 6px",
                  borderRadius: "4px",
                }}
              >
                {discountPercentage}% off
              </span>
            </div>
            <p style={{ color: "#1f2937", fontWeight: "600", fontSize: "1.125rem", margin: 0 }}>
              ${Number(product.finalPrice).toLocaleString()}
            </p>
          </>
        ) : (
          <p style={{ color: "#1f2937", fontWeight: "600", fontSize: "1.125rem", margin: 0 }}>
            ${Number(product.price).toLocaleString()}
          </p>
        )}
      </div>
    </div>

    <button
      className="btn-add--dynamic"
      onClick={handleAddToCart}
      disabled={product.stock === 0}
      style={{
        marginTop: "0.75rem",
        backgroundColor: product.stock === 0 ? "#9ca3af" : "#3b82f6",
        cursor: product.stock === 0 ? "not-allowed" : "pointer",
      }}
    >
      {product.stock === 0 ? "Sin Stock" : "Agregar al Carrito"}
    </button>
  </div>
</div>


);
};

export default SingleProduct;
