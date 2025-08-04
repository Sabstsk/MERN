import React, { useState, useEffect } from 'react';
import MessageList from '../components/MessageList';
import PhoneNumberEditor from '../components/PhoneNumberEditor';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import notificationService from '../services/NotificationService';

const Dashboard = ({ user, onLogout }) => {
  const [section, setSection] = useState('dashboard');

  // Start global notification service when Dashboard mounts
  useEffect(() => {
    notificationService.start();
    
    // Cleanup when Dashboard unmounts
    return () => {
      notificationService.stop();
    };
  }, []);

  return (
    <div className="dashboard-main">
      <Navbar section={section} setSection={setSection} user={user} onLogout={onLogout} />
      <main className="dashboard-content">
        {section === 'dashboard' && (
          <Card style={{ textAlign: 'center', maxWidth: 480, margin: '0 auto' }}>
            <h2 className="login-title">Welcome to Dashboard</h2>
            <p style={{ fontSize: '1.15rem', color: '#555', margin: '1.2rem 0 0.5rem' }}>
              This is your admin dashboard. Use the sidebar to manage messages, phone numbers, and your account.
            </p>
          </Card>
        )}
        {section === 'messages' && <MessageList />}
        {section === 'number' && (
          <Card style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
            <PhoneNumberEditor />
          </Card>
        )}
        {section === 'password' && (
          <Card style={{ textAlign: 'center', maxWidth: 480, margin: '0 auto' }}>
            <h2 className="login-title">Change Password</h2>
            <p style={{ color: '#666', marginBottom: 16 }}>This section will allow you to change your password. (Feature coming soon!)</p>
            {/* Add your password change form here if needed */}
          </Card>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
