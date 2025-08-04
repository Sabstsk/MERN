import React from 'react';
import { useNotification } from '../hooks/useNotification';

const icons = {
  dashboard: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/></svg>,
  messages: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  number: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24"><path d="M22 16.92V19a2 2 0 0 1-2.18 2A19.72 19.72 0 0 1 3 5.18 2 2 0 0 1 5 3h2.09a2 2 0 0 1 2 1.72c.13 1.13.37 2.24.72 3.32a2 2 0 0 1-.45 2.11l-.27.27a16 16 0 0 0 6.29 6.29l.27-.27a2 2 0 0 1 2.11-.45c1.08.35 2.19.59 3.32.72A2 2 0 0 1 22 16.92z"/></svg>,
  password: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
};

const Navbar = ({ section, setSection, user, onLogout }) => {
  const { hasNewMessages, newMessageCount, clearNotifications } = useNotification();
  console.log('Navbar: hasNewMessages =', hasNewMessages, 'newMessageCount =', newMessageCount);


  const handleMessagesClick = () => {
    clearNotifications();
    setSection('messages');
  };

  return (
  <nav className="admin-sidebar">
    <div className="admin-logo">AdminPanel</div>
    <button className={`nav-btn${section==='dashboard'?' active':''}`} onClick={() => setSection('dashboard')}>
      <span className="nav-icon">{icons.dashboard}</span> Dashboard
    </button>
    <button className={`nav-btn${section==='messages'?' active':''}`} onClick={handleMessagesClick} style={{ position: 'relative' }}>
      <span className="nav-icon">{icons.messages}</span> Messages
      {hasNewMessages && section !== 'messages' && (
        <span style={{
          position: 'absolute',
          top: '6px',
          right: '6px',
          width: '12px',
          height: '12px',
          backgroundColor: '#ef4444',
          borderRadius: '50%',
          animation: 'pulse 2s infinite',
          border: '2px solid white',
          zIndex: 10
        }}></span>
      )}
      {hasNewMessages && newMessageCount > 0 && section !== 'messages' && (
        <span style={{
          position: 'absolute',
          top: '2px',
          right: '2px',
          backgroundColor: '#ef4444',
          color: 'white',
          borderRadius: '12px',
          padding: '2px 6px',
          fontSize: '10px',
          fontWeight: 'bold',
          minWidth: '18px',
          textAlign: 'center',
          border: '1px solid white',
          zIndex: 11
        }}>
          {newMessageCount > 99 ? '99+' : newMessageCount}
        </span>
      )}
    </button>
    <button className={`nav-btn${section==='number'?' active':''}`} onClick={() => setSection('number')}>
      <span className="nav-icon">{icons.number}</span> Phone Number
    </button>
    <button className={`nav-btn${section==='password'?' active':''}`} onClick={() => setSection('password')}>
      <span className="nav-icon">{icons.password}</span> Change Password
    </button>
    <div style={{ flex: 1 }} />
    <div className="admin-user">Welcome, <b>{user}</b></div>
    <button className="login-btn" style={{ background: '#ef4444', marginTop: 8 }} onClick={onLogout}>Logout</button>
  </nav>
  );
};


export default Navbar;
