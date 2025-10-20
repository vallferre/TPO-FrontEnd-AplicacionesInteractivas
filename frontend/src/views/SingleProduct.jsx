import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import FavoriteButton from "../components/FavoriteButton";
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
    return <div className="product-card--dynamic loading">Cargando...</div>;
  }

  if (!product) {
    return <div className="product-card--dynamic error">Producto no encontrado</div>;
  }

  // === Verificar si tiene descuento ===
  const hasDiscount = product.finalPrice && product.finalPrice < product.price;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.price - product.finalPrice) / product.price) * 100)
    : 0;

  // === Obtener imagen principal ===
  const mainImageUrl = product.imageIds?.[0]
    ? `${API_BASE}/images/${product.imageIds[0]}`
    : "/assets/no-image.jpg";;

  return (
    <div
      className="product-card--dynamic large-card"
      onClick={handleCardClick}
      style={{ 
        position: "relative",
        height: "400px", // Altura fija para todas las tarjetas
        display: "flex",
        flexDirection: "column"
      }}
    >
      {/* Botón de favorito en esquina superior derecha */}
      <div
        className="btn-favorite--dynamic"
        style={{
          position: "absolute",
          top: "12px",
          right: "12px",
          zIndex: 10,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <FavoriteButton productId={id} productName={product.name} token={token} />
      </div>

      {/* Etiqueta de descuento */}
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

      {/* Imagen principal - Se expande para ocupar el espacio disponible */}
      <div 
        className="product-media--dynamic extra-large"
        style={{ 
          flex: "1 1 auto",
          minHeight: "0", // Permite que la imagen se redimensione
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden"
        }}
      >
        <img
          src={mainImageUrl}
          alt={product.name}
          loading="lazy"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover"
          }}
          onError={(e) => {
            <div className="no-image-placeholder">
              {product.name}
            </div>
          }}
        />
      </div>

      {/* Información - Altura fija para mantener consistencia */}
      <div 
        className="product-info--dynamic compact"
        style={{
          flex: "0 0 auto",
          padding: "1rem",
          minHeight: "120px", // Altura mínima para el área de información
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between"
        }}
      >
        <div>
          {/* Nombre del producto */}
          <h3 
            className="product-name--dynamic"
            style={{
              margin: "0 0 0.5rem 0",
              fontSize: "1rem",
              lineHeight: "1.4",
              height: "2.8rem", // Altura fija para 2 líneas
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical"
            }}
          >
            {product.name}
          </h3>

          {/* Precios - PRECIO ORIGINAL ARRIBA, PRECIO CON DESCUENTO ABAJO */}
          <div className="price-container">
            {hasDiscount ? (
              <>
                {/* Precio original tachado (ARRIBA) */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
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
                
                {/* Precio final con descuento (ABAJO) */}
                <p
                  style={{
                    color: "#1f2937",
                    fontWeight: "600",
                    fontSize: "1.125rem",
                    margin: "0",
                  }}
                >
                  ${Number(product.finalPrice).toLocaleString()}
                </p>
              </>
            ) : (
              // Precio normal sin descuento
              <p
                style={{
                  color: "#1f2937",
                  fontWeight: "600",
                  fontSize: "1.125rem",
                  margin: "0",
                }}
              >
                ${Number(product.price).toLocaleString()}
              </p>
            )}
          </div>
        </div>

        {/* Botón Add to Cart - Siempre en la misma posición */}
        <button 
          className="btn-add--dynamic" 
          onClick={handleAddToCart}
          disabled={product.stock === 0} // DESHABILITADO si no hay stock
          style={{
            marginTop: "0.75rem",
            backgroundColor: product.stock === 0 ? "#9ca3af" : "#3b82f6",
            cursor: product.stock === 0 ? "not-allowed" : "pointer"
          }}
        >
          {product.stock === 0 ? "Sin Stock" : "Agregar al Carrito"}
        </button>
      </div>
    </div>
  );
};

export default SingleProduct;