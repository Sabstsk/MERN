import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MessageList from '../components/MessageList';
import PhoneNumberEditor from '../components/PhoneNumberEditor';
import PasswordChange from '../components/PasswordChange';
import Navbar from '../components/Navbar';
import notificationService from '../services/NotificationService';
import { Squares2X2Icon, HandRaisedIcon } from '@heroicons/react/24/outline';

const Dashboard = ({ user, onLogout }) => {
  const [section, setSection] = useState('dashboard');

  useEffect(() => {
    notificationService.start();
    return () => {
      notificationService.stop();
    };
  }, []);

  const DashboardWelcome = () => (
    <motion.div
      key="dashboard"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-xl mx-auto flex items-center justify-center p-4"
    >
      <div className="p-8 bg-white rounded-2xl shadow-xl border border-gray-100 text-center">
        <div className="flex justify-center mb-4">
          <HandRaisedIcon className="h-16 w-16 text-blue-500" />
        </div>
        <h2 className="text-3xl font-bold mb-2 text-gray-800">Welcome, {user}!</h2>
        <p className="text-gray-600 mt-4">
          This is your admin panel. Use the sidebar on the left to navigate and manage different sections.
        </p>
      </div>
    </motion.div>
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Navbar section={section} setSection={setSection} user={user} onLogout={onLogout} />
      <main className="flex-1 overflow-auto p-8">
        <AnimatePresence mode="wait">
          {section === 'dashboard' && <DashboardWelcome key="dashboard-welcome" />}
          {section === 'messages' && (
            <motion.div key="messages-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full max-w-4xl mx-auto">
              <div className="w-full max-h-[90vh] overflow-y-auto">
                <MessageList />
              </div>
            </motion.div>
          )}
          {section === 'number' && (
            <motion.div key="number-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full max-w-lg mx-auto">
              <PhoneNumberEditor />
            </motion.div>
          )}
          {section === 'password' && (
            <motion.div key="password-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full max-w-lg mx-auto">
              <PasswordChange />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Dashboard;