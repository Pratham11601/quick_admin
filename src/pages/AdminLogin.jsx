<<<<<<< HEAD
import React from 'react';
=======
import React, { useState } from 'react';
>>>>>>> 98af867 (Added new updates to NevDev branch)
import { useNavigate } from 'react-router-dom';
import '../styles/AdminLogin.css';
import logo from '../assets/images/quickcab.png'; // Ensure correct import path

const AdminLogin = () => {
  const navigate = useNavigate();
<<<<<<< HEAD

  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/dashboard'); // Redirect to the dashboard on login click
=======
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('adminToken', data.token); // Store token if needed
        navigate('/category'); // Redirect to category page
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      setError('Server error. Please try again later.');
    }
>>>>>>> 98af867 (Added new updates to NevDev branch)
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-box">
        <img src={logo} alt="Quick Cabs Logo" className="admin-logo" />
        <h2>Admin Login</h2>
<<<<<<< HEAD
        <form onSubmit={handleLogin}>
          <input type="email" placeholder="Email" required className="admin-input" />
          <input type="password" placeholder="Password" required className="admin-input" />
          <button type="submit" className="admin-button">Login</button>
        </form>
        {/* <a href="#" className="admin-forgot-password">Forgot Password?</a> */}
=======
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleLogin}>
          <input 
            type="email" 
            placeholder="Email" 
            required 
            className="admin-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input 
            type="password" 
            placeholder="Password" 
            required 
            className="admin-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="admin-button">Login</button>
        </form>
        <a href="#" className="admin-forgot-password">Forgot Password?</a>
>>>>>>> 98af867 (Added new updates to NevDev branch)
      </div>
    </div>
  );
};

export default AdminLogin;
