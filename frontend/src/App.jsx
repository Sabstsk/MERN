import React, { useState } from 'react';
import MessageList from './components/MessageList';
import PhoneNumberEditor from './components/PhoneNumberEditor';
import Login from './components/Login';
import './App.css';

function App() {
  const [user, setUser] = useState(() => localStorage.getItem('user') || '');

  const handleLogin = (username) => {
    setUser(username);
    localStorage.setItem('user', username);
  };
  const handleLogout = () => {
    setUser('');
    localStorage.removeItem('user');
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <span className="font-semibold">Welcome, {user}</span>
          <button onClick={handleLogout} className="text-sm bg-red-500 text-white px-3 py-1 rounded ml-2">Logout</button>
        </div>
        <MessageList />
        <PhoneNumberEditor />
      </div>
    </div>
  );
}

export default App;
