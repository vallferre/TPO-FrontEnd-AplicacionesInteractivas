import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import FavoriteButton from "../components/FavoriteButton"; // 👈 importa tu nuevo componente
import "../assets/SingleProduct.css";

const API_BASE = "http://localhost:8080";

const SingleProduct = ({ id }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("jwtToken");

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // === Fetch product info ===
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_BASE}/products/id/${id}`);
        if (!res.ok) throw new Error(`Error: ${res.status}`);
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error("Error fetching product:", err);
        toast.error("Failed to load product information.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleCardClick = (e) => {
    if (
      e.target.closest(".btn-add--dynamic") ||
      e.target.closest(".btn-favorite--dynamic")
    )
      return;
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

  if (loading) {
    return <div className="product-card--dynamic loading">Loading...</div>;
  }

  if (!product) {
    return <div className="product-card--dynamic error">Product not found</div>;
  }

  // === Obtener imagen principal (la primera del array) ===
  const mainImageUrl = product.imageIds?.[0]
    ? `${API_BASE}/images/${product.imageIds[0]}`
    : "https://via.placeholder.com/800x600?text=Sin+imagen";

  return (
    <div
      className="product-card--dynamic large-card"
      onClick={handleCardClick}
      style={{ position: "relative" }}
    >
      {/* ❤️ Botón de favorito en esquina superior derecha */}
      <div
        className="btn-favorite--dynamic"
        style={{
          position: "absolute",
          top: "12px",
          right: "12px",
          zIndex: 10,
        }}
        onClick={(e) => e.stopPropagation()} // evita que se dispare el navigate
      >
        <FavoriteButton productId={id} token={token} />
      </div>

      {/* Imagen principal */}
      <div className="product-media--dynamic extra-large">
        <img
          src={mainImageUrl}
          alt={product.name}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src =
              "https://via.placeholder.com/800x600?text=Sin+imagen";
          }}
        />
      </div>

      {/* Información */}
      <div className="product-info--dynamic compact">
        <h3 className="product-name--dynamic">{product.name}</h3>

        {product.finalPrice != null && (
          <p className="product-price--dynamic">
            ${Number(product.finalPrice).toLocaleString()}
          </p>
        )}

        <button className="btn-add--dynamic" onClick={handleAddToCart}>
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default SingleProduct;
