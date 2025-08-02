import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MessageList = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('/api/messages')
      .then(res => {
        setMessages(Array.isArray(res.data) ? res.data : []);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch messages');
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
        {messages.map((msg) => (
          <li key={msg.id || Math.random()} className="border-b last:border-b-0 pb-2">
            <div className="flex flex-col gap-1">
              <div className="font-semibold text-blue-700">{msg.sender || msg.from || 'Unknown Sender'}</div>
              <div className="whitespace-pre-line text-gray-800">{msg.message || msg.text || ''}</div>
              <div className="text-xs text-gray-500 flex gap-2">
                <span>{msg.date || msg.time || ''}</span>
                {msg.sim_number && <span>SIM: {msg.sim_number}</span>}
                {msg.sim_slot && <span>Slot: {msg.sim_slot}</span>}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MessageList;
