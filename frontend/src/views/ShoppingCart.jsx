import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../assets/ShoppingCart.css";
import CartItem from "../components/CartItem";
import OrderSummary from "../components/OrderSummary";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";

const ShoppingCart = () => {
  const [cart, setCart] = useState({ items: [], total: 0 }); // ✅ estructura inicial segura
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

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

      if (!response.ok) {
        if (response.status === 404) {
          // ✅ si el usuario no tiene carrito, inicializar vacío
          setCart({ items: [], total: 0 });
        } else {
          throw new Error(`Error ${response.status}: Failed to fetch cart`);
        }
      } else {
        const data = await response.json();

        // ✅ Evitar errores si el back devuelve null, undefined o algo mal formado
        if (!data || !Array.isArray(data.items)) {
          setCart({ items: [], total: 0 });
        } else {
          setCart(data);
        }
      }
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
      const response = await fetch(
        `http://localhost:8080/cart/remove/1?number=1`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ productId }),
        }
      );
      if (!response.ok) throw new Error("Failed to remove product");
      fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Mostrar modal antes de eliminar todo el producto
  const handleDeleteAll = (productId, quantity, productName) => {
    setSelectedProduct({ productId, quantity, productName });
    setShowModal(true);
  };

  // ✅ Confirmar eliminación completa del producto
  const confirmDelete = async () => {
    if (!selectedProduct) return;
    const { productId, quantity } = selectedProduct;

    try {
      const response = await fetch(
        `http://localhost:8080/cart/remove/${quantity}?number=${quantity}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ productId }),
        }
      );
      if (!response.ok) throw new Error("Failed to delete product");
      fetchCart();
    } catch (err) {
      console.error(err);
    } finally {
      setShowModal(false);
      setSelectedProduct(null);
    }
  };

  const cancelDelete = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  if (loading)
    return (
      <div
        className="app-container"
        style={{ padding: "2rem", textAlign: "center" }}
      >
        Loading...
      </div>
    );

  if (error)
    return (
      <div
        className="app-container"
        style={{
          padding: "2rem",
          textAlign: "center",
          color: "red",
        }}
      >
        {error}
      </div>
    );

  // ✅ Si el carrito está vacío, mostrar mensaje sin romper
  if (!cart?.items?.length)
    return (
      <div
        className="app-container"
        style={{ padding: "2rem", textAlign: "center" }}
      >
        Your cart is empty.
      </div>
    );

  return (
    <div
      className="app-container"
      style={{ padding: "2rem", backgroundColor: "#f9fafb" }}
    >
      <main
        className="main"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        <div
          className="cart-container"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "2rem",
            maxWidth: "1100px",
            width: "100%",
          }}
        >
          <h2
            className="cart-title fade-in"
            style={{
              fontSize: "2rem",
              fontWeight: "bold",
              color: "#1e293b",
              marginBottom: "1rem",
            }}
          >
            Shopping Cart
          </h2>

          <div
            className="cart-grid fade-in"
            style={{
              display: "grid",
              gridTemplateColumns: "3fr 1fr",
              gap: "3rem",
              alignItems: "start",
            }}
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
              <ul
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.5rem",
                  listStyle: "none",
                  padding: 0,
                }}
              >
                {cart.items.map((item) => (
                  <CartItem
                    key={item.productId}
                    item={{
                      id: item.productId,
                      name: item.productName,
                      image: item.productImageUrl,
                      price: item.priceAtAddTime,
                      size: item.productDescription,
                      quantity: item.quantity,
                    }}
                    onIncrease={() => handleAdd(item.productId)}
                    onDecrease={() => handleRemove(item.productId)}
                    onRemove={() =>
                      handleDeleteAll(
                        item.productId,
                        item.quantity,
                        item.productName
                      )
                    }
                  />
                ))}
              </ul>
            </div>

            {/* Order Summary */}
            <OrderSummary
              cartItems={cart.items}
              subtotal={cart.total}
              shipping="Free"
              total={cart.total}
            />
          </div>
        </div>
      </main>

      {/* 🔹 Modal de confirmación */}
      <DeleteConfirmationModal
        isOpen={showModal}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        productName={selectedProduct?.productName}
      />
    </div>
  );
};

export default ShoppingCart;