import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { PhoneIcon, TrashIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

// Use import.meta.env for Vite-based projects
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const PhoneNumberEditor = () => {
  const [number, setNumber] = useState('');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');
  const [success, setSuccess] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchNumber = () => {
    setLoading(true);
    axios.get(`${API_URL}/api/number/web`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    })
    .then(res => {
      const fetchedNumber = res.data || '';
      setNumber(fetchedNumber);
      setInput(fetchedNumber);
      setLoading(false);
    })
    .catch(err => {
      const msg = (err.response?.data?.message) || 'Failed to fetch number';
      setError(msg);
      setNumber('');
      setInput('');
      setLoading(false);
      setTimeout(() => setError(null), 2500);
    });
  };

  useEffect(() => {
    fetchNumber();
  }, []);

  const handleUpdate = async () => {
    setIsUpdating(true);
    setError(null);
    setSuccess('');
    try {
      const response = await axios.put(`${API_URL}/api/number`, { number: input }, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });
      if (response.data.success) {
        setSuccess('Number updated successfully!');
        setNumber(input);
      } else {
        const msg = response.data.message || 'Update failed: Unknown error';
        setError(msg);
      }
    } catch (err) {
      const msg = (err.response?.data?.message) || 'Failed to update number';
      setError(msg);
    } finally {
      setIsUpdating(false);
      setTimeout(() => {
        setSuccess('');
        setError(null);
      }, 2500);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);
    setSuccess('');
    try {
      const response = await axios.delete(`${API_URL}/api/number`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });
      if (response.data.success) {
        setSuccess('Number deleted successfully!');
        setNumber('');
        setInput('');
      } else {
        setError('Delete failed: ' + (response.data.message || 'Unknown error'));
      }
    } catch (err) {
      const msg = (err.response?.data?.message) || 'Failed to delete number';
      setError(msg);
    } finally {
      setIsDeleting(false);
      setTimeout(() => {
        setSuccess('');
        setError(null);
      }, 2500);
    }
  };

  const inputClasses = "flex-1 w-full pl-12 pr-4 py-3 border-none rounded-xl text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200 shadow-sm";
  const buttonBaseClasses = "py-3 px-4 rounded-xl text-white font-semibold transition-all duration-200 transform-gpu active:scale-95 shadow-md";

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-500"></div>
      </div>
    );
  }

  return (
    <motion.div 
      className="w-full max-w-md mx-auto p-4 sm:p-6 bg-white rounded-2xl shadow-xl border border-gray-200"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Edit Phone Number</h2>
      
      <AnimatePresence>
        {success && (
          <motion.div
            className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-4 text-sm"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <CheckCircleIcon className="h-5 w-5" />
            {success}
          </motion.div>
        )}
        {error && (
          <motion.div
            className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <XCircleIcon className="h-5 w-5" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col sm:flex-row items-center gap-3 mb-4">
        <div className="relative w-full sm:flex-1">
          <input
            type="tel"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Enter phone number"
            className={inputClasses}
          />
          <PhoneIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
        
        <motion.button
          onClick={handleUpdate}
          disabled={isUpdating || isDeleting}
          className={clsx(
            buttonBaseClasses,
            'bg-blue-600 hover:bg-blue-700 w-full sm:w-auto',
            (isUpdating || isDeleting) && 'opacity-60 cursor-not-allowed'
          )}
          whileHover={{ scale: (isUpdating || isDeleting) ? 1 : 1.05 }}
          whileTap={{ scale: (isUpdating || isDeleting) ? 1 : 0.95 }}
        >
          {isUpdating ? 'Updating...' : 'Update'}
        </motion.button>
        
        <motion.button
          onClick={handleDelete}
          disabled={isUpdating || isDeleting || !number}
          className={clsx(
            buttonBaseClasses,
            'bg-red-500 hover:bg-red-600 px-4 w-full sm:w-auto flex items-center justify-center gap-2',
            (isUpdating || isDeleting || !number) && 'opacity-60 cursor-not-allowed'
          )}
          title="Delete number"
          whileHover={{ scale: (isUpdating || isDeleting || !number) ? 1 : 1.05 }}
          whileTap={{ scale: (isUpdating || isDeleting || !number) ? 1 : 0.95 }}
        >
          <TrashIcon className="h-5 w-5" />
          <span>Delete</span>
        </motion.button>
      </div>

      <div className="text-center text-sm text-gray-600 bg-gray-50 p-4 rounded-xl mt-4">
        Current number: <span className="font-semibold text-gray-800">{number || 'Not set'}</span>
      </div>
    </motion.div>
  );
};

export default PhoneNumberEditor;