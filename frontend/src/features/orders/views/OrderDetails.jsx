import { useEffect } from "react";
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

  //  Ahora solo pasamos el productId por URL
  const handleRateProduct = (productIdSnapshot) => {
    navigate(`/rate-product/${productIdSnapshot}`);
  };


  return (
    <div className="order-details-container">
      <div className="order-details-header">
        <h1>Detalle de Orden</h1>
        <p className="order-id">Order #{order.orderId}</p>
      </div>

      <div className="order-summary">
        <div className="summary-card">
          <p className="summary-label">Total </p>
          <p className="summary-value">${order.totalAmount}</p>
        </div>
        <div className="summary-card">
          <p className="summary-label">Items Totales</p>
          <p className="summary-value">{order.count}</p>
        </div>
        <div className="summary-card">
          <p className="summary-label">Fecha de Orden</p>
          <p className="summary-value">{order.orderDate}</p>
        </div>
      </div>

      <div className="order-table-container">
        <table className="order-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Cantidad</th>
              <th>Precio</th>
              <th>Subtotal</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.productIdSnapshot}>
                <td>#{item.productIdSnapshot}</td>
                <td>{item.productName}</td>
                <td>{item.quantity}</td>
                <td>${(item.priceAtPurchase * (1 - item.discountedPriceAtPurchase/100)).toFixed(2)}</td>
                <td>${(item.quantity * (item.priceAtPurchase * (1 - item.discountedPriceAtPurchase/100))).toFixed(2)}</td>
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