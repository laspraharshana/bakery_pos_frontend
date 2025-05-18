import React, { useState, useEffect } from 'react';
import styles from './RecentOrdersPage.module.css';
import { fetchWithAuth } from '../utils/api';  // Create this CSS file

function RecentOrdersPage() {
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null); // To show details of a specific order

  useEffect(() => {
    const fetchRecentOrders = async () => {
      try {
        const response = await fetchWithAuth('http://localhost:8080/api/orders/recent'); // Backend endpoint to fetch recent orders
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setRecentOrders(data);
        setLoading(false);
      } catch (e) {
        setError(e);
        setLoading(false);
      }
    };

    fetchRecentOrders();
  }, []);

  const handleViewOrder = (orderId) => {
    // Function to fetch and display details of a specific order
    const fetchOrderDetails = async () => {
      try {
        const response = await fetchWithAuth(`http://localhost:8080/api/orders/${orderId}`); // Backend endpoint to fetch order details
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSelectedOrder(data);
      } catch (e) {
        setError(e);
      }
    };

    fetchOrderDetails();
  };

  const handleCloseOrderDetails = () => {
    setSelectedOrder(null);
  };

  if (loading) {
    return <div>Loading recent orders...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className={styles.recentOrdersContainer}>
      <h2>Recent Orders</h2>
      {recentOrders.length === 0 ? (
        <p>No recent orders found.</p>
      ) : (
        <ul className={styles.orderList}>
          {recentOrders.map(order => (
            <li key={order.id} className={styles.orderItem}>
              <span>Order ID: {order.id}</span>
              <span>Date: {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'N/A'}</span> {/* Format the date */}
              <span>Total: ${order.totalAmount ? order.totalAmount.toFixed(2) : 'N/A'}</span>
              <button onClick={() => handleViewOrder(order.id)} className={styles.viewButton}>View Details</button>
            </li>
          ))}
        </ul>
      )}

      {selectedOrder && (
        <div className={styles.orderDetailsModal}>
          <div className={styles.modalContent}>
            <h3>Order Details - ID: {selectedOrder.id}</h3>
            <p>Order Date: {selectedOrder.orderDate ? new Date(selectedOrder.orderDate).toLocaleString() : 'N/A'}</p> {/* More detailed date/time */}
            <p>Total Amount: <span className={styles.total}>${selectedOrder.totalAmount ? selectedOrder.totalAmount.toFixed(2) : 'N/A'}</span></p>
            {selectedOrder.status && <p>Status: {selectedOrder.status}</p>} {/* Conditionally render status */}

            <h4>Order Items:</h4>
            {selectedOrder.orderItems && selectedOrder.orderItems.map(item => {
              const itemTotal = item.quantity * item.itemPrice;
              return (
                <div key={item.orderItemId} className={styles.orderItemDetails}>
                  <span>Product ID: {item.productId}</span>
                  <span>Quantity: {item.quantity}</span>
                  <span>Item Price: ${item.itemPrice.toFixed(2)}</span>
                  <span>Item Total: ${itemTotal.toFixed(2)}</span>
                </div>
              );
            })}

            <button onClick={handleCloseOrderDetails} className={styles.closeButton}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default RecentOrdersPage;