// src/features/cart/components/CartItem.jsx
import React from "react";

const CartItem = ({ item, onIncrease, onDecrease, onRemove }) => {
  const getImageSrc = (img) => {
    if (!img || !img.data) return null;
    return `data:${img.contentType};base64,${img.data}`;
  };

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

        <p style={{ fontWeight: "bold", marginTop: "0.5rem" }}>
          ${item.price}
        </p>

        {item.error && (
          <p style={{ color: "red", marginTop: "0.5rem" }}>{item.error}</p>
        )}

        <div style={{ display: "flex", gap: "0.8rem", marginTop: "1rem" }}>
          <button onClick={onDecrease}>-</button>
          <span>{item.quantity}</span>
          <button onClick={onIncrease}>+</button>

          <button
            style={{ marginLeft: "auto", color: "red" }}
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
