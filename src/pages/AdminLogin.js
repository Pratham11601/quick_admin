import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/images/quickcab.png'; 
import '../styles/AdminLogin.css';


const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    const isSuccess = login(email, password);

    if (isSuccess) {
      navigate('/dashboard');
    } else {
      setError('Invalid credentials');
    }
  };

  return (

    <div className="admin-login-container">
      <div className="admin-login-box">
        <img src={logo} alt="Quick Cabs Logo" className="admin-logo" />
        <h2>Admin Login</h2>

        <form onSubmit={handleSubmit}>
          <div>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <div style={{ color: 'red' }}>{error}</div>}
          <button type="submit">Login</button>
        </form>
      </div>
    </div>

  );
};

export default AdminLogin; 
