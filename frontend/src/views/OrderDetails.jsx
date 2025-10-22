import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../assets/OrderDetails.css";

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("jwtToken");
      if (!token) {
        setError("No se encontró token de autenticación");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:8080/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error(`Error ${response.status}: no se pudo obtener la orden`);
        }

        const data = await response.json();
        setOrder(data);
      } catch (err) {
        console.error(err);
        setError("Error al cargar la orden. Intenta nuevamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) return <p>Loading order...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!order) return <p>No order found.</p>;

  // 🔹 Navegar a RateProduct usando ruta con parámetro
  const handleRateProduct = (productIdSnapshot) => {
    navigate(`/rate-product/${productIdSnapshot}`);
  };

  return (
    <div className="order-details-container">
      <div className="order-details-header">
        <h1>Order Details</h1>
        <p className="order-id">Order #{order.orderId}</p>
      </div>

      <div className="order-summary">
        <div className="summary-card">
          <p className="summary-label">Total Amount</p>
          <p className="summary-value">${order.totalAmount}</p>
        </div>
        <div className="summary-card">
          <p className="summary-label">Total Items</p>
          <p className="summary-value">{order.count}</p>
        </div>
        <div className="summary-card">
          <p className="summary-label">Order Date</p>
          <p className="summary-value">{order.orderDate}</p>
        </div>
      </div>

      <div className="order-table-container">
        <table className="order-table">
          <thead>
            <tr>
              <th>Product ID</th>
              <th>Product Description</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.productIdSnapshot}>
                <td>#{item.productIdSnapshot}</td>
                <td>{item.productDescriptionSnapshot}</td>
                <td>{item.productQuantitySnapshot}</td>
                <td>${item.productPriceSnapshot}</td>
                <td>
                  <button
                    onClick={() => handleRateProduct(item.productIdSnapshot)}
                    className="rate-btn"
                    style={{
                      backgroundColor: "#facc15",
                      color: "#1e293b",
                      fontWeight: "bold",
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: "6px",
                      cursor: item.productId ? "pointer" : "not-allowed",
                    }}
                    disabled={!item.productId}
                  >
                    ⭐ Calificar Producto
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderDetails;