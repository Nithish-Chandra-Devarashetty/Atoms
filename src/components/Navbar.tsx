import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';
import { useWebSocket } from '../hooks/useWebSocket';
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
  LogOut,
  Bell,
  Mail
} from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  // Fetch initial notifications and set up real-time updates
  useEffect(() => {
    if (currentUser) {
      fetchNotifications();
    }
  }, [currentUser]);

  // Listen for global unread count updates (e.g., from Notifications page)
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as { count?: number } | undefined;
      if (detail && typeof detail.count === 'number') {
        setUnreadCount(detail.count);
      }
    };
    window.addEventListener('unread-count-update', handler as EventListener);
    return () => window.removeEventListener('unread-count-update', handler as EventListener);
  }, []);

  // WebSocket-driven notifications (instant)
  useWebSocket({
    enabled: !!currentUser,
    onNotificationCreated: (notif) => {
      // Simple increment unless it's read or malformed
      if (notif && !notif.isRead) {
        setUnreadCount((c: number) => c + 1);
      }
    },
    onNotificationsMarkedAllRead: (data?: { affectedId?: string }) => {
      if (data && data.affectedId) {
        // Single item marked read elsewhere
        setUnreadCount((c: number) => (c > 0 ? c - 1 : 0));
      } else {
        // Bulk mark-all or reset
        setUnreadCount(0);
      }
    }
  });

  const fetchNotifications = async () => {
    if (!currentUser) return;
    
    try {
      const response = await apiService.getNotifications(1, 5); // Get latest 5 for count only
      setUnreadCount(response.unreadCount || 0);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
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
    return (
      <Link
        to={to}
        className="flex items-center px-4 py-3 transition-all duration-300 text-gray-300 hover:bg-white/10 hover:text-white"
        onClick={closeMenu}
      >
        {icon}
  <span className="ml-3 whitespace-nowrap">{label}</span>
      </Link>
    );
  };

  // Static navbar: no scroll-based visibility. It will be shown only when page is at top (normal flow).

  return (
    <>
      <nav
        className="bg-black/20 backdrop-blur-md border-b border-white/10 w-full"
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="flex items-center hover:opacity-80 transition-all duration-300 group flex-shrink-0">
              <img src="/ai.png" alt="Atoms" className="w-8 h-8 object-contain" loading="lazy" />
              <span className="ml-3 text-2xl font-black text-white tracking-tight whitespace-nowrap">Atoms</span>
            </Link>

            <div className="hidden md:flex space-x-4 items-center flex-nowrap">
              <NavLink to="/webdev" icon={<Code size={20} />} label="Web Dev" />
              <NavLink to="/core" icon={<Database size={20} />} label="Core CS" />
              <NavLink to="/dsa" icon={<Brain size={20} />} label="DSA" />
              <NavLink to="/aptitude" icon={<Calculator size={20} />} label="Aptitude" />
              <NavLink to="/discussion" icon={<MessageCircle size={20} />} label="Discussion" />
              <NavLink to="/leaderboard" icon={<Trophy size={20} />} label="Leaderboard" />
              
              
              {/* Notifications Icon */}
              {currentUser && (
                <Link 
                  to="/notifications"
                  className="relative flex items-center px-4 py-3 text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-300"
                >
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>
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
                <Link
                  to="/auth"
                  className="flex items-center px-6 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold hover:from-cyan-400 hover:to-purple-500 transition-all duration-300 transform hover:scale-105"
                >
                  <User size={20} className="mr-2" />
                  Sign In
                </Link>
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
                <Link 
                  to="/notifications"
                  className="flex items-center px-4 py-3 text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-300"
                  onClick={closeMenu}
                >
                  <Bell size={20} className="mr-3" />
                  <span>Notifications</span>
                  {unreadCount > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>
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
                <Link
                  to="/auth"
                  className="flex items-center px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold hover:from-cyan-400 hover:to-purple-500 transition-all duration-300"
                >
                  <User size={20} className="mr-2" />
                  Sign In
                </Link>
              )}
            </div>
          )}
        </div>
      </nav>
    </>
  );
};
export default Navbar;