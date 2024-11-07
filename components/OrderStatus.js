import React from 'react';
import { useTranslation } from 'react-i18next';

const OrderStatus = ({ orderStatus }) => {
  const isSuccess = orderStatus === 'CAPTURED';
  const { t } = useTranslation("ordersconfirm");
  return (
    <div style={styles.container}>
      <div style={styles.card}>
      {isSuccess ? (
          <div style={styles.successContainer}>
            <svg style={styles.successIcon} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h1 style={styles.title}>{t('successTitle')}</h1>
            <p style={styles.text}>{t('successMessage1')}</p>
            <p style={styles.text}>{t('successMessage2')}</p>
            <div style={styles.orderDetails}>
              <h3 style={styles.orderDetailsTitle}>{t('orderSummary')}</h3>
              <ul style={styles.orderItems}>
                {orderItems.map((item, index) => (
                  <li key={index}>{item.name} - {item.price} {currency}</li>
                ))}
              </ul>
              <p style={styles.total}>{t('total')}: {total} {currency}</p>
            </div>
          </div>
        ) : (
          <div style={styles.failedContainer}>
            <svg style={styles.failedIcon} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <h1 style={styles.title}>{t('failedTitle')}</h1>
            <p style={styles.text}>{t('failedMessage1')}</p>
            <p style={styles.text}>{t('failedMessage2')}</p>
            <button style={styles.retryButton}>{t('tryAgain')}</button>
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
