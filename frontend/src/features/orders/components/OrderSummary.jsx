import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./OrderSummary.css";
import { checkoutOrder } from "../../../redux/slices/OrderSlice";
import { useDispatch, useSelector } from "react-redux";

export default function OrderSummary({
  subtotal,
  shipping,
  total,
  cartItems = [],
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const token = useSelector((s) => s.auth.token);

  const totalDiscount = cartItems.reduce((sum, item) => {
    if (item.discountedPrice && item.discountedPrice > 0) {
      const discountAmount =
        ((item.price * item.discountedPrice) / 100) * item.quantity;
      return sum + discountAmount;
    }
    return sum;
  }, 0);

  return (
    <div className="order-summary">
      <h3>Resumen de orden</h3>

      <div className="summary-details">
        {/* Subtotal */}
        <div>
          <p>Subtotal</p>
          <p>${subtotal}</p>
        </div>

        {/* Shipping */}
        <div>
          <p>Envío</p>
          <p>{shipping}</p>
        </div>

        {/* Discount Section */}
        {totalDiscount > 0 && (
          <>
            <div>
              <p>Descuento</p>
              <p>- ${totalDiscount.toFixed(2)}</p>
            </div>

            {cartItems
              .filter(
                (item) => item.discountedPrice && item.discountedPrice > 0
              )
              .map((item) => {
                const discountAmount =
                  ((item.price * item.discountedPrice) / 100) *
                  item.quantity;
                return (
                  <div key={item.productId}>
                    <div>
                      <p>
                        {item.name}
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

        {/* Total */}
        <div>
          <p>Total</p>
          <p>${(total - totalDiscount).toFixed(2)}</p>
        </div>
      </div>

      <button onClick={() => navigate("/checkout")}>Continuar al pago</button>

      <p>
        or <Link to="/products">Seguir comprando →</Link>
      </p>
    </div>
  );
}
