import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { login } from '../assets/images/quickcab.png';
import { useAuth } from '../context/AuthContext';
import '../styles/AdminLogin.css';
import logo from '../assets/images/quickcab.png';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = (e) => {
    e.preventDefault();
    if (login(username, password)) {
      navigate('/dashboard');
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div className='admin-login-container'>
      <div className='admin-login-box'>
        <img src={logo} alt="Quick Cabs Logo" className="admin-logo" />
        <h2>Admin Login</h2>
        <form onSubmit={handleLogin}>
          <div>
            <label>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;