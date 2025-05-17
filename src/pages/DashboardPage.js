import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import OrderEntryPage from './OrderEntryPage';
<<<<<<< HEAD
import { Routes, Route, Link } from 'react-router-dom';
import styles from './DashboardPage.module.css';
import InventoryPage from './InventoryPage';
import ProductManagementPage from './ProductManagementPage';
import RecentOrdersPage from './RecentOrdersPage';
import ReportsPage from './ReportsPage';
import { FaPlusCircle, FaChartBar, FaBell, FaExclamationTriangle, FaMoneyBillWave } from 'react-icons/fa';
import PendingOrdersPage from '../components/PendingOrdersPage';
import PaymentPage from '../components/PaymentPage';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function DashboardPage() {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentAlertIndex, setCurrentAlertIndex] = useState(0);
    const [generalAlerts, setGeneralAlerts] = useState([
        { id: 1, message: 'New Promotion: 15% off all pastries today!' },
    ]);
    const [inventoryData, setInventoryData] = useState([]);
    const [lowStockAlerts, setLowStockAlerts] = useState([]);
    const [allAlerts, setAllAlerts] = useState([...generalAlerts]);
    const [todaySalesData, setTodaySalesData] = useState(null);
    const [salesTrendData, setSalesTrendData] = useState([]);

    // Grab token from localStorage (adjust key name if needed)
    const token = localStorage.getItem('jwtToken');

    // Helper to fetch with Authorization header
    const fetchWithAuth = async (url, options = {}) => {
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            ...options.headers,
        };
        return fetch(url, { ...options, headers });
    };

    // Fetch dashboard overview data
    const fetchDashboardData = async () => {
        try {
            const response = await fetchWithAuth('http://localhost:8080/api/dashboard');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            setDashboardData(data);
            setLoading(false);
        } catch (e) {
            setError(e);
            setLoading(false);
        }
    };

    // Fetch inventory list
    const fetchInventoryData = async () => {
        try {
            const response = await fetchWithAuth('http://localhost:8080/api/inventory');
            if (!response.ok) {
                console.error('Failed to fetch inventory data:', response.status);
                return;
            }
            const data = await response.json();
            setInventoryData(data);
        } catch (error) {
            console.error('Error fetching inventory data:', error);
        }
    };

    // Fetch daily sales summary
    const fetchDailySales = async () => {
        try {
            const response = await fetchWithAuth('http://localhost:8080/api/orders/sales/daily');
            if (!response.ok) {
                console.error('Failed to fetch daily sales:', response.status);
                return;
            }
            const data = await response.json();
            setTodaySalesData(data);
            console.log("Daily Sales Data:", data);
        } catch (error) {
            console.error('Error fetching daily sales:', error);
        }
    };

    // Fetch today's sales trend data for charts
    const fetchSalesTrendData = async () => {
        try {
            const response = await fetchWithAuth('http://localhost:8080/api/orders/sales/trend/today');
            if (!response.ok) {
                console.error('Failed to fetch today\'s sales trend:', response.status);
                return;
            }
            const data = await response.json();
            setSalesTrendData(data);
            console.log("Today's Sales Trend Data:", data);
        } catch (error) {
            console.error('Error fetching today\'s sales trend:', error);
        }
    };

    // Check if product stock is low
    const isLowStock = (product) => product.stockQuantity !== undefined && product.stockQuantity < 5;

    useEffect(() => {
        // Initial fetches
        fetchDashboardData();
        fetchInventoryData();
        fetchDailySales();
        fetchSalesTrendData();

        // Polling every 5 seconds
        const intervalId = setInterval(() => {
            fetchDashboardData();
            fetchInventoryData();
            fetchDailySales();
            fetchSalesTrendData();
        }, 5000);

        return () => clearInterval(intervalId);
    }, []);

    // Update low stock alerts when inventory data changes
    useEffect(() => {
        const lowStockMessages = inventoryData
            .filter(isLowStock)
            .map(item => ({
                id: `low-stock-${item.inventoryId || item.id || item.name}`,
                message: `Low Stock: ${item.name} has only ${item.stockQuantity} remaining!`,
                type: 'low-stock',
            }));
        setLowStockAlerts(lowStockMessages);
    }, [inventoryData]);

    // Cycle through alerts every 3 seconds
    useEffect(() => {
        const intervalId = setInterval(() => {
            if (allAlerts.length > 0) {
                setCurrentAlertIndex((prevIndex) => (prevIndex + 1) % allAlerts.length);
            }
        }, 3000);
        return () => clearInterval(intervalId);
    }, [allAlerts]);

    // Combine general and low stock alerts
    useEffect(() => {
        setAllAlerts([...generalAlerts, ...lowStockAlerts]);
    }, [generalAlerts, lowStockAlerts]);

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
                            {allAlerts.length > 0 && <span className={styles.alertCount}>{allAlerts.length}</span>}
                        </button>
                    </div>
                </div>

                <div className={styles.dataOverview}>
                    <div className={`${styles.infoCard} ${styles.pendingOrdersCard}`}>
                        <h3 className={styles.label}>Pending Orders</h3>
                        <Link to="/pending-orders" className={styles.value} style={{ textDecoration: 'none', color: 'inherit' }}>
                            {dashboardData?.pendingOrders ?? '0'}
                        </Link>
                    </div>

                    <div className={styles.infoCard}>
                        <h3 className={styles.label}><FaMoneyBillWave className={styles.sectionIcon} /> Today's Sales</h3>
                        {todaySalesData ? (
                            <>
                                <span className={styles.value}>${todaySalesData.totalSales?.toFixed(2) ?? '0.00'}</span>
                                <span className={styles.subValue}>({todaySalesData.reportDate ? new Date(todaySalesData.reportDate).toLocaleDateString() : 'N/A'}, {todaySalesData.transactionCount ?? 'N/A'} Transactions)</span>
                            </>
                        ) : (
                            <p>No sales data yet.</p>
                        )}
                    </div>

                    <div className={`${styles.infoCard} ${styles.alertsCard}`}>
                        <h3 className={styles.label}><FaExclamationTriangle className={styles.sectionIcon} /> Alerts</h3>
                        {allAlerts.length > 0 ? (
                            <p key={allAlerts[currentAlertIndex].id}>
                                {allAlerts[currentAlertIndex].message}
                            </p>
                        ) : (
                            <p>No new alerts.</p>
                        )}
                    </div>

                    <div className={`${styles.infoCard} ${styles.salesTrendCard}`}>
                        <h3 className={styles.label}><FaChartBar className={styles.sectionIcon} /> Today's Sales Trend</h3>
                        {salesTrendData && salesTrendData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={200}>
                                <LineChart data={salesTrendData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="time" />
                                    <YAxis tickFormatter={(value) => `$${value.toFixed(2)}`} />
                                    <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                                    <Line type="monotone" dataKey="sales" stroke="#8884d8" activeDot={{ r: 8 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <p>No sales trend data available yet.</p>
                        )}
                    </div>
                </div>

                <Routes>
                    <Route path="/order-entry" element={<OrderEntryPage />} />
                    <Route path="/recent-orders" element={<RecentOrdersPage />} />
                    <Route path="/inventory" element={<InventoryPage />} />
                    <Route path="/product-management" element={<ProductManagementPage />} />
                    <Route path="/reports" element={<ReportsPage />} />
                    <Route path="/pending-orders" element={<PendingOrdersPage />} />
                    <Route path="/pay/:orderId" element={<PaymentPage />} />
                </Routes>
            </main>
        </div>
    );
}

export default DashboardPage;
=======
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
>>>>>>> 4d7b2222d4f1bc1b79e8cb360cf1274be094b99f
