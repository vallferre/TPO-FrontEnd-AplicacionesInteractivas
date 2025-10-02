import React from "react";
import "../components/ShoppingCart.css";

const ShoppingCart = () => {
  return (
    <div className="app-container">
      {/* Main */}
      <main className="main">
        <div className="cart-container">
          <h2 className="cart-title">Shopping Cart</h2>

          <div className="cart-grid">
            {/* Items */}
            <div className="cart-items">
              <ul>
                {/* Item 1 */}
                <li className="cart-item">
                  <div className="item-image">
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDCE-mj59m3h86Jn90wxXC25c1p_kY4gGzExaJ1KPO4iaIQdKGa476iULqLTftXzCJhWbx-yAzgncZ1qVpslkacLWZzuOotrFuKsjKsGxA2kOPTWVfiO0aQAZnEzGRInTAVyYh1w7a-9-mZm_geWTipc1Pk-yJ2tSx1BSP89KZmcVQV3pmmtVwFC7S8BzYTkhJg3hvE7pbX2-5brnCRLrFsIJzp4JgcWw1yyTAldTpcIjNDEzo0ms1SWXy3y949HWBimF3nwtuOsJI"
                      alt="Limited Edition Sneakers"
                    />
                  </div>
                  <div className="item-details">
                    <div className="item-top">
                      <h3>Limited Edition Sneakers</h3>
                      <p className="item-price">$150.00</p>
                    </div>
                    <p className="item-size">Size 9</p>
                    <div className="item-actions">
                      <div className="quantity">
                        <button>-</button>
                        <span>1</span>
                        <button>+</button>
                      </div>
                      <button className="remove-btn">Remove</button>
                    </div>
                  </div>
                </li>

                {/* Item 2 */}
                <li className="cart-item">
                  <div className="item-image">
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuB202qCH64LOgzxnWNMtL_vUA4LZlXwuQf0GhihXjk61Ux_BRW7BAuG4Djh1_A-qlIooFp82bXSP2Of5yiHq1fLoxTSgGcFNUwcOohQZtFc08YzuQTIhG0x8_l1PCCTI3twa9IME0vesA8V0_Y8_ezwocUPD98T0LXz6ok48XQMol4uA8pVY5-M7hyzwky8H7Ll33kBn2qgEHwIFSE5QhKEGo-TsgS8hukKcy8Ll4fZlrj_FkjH_Ux46dBkx7rkNlJlXc6YUBvhD1A"
                      alt="Vintage T-Shirt"
                    />
                  </div>
                  <div className="item-details">
                    <div className="item-top">
                      <h3>Vintage T-Shirt</h3>
                      <p className="item-price">$50.00</p>
                    </div>
                    <p className="item-size">Size M</p>
                    <div className="item-actions">
                      <div className="quantity">
                        <button>-</button>
                        <span>1</span>
                        <button>+</button>
                      </div>
                      <button className="remove-btn">Remove</button>
                    </div>
                  </div>
                </li>

                {/* Item 3 */}
                <li className="cart-item">
                  <div className="item-image">
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZHNGfhPOWgEkIEdLiJ4VMlD1ktTr9ynvh2b_qDgGbIYjHDLsPs-pWmQQo_g58feyYGuKml2MOoZw_82u__NS9HMQx3eQ728rLSIiuiES4ETUcN376bY2_owCbVT2Z_AMiLbVE_ccq6hOHEusNT8Kk0Qh0mhFEGvMX6LxJnLgJFU3oBLdkkxfnX0kq_VNeSO7tYfUv3HmDkvG0PTAfiLTzzPGMuy8CQ9laXf_ZFFbD4hVrll4wjnE9XkHqe9pFmaL2JD2_DZsaINE"
                      alt="Collectible Action Figure"
                    />
                  </div>
                  <div className="item-details">
                    <div className="item-top">
                      <h3>Collectible Action Figure</h3>
                      <p className="item-price">$50.00</p>
                    </div>
                    <p className="item-size">Standard</p>
                    <div className="item-actions">
                      <div className="quantity">
                        <button>-</button>
                        <span>1</span>
                        <button>+</button>
                      </div>
                      <button className="remove-btn">Remove</button>
                    </div>
                  </div>
                </li>
              </ul>
            </div>

            {/* Order Summary */}
            <div className="order-summary">
              <h3>Order Summary</h3>
              <div className="summary-details">
                <div className="summary-row">
                  <p>Subtotal</p>
                  <p>$250.00</p>
                </div>
                <div className="summary-row">
                  <p>Shipping</p>
                  <p>Free</p>
                </div>
                <div className="summary-row">
                  <p>Estimated Tax</p>
                  <p>$20.00</p>
                </div>
                <div className="divider"></div>
                <div className="summary-row total">
                  <p>Total</p>
                  <p>$270.00</p>
                </div>
              </div>
              <button className="checkout-btn">Proceed to Checkout</button>
              <p className="continue-shopping">
                or{" "}
                <a href="#">Continue Shopping →</a>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ShoppingCart;