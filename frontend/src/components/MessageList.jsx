import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

import Card from './Card';

const MessageList = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  const token = localStorage.getItem('token');

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    
    console.log('Frontend: Attempting to delete message with ID:', id);
    console.log('Frontend: Token:', token);
    console.log('Frontend: API URL:', apiUrl);
    
    try {
      const response = await axios.delete(`${apiUrl}/api/messages/${id}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });
      console.log('Frontend: Delete response:', response.data);
      setMessages(msgs => msgs.filter(m => m._id !== id));
    } catch (err) {
      console.error('Frontend: Delete error:', err);
      console.error('Frontend: Error response:', err.response?.data);
      console.error('Frontend: Error status:', err.response?.status);
      alert(`Failed to delete message. ${err.response?.data?.error || err.message}`);
    }
  };

  // Function to fetch messages
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

  // Initial fetch only (auto-refresh handled by global service)
  useEffect(() => {
    console.log('MessageList: Initial fetch');
    fetchMessages();
    
    // Listen for new message events from global service
    const handleNewMessages = () => {
      console.log('MessageList: Received new message event, refreshing...');
      fetchMessages(false);
    };
    
    window.addEventListener('newMessages', handleNewMessages);
    
    return () => {
      window.removeEventListener('newMessages', handleNewMessages);
    };
  }, []);

  // Clear new message notifications when first viewing messages
  useEffect(() => {
    // Only clear notifications on initial mount, not on every update
    const clearInitialNotifications = () => {
      localStorage.removeItem('hasNewMessages');
      localStorage.removeItem('newMessageCount');
      console.log('MessageList: Cleared initial notifications');
    };
    
    clearInitialNotifications();
  }, []); // Empty dependency array ensures this only runs once on mount

  // Test function to manually trigger notification
  const testNotification = () => {
    console.log('Testing notification...');
    localStorage.setItem('hasNewMessages', 'true');
    localStorage.setItem('newMessageCount', '1');
    window.dispatchEvent(new CustomEvent('newMessages', { 
      detail: { count: 1, total: messages.length + 1 } 
    }));
  };

  // Function to simulate a new message arriving
  const simulateNewMessage = () => {
    console.log('Simulating new message arrival...');
    const newMessage = {
      _id: 'test_' + Date.now(),
      sender: 'Test Sender',
      message: 'This is a simulated new message',
      timestamp: new Date().toISOString()
    };
    
    // Add the message to the current list
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    
    // Manually trigger notification (simulating what global service would do)
    // Get existing count and add 1
    const existingCount = parseInt(localStorage.getItem('newMessageCount') || '0');
    const newTotalCount = existingCount + 1;
    
    localStorage.setItem('hasNewMessages', 'true');
    localStorage.setItem('newMessageCount', newTotalCount.toString());
    
    console.log(`Simulate: Adding 1 to existing ${existingCount} = ${newTotalCount}`);
    
    window.dispatchEvent(new CustomEvent('newMessages', { 
      detail: { count: newTotalCount, total: updatedMessages.length, newInThisBatch: 1 } 
    }));
  };

  // Function to simulate multiple messages arriving at once
  const simulateMultipleMessages = () => {
    console.log('Simulating 3 new messages arriving...');
    const newMessages = [];
    for (let i = 1; i <= 3; i++) {
      newMessages.push({
        _id: 'test_multi_' + Date.now() + '_' + i,
        sender: `Test Sender ${i}`,
        message: `This is simulated message ${i}`,
        timestamp: new Date().toISOString()
      });
    }
    
    // Add the messages to the current list
    const updatedMessages = [...messages, ...newMessages];
    setMessages(updatedMessages);
    
    // Manually trigger notification for 3 new messages
    const existingCount = parseInt(localStorage.getItem('newMessageCount') || '0');
    const newTotalCount = existingCount + 3;
    
    localStorage.setItem('hasNewMessages', 'true');
    localStorage.setItem('newMessageCount', newTotalCount.toString());
    
    console.log(`Simulate: Adding 3 to existing ${existingCount} = ${newTotalCount}`);
    
    window.dispatchEvent(new CustomEvent('newMessages', { 
      detail: { count: newTotalCount, total: updatedMessages.length, newInThisBatch: 3 } 
    }));
  };

  if (loading) return <div className="text-center">Loading messages...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (!messages.length) return <div className="text-center text-gray-500">No messages found.</div>;

  // Delete all messages handler
  const handleDeleteAll = async () => {
    if (!window.confirm('Are you sure you want to delete ALL messages?')) return;
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const token = localStorage.getItem('token');
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

  return (
    <>
      <Card className="message-list-card" style={{ width: '100%', maxWidth: '100%', display: 'flex', flexDirection: 'column', flex: 1, position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <h2 className="login-title" style={{ margin: 0 }}>Messages</h2>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div style={{ 
              background: '#3b82f6', 
              color: 'white', 
              padding: '4px 12px', 
              borderRadius: '20px', 
              fontSize: '14px',
              fontWeight: 'bold'
            }}>
              Total: {messages.length}
            </div>
          </div>
        </div>
        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
          <ul className="message-list">
            {messages.map((msg, idx) => (
              <li key={msg._id} className="message-item flex justify-between items-start">
                <div className="message-content">
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
                <button className="delete-btn" title="Delete message" onClick={() => handleDelete(msg._id)}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </Card>
      {messages.length > 0 && (
        <button
          className="delete-all-btn floating-delete-all"
          onClick={handleDeleteAll}
          title="Delete All Messages"
          style={{ position: 'fixed', right: 36, bottom: 36 }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="6" width="18" height="13" rx="2"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
        </button>
      )}
    </>
  );
};

export default MessageList;