import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./OrderDetails.css";
import { useDispatch, useSelector } from "react-redux";
import { getOrderById } from "../../../redux/slices/OrderSlice";

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const token = useSelector((s) => s.auth.token);
  const order = useSelector((s) => s.order.currentOrder);
  const loading = useSelector((s) => s.order.loading);
  const error = useSelector((s) => s.order.error);

  useEffect(() => {
    if (token) {
      dispatch(getOrderById({ orderId, token }));
    }
  }, [orderId, token, dispatch]);

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
                <td>{item.description}</td>
                <td>{item.quantity}</td>
                <td>${item.priceAtPurchase}</td>
                <td>${(item.quantity * item.priceAtPurchase).toFixed(2)}</td>
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
                      cursor: "pointer",
                    }}
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
