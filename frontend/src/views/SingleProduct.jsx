import React from "react";
import { useNavigate } from "react-router-dom";
import "../components/SingleProduct.css";

const API_BASE = "http://localhost:8080";

const SingleProduct = ({ id, name, description, price, stock, categories, image }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("jwtToken");
  const imageUrl = image ? `${API_BASE}/images/${image}` : null;

  const handleCardClick = (e) => {
    if (e.target.closest(".btn-add--dynamic")) return; // evita navegar al hacer click en el botón
    navigate(`/product/${id}`);
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation(); // no dispara navigate

    if (!token) {
      alert("Please log in to add products to the cart.");
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: id, quantity: 1 }),
      });

      if (!response.ok) throw new Error(`Failed to add product: ${response.status}`);
      alert(`${name} added to cart!`);
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert("Failed to add product to cart. Please try again.");
    }
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
              e.currentTarget.src = "https://via.placeholder.com/800x600?text=Sin+imagen";
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
          onClick={handleAddToCart}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default SingleProduct;
