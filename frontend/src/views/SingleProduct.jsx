import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../components/SingleProduct.css";

const API_BASE = "http://localhost:8080";

const SingleProduct = ({ id, name, description, price, stock, categories, image }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("jwtToken");
  const imageUrl = image ? `${API_BASE}/images/${image}` : null;
  const [isFavorite, setIsFavorite] = useState(false);

  const handleCardClick = (e) => {
    if (e.target.closest(".btn-add--dynamic") || e.target.closest(".btn-favorite--dynamic")) return;
    navigate(`/product/${id}`);
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (!token) {
      toast.info("Please log in to add products to the cart.");
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
      toast.success(`${name} added to cart!`);
    } catch (err) {
      console.error("Error adding to cart:", err);
      toast.error("Failed to add product to cart. Please try again.");
    }
  };

  const handleFavorite = async (e) => {
    e.stopPropagation(); // evita navegar
    if (!token) {
      toast.info("Please log in to add products to favorites.");
      navigate("/login");
      return;
    }

    try {
      // Aquí podrías llamar al endpoint de favoritos
      // const response = await fetch(`${API_BASE}/favorites/add`, { ... });
      setIsFavorite(!isFavorite); // toggle visual
      toast.success(
      `${name} ${!isFavorite ? "added to" : "removed from"} favorites!`
    );
    } catch (err) {
      console.error("Error updating favorites:", err);
      toast.error("Failed to update favorites. Please try again.");
    }
  };

  return (
    <div className="product-card--dynamic large-card" onClick={handleCardClick} style={{ position: "relative" }}>
      {/* Botón de favoritos */}
      <button
        className={`btn-favorite--dynamic ${isFavorite ? "active" : ""}`}
        onClick={handleFavorite}
        title={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        {isFavorite ? "★" : "☆"}
      </button>

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