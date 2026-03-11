import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getRecentOrders, terminateOrder } from "../services/orderService";
import "../styles/OrderHistory.css";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all"); // all, pending, terminated

  const fetchOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getRecentOrders();
      setOrders(data);
    } catch (err) {
      setError("Failed to load order history. Please try again.");
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleTerminate = async (orderId) => {
    if (!window.confirm("Are you sure you want to terminate this order?")) return;
    
    try {
      await terminateOrder(orderId);
      setOrders(orders.map(o => 
        o._id === orderId ? { ...o, status: "terminated" } : o
      ));
    } catch (err) {
      alert("Failed to terminate order");
      console.error("Error terminating order:", err);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const filteredOrders = orders.filter(order => {
    if (filter === "all") return true;
    return order.status === filter;
  });

  const pendingCount = orders.filter(o => o.status === "pending").length;
  const terminatedCount = orders.filter(o => o.status === "terminated").length;

  return (
    <div className="order-history-page">
      <div className="order-history-header">
        <div className="order-history-header-content">
          <div className="order-history-header-icon">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/>
            </svg>
          </div>
          <div>
            <h2>Order History</h2>
            <p>Last 24 hours • All orders</p>
          </div>
        </div>
        <Link to="/orders" className="back-link">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
          </svg>
          Back to Orders
        </Link>
      </div>

      {/* Stats */}
      <div className="history-stats">
        <div className="stat-card">
          <span className="stat-number">{orders.length}</span>
          <span className="stat-label">Total Orders</span>
        </div>
        <div className="stat-card pending">
          <span className="stat-number">{pendingCount}</span>
          <span className="stat-label">Pending</span>
        </div>
        <div className="stat-card terminated">
          <span className="stat-number">{terminatedCount}</span>
          <span className="stat-label">Terminated</span>
        </div>
      </div>

      {/* Filters */}
      <div className="history-filters">
        <button 
          className={`filter-btn ${filter === "all" ? "active" : ""}`}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button 
          className={`filter-btn ${filter === "pending" ? "active" : ""}`}
          onClick={() => setFilter("pending")}
        >
          Pending
        </button>
        <button 
          className={`filter-btn ${filter === "terminated" ? "active" : ""}`}
          onClick={() => setFilter("terminated")}
        >
          Terminated
        </button>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading order history...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="empty-history">
          <div className="empty-history-icon">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9z"/>
            </svg>
          </div>
          <p>No orders found</p>
          <span>Orders from the last 24 hours will appear here</span>
        </div>
      ) : (
        <div className="history-table-container">
          <table className="history-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Table</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Time</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order._id}>
                  <td className="order-id">#{order._id.slice(-6).toUpperCase()}</td>
                  <td className="table-number">Table {order.tableNumber}</td>
                  <td className="order-items">
                    {order.items.map((item, idx) => (
                      <span key={idx} className="item-tag">
                        {item.quantity}x {item.name}
                      </span>
                    ))}
                  </td>
                  <td className="order-total">${order.totalAmount.toFixed(2)}</td>
                  <td>
                    <span className={`status-badge ${order.status}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="order-time">
                    <div>{formatDate(order.createdAt)}</div>
                    <div className="time">{formatTime(order.createdAt)}</div>
                  </td>
                  <td className="actions-cell">
                    {order.status === "pending" && (
                      <button 
                        className="terminate-btn"
                        onClick={() => handleTerminate(order._id)}
                      >
                        Terminate
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

