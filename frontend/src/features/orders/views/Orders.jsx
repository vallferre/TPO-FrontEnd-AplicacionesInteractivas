import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./Orders.css";
import {
  selectOrders,
  selectOrderLoading,
  selectOrderError,
  selectOrderTotalPages,
} from "../../../redux/slices/orderSelectors";
import { getUserOrders } from "../../../redux/slices/OrderSlice";

const Orders = () => {
  const [page, setPage] = useState(0);
  const [sortOrder, setSortOrder] = useState("desc");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const orders = useSelector(selectOrders) || [];
  const loading = useSelector(selectOrderLoading);
  const error = useSelector(selectOrderError);
  const totalPages = useSelector(selectOrderTotalPages) || 1;

  const token = useSelector((state) => state.auth.token);

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
    setPage(0);
  };

  // Función para calcular el total con descuentos de UNA orden específica
  const calculateOrderTotal = (order) => {
    if (!order.items || order.items.length === 0) {
      return order.total || 0;
    }

    return order.items.reduce((acc, item) => {
      const discount = item.discountedPriceAtPurchase || 0;
      const precioConDescuento = item.priceAtPurchase * (1 - discount / 100);
      return acc + item.quantity * precioConDescuento;
    }, 0);
  };

  const handleOrderClick = (orderId) => {
    if (!orderId) return;
    navigate(`/order/${orderId}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    });
  };

  useEffect(() => {
    if (!token) return;
    dispatch(getUserOrders({ page, sortOrder, token }));
  }, [page, sortOrder, dispatch, token]);

  return (
    <div className="orders-content">
      <div className="orders-header">
        <h1>Sus Ordenes</h1>
        <div className="orders-subheader">
          <p>Consulta tu historial completo de pedidos y sigue tus entregas actuales.</p>
          <button className="sort-button" onClick={toggleSortOrder}>
            {sortOrder === "desc" ? "⬇ Nuevos Primero" : "⬆ Antiguos Primero"}
          </button>
        </div>
      </div>

      {loading && <p>Cargando órdenes...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && orders.length === 0 && (
        <p>Aún no realizaste pedidos.</p>
      )}

      <div className="orders-list">
        {orders.map((order) => {
          const orderTotal = calculateOrderTotal(order);
          
          return (
            <div
              key={order.orderId ?? order.id}
              className="order-card"
              onClick={() => handleOrderClick(order.orderId ?? order.id)}
            >
              <div className="order-card-content">
                <div className="order-basic-info">
                  <div className="order-left">
                    <h3 className="order-title">
                      Orden #{order.orderId ?? order.id}
                    </h3>
                    {order.orderDate && (
                      <span className="order-date">{formatDate(order.orderDate)}</span>
                    )}
                  </div>
                  <div className="order-stats">
                    <span className="items-count">
                      {order.count ?? order.itemsCount} items
                    </span>
                    <span className="total-amount">
                      ${orderTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="view-details">Haz clic para ver los detalles →</div>
              </div>
            </div>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
          >
            ← Prev
          </button>
          <span>
            Page {page + 1} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page + 1 === totalPages}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

export default Orders;