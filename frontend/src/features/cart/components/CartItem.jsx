import React from "react";
import "./CartItem.css";

const CartItem = ({ item, onIncrease, onDecrease, onRemove }) => {
  const getImageSrc = (img) => {
    if (!img || !img.data) return null;
    return `data:${img.contentType};base64,${img.data}`;
  };

  const hasDiscount = item.discountedPrice && item.discountedPrice > 0;

  const finalPrice = hasDiscount
    ? item.price - (item.price * item.discountedPrice) / 100
    : item.price;

  return (
    <li className="cart-item">
      {/* Imagen */}
      <img
        className="cart-item-image"
        src={getImageSrc(item.image) || "/placeholder.jpg"}
        alt={item.name}
      />

      {/* Info */}
      <div className="cart-item-info">
        <h3 className="cart-item-name">{item.name}</h3>
        <p className="cart-item-size">{item.size}</p>

        {/* Precios */}
        {hasDiscount ? (
          <>
            <p className="old-price">${item.price.toFixed(2)}</p>
            <p className="discount">{item.discountedPrice}% OFF</p>
            <p className="final-price">${finalPrice.toFixed(2)}</p>
          </>
        ) : (
          <p className="final-price">${item.price.toFixed(2)}</p>
        )}

        {/* Error */}
        {item.error && (
          <p className="cart-item-error">{item.error}</p>
        )}

        {/* Controles */}
        <div className="cart-controls">
          <button onClick={onDecrease}>-</button>
          <span>{item.quantity}</span>
          <button onClick={onIncrease}>+</button>

          <button className="remove-btn" onClick={onRemove}>
            Eliminar
          </button>
        </div>
      </div>
    </li>
  );
};

export default CartItem;
