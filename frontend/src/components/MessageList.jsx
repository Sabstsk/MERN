import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MessageList = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL;
    axios.get(`${apiUrl}/api/messages`)
      .then(res => {
        // The server now directly sends an array of messages, not an object with a 'messages' key
        if (Array.isArray(res.data)) {
          setMessages(res.data);
        } else {
          setMessages([]);
        }
        setLoading(false);
      })
      .catch(err => {
        let msg = 'Failed to fetch messages';
        if (err.response && err.response.data && err.response.data.message) {
          msg = err.response.data.message;
        }
        setError(msg);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center">Loading messages...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (!messages.length) return <div className="text-center text-gray-500">No messages found.</div>;

  return (
    <div className="bg-white rounded shadow p-4 mb-6 max-h-[400px] overflow-y-auto">
      <h2 className="text-lg font-bold mb-2">Messages</h2>
      <ul className="space-y-2">
        {messages.map((msg, idx) => (
          <li key={msg._id} className="border-b last:border-b-0 pb-2">
            <div className="flex flex-col gap-1">
              <div className="font-semibold text-blue-700">
                {idx + 1}. {msg.sender || 'Unknown Sender'}
              </div>
              <div className="whitespace-pre-line text-gray-800">{msg.message || ''}</div>
              <div className="text-xs text-gray-500">
                <span>{new Date(msg.date).toLocaleString()}</span>
                {msg.sim_number && <span className="ml-2">SIM Number: {msg.sim_number}</span>}
                {msg.sim_slot && <span className="ml-2">SIM Slot: {msg.sim_slot}</span>}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MessageList;