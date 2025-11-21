import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./OrderSummary.css";
import { checkoutOrder } from "../../../redux/slices/OrderSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  selectOrderLoading,
  selectOrderError,
  selectCurrentOrder,
} from "../../../redux/slices/orderSelectors";

export default function OrderSummary({
  subtotal,
  shipping,
  tax,
  total,
  cartItems = [],
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loading = useSelector(selectOrderLoading);
  const error = useSelector(selectOrderError);
  const currentOrder = useSelector(selectCurrentOrder);

  const token = useSelector((s) => s.auth.token);

  const totalDiscount = cartItems.reduce((sum, item) => {
    if (item.discountedPrice && item.discountedPrice > 0) {
      const discountAmount =
        ((item.priceAtAddTime * item.discountedPrice) / 100) * item.quantity;
      return sum + discountAmount;
    }
    return sum;
  }, 0);

  const handleCheckout = async () => {
    if (!token) {
      toast.error("Necesitas iniciar sesión para completar la compra.");
      return;
    }
    //se pasa el token al thunk desde el estado global
    const result = await dispatch(checkoutOrder({ token }));

    if (checkoutOrder.fulfilled.match(result)) {
      toast.success("Orden exitosa!");
      navigate(`/order/${result.payload.orderId}`, {
        state: { order: result.payload },
      });
    } else {
      toast.error(result.payload || "Checkout fallido.");
    }
  };

  return (
    <div className="order-summary">
      <h3>Order Summary</h3>

      <div className="summary-details">
        {/* Subtotal */}
        <div>
          <p>Subtotal</p>
          <p>${subtotal}</p>
        </div>

        {/* Shipping */}
        <div>
          <p>Shipping</p>
          <p>{shipping}</p>
        </div>

        {/* Discount Section */}
        {totalDiscount > 0 && (
          <>
            <div>
              <p>Discount</p>
              <p>- ${totalDiscount.toFixed(2)}</p>
            </div>

            {cartItems
              .filter(
                (item) => item.discountedPrice && item.discountedPrice > 0
              )
              .map((item) => {
                const discountAmount =
                  ((item.priceAtAddTime * item.discountedPrice) / 100) *
                  item.quantity;
                return (
                  <div key={item.productId}>
                    <div>
                      <p>
                        {item.productName}
                        <br />
                        <span>({item.discountedPrice}% off)</span>
                      </p>
                    </div>
                    <p>- ${discountAmount.toFixed(2)}</p>
                  </div>
                );
              })}
          </>
        )}

        <div></div>

        {/* Total */}
        <div>
          <p>Total</p>
          <p>${(total - totalDiscount).toFixed(2)}</p>
        </div>
      </div>

      <button onClick={() => navigate("/checkout")}>Proceed to Checkout</button>

      <p>
        or <Link to="/">Continue Shopping →</Link>
      </p>
    </div>
  );
}
