import React from "react";
import { Link } from "react-router-dom";

export default function OrderSummary({ subtotal, shipping, tax, total }) {
  return (
    <div className="order-summary" style={{ backgroundColor: "white", padding: "1.5rem", borderRadius: "0.75rem", boxShadow: "0 1px 4px rgba(0, 0, 0, 0.1)", height: "fit-content" }}>
      <h3 style={{ fontSize: "1.25rem", fontWeight: "bold", marginBottom: "1rem" }}>Order Summary</h3>
      <div className="summary-details" style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <div className="summary-row" style={{ display: "flex", justifyContent: "space-between" }}>
          <p>Subtotal</p>
          <p>${subtotal}</p>
        </div>
        <div className="summary-row" style={{ display: "flex", justifyContent: "space-between" }}>
          <p>Shipping</p>
          <p>{shipping}</p>
        </div>
        <div className="summary-row" style={{ display: "flex", justifyContent: "space-between" }}>
          <p>Estimated Tax</p>
          <p>${tax}</p>
        </div>
        <div className="divider" style={{ borderTop: "1px solid #e2e8f0", margin: "0.75rem 0" }}></div>
        <div className="summary-row total" style={{ display: "flex", justifyContent: "space-between", fontWeight: "600" }}>
          <p>Total</p>
          <p>${total}</p>
        </div>
      </div>
      <button style={{ backgroundColor: "#1173d4", color: "white", fontWeight: "600", width: "100%", marginTop: "1rem", padding: "0.75rem", borderRadius: "0.5rem" }}>
        Proceed to Checkout
      </button>
      <p className="continue-shopping" style={{ textAlign: "center", marginTop: "1rem" }}>
        or <Link to="/" style={{ color: "#1173d4", fontWeight: "500", textDecoration: "none" }}>Continue Shopping →</Link>
      </p>
    </div>
  );
}
