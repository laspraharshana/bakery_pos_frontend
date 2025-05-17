import React, { useState, useEffect } from 'react';
import styles from './InventoryPage.module.css'; // Import the CSS module

function InventoryPage() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState(''); // State for the search term
  const [filteredInventory, setFilteredInventory] = useState([]); // State for the filtered inventory

// Get JWT token from localStorage
  const token = localStorage.getItem('jwtToken');

  // Helper fetch with auth header
  const fetchWithAuth = async (url, options = {}) => {
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    };
    return fetch(url, { ...options, headers });
  };



  useEffect(() => {
    const fetchInventoryData = async (category) => {
      setLoading(true);
      setError(null);
      try {
        const url = category ? `/api/inventory/category?category=${category}` : 'http://localhost:8080/api/inventory';
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setInventory(data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchInventoryData(selectedCategory);
  }, [selectedCategory]);

  useEffect(() => {
    // Filter the inventory based on the search term
    const filtered = inventory.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredInventory(filtered);
  }, [inventory, searchTerm]);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  if (loading) {
    return <div className={styles.loading}>Loading inventory...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error loading inventory: {error.message}</div>;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Inventory</h2>

      <div className={styles.filterAndSearch}>
        <div className={styles.filterContainer}>
          <label htmlFor="category-filter" className={styles.filterLabel}>
            Filter by Category:
          </label>
          <select
            id="category-filter"
            value={selectedCategory}
            onChange={handleCategoryChange}
            className={styles.filterSelect}
          >
            <option value="">All Categories</option>
            <option value="Cakes">Cakes</option>
            <option value="Breads">Breads</option>
            <option value="Pastries">Pastries</option>
          </select>
        </div>

        <div className={styles.searchContainer}>
          <label htmlFor="search-input" className={styles.searchLabel}>
            Search:
          </label>
          <input
            type="text"
            id="search-input"
            value={searchTerm}
            onChange={handleSearchChange}
            className={styles.searchInput}
            placeholder="Search by name"
          />
        </div>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Stock Quantity</th>
            <th>Price</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody>
          {filteredInventory.map(product => (
              <tr
                key={product.productId}
                className={product.stockQuantity <= 10 ? styles.lowStockRow : ''}
              >
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td className={product.stockQuantity <= 5 ? styles.criticalStock : ''}>
                  {product.stockQuantity}
                </td>
                <td>${product.price.toFixed(2)}</td>
                <td>
                  {product.imageUrl && (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className={styles.image}
                    />
                  )}
                </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default InventoryPage;