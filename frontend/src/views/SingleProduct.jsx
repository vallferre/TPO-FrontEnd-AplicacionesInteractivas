// src/views/SingleProduct.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "../components/SingleProduct.css";

const API_BASE = "http://localhost:8080";

const SingleProduct = ({ id, name, description, price, stock, categories, image }) => {
  const navigate = useNavigate();
  const imageUrl = image ? `${API_BASE}/images/${image}` : null;

  const handleCardClick = (e) => {
    if (e.target.closest(".btnAddSpecial")) return;
    navigate(`/product/${id}`);
  };

  return (
    <div className="productCardSpecial" onClick={handleCardClick}>
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={name}
          className="productImageSpecial"
          onError={(e) => {
            e.currentTarget.src = "https://via.placeholder.com/400x300?text=Sin+imagen";
          }}
        />
      ) : (
        <div className="productImageSpecial placeholder">No image</div>
      )}

      <div className="productInfoSpecial">
        <h3 className="productNameSpecial">{name}</h3>
        {description && <p className="productDescriptionSpecial">{description}</p>}
        {price != null && <p className="productPriceSpecial">${Number(price).toLocaleString()}</p>}
        {stock != null && <p className="productStockSpecial">Stock: {stock}</p>}

        <div className="productCategoriesSpecial">
          {(categories || []).map((cat, i) => (
            <span key={i} className="categoryBadgeSpecial">
              {typeof cat === "string" ? cat : cat?.description ?? ""}
            </span>
          ))}
        </div>

        <button
          className="btnAddSpecial"
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
