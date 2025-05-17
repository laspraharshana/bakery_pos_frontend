import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom'; // Using NavLink for active class
import styles from './Sidebar.module.css';

function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <aside className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}>
      <div className={styles.logoAndToggleButton}>
        <h2 className={styles.logo}>Bakery POS</h2>
        <button className={styles.toggleButton} onClick={toggleCollapse}>
          {isCollapsed ? '▶' : '◀'}
        </button>
      </div>
      <ul className={styles.navList}>
        <li className={styles.navItem}>
          <NavLink to="/" className={styles.navLink} activeClassName={styles.active} end>
            <span>Dashboard</span>
          </NavLink>
        </li>
        <li className={styles.navItem}>
          <NavLink to="/order-entry" className={styles.navLink} activeClassName={styles.active}>
            <span>Order Entry</span>
          </NavLink>
        </li>
        <li className={styles.navItem}>
          <NavLink to="/recent-orders" className={styles.navLink} activeClassName={styles.active}>
            <span>Recent Orders</span>
          </NavLink>
        </li>
        <li className={styles.navItem}>
          <NavLink to="/inventory" className={styles.navLink} activeClassName={styles.active}>
            <span>Inventory</span>
          </NavLink>
        </li>
        <li className={styles.navItem}>
          <NavLink to="/product-management" className={styles.navLink} activeClassName={styles.active}>
            <span>Product MS</span>
          </NavLink>
        </li>
        <li className={styles.navItem}>
          <NavLink to="/reports" className={styles.navLink} activeClassName={styles.active}>
            <span>Reports</span>
          </NavLink>
        </li>
        {/* Add more navigation items here */}
      </ul>
    </aside>
  );
}

export default Sidebar;