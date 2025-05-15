import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import OrderEntryPage from './OrderEntryPage';
import { Routes, Route, Link } from 'react-router-dom'; // Import Link
import styles from './DashboardPage.module.css';
import InventoryPage from './InventoryPage';
import ProductManagementPage from './ProductManagementPage';
import RecentOrdersPage from './RecentOrdersPage'; 
import ReportsPage from './ReportsPage';
import { FaPlusCircle, FaChartBar, FaBell } from 'react-icons/fa'; // Example icons

function DashboardPage() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alerts, setAlerts] = useState([
    { id: 1, message: 'New Promotion: 15% off all pastries today!' },
    // Add more alerts as needed
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/dashboard');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setDashboardData(data);
        setLoading(false);
      } catch (e) {
        setError(e);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading dashboard data...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className={styles.dashboardContainer}>
      <Sidebar />
      <main className={styles.mainContent}>
        <div className={styles.dashboardHeader}>
          <h1 className={styles.title}>Bakery POS Dashboard</h1>
          <div className={styles.headerActions}>
            <Link to="/order-entry" className={styles.newOrderButton}>
              <FaPlusCircle className={styles.buttonIcon} /> New Order
            </Link>
            <button className={styles.alertsButton}>
              <FaBell className={styles.buttonIcon} />
              {alerts.length > 0 && <span className={styles.alertCount}>{alerts.length}</span>}
            </button>
            {/* Add more header actions if needed */}
          </div>
        </div>
        <div className={styles.dataOverview}>
          <div className={`${styles.infoCard} ${styles.pendingOrdersCard}`}>
            <span className={styles.label}>Pending Orders:</span>
            <span className={styles.value}>{dashboardData?.pendingOrders ?? '0'}</span>
          </div>
          <div className={styles.infoCard}>
            <span className={styles.label}>Today's Sales:</span>
            <span className={styles.value}>${dashboardData?.totalSalesToday?.toFixed(2) ?? '0.00'}</span>
            <span className={styles.subValue}>({dashboardData?.salesTransactionsToday ?? '0'} Transactions)</span>
          </div>
          <div className={styles.alertsSection}>
            <h3><FaBell className={styles.sectionIcon} /> Alerts</h3>
            {alerts.length > 0 ? (
              <ul>
                {alerts.map(alert => (
                  <li key={alert.id}>{alert.message}</li>
                ))}
              </ul>
            ) : (
              <p>No new alerts.</p>
            )}
          </div>
          <div className={styles.salesSummaryCard}>
            <h3><FaChartBar className={styles.sectionIcon} /> Today's Sales Trend</h3>
            {/* Placeholder for a small sales trend chart */}
            <p>Sales data will be visualized here.</p>
          </div>
          <div className={styles.recentOrders}>
            <h2>Recent Delivered Orders</h2>
            {dashboardData?.recentDeliveredOrders && dashboardData.recentDeliveredOrders.length > 0 ? (
              <ul>
                {dashboardData.recentDeliveredOrders.map(order => (
                  <li key={order.id}>
                    Order ID: {order.id}, Time: {new Date(order.orderDate).toLocaleTimeString()}, Total: ${order.totalAmount.toFixed(2)}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No recent delivered orders.</p>
            )}
          </div>
        </div>
        <Routes> {/* Use Routes here */}
          <Route path="/order-entry" element={<OrderEntryPage />} />
          <Route path="/recent-orders" element={<RecentOrdersPage/>} />
          <Route path="/inventory" element={<InventoryPage/>} />
          <Route path="/product-management" element={<ProductManagementPage />} /> {/* Add this route */}
          <Route path="/reports" element={<ReportsPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default DashboardPage;