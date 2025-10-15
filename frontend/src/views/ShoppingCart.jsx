import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../components/ShoppingCart.css";
import CartItem from "../components/CartItem";
import OrderSummary from "../components/OrderSummary";

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
          <h2 className="cart-title fade-in" style={{ fontSize: "2rem", fontWeight: "bold", color: "#1e293b", marginBottom: "1rem" }}>
            Shopping Cart
          </h2>

          <div className="cart-grid fade-in" style={{ display: "grid", gridTemplateColumns: "3fr 1fr", gap: "3rem", alignItems: "start" }}>
            {/* Items */}
            <div className="cart-items" style={{ backgroundColor: "white", padding: "1.5rem", borderRadius: "0.75rem", boxShadow: "0 1px 4px rgba(0, 0, 0, 0.1)" }}>
              <ul style={{ display: "flex", flexDirection: "column", gap: "1.5rem", listStyle: "none", padding: 0 }}>
                {cart.items.map((item) => (
                  <CartItem
                    key={item.productId}
                    item={{
                      name: item.productName,
                      image: item.imageUrl || "https://via.placeholder.com/80",
                      price: item.priceAtAddTime,
                      size: item.productDescription,
                      quantity: item.quantity,
                    }}
                    onIncrease={() => handleAdd(item.productId)}
                    onDecrease={() => handleRemove(item.productId)}
                    onRemove={() => handleRemove(item.productId)}
                  />
                ))}
              </ul>
            </div>

            {/* Order Summary */}
            <OrderSummary
              subtotal={cart.total}
              shipping="Free"
              tax={0} // o el valor real si lo tienes
              total={cart.total}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ShoppingCart;
