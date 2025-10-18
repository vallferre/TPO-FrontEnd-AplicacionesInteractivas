import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function OrderSummary({ subtotal, shipping, tax, total, cartItems = [] }) {
  const navigate = useNavigate();

  const totalDiscount = cartItems.reduce((sum, item) => {
    if (item.discountedPrice && item.discountedPrice > 0) {
      const discountAmount = ((item.priceAtAddTime * item.discountedPrice) / 100) * item.quantity;
      return sum + discountAmount;
    }
    return sum;
  }, 0);

  const handleCheckout = async () => {
    const token = localStorage.getItem("jwtToken");

    if (!token) {
      alert("Please log in to continue with the checkout.");
      navigate("/login");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/cart/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ corregido (template string)
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Checkout successful:", data);

        // ✅ Redirige usando el orderId devuelto
        navigate(`/order/${data.orderId}`, { state: { order: data } });
      } else if (response.status === 400) {
        const errorMessage = await response.text();
        alert(`Error: ${errorMessage}`); // ✅ corregido (template string)
      } else if (response.status === 401) {
        alert("Unauthorized. Please log in again.");
        navigate("/login");
      } else {
        throw new Error(`Checkout failed with status ${response.status}`); // ✅ corregido (template string)
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("An error occurred during checkout. Please try again.");
    }
  };

  return (
    <div
      className="order-summary"
      style={{
        backgroundColor: "white",
        padding: "1.5rem",
        borderRadius: "0.75rem",
        boxShadow: "0 1px 4px rgba(0, 0, 0, 0.1)",
        height: "fit-content",
        minWidth: "300px",
      }}
    >
      <h3
        style={{
          fontSize: "1.25rem",
          fontWeight: "bold",
          marginBottom: "1rem",
        }}
      >
        Order Summary
      </h3>

      <div
        className="summary-details"
        style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
      >
        {/* Subtotal */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <p style={{ flex: 1, margin: 0 }}>Subtotal</p>
          <p style={{ margin: 0, minWidth: "80px", textAlign: "right" }}>${subtotal}</p>
        </div>

        {/* Shipping */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <p style={{ flex: 1, margin: 0 }}>Shipping</p>
          <p style={{ margin: 0, minWidth: "80px", textAlign: "right" }}>{shipping}</p>
        </div>

        {/* Discount Section */}
        {totalDiscount > 0 && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <p style={{ flex: 1, margin: 0, fontWeight: "500" }}>Discount</p>
              <p style={{
                margin: 0,
                minWidth: "80px",
                textAlign: "right",
                color: "green",
                fontWeight: "500"
              }}>
                - ${totalDiscount.toFixed(2)}
              </p>
            </div>

            {cartItems
              .filter((item) => item.discountedPrice && item.discountedPrice > 0)
              .map((item) => {
                const discountAmount = ((item.priceAtAddTime * item.discountedPrice) / 100) * item.quantity;
                return (
                  <div
                    key={item.productId}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      fontSize: "0.9rem",
                      color: "green",
                    }}
                  >
                    <div style={{ flex: 1, margin: 0, marginLeft: "1rem" }}>
                      <p style={{
                        margin: 0,
                        lineHeight: "1.2",
                        wordWrap: "break-word"
                      }}>
                        {item.productName}
                        <br />
                        <span style={{ fontSize: "0.8rem", opacity: "0.8" }}>
                          ({item.discountedPrice}% off)
                        </span>
                      </p>
                    </div>
                    <p style={{
                      margin: 0,
                      minWidth: "80px",
                      textAlign: "right",
                      fontWeight: "500"
                    }}>
                      - ${discountAmount.toFixed(2)}
                    </p>
                  </div>
                );
              })}
          </>
        )}

        <div style={{ borderTop: "1px solid #e2e8f0", margin: "1rem 0" }}></div>

        {/* Total */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          fontWeight: "600",
        }}>
          <p style={{ flex: 1, margin: 0, fontSize: "1.1rem" }}>Total</p>
          <p style={{
            margin: 0,
            minWidth: "80px",
            textAlign: "right",
            fontSize: "1.1rem"
          }}>
            ${(total - totalDiscount).toFixed(2)}
          </p>
        </div>
      </div>

      <button
        onClick={handleCheckout}
        style={{
          backgroundColor: "#1173d4",
          color: "white",
          fontWeight: "600",
          width: "100%",
          marginTop: "1.5rem",
          padding: "0.75rem",
          borderRadius: "0.5rem",
          cursor: "pointer",
          border: "none",
          fontSize: "1rem",
        }}
      >
        Proceed to Checkout
      </button>

      <p style={{ textAlign: "center", marginTop: "1rem", margin: 0 }}>
        or{" "}
        <Link
          to="/"
          style={{
            color: "#1173d4",
            fontWeight: "500",
            textDecoration: "none",
          }}
        >
          Continue Shopping →
        </Link>
      </p>
    </div>
  );
}
