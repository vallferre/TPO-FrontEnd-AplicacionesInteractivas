import React from "react";
import { Link } from "react-router-dom";
import "../components/ShoppingCart.css";

const ShoppingCart = () => {
  return (
    <div className="app-container" style={{ padding: "2rem", backgroundColor: "#f9fafb" }}>
      {/* Main */}
      <main className="main" style={{ display: "flex", justifyContent: "center", alignItems: "flex-start" }}>
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
            className="cart-title"
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
            className="cart-grid"
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
              <ul style={{ display: "flex", flexDirection: "column", gap: "1.5rem", listStyle: "none", padding: 0 }}>
                {/* Item 1 */}
                <li
                  className="cart-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1.5rem",
                    borderBottom: "1px solid #e2e8f0",
                    paddingBottom: "1.5rem",
                  }}
                >
                  <div className="item-image">
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDCE-mj59m3h86Jn90wxXC25c1p_kY4gGzExaJ1KPO4iaIQdKGa476iULqLTftXzCJhWbx-yAzgncZ1qVpslkacLWZzuOotrFuKsjKsGxA2kOPTWVfiO0aQAZnEzGRInTAVyYh1w7a-9-mZm_geWTipc1Pk-yJ2tSx1BSP89KZmcVQV3pmmtVwFC7S8BzYTkhJg3hvE7pbX2-5brnCRLrFsIJzp4JgcWw1yyTAldTpcIjNDEzo0ms1SWXy3y949HWBimF3nwtuOsJI"
                      alt="Limited Edition Sneakers"
                      style={{ width: "80px", height: "80px", borderRadius: "0.5rem", objectFit: "cover" }}
                    />
                  </div>
                  <div className="item-details" style={{ flex: 1 }}>
                    <div className="item-top" style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                      <h3 style={{ fontSize: "1.125rem", fontWeight: "600", color: "#1e293b" }}>
                        Limited Edition Sneakers
                      </h3>
                      <p className="item-price" style={{ fontWeight: "500", color: "#334155" }}>
                        $150.00
                      </p>
                    </div>
                    <p className="item-size" style={{ fontSize: "0.9rem", color: "#64748b" }}>
                      Size 9
                    </p>
                    <div className="item-actions" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1rem" }}>
                      <div className="quantity" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <button style={{ backgroundColor: "#e2e8f0", padding: "0.3rem 0.6rem", borderRadius: "0.375rem" }}>-</button>
                        <span>1</span>
                        <button style={{ backgroundColor: "#e2e8f0", padding: "0.3rem 0.6rem", borderRadius: "0.375rem" }}>+</button>
                      </div>
                      <button className="remove-btn" style={{ color: "#ef4444" }}>Remove</button>
                    </div>
                  </div>
                </li>

                {/* Item 2 */}
                <li
                  className="cart-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1.5rem",
                    borderBottom: "1px solid #e2e8f0",
                    paddingBottom: "1.5rem",
                  }}
                >
                  <div className="item-image">
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuB202qCH64LOgzxnWNMtL_vUA4LZlXwuQf0GhihXjk61Ux_BRW7BAuG4Djh1_A-qlIooFp82bXSP2Of5yiHq1fLoxTSgGcFNUwcOohQZtFc08YzuQTIhG0x8_l1PCCTI3twa9IME0vesA8V0_Y8_ezwocUPD98T0LXz6ok48XQMol4uA8pVY5-M7hyzwky8H7Ll33kBn2qgEHwIFSE5QhKEGo-TsgS8hukKcy8Ll4fZlrj_FkjH_Ux46dBkx7rkNlJlXc6YUBvhD1A"
                      alt="Vintage T-Shirt"
                      style={{ width: "80px", height: "80px", borderRadius: "0.5rem", objectFit: "cover" }}
                    />
                  </div>
                  <div className="item-details" style={{ flex: 1 }}>
                    <div className="item-top" style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                      <h3 style={{ fontSize: "1.125rem", fontWeight: "600", color: "#1e293b" }}>Vintage T-Shirt</h3>
                      <p className="item-price" style={{ fontWeight: "500", color: "#334155" }}>$50.00</p>
                    </div>
                    <p className="item-size" style={{ fontSize: "0.9rem", color: "#64748b" }}>Size M</p>
                    <div className="item-actions" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1rem" }}>
                      <div className="quantity" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <button style={{ backgroundColor: "#e2e8f0", padding: "0.3rem 0.6rem", borderRadius: "0.375rem" }}>-</button>
                        <span>1</span>
                        <button style={{ backgroundColor: "#e2e8f0", padding: "0.3rem 0.6rem", borderRadius: "0.375rem" }}>+</button>
                      </div>
                      <button className="remove-btn" style={{ color: "#ef4444" }}>Remove</button>
                    </div>
                  </div>
                </li>

                {/* Item 3 */}
                <li
                  className="cart-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1.5rem",
                  }}
                >
                  <div className="item-image">
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZHNGfhPOWgEkIEdLiJ4VMlD1ktTr9ynvh2b_qDgGbIYjHDLsPs-pWmQQo_g58feyYGuKml2MOoZw_82u__NS9HMQx3eQ728rLSIiuiES4ETUcN376bY2_owCbVT2Z_AMiLbVE_ccq6hOHEusNT8Kk0Qh0mhFEGvMX6LxJnLgJFU3oBLdkkxfnX0kq_VNeSO7tYfUv3HmDkvG0PTAfiLTzzPGMuy8CQ9laXf_ZFFbD4hVrll4wjnE9XkHqe9pFmaL2JD2_DZsaINE"
                      alt="Collectible Action Figure"
                      style={{ width: "80px", height: "80px", borderRadius: "0.5rem", objectFit: "cover" }}
                    />
                  </div>
                  <div className="item-details" style={{ flex: 1 }}>
                    <div className="item-top" style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                      <h3 style={{ fontSize: "1.125rem", fontWeight: "600", color: "#1e293b" }}>Collectible Action Figure</h3>
                      <p className="item-price" style={{ fontWeight: "500", color: "#334155" }}>$50.00</p>
                    </div>
                    <p className="item-size" style={{ fontSize: "0.9rem", color: "#64748b" }}>Standard</p>
                    <div className="item-actions" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1rem" }}>
                      <div className="quantity" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <button style={{ backgroundColor: "#e2e8f0", padding: "0.3rem 0.6rem", borderRadius: "0.375rem" }}>-</button>
                        <span>1</span>
                        <button style={{ backgroundColor: "#e2e8f0", padding: "0.3rem 0.6rem", borderRadius: "0.375rem" }}>+</button>
                      </div>
                      <button className="remove-btn" style={{ color: "#ef4444" }}>Remove</button>
                    </div>
                  </div>
                </li>
              </ul>
            </div>

            {/* Order Summary */}
            <div
              className="order-summary"
              style={{
                backgroundColor: "white",
                padding: "1.5rem",
                borderRadius: "0.75rem",
                boxShadow: "0 1px 4px rgba(0, 0, 0, 0.1)",
                height: "fit-content",
              }}
            >
              <h3 style={{ fontSize: "1.25rem", fontWeight: "bold", marginBottom: "1rem" }}>Order Summary</h3>
              <div className="summary-details" style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <div className="summary-row" style={{ display: "flex", justifyContent: "space-between" }}>
                  <p>Subtotal</p>
                  <p>$250.00</p>
                </div>
                <div className="summary-row" style={{ display: "flex", justifyContent: "space-between" }}>
                  <p>Shipping</p>
                  <p>Free</p>
                </div>
                <div className="summary-row" style={{ display: "flex", justifyContent: "space-between" }}>
                  <p>Estimated Tax</p>
                  <p>$20.00</p>
                </div>
                <div className="divider" style={{ borderTop: "1px solid #e2e8f0", margin: "0.75rem 0" }}></div>
                <div className="summary-row total" style={{ display: "flex", justifyContent: "space-between", fontWeight: "600" }}>
                  <p>Total</p>
                  <p>$270.00</p>
                </div>
              </div>
              <button
                className="checkout-btn"
                style={{
                  backgroundColor: "#1173d4",
                  color: "white",
                  fontWeight: "600",
                  width: "100%",
                  marginTop: "1rem",
                  padding: "0.75rem",
                  borderRadius: "0.5rem",
                }}
              >
                Proceed to Checkout
              </button>
              <p className="continue-shopping" style={{ textAlign: "center", marginTop: "1rem" }}>
                or{" "}
                <Link to="/" style={{ color: "#1173d4", fontWeight: "500", textDecoration: "none" }}>
                  Continue Shopping →
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ShoppingCart;
