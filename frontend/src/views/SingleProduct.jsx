import React from "react";
import { useNavigate } from "react-router-dom";
import "../components/SingleProduct.css";

const API_BASE = "http://localhost:8080";

const SingleProduct = ({ id, name, description, price, stock, categories, image }) => {
  const navigate = useNavigate();
  const imageUrl = image ? `${API_BASE}/images/${image}` : null;

  const handleCardClick = (e) => {
    if (e.target.closest(".btn-add--dynamic")) return;
    navigate(`/product/${id}`);
  };

  return (
    <div className="product-card--dynamic large-card" onClick={handleCardClick}>
      {/* Imagen principal */}
      <div className="product-media--dynamic extra-large">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src =
                "https://via.placeholder.com/800x600?text=Sin+imagen";
            }}
          />
        ) : (
          <div className="product-media__placeholder--dynamic">No image</div>
        )}
      </div>

      {/* Información */}
      <div className="product-info--dynamic compact">
        <h3 className="product-name--dynamic">{name}</h3>

        {price != null && (
          <p className="product-price--dynamic">
            ${Number(price).toLocaleString()}
          </p>
        )}

        <button
          className="btn-add--dynamic"
          onClick={(e) => {
            e.stopPropagation();
            console.log(`Producto ${id} agregado al carrito`);
          }}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default SingleProduct;
