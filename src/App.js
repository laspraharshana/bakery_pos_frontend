import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import LoginForm from './components/Auth/LoginForm';
import SignupForm from './components/Auth/SignupForm';
import DashboardPage from './pages/DashboardPage';
import OrderEntryPage from './pages/OrderEntryPage';
import InventoryPage from './pages/InventoryPage';
import ProductManagementPage from './pages/ProductManagementPage';
import RecentOrdersPage from './pages/RecentOrdersPage';
import ReportsPage from './pages/ReportsPage';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (token) => {
    localStorage.setItem('jwtToken', token);
    setIsAuthenticated(true);
    navigate('/dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    setIsAuthenticated(false);
    navigate('/login');
  };

  const PrivateRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/login" replace />;
  };

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />
        <Route path="/signup" element={<SignupForm />} />

        {/* Private Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardPage handleLogout={handleLogout} />
            </PrivateRoute>
          }
        />
        <Route
          path="/order-entry"
          element={
            <PrivateRoute>
              <OrderEntryPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/inventory"
          element={
            <PrivateRoute>
              <InventoryPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/product-management"
          element={
            <PrivateRoute>
              <ProductManagementPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/recent-orders"
          element={
            <PrivateRoute>
              <RecentOrdersPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <PrivateRoute>
              <ReportsPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
