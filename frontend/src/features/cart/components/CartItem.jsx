import React from "react";
import "./CartItem.css"

const CartItem = ({ item, onIncrease, onDecrease, onRemove }) => {
  const getImageSrc = (img) => {
    if (!img || !img.data) return null;
    return `data:${img.contentType};base64,${img.data}`;
  };

  // Cálculo del precio final
  const hasDiscount =
    item.discountedPrice && item.discountedPrice > 0;

  const finalPrice = hasDiscount
    ? item.price - (item.price * item.discountedPrice) / 100
    : item.price;

  return (
    <li
      style={{
        display: "flex",
        gap: "1rem",
        paddingBottom: "1rem",
        borderBottom: "1px solid #ddd",
      }}
    >
      <img
        src={getImageSrc(item.image) || "/placeholder.jpg"}
        alt={item.name}
        style={{
          width: "120px",
          height: "120px",
          objectFit: "cover",
          borderRadius: "6px",
        }}
      />

      <div style={{ flex: 1 }}>
        <h3 style={{ margin: 0 }}>{item.name}</h3>
        <p style={{ color: "#666", margin: "0.3rem 0" }}>{item.size}</p>

        {/* Si hay descuento */}
        {hasDiscount ? (
          <>
            <p
              style={{
                color: "#888",
                textDecoration: "line-through",
                margin: "0.2rem 0",
              }}
            >
              ${item.price.toFixed(2)}
            </p>

            <p
              style={{
                color: "#10b981",
                fontSize: "0.9rem",
                margin: "0.2rem 0",
              }}
            >
              {item.discountedPrice}% OFF
            </p>

            <p
              style={{
                fontWeight: "bold",
                color: "#111",
                margin: "0.2rem 0",
              }}
            >
              ${finalPrice.toFixed(2)}
            </p>
          </>
        ) : (
          // Si NO hay descuento
          <p
            style={{
              fontWeight: "bold",
              marginTop: "0.5rem",
            }}
          >
            ${item.price.toFixed(2)}
          </p>
        )}

        {/* Error */}
        {item.error && (
          <p style={{ color: "red", marginTop: "0.5rem" }}>{item.error}</p>
        )}

        {/* Controles */}
        <div style={{ display: "flex", gap: "0.8rem", marginTop: "1rem" }}>
          <button onClick={onDecrease}>-</button>
          <span>{item.quantity}</span>
          <button onClick={onIncrease}>+</button>

          <button
            style={{ marginLeft: "auto", backgroundColor: '#ff5f5f' }}
            onClick={onRemove}
          >
            Eliminar
          </button>
        </div>
      </div>
    </li>
  );
};

export default CartItem;
