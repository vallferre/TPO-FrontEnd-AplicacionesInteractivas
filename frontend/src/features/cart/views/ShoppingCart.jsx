// src/features/cart/pages/ShoppingCart.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchCart,
  increaseQuantity,
  decreaseQuantity,
  deleteProduct,
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

  // FETCH
  useEffect(() => {
    if (token) dispatch(fetchCart({ token }));
  }, [dispatch, token]);

  const handleAdd = (productId) => {
    dispatch(increaseQuantity({ productId, token }));
  };

  const handleRemove = (productId) => {
    dispatch(decreaseQuantity({ productId, token }));
  };

  const handleDeleteAll = (productId, quantity, productName) => {
    setSelectedProduct({ productId, quantity, productName });
    setShowModal(true);
  };

  const confirmDelete = () => {
    dispatch(deleteProduct({ productId: selectedProduct.productId, token }));
    setShowModal(false);
  };

  if (!token) return <ErrorView message="Debes iniciar sesión." />;

  if (loading) return <p style={{ padding: 20 }}>Cargando...</p>;

  if (error)
    return (
      <ErrorView message={error || "Error cargando carrito"} />
    );

  const validCartItems =
    items?.map((i) => ({
      id: i.productId,
      name: i.productName,
      size: i.productDescription,
      price: i.priceAtAddTime,
      quantity: i.quantity,
      image: i.productImageUrl,
    })) || [];

  if (!validCartItems.length)
    return <ErrorView message="Tu carrito está vacío." />;

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Shopping Cart</h2>

      <div style={{ display: "grid", gridTemplateColumns: "3fr 1fr", gap: "2rem" }}>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {validCartItems.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onIncrease={() => handleAdd(item.id)}
              onDecrease={() => handleRemove(item.id)}
              onRemove={() =>
                handleDeleteAll(item.id, item.quantity, item.name)
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
