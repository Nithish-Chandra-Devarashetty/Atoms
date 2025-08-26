import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';
import LoginModal from './LoginModal';
import { 
  Home, 
  Code, 
  Database, 
  Brain, 
  Calculator, 
  User, 
  MessageCircle, 
  Trophy,
  Menu,
  X,
  Bot,
  LogOut,
  Bell,
  Mail
} from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { currentUser, logout } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loadingNotifications] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  // Fetch notifications when user is logged in
  useEffect(() => {
    if (currentUser) {
      fetchNotifications();
      // Poll for new notifications every 30 seconds
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [currentUser]);

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showNotifications) {
        const target = event.target as HTMLElement;
        if (!target.closest('.notification-dropdown')) {
          setShowNotifications(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showNotifications]);

  const fetchNotifications = async () => {
    if (!currentUser) return;
    
    try {
      const response = await apiService.getNotifications(1, 5); // Get latest 5
      setNotifications(response.notifications || []);
      setUnreadCount(response.unreadCount || 0);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  const handleNotificationClick = async (notification: any) => {
    // Mark as read
    if (!notification.isRead) {
      try {
        await apiService.markNotificationRead(notification._id);
        fetchNotifications(); // Refresh
      } catch (error) {
        console.error('Failed to mark notification as read:', error);
      }
    }

    // Navigate based on notification type
    if (notification.type === 'message') {
      window.location.href = `/messages?user=${notification.data?.userId}`;
    } else if (notification.type === 'discussion_reply' || notification.type === 'discussion_like') {
      window.location.href = '/discussion';
    } else if (notification.type === 'follow') {
      window.location.href = `/user/${notification.data?.userId}`;
    }
    
    setShowNotifications(false);
  };

    const handleClearAllNotifications = async () => {
    try {
      await apiService.clearAllNotifications();
      setNotifications([]);
    } catch (error) {
      console.error('Failed to clear all notifications:', error);
    }
  };

  const handleDeleteNotification = async (notificationId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the dropdown item click
    try {
      await apiService.deleteNotification(notificationId);
      setNotifications(prev => prev.filter(notif => notif._id !== notificationId));
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await apiService.markAllNotificationsRead();
      fetchNotifications(); // Refresh to update read status
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const NavLink: React.FC<{ to: string; icon: React.ReactNode; label: string }> = ({ to, icon, label }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        className={`flex items-center px-4 py-3 transition-all duration-300 ${
          isActive 
            ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white' 
            : 'text-gray-300 hover:bg-white/10 hover:text-white'
        }`}
        onClick={closeMenu}
      >
        {icon}
        <span className="ml-3">{label}</span>
      </Link>
    );
  };

  // Create portal target element
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // --- Only show navbar when at very top ---
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY === 0) {
        setIsVisible(true); // show at top
      } else {
        setIsVisible(false); // hide when scrolling down
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`bg-black/20 backdrop-blur-md border-b border-white/10 w-full z-50 fixed top-0 left-0 transform transition-transform duration-300 ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="flex items-center hover:opacity-80 transition-all duration-300 group">
              <div className="relative">
                <Bot size={32} className="text-cyan-400 group-hover:text-cyan-300 transition-colors duration-300" />
                <div className="absolute -inset-1 bg-cyan-400/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <span className="ml-3 text-2xl font-black text-white tracking-tight">Atoms</span>
            </Link>

            <div className="hidden md:flex space-x-4 items-center">
              <NavLink to="/webdev" icon={<Code size={20} />} label="Web Dev" />
              <NavLink to="/core" icon={<Database size={20} />} label="Core CS" />
              <NavLink to="/dsa" icon={<Brain size={20} />} label="DSA" />
              <NavLink to="/aptitude" icon={<Calculator size={20} />} label="Aptitude" />
              <NavLink to="/discussion" icon={<MessageCircle size={20} />} label="Discussion" />
              <NavLink to="/leaderboard" icon={<Trophy size={20} />} label="Leaderboard" />
              
              {currentUser && (
                <div className="relative notification-dropdown">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative flex items-center px-4 py-3 text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-300"
                  >
                    <Bell size={20} />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                  
                  {showNotifications && (
                    <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                      <div className="p-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
                          <div className="flex space-x-2">
                            {unreadCount > 0 && (
                              <button
                                onClick={handleMarkAllAsRead}
                                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                              >
                                Mark all read
                              </button>
                            )}
                            {notifications.length > 0 && (
                              <button
                                onClick={handleClearAllNotifications}
                                className="text-xs text-red-600 hover:text-red-800 font-medium"
                              >
                                Clear all
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {loadingNotifications ? (
                          <div className="p-4 text-center text-gray-500">Loading...</div>
                        ) : notifications.length === 0 ? (
                          <div className="p-4 text-center text-gray-500">No notifications</div>
                        ) : (
                          notifications.map((notification: any) => (
                            <div
                              key={notification._id}
                              onClick={() => handleNotificationClick(notification)}
                              className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                                !notification.isRead ? 'bg-blue-50' : ''
                              }`}
                            >
                              <div className="flex items-start space-x-3">
                                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                  {notification.sender?.displayName?.[0]?.toUpperCase() || 'U'}
                                </div>
                                <div className="flex-1">
                                  <h4 className="text-sm font-medium text-gray-800">{notification.title}</h4>
                                  <p className="text-sm text-gray-600">{notification.message}</p>
                                  <p className="text-xs text-gray-400 mt-1">
                                    {new Date(notification.createdAt).toLocaleDateString()}
                                  </p>
                                </div>
                                <div className="flex items-center space-x-2">
                                  {!notification.isRead && (
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                  )}
                                  <button
                                    onClick={(e) => handleDeleteNotification(notification._id, e)}
                                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                    title="Delete notification"
                                  >
                                    <X size={14} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Messages Icon */}
              {currentUser && (
                <Link 
                  to="/messages"
                  className="flex items-center px-4 py-3 text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-300"
                >
                  <Mail size={20} />
                </Link>
              )}
              
              {currentUser && <NavLink to="/profile" icon={<User size={20} />} label="Profile" />}

              {!currentUser && (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="flex items-center px-6 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold hover:from-cyan-400 hover:to-purple-500 transition-all duration-300 transform hover:scale-105"
                >
                  <User size={20} className="mr-2" />
                  Sign In
                </button>
              )}
            </div>

            <div className="md:hidden flex items-center">
              <button onClick={toggleMenu} className="text-white focus:outline-none">
                {isOpen ? <X size={24} className="text-white" /> : <Menu size={24} className="text-white" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isOpen && (
            <div className="bg-black/40 backdrop-blur-md border-t border-white/10 flex flex-col space-y-2 px-4 py-4 md:hidden">
              <NavLink to="/" icon={<Home size={20} />} label="Home" />
              <NavLink to="/webdev" icon={<Code size={20} />} label="Web Dev" />
              <NavLink to="/core" icon={<Database size={20} />} label="Core CS" />
              <NavLink to="/dsa" icon={<Brain size={20} />} label="DSA" />
              <NavLink to="/aptitude" icon={<Calculator size={20} />} label="Aptitude" />
              <NavLink to="/discussion" icon={<MessageCircle size={20} />} label="Discussion" />
              <NavLink to="/leaderboard" icon={<Trophy size={20} />} label="Leaderboard" />
              
              {currentUser && (
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="flex items-center px-4 py-3 text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-300"
                >
                  <Bell size={20} className="mr-3" />
                  <span>Notifications</span>
                  {unreadCount > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>
              )}
              
              {currentUser && <NavLink to="/messages" icon={<Mail size={20} />} label="Messages" />}
              
              {currentUser && <NavLink to="/profile" icon={<User size={20} />} label="Profile" />}

              {currentUser ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center px-4 py-2 bg-red-500/80 backdrop-blur-md text-white font-semibold hover:bg-red-500 transition-all duration-300"
                >
                  <LogOut size={20} className="mr-2" />
                  Logout
                </button>
              ) : (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="flex items-center px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold hover:from-cyan-400 hover:to-purple-500 transition-all duration-300"
                >
                  <User size={20} className="mr-2" />
                  Sign In
                </button>
              )}
            </div>
          )}
        </div>
      </nav>

      {mounted && showLoginModal && (
        <div id="modal-root">
          <LoginModal onClose={() => setShowLoginModal(false)} />
        </div>
      )}
    </>
  );
};
export default Navbar;