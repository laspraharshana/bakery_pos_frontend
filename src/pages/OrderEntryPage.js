import React, { useState, useEffect } from 'react';
import styles from './OrderEntryPage.module.css';

function OrderEntryPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categories, setCategories] = useState(['All']); // Initialize with 'All'
  const [orderItems, setOrderItems] = useState([]); // State to hold items in the order

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/products/');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProducts(data);
        setLoading(false);

        // Extract unique categories from the product data
        const uniqueCategories = [...new Set(data.map(product => product.category))];
        setCategories(['All', ...uniqueCategories]);
      } catch (e) {
        setError(e);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };
  const handleAddToOrder = (product) => {
    const existingItem = orderItems.find(item => item.productId === product.productId);

    if (existingItem) {
      // If the item is already in the order, increase the quantity
      setOrderItems(
        orderItems.map(item =>
          item.productId === product.productId ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      // If the item is not in the order, add it with a quantity of 1
      setOrderItems([...orderItems, { ...product, quantity: 1 }]);
    }
  }; 
  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity >= 1) {
      setOrderItems(
        orderItems.map(item =>
          item.productId === productId ? { ...item, quantity: parseInt(newQuantity) } : item
        )
      );
    } else if (newQuantity === 0) {
        handleRemoveItem(productId); // Call remove function if quantity is set to 0
    }
  };
  const handleRemoveItem = (productId) => {
    setOrderItems(orderItems.filter(item => item.productId !== productId));
  };
  const calculateSubtotal = () => {
    return orderItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };
const handlePlaceOrder = async () => {
        if (orderItems.length > 0) {
            const orderData = {
                orderItems: orderItems.map(item => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    itemPrice: item.price // Assuming you want to send the current price
                })),
                totalAmount: calculateSubtotal()
            };
            // Get the selected payment method
    const paymentMethod = document.querySelector(`.${styles.paymentSelect}`).value;

            try {
                const response = await fetch('http://localhost:8080/api/orders/place', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(orderData),
                });
                console.log('response.ok:', response.ok);
                if (response.ok) {
                    const result = await response.json();
                    console.log('Order placed successfully:', result);
                     alert(`SUCCESSFUL ORDER!\nPayment Method: ${paymentMethod}`); // Include payment method
                    setOrderItems([]); // Clear the order after successful submission
                } else {
                    console.error('Failed to place order:', response.status);
                    alert('Failed to place order.');
                }
            } catch (error) {
                console.error('There was an error placing the order:', error);
                alert('There was an error placing the order.');
            }
        } else {
            alert('Your order is empty. Please add items to the order.');
        }
    };

  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter(product => product.category === selectedCategory);

  if (loading) {
    return <div>Loading products...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className={styles.orderEntryContainer}>
      <aside className={styles.categorySidebar}>
        <h2>Categories</h2>
        <ul>
          {categories.map(category => (
            <li
              key={category}
              className={selectedCategory === category ? styles.active : ''}
              onClick={() => handleCategoryClick(category)}
            >
              {category}
            </li>
          ))}
        </ul>
      </aside>
      <main className={styles.productGrid}>
        {filteredProducts.map(product => (
          <div key={product.productId} className={styles.productCard}>
            {product.imageUrl && <img src={product.imageUrl} alt={product.name} className={styles.productImage} />}
            <h3 className={styles.productName}>{product.name}</h3>
            <p className={styles.productPrice}>${product.price.toFixed(2)}</p>
            <button className={styles.addToOrderButton}onClick={() => handleAddToOrder(product)}>Add to Order</button>
          </div>
        ))}
      </main>
      <aside className={styles.orderSummary}>
        <h2>Order Summary</h2>
        {orderItems.length === 0 ? (
          <p>Your order is empty.</p>
        ) : (
            <div>
            <ul>
              {orderItems.map(item => (
                <li key={item.productId} className={styles.orderItem}>
                  <div className={styles.itemDetails}>
                    <span className={styles.itemName}>{item.name}</span>
                    <span className={styles.itemQuantity}>Quantity: {item.quantity}</span>
                    <span className={styles.itemIndividualPrice}>(${item.price.toFixed(2)} each)</span>
                  </div>
                  <div className={styles.itemControls}>
                    <div className={styles.quantityControls}>
                      <button onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}>-</button>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.productId, e.target.value)}
                        className={styles.quantityInput}
                      />
                      <button onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}>+</button>
                    </div>
                    <span className={styles.itemPrice}>${ (item.price * item.quantity).toFixed(2) }</span>
                    <button className={styles.removeItemButton} onClick={() => handleRemoveItem(item.productId)}>
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <div className={styles.totalSection}>
              <hr />
              <p>Subtotal: ${calculateSubtotal().toFixed(2)}</p>
              <p>Total: ${calculateSubtotal().toFixed(2)}</p>
               {/* Add Payment Options Here */}
            <div className={styles.paymentOptions}>
            <h3>Payment Method</h3>
             <select className={styles.paymentSelect}>
             <option value="cash">Cash</option>
             <option value="card">Credit Card</option>
             <option value="mobile">Mobile Payment</option>
            </select>
            </div>





              <button className={styles.placeOrderButton} onClick={handlePlaceOrder}>
                                Place Order
                            </button>
            </div>
          </div>
        )}
        
      </aside>
    </div>
  );
}

export default OrderEntryPage;