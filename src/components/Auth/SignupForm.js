import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import './Auth.css'; // Assuming you have some CSS for styling

function SignupForm() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null); // To store any error messages
  const [loading, setLoading] = useState(false); // To show a loading state
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setError(null); // Clear any previous errors
    setLoading(true); // Set loading to true, disable the button

    // Basic client-side validation (you should also have server-side validation)
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      setLoading(false);
      return;
    }

    try {
      // 1. Make the API call to your backend's signup endpoint (/api/auth/signup)
      const response = await fetch('/api/auth/signup', {
        method: 'POST', // Use the POST method for signup
        headers: {
          'Content-Type': 'application/json', // Tell the server we're sending JSON data
        },
        body: JSON.stringify({ username, email, password }), // Send the data
      });

      // 2. Handle the response from the server
      if (!response.ok) {
        // If the response is not OK (e.g., 400 Bad Request, 500 Server Error)
        const errorData = await response.json();
        throw new Error(errorData.error || 'Signup failed. Please check your information.'); // Use the server's error message
      }

      // If the signup is successful (response.ok is true)
      // const data = await response.json();  // You might get a success message from the server, but we don't need the token here.

      // 3.  Redirect the user to the login page (Important!)
      navigate('/login'); // Redirect to login.  Signup and login are separate.

    } catch (error) {
      // 4. Handle any errors that occurred during the fetch operation or in the response
      setError(error.message); // Set the error message to be displayed
      console.error('Signup error:', error);
    } finally {
      setLoading(false); // Set loading to false, re-enable the button
    }
  };

  return (
    <div className="auth-form-container">
      <h2>Sign Up for Bakery POS</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <p>
          Already have an account? <a href="/login">Login</a>
        </p>
      </form>
    </div>
  );
}

export default SignupForm;
