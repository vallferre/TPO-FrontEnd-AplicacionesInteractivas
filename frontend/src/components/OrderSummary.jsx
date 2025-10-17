import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function OrderSummary({ subtotal, shipping, tax, total }) {
  const navigate = useNavigate();

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
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Checkout successful:", data);

        // ✅ Redirige usando el orderId devuelto
        navigate(`/order/${data.orderId}`, { state: { order: data } });
      } else if (response.status === 400) {
        const errorMessage = await response.text();
        alert(`Error: ${errorMessage}`);
      } else if (response.status === 401) {
        alert("Unauthorized. Please log in again.");
        navigate("/login");
      } else {
        throw new Error(`Checkout failed with status ${response.status}`);
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
        style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
      >
        <div
          className="summary-row"
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <p>Subtotal</p>
          <p>${subtotal}</p>
        </div>
        <div
          className="summary-row"
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <p>Shipping</p>
          <p>{shipping}</p>
        </div>
        <div
          className="summary-row"
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <p>Discount</p>
          <p>${tax}</p>
        </div>

        <div
          className="divider"
          style={{ borderTop: "1px solid #e2e8f0", margin: "0.75rem 0" }}
        ></div>

        <div
          className="summary-row total"
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontWeight: "600",
          }}
        >
          <p>Total</p>
          <p>${total}</p>
        </div>
      </div>

      <button
        onClick={handleCheckout}
        style={{
          backgroundColor: "#1173d4",
          color: "white",
          fontWeight: "600",
          width: "100%",
          marginTop: "1rem",
          padding: "0.75rem",
          borderRadius: "0.5rem",
          cursor: "pointer",
        }}
      >
        Proceed to Checkout
      </button>

      <p
        className="continue-shopping"
        style={{ textAlign: "center", marginTop: "1rem" }}
      >
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
