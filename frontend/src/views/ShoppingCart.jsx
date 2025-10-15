import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../components/ShoppingCart.css";

const ShoppingCart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("jwtToken");

  const fetchCart = async () => {
    if (!token) {
      setError("No token found. Please log in.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/cart", {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error(`Error ${response.status}: Failed to fetch cart`);
      const data = await response.json();
      setCart(data);
    } catch (err) {
      console.error("Error fetching cart:", err);
      setError("Failed to fetch cart. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleAdd = async (productId) => {
    try {
      const response = await fetch("http://localhost:8080/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity: 1 }),
      });
      if (!response.ok) throw new Error("Failed to add product");
      fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemove = async (productId) => {
    try {
      const response = await fetch("http://localhost:8080/cart/remove", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId }),
      });
      if (!response.ok) throw new Error("Failed to remove product");
      fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading)
    return (
      <div className="app-container" style={{ padding: "2rem", textAlign: "center" }}>
        Loading...
      </div>
    );

  if (error)
    return (
      <div className="app-container" style={{ padding: "2rem", textAlign: "center", color: "red" }}>
        {error}
      </div>
    );

  if (!cart || !cart.items?.length)
    return (
      <div className="app-container" style={{ padding: "2rem", textAlign: "center" }}>
        Your cart is empty.
      </div>
    );

  return (
    <div className="app-container" style={{ padding: "2rem", backgroundColor: "#f9fafb" }}>
      <main className="main" style={{ display: "flex", justifyContent: "center", alignItems: "flex-start" }}>
        <div
          className="cart-container"
          style={{ display: "flex", flexDirection: "column", gap: "2rem", maxWidth: "1100px", width: "100%" }}
        >
          <h2
            className="cart-title fade-in"
            style={{ fontSize: "2rem", fontWeight: "bold", color: "#1e293b", marginBottom: "1rem" }}
          >
            Shopping Cart
          </h2>

          <div
            className="cart-grid fade-in"
            style={{ display: "grid", gridTemplateColumns: "3fr 1fr", gap: "3rem", alignItems: "start" }}
          >
            {/* Items */}
            <div
              className="cart-items"
              style={{
                backgroundColor: "white",
                padding: "1.5rem",
                borderRadius: "0.75rem",
                boxShadow: "0 1px 4px rgba(0, 0, 0, 0.1)",
              }}
            >
              <ul style={{ display: "flex", flexDirection: "column", gap: "1.5rem", listStyle: "none", padding: 0 }}>
                {cart.items.map((item, i) => (
                  <li
                    key={i}
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
                        src={item.imageUrl || "https://via.placeholder.com/80"}
                        alt={item.productName}
                        style={{ width: "80px", height: "80px", borderRadius: "0.5rem", objectFit: "cover" }}
                      />
                    </div>
                    <div className="item-details" style={{ flex: 1 }}>
                      <div
                        className="item-top"
                        style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}
                      >
                        <h3 style={{ fontSize: "1.125rem", fontWeight: "600", color: "#1e293b" }}>
                          {item.productName}
                        </h3>
                        <p className="item-price" style={{ fontWeight: "500", color: "#334155" }}>
                          ${item.priceAtAddTime.toFixed(2)}
                        </p>
                      </div>
                      <p className="item-size" style={{ fontSize: "0.9rem", color: "#64748b" }}>
                        {item.productDescription}
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
                            onClick={() => handleRemove(item.productId)}
                            style={{ backgroundColor: "#e2e8f0", padding: "0.3rem 0.6rem", borderRadius: "0.375rem" }}
                          >
                            -
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            onClick={() => handleAdd(item.productId)}
                            style={{ backgroundColor: "#e2e8f0", padding: "0.3rem 0.6rem", borderRadius: "0.375rem" }}
                          >
                            +
                          </button>
                        </div>
                        <button
                          className="remove-btn"
                          onClick={() => handleRemove(item.productId)}
                          style={{ color: "#ef4444" }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Order Summary */}
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
              <h3 style={{ fontSize: "1.25rem", fontWeight: "bold", marginBottom: "1rem" }}>Order Summary</h3>
              <div className="summary-details" style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <div className="summary-row" style={{ display: "flex", justifyContent: "space-between" }}>
                  <p>Subtotal</p>
                  <p>${cart.total.toFixed(2)}</p>
                </div>
                <div className="summary-row" style={{ display: "flex", justifyContent: "space-between" }}>
                  <p>Shipping</p>
                  <p>Free</p>
                </div>
                <div className="divider" style={{ borderTop: "1px solid #e2e8f0", margin: "0.75rem 0" }}></div>
                <div
                  className="summary-row total"
                  style={{ display: "flex", justifyContent: "space-between", fontWeight: "600" }}
                >
                  <p>Total</p>
                  <p>${cart.total.toFixed(2)}</p>
                </div>
              </div>
              <button
                className="checkout-btn"
                style={{
                  backgroundColor: "#1173d4",
                  color: "white",
                  fontWeight: "600",
                  width: "100%",
                  marginTop: "1rem",
                  padding: "0.75rem",
                  borderRadius: "0.5rem",
                }}
              >
                Proceed to Checkout
              </button>
              <p className="continue-shopping" style={{ textAlign: "center", marginTop: "1rem" }}>
                or{" "}
                <Link to="/" style={{ color: "#1173d4", fontWeight: "500", textDecoration: "none" }}>
                  Continue Shopping →
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ShoppingCart;
