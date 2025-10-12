// src/views/Orders.jsx
import "../components/Orders.css";

const Orders = () => {
  const orders = [
    {
      id: "1234567890",
      date: "July 15, 2023",
      items: 2,
      total: "$120.00",
      discount: "$10.00",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAjBhalqy_ucFvQOLrm8v8BAm-Vi75LAk7SaV-ehdcI5Sn9e0O7CNH5uKr5QjLq2caqFJWD0JkwUoa36v8sfIybYGZWUuImm9FBoPeFZtoYNowYVeCR4GG5NyCkyHOCO-1UHeVnM8--nj8O6uATy0hqYYrDA__xCXUJQ-VDCWAKlr7bWXc4vJE2_yn-6DAR_2bh-qWdqxqDDWp4GTCtmUX3PnQ1qpwnCxFA6WiNtOuUhiVYn9HlwdP4Bn3nz9ErycM6b65tvXvofiFW",
    },
    {
      id: "9876543210",
      date: "August 3, 2023",
      items: 1,
      total: "$45.00",
      discount: "$0.00",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBjhcbZc5P8cxoI6ylGRQLKWJn3iNgBh_EjsFOxuwoUbrqc8Afc4iD6pmztElxKLzruCR4xBzd1M2qK_eR8Jf8AxbOgqfG6RSIruDDLZedl4FjPuX6LdsBJZNNWlJiRq0uTTPj8LfaZXEibQrxgp_eAPSYEaTmPVupCRkiBsTRLQULVBojmzcuo0-xDxnY6jwjHJQDufAgvI8t4e2Zu7vIRwK1d9aimEGZbP-mQjVP_X7BMjF6eOvdcsP2VUA0YjDfrHL7d3p1T209L",
    },
  ];

  return (
    <div className="orders-content">
      <div className="orders-header">
        <h1>Your Orders</h1>
        <p>View your complete order history and track current deliveries.</p>
      </div>

      <div className="orders-list">
        {orders.map((order) => (
          <div key={order.id} className="order-card">
            <div className="order-info">
              <div
                className="order-image"
                style={{ backgroundImage: `url(${order.image})` }}
              ></div>
              <div>
                <p className="order-id">Order #{order.id}</p>
                <p className="order-date">Placed on {order.date}</p>
                <p className="order-items">{order.items} items</p>
              </div>
            </div>

            <div className="order-details">
              <p className="order-price">{order.total}</p>
              <p className="order-discount">Discount: {order.discount}</p>
              <a href="#" className="view-details-btn">
                View Details →
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
