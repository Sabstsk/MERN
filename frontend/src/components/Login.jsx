import React, { useState } from 'react';

const Login = ({ onLogin }) => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch(`${apiUrl}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (response.ok && data.token) {
        localStorage.setItem('token', data.token);
        onLogin(username); // Optionally pass token
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Network error');
    }
  };


  return (
    <div className="login-bg">
      <form onSubmit={handleSubmit} className="login-card">
        <h2 className="login-title">Login</h2>
        {error && <div className="login-error">{error}</div>}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="login-btn">Login</button>
      </form>
    </div>
  );
};

export default Login;
