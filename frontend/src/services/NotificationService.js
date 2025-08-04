import axios from 'axios';

class NotificationService {
  constructor() {
    this.intervalId = null;
    this.lastMessageCount = null;
    this.isRunning = false;
    this.apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  }

  start() {
    if (this.isRunning) return;
    
    console.log('NotificationService: Starting global message monitoring');
    this.isRunning = true;
    
    // Initial fetch to set baseline
    this.checkForNewMessages();
    
    // Set up interval to check every 5 seconds
    this.intervalId = setInterval(() => {
      this.checkForNewMessages();
    }, 5000);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
    console.log('NotificationService: Stopped global message monitoring');
  }

  async checkForNewMessages() {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await axios.get(`${this.apiUrl}/api/messages`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const messages = Array.isArray(response.data) ? response.data : [];
      const currentCount = messages.length;

      // Use lastMessageCount to detect new messages
      let lastCount = parseInt(localStorage.getItem('lastMessageCount') || '0');
      if (this.lastMessageCount !== null) lastCount = this.lastMessageCount;
      const diff = currentCount - lastCount;
      let newMessageCount = parseInt(localStorage.getItem('newMessageCount') || '0');
      if (diff > 0) {
        newMessageCount += diff;
        localStorage.setItem('hasNewMessages', 'true');
        localStorage.setItem('newMessageCount', newMessageCount.toString());
        window.dispatchEvent(new CustomEvent('newMessages', {
          detail: { count: newMessageCount, total: currentCount, newInThisBatch: diff }
        }));
        console.log('NotificationService: Detected', diff, 'new messages. Accumulated count:', newMessageCount);
      } else if (newMessageCount > 0) {
        // No new messages, keep the badge
        window.dispatchEvent(new CustomEvent('newMessages', {
          detail: { count: newMessageCount, total: currentCount, newInThisBatch: 0 }
        }));
      } else {
        localStorage.setItem('hasNewMessages', 'false');
        localStorage.setItem('newMessageCount', '0');
      }
      // Update lastMessageCount for next poll
      this.lastMessageCount = currentCount;
      localStorage.setItem('lastMessageCount', currentCount.toString());
    } catch (error) {
      console.error('NotificationService: Error checking messages:', error);
    }
  }

  async reset() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        this.lastMessageCount = null;
        return;
      }
      const response = await axios.get(`${this.apiUrl}/api/messages`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const messages = Array.isArray(response.data) ? response.data : [];
      this.lastMessageCount = messages.length;
      localStorage.setItem('lastMessageCount', messages.length.toString());
      console.log('NotificationService: Baseline reset to', this.lastMessageCount);
    } catch (error) {
      this.lastMessageCount = null;
      console.error('NotificationService: Error resetting baseline:', error);
    }
  }
}

// Create singleton instance
const notificationService = new NotificationService();

window.notificationService = notificationService;
export default notificationService;
