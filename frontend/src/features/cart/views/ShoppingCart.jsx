// src/features/cart/pages/ShoppingCart.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchCart,
  addToCart,
  removeFromCart,
  clearCart,
} from "../../../redux/slices/CartSlice";

import {
  selectCartItems,
  selectCartTotal,
  selectCartLoading,
  selectCartError,
} from "../../../redux/slices/CartSelectors";

import CartItem from "../components/CartItem";
import OrderSummary from "../../orders/components/OrderSummary";
import ErrorView from "../../../components/ui/ErrorView";
import DeleteConfirmationModal from "../../../components/ui/DeleteConfirmationModal";

const ShoppingCart = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const loading = useSelector(selectCartLoading);
  const error = useSelector(selectCartError);

  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartErrors, setCartErrors] = useState({});

  // Fetch cart on mount
  useEffect(() => {
    if (token) dispatch(fetchCart({ token }));
  }, [dispatch, token]);

  const handleIncrease = (productId) => {
    dispatch(addToCart({ productId, token, quantity: 1 }))
      .unwrap()
      .then(() => setCartErrors((prev) => ({ ...prev, [productId]: null })))
      .catch((err) =>
        setCartErrors((prev) => ({ ...prev, [productId]: err }))
      );
  };

  const handleDecrease = (productId) => {
    dispatch(removeFromCart({ productId, number: 1, token }))
      .unwrap()
      .catch((err) =>
        setCartErrors((prev) => ({ ...prev, [productId]: err }))
      );
  };

  const handleDeleteAll = (productId, productName, quantity) => {
    setSelectedProduct({ productId, productName, quantity });
    setShowModal(true);
  };

  const confirmDelete = () => {
    if (!selectedProduct) return;
    dispatch(
      removeFromCart({
        productId: selectedProduct.productId,
        number: selectedProduct.quantity,
        token,
      })
    );
    setShowModal(false);
    setSelectedProduct(null);
  };

  if (!token) return <ErrorView message="Debes iniciar sesión." />;
  if (loading) return <p style={{ padding: 20 }}>Cargando...</p>;
  if (error) return <ErrorView message={error || "Error cargando carrito"} />;

  const validCartItems =
    items?.map((i) => ({
      id: i.productId,
      name: i.productName,
      size: i.productDescription,
      price: i.priceAtAddTime,
      discountedPrice: i.discountedPrice,
      quantity: i.quantity,
      image: i.productImageUrl,
      error: cartErrors[i.productId],
    })) || [];

  if (!validCartItems.length)
    return <ErrorView message="Tu carrito está vacío." />;

  return (
    <div style={{ padding: "2rem" }}>
      <h2 className="title">Shopping Cart</h2>

      <div style={{ display: "grid", gridTemplateColumns: "3fr 1fr", gap: "2rem" }}>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {validCartItems.map((item) => (
            console.log(item.name),
            console.log(item.productName),
            console.log(item.productNameSnapshot),
            <CartItem
              key={item.id}
              item={item}
              onIncrease={() => handleIncrease(item.id)}
              onDecrease={() => handleDecrease(item.id)}
              onRemove={() =>
                handleDeleteAll(item.id, item.name, item.quantity)
              }
            />
          ))}
        </ul>

        <OrderSummary
          cartItems={validCartItems}
          subtotal={total}
          total={total}
          shipping="Free"
        />
      </div>

      <DeleteConfirmationModal
        isOpen={showModal}
        onConfirm={confirmDelete}
        onCancel={() => setShowModal(false)}
        productName={selectedProduct?.productName}
      />
    </div>
  );
};

export default ShoppingCart;
