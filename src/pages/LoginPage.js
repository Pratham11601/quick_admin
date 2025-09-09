import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/AdminLogin.css';
import logo from '../assets/images/quickcab.png';
import AdminLoginForm from './AdminLoginForm';
import SubAdminLoginForm from './SubAdminLoginForm';

const LoginPage = () => {
  const [activeTab, setActiveTab] = useState('admin'); // 'admin' | 'sub-admin'
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = (username, password, role) => {
    const success = login(username, password, role);
    if (success) {
      navigate('/dashboard');
    } else {
      alert(`Invalid ${role} credentials`);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-box">
        <img src={logo} alt="Quick Cabs Logo" className="admin-logo" />

        {/* Tabs */}
        <div className="login-tabs">
          <button
            className={activeTab === 'admin' ? 'active' : ''}
            onClick={() => setActiveTab('admin')}
          >
            Admin
          </button>
          <button
            className={activeTab === 'sub-admin' ? 'active' : ''}
            onClick={() => setActiveTab('sub-admin')}
          >
            Sub-Admin
          </button>
        </div>

        {activeTab === 'admin' ? (
          <AdminLoginForm onLogin={(u, p) => handleLogin(u, p, 'admin')} />
        ) : (
          <SubAdminLoginForm onLogin={(u, p) => handleLogin(u, p, 'sub-admin')} />
        )}
      </div>
    </div>
  );
};

export default LoginPage;
