import React from "react";

export default function CartItem({ item, onRemove, onIncrease, onDecrease }) {
  // URL de fallback si no hay imagen o no carga
  const imageUrl = item.image || "https://via.placeholder.com/80?text=No+Image";

  return (
    <li
      className="cart-item"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "1.5rem",
        borderBottom: "1px solid #e2e8f0",
        paddingBottom: "1.5rem",
      }}
    >
      <div className="item-image">
        <img
          src={imageUrl}
          alt={item.name}
          style={{ width: "80px", height: "80px", borderRadius: "0.5rem", objectFit: "cover" }}
          onError={(e) => {
            e.target.onerror = null; // previene loop infinito
            e.target.src = "https://via.placeholder.com/80?text=No+Image";
          }}
        />
      </div>
      <div className="item-details" style={{ flex: 1 }}>
        <div
          className="item-top"
          style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}
        >
          <h3 style={{ fontSize: "1.125rem", fontWeight: "600", color: "#1e293b" }}>
            {item.name}
          </h3>
          <p className="item-price" style={{ fontWeight: "500", color: "#334155" }}>
            ${item.price}
          </p>
        </div>
        <p className="item-size" style={{ fontSize: "0.9rem", color: "#64748b" }}>
          {item.size}
        </p>
        <div
          className="item-actions"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "1rem",
          }}
        >
          <div className="quantity" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <button
              onClick={onDecrease}
              style={{ backgroundColor: "#e2e8f0", padding: "0.3rem 0.6rem", borderRadius: "0.375rem" }}
            >
              -
            </button>
            <span>{item.quantity}</span>
            <button
              onClick={onIncrease}
              style={{ backgroundColor: "#e2e8f0", padding: "0.3rem 0.6rem", borderRadius: "0.375rem" }}
            >
              +
            </button>
          </div>
          <button onClick={onRemove} className="remove-btn" style={{ color: "#ef4444" }}>
            Remove
          </button>
        </div>
      </div>
    </li>
  );
}
