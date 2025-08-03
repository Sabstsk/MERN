import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Use import.meta.env for Vite-based projects
const API_URL = import.meta.env.VITE_API_URL;

const PhoneNumberEditor = () => {
  const [number, setNumber] = useState('');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');

  // ✅ Fetch function updated
  const fetchNumber = () => {
    setLoading(true);
    // ➡️ Fixed: Corrected API endpoint to '/api/number'
    axios.get(`${API_URL}/api/number`)
      .then(res => {
        // ➡️ Updated: Access res.data directly, as it is now a string.
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
        setTimeout(() => setError(''), 2500);
      });
  };

  useEffect(() => {
    fetchNumber();
  }, []);

  // ✅ Update function is working correctly
  const handleUpdate = async () => {
    try {
      const response = await axios.put(`${API_URL}/api/number`, { number: input });
      if (response.data.success) {
        setSuccess('Number updated!');
        setNumber(input);
        setTimeout(() => setSuccess(''), 2000);
      } else {
        const msg = response.data.message || 'Update failed: Unknown error';
        setError(msg);
        setTimeout(() => setError(''), 2500);
      }
    } catch (error) {
      const msg = (error.response?.data?.message) || 'Failed to update number';
      setError(msg);
      setTimeout(() => setError(''), 2500);
    }
  };

  // ✅ Delete function updated
  const handleDelete = () => {
    axios.delete(`${API_URL}/api/number`)
      .then(res => {
        // ➡️ Fixed: The backend sends a 'success' property, not a 'message'.
        if (res.data.success) {
          setSuccess('Number deleted!');
          setNumber('');
          setInput('');
        } else {
          setError('Delete failed: ' + (res.data.message || 'Unknown error'));
        }
        setTimeout(() => setSuccess(''), 2000);
      })
      .catch(err => {
        const msg = (err.response?.data?.message) || 'Failed to delete number';
        setError(msg);
        setTimeout(() => setError(''), 2500);
      });
  };

  if (loading) return <div className="text-center">Loading number...</div>;

  return (
    <div className="bg-white rounded shadow p-4">
      <h2 className="text-lg font-bold mb-2">Phone Number</h2>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <input
        className="border px-2 py-1 rounded mr-2"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Enter phone number"
      />
      <button
        className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
        onClick={handleUpdate}
        disabled={input === number}
      >
        Update
      </button>
      <button
        className="bg-red-500 text-white px-3 py-1 rounded"
        onClick={handleDelete}
        disabled={!number}
      >
        Delete
      </button>
      {success && <div className="text-green-600 mt-2">{success}</div>}
    </div>
  );
};

export default PhoneNumberEditor;