import React from 'react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa'; // FontAwesome for icons

const OrderStatus = ({ orderStatus }) => {
  const isSuccess = orderStatus === 'CAPTURED';

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {isSuccess ? (
          <div style={styles.successContainer}>
            <FaCheckCircle style={styles.successIcon} />
            <h1 style={styles.title}>Thank You for Your Order!</h1>
            <p style={styles.text}>
              Your order has been successfully placed and is now being processed.
            </p>
            <p style={styles.text}>
              You will receive an email confirmation shortly with your order details.
            </p>
            <div style={styles.orderDetails}>
              <h3 style={styles.orderDetailsTitle}>Order Summary</h3>
              <ul style={styles.orderItems}>
                <li>Product 1 - $100</li>
                <li>Product 2 - $50</li>
                <li>Product 3 - $25</li>
              </ul>
              <p style={styles.total}>Total: $175</p>
            </div>
          </div>
        ) : (
          <div style={styles.failedContainer}>
            <FaTimesCircle style={styles.failedIcon} />
            <h1 style={styles.title}>Oops! Something Went Wrong</h1>
            <p style={styles.text}>
              Unfortunately, we were unable to process your order at this time.
            </p>
            <p style={styles.text}>
              Please try again later or contact customer support for assistance.
            </p>
            <button style={styles.retryButton}>Try Again</button>
          </div>
        )}
      </div>
    </div>
  );
};

// Define styles
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
  },
  card: {
    backgroundColor: '#fff',
    padding: '40px',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    maxWidth: '600px',
    width: '100%',
    textAlign: 'center',
  },
  successContainer: {
    color: '#28a745',
  },
  failedContainer: {
    color: '#dc3545',
  },
  successIcon: {
    fontSize: '50px',
    color: '#28a745',
    marginBottom: '20px',
  },
  failedIcon: {
    fontSize: '50px',
    color: '#dc3545',
    marginBottom: '20px',
  },
  title: {
    fontSize: '24px',
    marginBottom: '10px',
    fontWeight: 'bold',
  },
  text: {
    fontSize: '16px',
    marginBottom: '20px',
    color: '#555',
  },
  orderDetails: {
    marginTop: '30px',
    textAlign: 'left',
  },
  orderDetailsTitle: {
    fontSize: '18px',
    marginBottom: '10px',
    fontWeight: 'bold',
  },
  orderItems: {
    listStyleType: 'none',
    paddingLeft: '0',
    marginBottom: '20px',
  },
  total: {
    fontSize: '18px',
    fontWeight: 'bold',
  },
  retryButton: {
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
  },
};

export default OrderStatus;
