import { useState, useEffect } from 'react';

export const useNotification = () => {
  const [hasNewMessages, setHasNewMessages] = useState(false);
  const [newMessageCount, setNewMessageCount] = useState(0);

  useEffect(() => {
    // Check for existing notifications on mount
    const checkNotifications = () => {
      const hasNew = localStorage.getItem('hasNewMessages') === 'true';
      const count = parseInt(localStorage.getItem('newMessageCount') || '0');
      console.log('useNotification: Checking notifications - hasNew:', hasNew, 'count:', count);
      setHasNewMessages(hasNew);
      setNewMessageCount(count);
    };

    checkNotifications();

    // Listen for new message events
    const handleNewMessages = (event) => {
      console.log('useNotification: Received newMessages event:', event.detail);
      const totalCount = event.detail.count;
      console.log('useNotification: Setting notification count to:', totalCount);
      setHasNewMessages(true);
      setNewMessageCount(totalCount);
    };

    window.addEventListener('newMessages', handleNewMessages);

    // Check localStorage periodically in case it's updated by other components
    const interval = setInterval(checkNotifications, 1000);

    return () => {
      window.removeEventListener('newMessages', handleNewMessages);
      clearInterval(interval);
    };
  }, []);

  const clearNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/api/messages`, {
        headers: { Authorization: token ? `Bearer ${token}` : undefined }
      });
      const data = await response.json();
      const totalCount = Array.isArray(data) ? data.length : 0;
      localStorage.setItem('lastSeenMessageCount', totalCount.toString());
    } catch (e) {
      localStorage.setItem('lastSeenMessageCount', '0');
    }
    setHasNewMessages(false);
    setNewMessageCount(0);
    localStorage.setItem('hasNewMessages', 'false');
    localStorage.setItem('newMessageCount', '0');
    localStorage.setItem('lastMessageCount', '0');
    // Reset NotificationService baseline
    if (window.notificationService && window.notificationService.reset) {
      window.notificationService.reset();
    }
  };

  return {
    hasNewMessages,
    newMessageCount,
    clearNotifications
  };
};
