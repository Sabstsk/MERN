import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Use import.meta.env for Vite-based projects
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const PhoneNumberEditor = () => {
  const [number, setNumber] = useState('');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');
  const [success, setSuccess] = useState('');

  // ✅ Fetch function updated
  const fetchNumber = () => {
    setLoading(true);
    // ➡️ Fixed: Corrected API endpoint to '/api/number'
    axios.get(`${API_URL}/api/number/web`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    })
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
      const response = await axios.put(`${API_URL}/api/number`, { number: input }, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });
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
    axios.delete(`${API_URL}/api/number`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    })
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
    <div className="dashboard-content">
      <div className="solid-card">
        <h2 className="login-title">Edit Phone Number</h2>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <>
            {error && <div className="login-error">{error}</div>}
            {success && <div className="login-success" style={{ color: '#22c55e', background: '#dcfce7', borderRadius: 8, padding: '0.5rem 0.8rem', marginBottom: 8, textAlign: 'center', fontSize: '1rem' }}>{success}</div>}
            <div style={{ display: 'flex', gap: 12, marginBottom: 18 }}>
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                className="w-full"
                placeholder="Enter phone number"
                style={{ borderRadius: 10, border: '1px solid #e5e7eb', padding: '0.9rem 1.1rem', fontSize: '1rem', background: '#f9fafb', boxShadow: '0 1px 4px rgba(0,0,0,0.03)' }}
              />
              <button
                onClick={handleUpdate}
                className="login-btn"
                style={{ minWidth: 90 }}
              >
                Update
              </button>
              <button
                onClick={handleDelete}
                className="delete-btn"
                title="Delete number"
                style={{ minWidth: 40, minHeight: 40 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: 22, height: 22 }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="text-gray-500 text-sm">Current number: <span className="font-semibold">{number}</span></div>
          </>
        )}
      </div>
    </div>
  );
};

export default PhoneNumberEditor;