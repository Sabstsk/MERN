import React, { useState } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { UserIcon, LockClosedIcon } from '@heroicons/react/24/outline';

const Login = ({ onLogin }) => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${apiUrl}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (response.ok && data.token) {
        localStorage.setItem('token', data.token);
        onLogin(username);
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "w-full pl-12 pr-4 py-3 border-none rounded-xl text-sm bg-gray-50/70 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200 shadow-sm";

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
      {/* Background Image Container */}
      <div 
        className="absolute inset-0 bg-cover bg-center" 
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2070&auto=format&fit=crop')" }}
      >
        {/* Semi-transparent Overlay */}
        <div className="absolute inset-0 bg-blue-900 opacity-60"></div>
        {/* Blur Effect */}
        <div className="absolute inset-0 backdrop-blur-md"></div>
      </div>
      
      <motion.div
        className="relative w-full max-w-sm mx-auto p-8 bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-center text-white mb-8 tracking-tight">Login</h2>
        
        {error && (
          <motion.div
            className="bg-red-100 border border-red-200 text-red-700 px-5 py-3 rounded-xl mb-6 text-sm font-medium"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className={inputClasses + " text-gray-800 placeholder-gray-500"}
              required
            />
            <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
          </div>

          <div className="relative">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className={inputClasses + " text-gray-800 placeholder-gray-500"}
              required
            />
            <LockClosedIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            className={clsx(
              "w-full py-3 mt-4 rounded-xl text-white font-semibold transition-all duration-300 transform-gpu",
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 active:scale-95 shadow-lg hover:shadow-xl"
            )}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-3">
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Logging in...
              </span>
            ) : (
              'Login'
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;