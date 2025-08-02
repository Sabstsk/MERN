import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PhoneNumberEditor = () => {
  const [number, setNumber] = useState('');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');

  const fetchNumber = () => {
    setLoading(true);
    axios.get('https://mern-gcye.vercel.app/api/number')
      .then(res => {
        setNumber(res.data.number || '');
        setInput(res.data.number || '');
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch number');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchNumber();
  }, []);

  const handleUpdate = () => {
    axios.put('http://localhost:3000/api/number', { number: input })
      .then(() => {
        setSuccess('Number updated!');
        setNumber(input);
        setTimeout(() => setSuccess(''), 2000);
      })
      .catch(() => setError('Failed to update number'));
  };

  const handleDelete = () => {
    axios.delete('http://localhost:3000/api/number')
      .then(() => {
        setSuccess('Number deleted!');
        setNumber('');
        setInput('');
        setTimeout(() => setSuccess(''), 2000);
      })
      .catch(() => setError('Failed to delete number'));
  };

  if (loading) return <div className="text-center">Loading number...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="bg-white rounded shadow p-4">
      <h2 className="text-lg font-bold mb-2">Phone Number</h2>
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
