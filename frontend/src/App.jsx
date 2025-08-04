import React, { useState } from 'react';
import Dashboard from './pages/Dashboard';
import Login from './components/Login';
import './App.css';

function App() {
  const [user, setUser] = useState(() => localStorage.getItem('user') || '');

  const handleLogin = (username) => {
    setUser(username);
    localStorage.setItem('user', username);
  };
  const handleLogout = () => {
    setUser('');
    localStorage.removeItem('user');
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return <Dashboard user={user} onLogout={handleLogout} />;
}

export default App;
