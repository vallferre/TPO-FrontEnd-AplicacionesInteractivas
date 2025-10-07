import "../components/Orders.css";

const Orders = () => {
  return (
    <div className="orders-container">
      <main className="orders-main">
        <div className="orders-header">
          <h1>Your Orders</h1>
          <p>
            View your complete order history and track current deliveries.
          </p>
        </div>

        <div className="orders-list">
          {/* Order 1 */}
          <div className="order-card">
            <div className="order-info">
              <div
                className="order-image"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAjBhalqy_ucFvQOLrm8v8BAm-Vi75LAk7SaV-ehdcI5Sn9e0O7CNH5uKr5QjLq2caqFJWD0JkwUoa36v8sfIybYGZWUuImm9FBoPeFZtoYNowYVeCR4GG5NyCkyHOCO-1UHeVnM8--nj8O6uATy0hqYYrDA__xCXUJQ-VDCWAKlr7bWXc4vJE2_yn-6DAR_2bh-qWdqxqDDWp4GTCtmUX3PnQ1qpwnCxFA6WiNtOuUhiVYn9HlwdP4Bn3nz9ErycM6b65tvXvofiFW')",
                }}
              ></div>
              <div>
                <p className="order-id">Order #1234567890</p>
                <p className="order-date">Placed on July 15, 2023</p>
                <p className="order-items">2 items</p>
              </div>
            </div>

            <div className="order-details">
              <p className="order-price">$120.00</p>
              <p className="order-discount">Discount: $10.00</p>
              <a href="#" className="view-details-btn">
                View Details →
              </a>
            </div>
          </div>

          {/* Podés duplicar el bloque order-card para los demás pedidos */}
        </div>
      </main>
    </div>
  );
};

export default Orders;
