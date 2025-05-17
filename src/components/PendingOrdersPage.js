import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './PendingOrdersPage.module.css'; // Create this CSS file

function PendingOrdersPage() {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
   const navigate = useNavigate();

  useEffect(() => {
    const fetchPendingOrders = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/orders/pending'); // Backend API endpoint
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPendingOrders(data);
        setLoading(false);
      } catch (e) {
        setError(e);
        setLoading(false);
      }
    };

    fetchPendingOrders();
  }, []);

  const handleCompletePayment = async (orderId) => {
    // Implement logic to navigate to a payment processing page for this order
    console.log(`Navigating to payment for order ID: ${orderId}`);
    navigate(`/pay/${orderId}`);
    // You might use useNavigate from react-router-dom here
  };

  const handleViewDetails = async (orderId) => {
    // Implement logic to view the full details of the pending order
    console.log(`Viewing details for order ID: ${orderId}`);
    // You might navigate to a detailed order view page
  };

  if (loading) {
    return <div>Loading pending orders...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className={styles.pendingOrdersContainer}>
      <h1>Pending Orders</h1>
      {pendingOrders.length > 0 ? (
        <ul className={styles.pendingOrdersList}>
          {pendingOrders.map(order => (
            <li key={order.id} className={styles.pendingOrderItem}>
              <div className={styles.orderInfo}>
                <span>Order ID: {order.id}</span>
                <span>Date: {new Date(order.orderDate).toLocaleString()}</span>
                <span>Total: ${order.totalAmount.toFixed(2)}</span>
                <span>Status: {order.status}</span>
                {/* Display a brief summary of items if needed */}
              </div>
              <div className={styles.orderActions}>
                {order.status === 'PENDING' && ( // Adjust condition based on your backend status
                  <button onClick={() => handleCompletePayment(order.id)} className={styles.completeButton}>
                    Complete Payment
                  </button>
                )}
                <button onClick={() => handleViewDetails(order.id)} className={styles.detailsButton}>
                  View Details
                </button>
                {/* Add other actions like 'Cancel Order' if necessary */}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No pending orders.</p>
      )}
      <Link to="/" className={styles.backButton}>Back to Dashboard</Link>
    </div>
  );
}

export default PendingOrdersPage;