import React, { useState } from 'react';
import { EyeIcon, EyeSlashIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { motion } from 'framer-motion';

const PasswordChange = () => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [show, setShow] = useState({
    old: false,
    new: false,
    confirm: false
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (message) setMessage('');
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!formData.oldPassword || !formData.newPassword || !formData.confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (formData.newPassword.length < 6) {
      setError('New password must be at least 6 characters long');
      return;
    }

    if (formData.oldPassword === formData.newPassword) {
      setError('New password must be different from old password');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/api/update-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Password updated successfully!');
        setFormData({
          oldPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        setError(data.error || 'Failed to update password');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "w-full pl-12 pr-12 py-3 border-none rounded-xl text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200 shadow-sm";
  const iconClasses = "absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none";

  return (
    <div className="min-h-[400px] w-full max-w-md mx-auto p-8 bg-white/60 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-200 relative overflow-hidden">
      <div className="absolute inset-0 bg-blue-100 opacity-30 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
      
      <motion.h2
        className="text-3xl font-bold text-center text-gray-800 mb-8 tracking-tight"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Change Password
      </motion.h2>

      {message && (
        <motion.div
          className="bg-green-100 border border-green-200 text-green-700 px-5 py-3 rounded-xl mb-4 text-sm font-medium flex items-center gap-3"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
          {message}
        </motion.div>
      )}

      {error && (
        <motion.div
          className="bg-red-100 border border-red-200 text-red-700 px-5 py-3 rounded-xl mb-4 text-sm font-medium flex items-center gap-3"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/></svg>
          {error}
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Old password */}
        <div className="relative">
          <input
            type={show.old ? "text" : "password"}
            name="oldPassword"
            value={formData.oldPassword}
            onChange={handleChange}
            placeholder="Current password"
            className={inputClasses}
            autoComplete="current-password"
            required
          />
          <LockClosedIcon className={iconClasses + " w-5 h-5"} />
          <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors" onClick={() => setShow(s => ({ ...s, old: !s.old }))}>
            {show.old ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
          </button>
        </div>

        {/* New password */}
        <div className="relative">
          <input
            type={show.new ? "text" : "password"}
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            placeholder="New password (min 6 chars)"
            className={inputClasses}
            autoComplete="new-password"
            required
          />
          <LockClosedIcon className={iconClasses + " w-5 h-5"} />
          <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors" onClick={() => setShow(s => ({ ...s, new: !s.new }))}>
            {show.new ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
          </button>
        </div>

        {/* Confirm password */}
        <div className="relative">
          <input
            type={show.confirm ? "text" : "password"}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm password"
            className={inputClasses}
            autoComplete="new-password"
            required
          />
          <LockClosedIcon className={iconClasses + " w-5 h-5"} />
          <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors" onClick={() => setShow(s => ({ ...s, confirm: !s.confirm }))}>
            {show.confirm ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
          </button>
        </div>
        
        <motion.button
          type="submit"
          disabled={loading}
          className={clsx(
            "w-full py-3 mt-2 rounded-xl text-white font-semibold transition-all duration-300 transform-gpu",
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 active:scale-95 shadow-lg hover:shadow-xl"
          )}
          whileHover={{ scale: loading ? 1 : 1.02 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-3">
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              Updating...
            </span>
          ) : (
            'Update Password'
          )}
        </motion.button>
      </form>
      
      <div className="mt-6 text-center text-gray-500 text-sm bg-gray-100 p-4 rounded-xl">
        <p className="font-medium text-gray-600">Requirements:</p>
        <p className="mt-1">
          Minimum 6 characters • Must be different from your current password
        </p>
      </div>
    </div>
  );
};

export default PasswordChange;