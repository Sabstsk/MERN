import React, { useState } from 'react';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simple hardcoded check (replace with real auth as needed)
    if (username === 'admin' && password === 'password') {
      onLogin(username);
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-full max-w-xs">
        <h2 className="text-lg font-bold mb-4 text-center">Login</h2>
        {error && <div className="text-red-500 mb-2 text-center">{error}</div>}
        <input
          type="text"
          placeholder="Username"
          className="w-full mb-2 px-3 py-2 border rounded"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 px-3 py-2 border rounded"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Login</button>
      </form>
    </div>
  );
};

export default Login;
