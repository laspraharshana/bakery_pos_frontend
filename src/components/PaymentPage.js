import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './PaymentPage.module.css'; // Create this CSS file

function PaymentPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [amountReceived, setAmountReceived] = useState('');
  const [changeDue, setChangeDue] = useState(0);
  const [paymentSuccessful, setPaymentSuccessful] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/orders/${orderId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setOrder(data);
        setLoading(false);
      } catch (e) {
        setError(e);
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
    // Reset payment-related states when payment method changes
    setAmountReceived('');
    setChangeDue(0);
    setPaymentSuccessful(false);
    setPaymentError('');
  };

  const handleAmountReceivedChange = (event) => {
    const amount = event.target.value;
    setAmountReceived(amount);
    if (paymentMethod === 'cash' && order) {
      const change = parseFloat(amount) - order.totalAmount;
      setChangeDue(isNaN(change) ? 0 : change.toFixed(2));
    }
  };

  const handleCompletePayment = async () => {
    if (!order) {
      setPaymentError('Order details not loaded.');
      return;
    }
    if (!paymentMethod) {
      setPaymentError('Please select a payment method.');
      return;
    }

    const paymentData = {
      paymentMethod: paymentMethod,
      amountReceived: parseFloat(amountReceived),
      totalAmount: order.totalAmount,
      changeDue: parseFloat(changeDue), // Backend can recalculate this for safety
      status: 'COMPLETED', // Update order status to completed
      // Add any other relevant payment information
    };

    try {
      const response = await fetch(`http://localhost:8080/api/orders/${orderId}/pay`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      if (response.ok) {
        setPaymentSuccessful(true);
        setPaymentError('');
        // Optionally, navigate the user to a confirmation page or back to pending orders
        setTimeout(() => navigate('/pending-orders'), 2000); // Redirect after 2 seconds
      } else {
        const errorData = await response.json(); // Or response.text()
        setPaymentError(errorData?.message || 'Payment processing failed.');
      }
    } catch (e) {
      setPaymentError('Error processing payment: ' + e.message);
    }
  };

  if (loading) {
    return <div>Loading order details...</div>;
  }

  if (error) {
    return <div>Error loading order: {error.message}</div>;
  }

  return (
    <div className={styles.paymentContainer}>
      <h1>Process Payment for Order #{orderId}</h1>
      {order && (
        <div className={styles.orderDetails}>
          <p>Order Date: {new Date(order.orderDate).toLocaleString()}</p>
          <p>Total Amount Due: ${order.totalAmount.toFixed(2)}</p>
          {order.orderItems && order.orderItems.map(item => (
            <p key={item.id}>
              {item.quantity} x Product ID {item.productId} @ ${item.itemPrice.toFixed(2)}
            </p>
          ))}

          <div className={styles.paymentOptions}>
            <h2>Payment Information</h2>
            <label>
              Payment Method:
              <select value={paymentMethod} onChange={handlePaymentMethodChange}>
                <option value="">Select Method</option>
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="mobile">Mobile Payment</option>
                {/* Add more payment methods as needed */}
              </select>
            </label>

            {paymentMethod === 'cash' && (
              <label>
                Amount Received: $
                <input
                  type="number"
                  value={amountReceived}
                  onChange={handleAmountReceivedChange}
                />
              </label>
            )}

            {changeDue > 0 && paymentMethod === 'cash' && (
              <p className={styles.changeDue}>Change Due: ${changeDue}</p>
            )}

            {paymentError && <p className={styles.error}>{paymentError}</p>}
            {paymentSuccessful && <p className={styles.success}>Payment Successful! Redirecting...</p>}

            <button onClick={handleCompletePayment} disabled={paymentSuccessful || loading || !paymentMethod}>
              Complete Payment
            </button>
            <button onClick={() => navigate('/pending-orders')}>Back to Pending Orders</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PaymentPage;