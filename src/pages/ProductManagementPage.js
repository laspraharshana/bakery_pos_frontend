import React, { useState, useEffect } from 'react';
import styles from './ProductManagementPage.module.css'; // We'll create this CSS module

function ProductManagementPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    price: '',
    stockQuantity: '' // Let's include stock here for now
  });

 // Declare fetchProducts outside the useEffect
  const fetchProducts = async () => {
    setLoading(true);
    setError(null); // Reset error before fetching
    try {
      // Replace with your actual API endpoint
      const response = await fetch('http://localhost:8080/api/products/');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setProducts(data);
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(); // Call fetchProducts when the component mounts
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewProduct(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAddProduct = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/products/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProduct),
      });
      if (response.ok) {
        // If successful, fetch the updated product list
        fetchProducts();
        // Clear the form
        setNewProduct({ name: '', category: '', price: '', stockQuantity: '' });
      } else {
        const errorData = await response.json();
        setError(`Error adding product: ${errorData.message || response.statusText}`);
      }
    } catch (err) {
      setError(`Error adding product: ${err.message}`);
    }
  };

  if (loading) {
    return <div>Loading products...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error: {error.message}</div>;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Product Management</h2>

      <div className={styles.addProductForm}>
        <h3>Add New Product</h3>
        <label htmlFor="name">Name:</label>
        <input type="text" id="name" name="name" value={newProduct.name} onChange={handleInputChange} />

        <label htmlFor="category">Category:</label>
        <input type="text" id="category" name="category" value={newProduct.category} onChange={handleInputChange} />

        <label htmlFor="price">Price:</label>
        <input type="number" id="price" name="price" value={newProduct.price} onChange={handleInputChange} />

        <label htmlFor="stockQuantity">Stock Quantity:</label>
        <input type="number" id="stockQuantity" name="stockQuantity" value={newProduct.stockQuantity} onChange={handleInputChange} />

        <button onClick={handleAddProduct} className={styles.addButton}>Add Product</button>
      </div>

      <div className={styles.productList}>
        <h3>Current Products</h3>
        {products.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock Quantity</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.productId}>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>${product.price.toFixed(2)}</td>
                  <td>{product.stockQuantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No products available.</p>
        )}
      </div>
    </div>
  );
}

export default ProductManagementPage;