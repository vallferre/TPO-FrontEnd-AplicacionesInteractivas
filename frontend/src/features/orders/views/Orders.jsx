import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./Orders.css";
import {
  selectOrders,
  selectCurrentOrder,
  selectOrderLoading,
  selectOrderError,
  selectOrderTotalPages,
} from "../../../redux/slices/orderSelectors";

import { getUserOrders } from "../../../redux/slices/OrderSlice";

import "./Orders.css";

const Orders = () => {
  const [page, setPage] = useState(0);
  const [sortOrder, setSortOrder] = useState("desc");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const orders = useSelector(selectOrders);
  const loading = useSelector(selectOrderLoading);
  const error = useSelector(selectOrderError);
  const totalPages = useSelector(selectOrderTotalPages);

  const token = useSelector((state) => state.auth.token);

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
    setPage(0);
  };

  const handleOrderClick = (orderId) => {
    navigate(`/order/${orderId}`);
  };

  // ✅ Función para formatear fecha (sin hora)
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  useEffect(() => {
    if (!token) return;
    dispatch(getUserOrders({ page, sortOrder, token }));
  }, [page, sortOrder, dispatch, token]);

  return (
    <div className="orders-content">
      <div className="orders-header">
        <h1>Your Orders</h1>
        <div className="orders-subheader">
          <p>View your complete order history and track current deliveries.</p>
          <button className="sort-button" onClick={toggleSortOrder}>
            {sortOrder === "desc" ? "⬇ Newest first" : "⬆ Oldest first"}
          </button>
        </div>
      </div>

      {loading && <p>Loading orders...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && orders.length === 0 && (
        <p>You don't have any orders yet.</p>
      )}

      <div className="orders-list">
        {orders.map((order) => (
          <div
            key={order.orderId}
            className="order-card"
            onClick={() => handleOrderClick(order.orderId)}
          >
            <div className="order-card-content">
              <div className="order-basic-info">
                <div className="order-left">
                  <h3 className="order-title">Order #{order.orderId}</h3>
                  {order.orderDate && (
                    <span className="order-date">
                      {formatDate(order.orderDate)}
                    </span>
                  )}
                </div>
                <div className="order-stats">
                  <span className="items-count">{order.count} items</span>
                  <span className="total-amount">${order.totalAmount}</span>
                </div>
              </div>

              <div className="view-details">Click to view details →</div>
            </div>
          </div>
        ))}
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
