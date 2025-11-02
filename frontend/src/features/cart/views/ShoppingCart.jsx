import React, { useEffect, useState } from "react";
import "./ShoppingCart.css";
import CartItem from "../components/CartItem.jsx";
import OrderSummary from "../../orders/components/OrderSummary.jsx";
import DeleteConfirmationModal from "../../../components/ui/DeleteConfirmationModal.jsx";
import ErrorView from "../../../components/ui/ErrorView.jsx";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCartThunk,
  addToCartThunk,
  removeFromCartThunk,
  deleteProductThunk,
} from "../../../redux/thunks/CartThunk.js";

const ShoppingCart = () => {
  const dispatch = useDispatch();
  const { items, total, loading, error } = useSelector((state) => state.cart);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartErrors, setCartErrors] = useState({});

  useEffect(() => {
    dispatch(fetchCartThunk());
  }, [dispatch]);

  const handleAdd = async (productId) => {
    try {
      await dispatch(addToCartThunk({ productId })).unwrap();
      setCartErrors((prev) => ({ ...prev, [productId]: null }));
    } catch (err) {
      setCartErrors((prev) => ({ ...prev, [productId]: err || "No hay más stock" }));
    }
  };

  const handleRemove = (productId) => {
    dispatch(removeFromCartThunk(productId));
  };

  const handleDeleteAll = (productId, quantity, productName) => {
    setSelectedProduct({ productId, quantity, productName });
    setShowModal(true);
  };

  const confirmDelete = () => {
    if (!selectedProduct) return;
    dispatch(deleteProductThunk(selectedProduct));
    setShowModal(false);
    setSelectedProduct(null);
  };

  const cancelDelete = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  if (loading)
    return <div className="app-container" style={{ padding: "2rem", textAlign: "center" }}>Loading...</div>;

  if (error)
    return <div className="app-container" style={{ padding: "2rem", textAlign: "center", color: "red" }}>{error}</div>;

  const validCartItems = items?.filter((item) => item.quantity > 0) || [];

  if (!validCartItems.length)
    return <ErrorView message="Agrega un par de productos a tu carrito para empezar." />;

  return (
    <div className="app-container" style={{ padding: "2rem", backgroundColor: "#f9fafb" }}>
      <main className="main" style={{ display: "flex", justifyContent: "center", alignItems: "flex-start" }}>
        <div className="cart-container" style={{ display: "flex", flexDirection: "column", gap: "2rem", maxWidth: "1100px", width: "100%" }}>
          <h2 className="cart-title fade-in" style={{ fontSize: "2rem", fontWeight: "bold", color: "#1e293b", marginBottom: "1rem" }}>
            Shopping Cart
          </h2>

          <div className="cart-grid fade-in" style={{ display: "grid", gridTemplateColumns: "3fr 1fr", gap: "3rem", alignItems: "start" }}>
            <div className="cart-items" style={{ backgroundColor: "white", padding: "1.5rem", borderRadius: "0.75rem", boxShadow: "0 1px 4px rgba(0, 0, 0, 0.1)" }}>
              <ul style={{ display: "flex", flexDirection: "column", gap: "1.5rem", listStyle: "none", padding: 0 }}>
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

            <OrderSummary cartItems={validCartItems} subtotal={total} shipping="Free" total={total} />
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
