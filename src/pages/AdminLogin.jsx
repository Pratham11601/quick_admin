import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminLogin.css';
import logo from '../assets/images/quickcab.png'; // Ensure correct import path

const AdminLogin = () => {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/dashboard'); // Redirect to the dashboard on login click
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-box">
        <img src={logo} alt="Quick Cabs Logo" className="admin-logo" />
        <h2>Admin Login</h2>
        <form onSubmit={handleLogin}>
          <input type="email" placeholder="Email" required className="admin-input" />
          <input type="password" placeholder="Password" required className="admin-input" />
          <button type="submit" className="admin-button">Login</button>
        </form>
        {/* <a href="#" className="admin-forgot-password">Forgot Password?</a> */}
      </div>
    </div>
  );
};

export default AdminLogin;
