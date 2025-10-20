import React, { useEffect, useState } from "react";
import "../assets/ShoppingCart.css";
import CartItem from "../components/CartItem";
import OrderSummary from "../components/OrderSummary";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";
import ErrorView from "../components/ErrorView.jsx"; // ✅ importamos ErrorView

const ShoppingCart = () => {
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartErrors, setCartErrors] = useState({});

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
          setCart({ items: [], total: 0 });
        } else {
          throw new Error(`Error ${response.status}: Failed to fetch cart`);
        }
      } else {
        const data = await response.json();
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

      if (!response.ok) {
        const errorData = await response.json();
        setCartErrors((prev) => ({ ...prev, [productId]: errorData.message || "Insufficient stock" }));
        return;
      }

      setCartErrors((prev) => ({ ...prev, [productId]: null }));
      fetchCart();
    } catch (err) {
      console.error(err);
      setCartErrors((prev) => ({ ...prev, [productId]: "No hay más stock para agregar" }));
    }
  };

  const handleRemove = async (productId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/cart/remove/${productId}?number=1`,
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
      setCartErrors((prev) => ({ ...prev, [productId]: null }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteAll = (productId, quantity, productName) => {
    setSelectedProduct({ productId, quantity, productName });
    setShowModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedProduct) return;
    const { productId, quantity } = selectedProduct;

    try {
      const response = await fetch(
        `http://localhost:8080/cart/remove/${productId}?number=${quantity}`,
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
      setCartErrors((prev) => ({ ...prev, [productId]: null }));
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

  const validCartItems = cart?.items?.filter((item) => item.quantity > 0) || [];

  if (!validCartItems.length)
    return <ErrorView />; // ✅ Aquí usamos ErrorView si el carrito está vacío

  return (
    <div className="app-container" style={{ padding: "2rem", backgroundColor: "#f9fafb" }}>
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
                {validCartItems.map((item) => (
                  <CartItem
                    key={item.productId}
                    item={{
                      id: item.productId,
                      name: item.productName,
                      image: item.productImageUrl,
                      price: item.priceAtAddTime,
                      size: item.productDescription,
                      quantity: item.quantity,
                      stock: item.productStock,
                      error: cartErrors[item.productId],
                    }}
                    onIncrease={() => handleAdd(item.productId)}
                    onDecrease={() => handleRemove(item.productId)}
                    onRemove={() =>
                      handleDeleteAll(item.productId, item.quantity, item.productName)
                    }
                  />
                ))}
              </ul>
            </div>

            <OrderSummary
              cartItems={validCartItems}
              subtotal={cart.total}
              shipping="Free"
              total={cart.total}
            />
          </div>
        </div>
      </main>

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
