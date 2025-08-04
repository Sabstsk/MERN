import React, { useEffect, useState } from 'react';
import axios from 'axios';
import clsx from 'clsx';
import { TrashIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

// Card component from our dashboard design
const Card = ({ children, className = '' }) => (
  <div className={clsx("p-6 bg-white rounded-2xl shadow-xl border border-gray-100", className)}>
    {children}
  </div>
);

const MessageList = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  const token = localStorage.getItem('token');

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    
    try {
      await axios.delete(`${apiUrl}/api/messages/${id}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });
      setMessages(msgs => msgs.filter(m => m._id !== id));
    } catch (err) {
      alert(`Failed to delete message. ${err.response?.data?.error || err.message}`);
    }
  };

  const fetchMessages = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const response = await axios.get(`${apiUrl}/api/messages`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });
      
      const newMessages = Array.isArray(response.data) ? response.data : [];
      setMessages(newMessages);
      if (showLoading) setLoading(false);
    } catch (err) {
      let msg = 'Failed to fetch messages';
      if (err.response && err.response.status === 401) {
        msg = 'Session expired or unauthorized. Please login again.';
        localStorage.removeItem('token');
      } else if (err.response && err.response.data && err.response.data.message) {
        msg = err.response.data.message;
      }
      setError(msg);
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    
    const handleNewMessages = () => {
      fetchMessages(false);
    };
    
    window.addEventListener('newMessages', handleNewMessages);
    
    return () => {
      window.removeEventListener('newMessages', handleNewMessages);
    };
  }, []);

  useEffect(() => {
    const clearInitialNotifications = () => {
      localStorage.removeItem('hasNewMessages');
      localStorage.removeItem('newMessageCount');
    };
    
    clearInitialNotifications();
  }, []);

  const handleDeleteAll = async () => {
    if (!window.confirm('Are you sure you want to delete ALL messages?')) return;
    try {
      await axios.delete(`${apiUrl}/api/messages`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });
      setMessages([]);
    } catch (err) {
      alert('Failed to delete all messages.');
    }
  };

  if (loading) return <div className="text-center py-8 text-gray-500">Loading messages...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <Card className="h-full flex flex-col max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <ChatBubbleLeftRightIcon className="h-7 w-7 text-blue-600" /> Messages
        </h2>
        <div className="bg-blue-600 text-white font-semibold py-1 px-4 rounded-full text-sm">
          Total: {messages.length}
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto -mx-6 px-6">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-10">No messages found.</div>
        ) : (
          <ul className="space-y-4">
            {messages.map((msg, idx) => (
              <li 
                key={msg._id} 
                className="flex items-start p-4 bg-gray-50 rounded-xl shadow-sm border border-gray-100"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-gray-900">{idx + 1}.</span>
                    <span className="font-semibold text-blue-700">{msg.sender || 'Unknown Sender'}</span>
                  </div>
                  <p className="whitespace-pre-line text-gray-800 leading-relaxed mb-2">{msg.message || ''}</p>
                  <div className="text-xs text-gray-500 space-x-2">
                    <span>{new Date(msg.date).toLocaleString()}</span>
                    {msg.sim_number && <span>SIM Number: {msg.sim_number}</span>}
                    {msg.sim_slot && <span>SIM Slot: {msg.sim_slot}</span>}
                  </div>
                </div>
                <button 
                  className="p-2 ml-4 rounded-full hover:bg-red-100 text-red-500 hover:text-red-700 transition-colors duration-200" 
                  title="Delete message" 
                  onClick={() => handleDelete(msg._id)}
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {messages.length > 0 && (
        <button
          className="fixed right-8 bottom-8 p-4 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition-colors duration-200 transform hover:scale-105"
          onClick={handleDeleteAll}
          title="Delete All Messages"
        >
          <TrashIcon className="w-6 h-6" />
        </button>
      )}
    </Card>
  );
};

export default MessageList;