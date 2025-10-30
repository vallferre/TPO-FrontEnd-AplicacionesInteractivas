import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./OrderSummary.css"

export default function OrderSummary({ subtotal, shipping, tax, total, cartItems = [] }) {
  const navigate = useNavigate();

  const totalDiscount = cartItems.reduce((sum, item) => {
    if (item.discountedPrice && item.discountedPrice > 0) {
      const discountAmount = ((item.priceAtAddTime * item.discountedPrice) / 100) * item.quantity;
      return sum + discountAmount;
    }
    return sum;
  }, 0);

  const handleCheckout = async () => {
    const token = localStorage.getItem("jwtToken");

    if (!token) {
      toast.warning("Please log in to continue with the checkout.");
      navigate("/login");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/cart/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        navigate(`/order/${data.orderId}`, { state: { order: data } });
      } else if (response.status === 400) {
        const errorMessage = await response.text();
        toast.error(`Error: ${errorMessage}`);
      } else if (response.status === 401) {
        toast.warning("Unauthorized. Please log in again.");
        navigate("/login");
      } else {
        throw new Error(`Checkout failed with status ${response.status}`);
      }
    } catch (error) {
      toast.error("An error occurred during checkout. Please try again.");
      console.error(error);
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
              .filter((item) => item.discountedPrice && item.discountedPrice > 0)
              .map((item) => {
                const discountAmount = ((item.priceAtAddTime * item.discountedPrice) / 100) * item.quantity;
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

      <button onClick={handleCheckout}>Proceed to Checkout</button>

      <p>
        or{" "}
        <Link to="/">Continue Shopping →</Link>
      </p>
    </div>
  );
}
