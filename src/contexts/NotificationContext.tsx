import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
  duration?: number;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (type: Notification['type'], message: string, duration?: number) => void;
  removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((type: Notification['type'], message: string, duration = 3000) => {
    const id = Math.random().toString(36).substr(2, 9);
    const notification = { id, type, message, duration };
    
    setNotifications(prev => [...prev, notification]);
    
    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
      {children}
      
      {/* Notification Display */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map(notification => (
          <div
            key={notification.id}
            className={`flex items-center p-3 rounded-lg shadow-lg backdrop-blur-md border max-w-sm animate-in slide-in-from-right ${
              notification.type === 'success' 
                ? 'bg-green-500/20 border-green-500/50 text-green-200'
                : notification.type === 'error'
                ? 'bg-red-500/20 border-red-500/50 text-red-200'
                : 'bg-blue-500/20 border-blue-500/50 text-blue-200'
            }`}
            onClick={() => removeNotification(notification.id)}
          >
            {notification.type === 'success' && <CheckCircle className="w-5 h-5 mr-2" />}
            {notification.type === 'error' && <AlertCircle className="w-5 h-5 mr-2" />}
            {notification.type === 'info' && <Info className="w-5 h-5 mr-2" />}
            <span className="text-sm">{notification.message}</span>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};
