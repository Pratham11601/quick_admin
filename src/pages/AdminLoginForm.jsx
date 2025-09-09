import React, { useState } from 'react';

const AdminLoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const submitHandler = (e) => {
    e.preventDefault();
    onLogin(username, password);
  };

  return (
    <>
      <h2>Admin Login</h2>
      <form onSubmit={submitHandler}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••"
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </>
  );
};

export default AdminLoginForm;
