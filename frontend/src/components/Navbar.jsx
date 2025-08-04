import React from 'react';
import { useNotification } from '../hooks/useNotification';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { 
  Squares2X2Icon, 
  ChatBubbleLeftRightIcon, 
  PhoneIcon, 
  KeyIcon, 
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

const icons = {
  dashboard: <Squares2X2Icon className="h-5 w-5" />,
  messages: <ChatBubbleLeftRightIcon className="h-5 w-5" />,
  number: <PhoneIcon className="h-5 w-5" />,
  password: <KeyIcon className="h-5 w-5" />
};

const Navbar = ({ section, setSection, user, onLogout }) => {
  const { hasNewMessages, newMessageCount, clearNotifications } = useNotification();
  console.log('Navbar: hasNewMessages =', hasNewMessages, 'newMessageCount =', newMessageCount);

  const handleMessagesClick = () => {
    clearNotifications();
    setSection('messages');
  };

  const navItems = [
    { name: 'Dashboard', key: 'dashboard', icon: icons.dashboard },
    { name: 'Messages', key: 'messages', icon: icons.messages },
    { name: 'Phone Number', key: 'number', icon: icons.number },
    { name: 'Change Password', key: 'password', icon: icons.password }
  ];

  return (
    <motion.nav 
      className="flex flex-col h-screen bg-white border-r border-gray-100 p-4 shadow-sm"
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100 }}
    >
      <div className="flex items-center gap-2 mb-6 px-2">
        <span className="text-xl font-bold text-gray-800 tracking-tight hidden sm:inline">AdminPanel</span>
      </div>

      <div className="flex flex-col gap-2">
        {navItems.map((item) => (
          <motion.button
            key={item.key}
            onClick={() => {
              if (item.key === 'messages') {
                handleMessagesClick();
              } else {
                setSection(item.key);
              }
            }}
            className={clsx(
              "flex items-center gap-4 px-4 py-3 rounded-lg font-medium transition-all duration-200",
              item.key === section
                ? "bg-blue-50 text-blue-600 hover:bg-blue-100"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="hidden sm:inline">{item.name}</span>
            
            {/* Notification Badge */}
            {item.key === 'messages' && hasNewMessages && section !== 'messages' && (
              <motion.span
                className="ml-auto px-2 py-0.5 text-xs font-bold text-white bg-red-500 rounded-full"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                {newMessageCount > 99 ? '99+' : newMessageCount}
              </motion.span>
            )}
          </motion.button>
        ))}
      </div>

      <div className="mt-auto pt-6 border-t border-gray-100">
        <div className="flex items-center gap-2 mb-2 px-2 text-gray-700 hidden sm:flex">
          <span className="text-sm">Welcome,</span>
          <b className="font-semibold">{user}</b>
        </div>
        <motion.button
          onClick={onLogout}
          className="w-full flex items-center justify-center sm:justify-start gap-2 px-4 py-3 rounded-lg font-medium text-white bg-red-500 hover:bg-red-600 transition-colors duration-200"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5" />
          <span className="hidden sm:inline">Logout</span>
        </motion.button>
      </div>
    </motion.nav>
  );
};

export default Navbar;