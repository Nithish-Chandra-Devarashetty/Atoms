import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCheck, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';
import { useRealTimeUpdates } from '../hooks/useRealTimeUpdates';

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
  sender?: {
    _id: string;
    displayName: string;
    photoURL?: string;
  };
  data?: any;
}

export const Notifications: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (currentUser) {
      fetchNotifications(1);
    }
  }, [currentUser]);

  // Real-time updates for notifications
  const handleNotificationsUpdate = (newNotifications: Notification[]) => {
    const hasChanges = JSON.stringify(newNotifications) !== JSON.stringify(notifications.slice(0, 20)); // Compare with first 20
    if (hasChanges && newNotifications.length > 0) {
      console.log('🔄 Real-time update: New notifications received');
      setNotifications(newNotifications);
    }
  };

  useRealTimeUpdates({
    onNotificationsUpdate: handleNotificationsUpdate,
    shouldFetchNotifications: true,
    interval: 20000, // Poll every 20 seconds for notifications
    enabled: !loading // Don't poll while loading
  });

  const fetchNotifications = async (pageNum = 1) => {
    if (!currentUser) return;
    
    try {
      setLoading(pageNum === 1);
      const response = await apiService.getNotifications(pageNum, 20);
      
      if (pageNum === 1) {
        setNotifications(response.notifications || []);
      } else {
        setNotifications(prev => [...prev, ...(response.notifications || [])]);
      }

      const pagination = response.pagination || {};
      setHasMore(!!pagination.hasMore);
      setPage(pagination.currentPage || pageNum);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    // Mark as read if unread
    if (!notification.isRead) {
      try {
        await apiService.markNotificationRead(notification._id);
        setNotifications(prev => {
          const updated = prev.map(notif => notif._id === notification._id ? { ...notif, isRead: true } : notif);
          // Broadcast unread count change
          const newUnread = updated.filter(n => !n.isRead).length;
          window.dispatchEvent(new CustomEvent('unread-count-update', { detail: { count: newUnread } }));
          return updated;
        });
      } catch (error) {
        console.error('Failed to mark notification as read:', error);
      }
    }

    // Navigate based on notification type
    if (notification.type === 'message') {
  navigate(`/messages?user=${notification.data?.userId}`);
    } else if (notification.type === 'discussion_reply' || notification.type === 'discussion_like') {
      navigate('/discussion');
    } else if (notification.type === 'follow') {
      if (notification.data?.userId) {
        navigate(`/user/${notification.data.userId}`);
      }
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await apiService.markAllNotificationsRead();
      setNotifications(prev => {
        const updated = prev.map(notif => ({ ...notif, isRead: true }));
        // Broadcast unread count reset
        window.dispatchEvent(new CustomEvent('unread-count-update', { detail: { count: 0 } }));
        return updated;
      });
  // Ensure navbar badge sync and pagination state by refetching first page
  fetchNotifications(1);
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const handleClearAll = async () => {
    try {
      await apiService.clearAllNotifications();
      setNotifications([]);
  // Broadcast unread count reset
  window.dispatchEvent(new CustomEvent('unread-count-update', { detail: { count: 0 } }));
    } catch (error) {
      console.error('Failed to clear all notifications:', error);
    }
  };

  const loadMore = () => {
    if (hasMore && !loading) {
      fetchNotifications(page + 1);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60);
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays === 1) return '1 day ago';
      if (diffInDays < 7) return `${diffInDays} days ago`;
      return date.toLocaleDateString();
    }
  };

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.isRead) 
    : notifications;
  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <Bell className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <h2 className="text-xl font-semibold mb-2">Sign in to view notifications</h2>
          <p className="text-gray-400">You need to be logged in to see your notifications</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-pink-500/10 blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 relative z-10">
          <div className="flex items-center justify-center mb-6">
            <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent tracking-tight">
              Notifications
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto font-light">
            Stay updated with your latest activities and interactions
          </p>
        </div>

        {/* Main Content Container */}
        <div className="max-w-4xl mx-auto relative z-10">

          {/* Filter and Action Buttons */}
          <div className="relative bg-white/5 backdrop-blur-md border border-white/10 p-8 mb-8 z-10">
            <h2 className="text-3xl font-black text-white mb-6">Manage Notifications</h2>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex space-x-3">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-6 py-3 font-semibold transition-all duration-300 ${
                    filter === 'all'
                      ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
                  }`}
                >
                  All ({notifications.length})
                </button>
                <button
                  onClick={() => setFilter('unread')}
                  className={`px-6 py-3 font-semibold transition-all duration-300 ${
                    filter === 'unread'
                      ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
                  }`}
                >
                  Unread ({unreadCount})
                </button>
              </div>

              <div className="flex space-x-3">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="px-6 py-3 bg-green-500/80 hover:bg-green-500 text-white font-semibold transition-all duration-300 flex items-center space-x-2 shadow-lg"
                  >
                    <CheckCheck className="w-5 h-5" />
                    <span>Mark All Read</span>
                  </button>
                )}
                {notifications.length > 0 && (
                  <button
                    onClick={handleClearAll}
                    className="px-6 py-3 bg-red-500/80 hover:bg-red-500 text-white font-semibold transition-all duration-300 flex items-center space-x-2 shadow-lg"
                  >
                    <Trash2 className="w-5 h-5" />
                    <span>Clear All</span>
                  </button>
                )}
              </div>
            </div>
          </div>

        {/* Notifications List */}
        <div className="relative bg-white/5 backdrop-blur-md border border-white/10 overflow-hidden z-10">
          {loading && page === 1 ? (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="text-center py-16 px-8">
              <Bell className="w-20 h-20 text-gray-500 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">
                {filter === 'unread' ? 'No unread notifications' : 'No notifications'}
              </h3>
              <p className="text-gray-400 text-lg">
                {filter === 'unread' 
                  ? 'All caught up! Check back later for new notifications.' 
                  : 'You\'ll see notifications here when you have activity on your account.'
                }
              </p>
            </div>
          ) : (
            <>
              {filteredNotifications.map((notification, index) => (
                <div
                  key={notification._id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-8 border-b border-white/10 hover:bg-white/5 cursor-pointer transition-all duration-300 relative ${
                    !notification.isRead ? 'bg-cyan-500/10 border-l-4 border-l-cyan-500' : ''
                  } ${index === filteredNotifications.length - 1 ? 'border-b-0' : ''}`}
                >
                  <div className="flex items-start space-x-6">
                    {/* Avatar */}
                    <div className="flex-shrink-0 relative">
                      {notification.sender?.photoURL ? (
                        <img
                          src={notification.sender.photoURL}
                          alt={notification.sender.displayName}
                          className="w-14 h-14 rounded-full object-cover shadow-lg"
                        />
                      ) : (
                        <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                          {notification.sender?.displayName?.[0]?.toUpperCase() || 'U'}
                        </div>
                      )}
                      {!notification.isRead && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-bold text-xl mb-2 leading-tight">
                        {notification.title}
                      </h3>
                      <p className="text-gray-300 mb-4 leading-relaxed text-lg">
                        {notification.message}
                      </p>
                      <p className="text-gray-400 text-sm font-medium">
                        {formatTime(notification.createdAt)}
                      </p>
                    </div>

                    {/* Only unread indicator, no action buttons */}
                    {!notification.isRead && (
                      <div className="flex-shrink-0">
                        <div className="w-3 h-3 bg-cyan-500 rounded-full animate-pulse"></div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Load More Button */}
              {hasMore && (
                <div className="p-8 text-center border-t border-white/10">
                  <button
                    onClick={loadMore}
                    disabled={loading}
                    className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold text-lg transition-all duration-300 flex items-center space-x-3 mx-auto shadow-lg"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                        <span>Loading...</span>
                      </>
                    ) : (
                      <span>Load More Notifications</span>
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        </div>
      </div>
    </div>
  );
};
