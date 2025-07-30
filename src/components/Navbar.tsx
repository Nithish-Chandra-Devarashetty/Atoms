import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
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
  Moon,
  Sun,
  LogOut
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { currentUser, logout } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
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
        className={`flex items-center px-4 py-2 rounded-md ${isActive ? (isDarkMode ? 'bg-gray-700 text-white' : 'bg-blue-500 text-white') : (isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-200')}`}
        onClick={closeMenu}
      >
        {icon}
        <span className="ml-3">{label}</span>
      </Link>
    );
  };

  return (
    <nav className={
      (isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800') +
      ' shadow-md fixed w-full z-30 top-0'
    }>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Bot size={32} className={
              (isDarkMode ? 'text-blue-400' : 'text-blue-600')
            } />
            <span className="ml-2 text-xl font-bold">Zuno</span>
          </div>

          <div className="hidden md:flex space-x-4 items-center">
            <NavLink to="/" icon={<Home size={20} />} label="Home" />
            <NavLink to="/webdev" icon={<Code size={20} />} label="Web Dev" />
            <NavLink to="/corecs" icon={<Database size={20} />} label="Core CS" />
            <NavLink to="/dsa" icon={<Brain size={20} />} label="DSA" />
            <NavLink to="/aptitude" icon={<Calculator size={20} />} label="Aptitude" />
            <NavLink to="/discussion" icon={<MessageCircle size={20} />} label="Discussion" />
            <NavLink to="/leaderboard" icon={<Trophy size={20} />} label="Leaderboard" />
            {currentUser && <NavLink to="/profile" icon={<User size={20} />} label="Profile" />} {/* Only show profile if logged in */}
            
            {currentUser ? (
              <button
                onClick={handleLogout}
                className={
                  "flex items-center px-4 py-2 rounded-md font-semibold " +
                  (isDarkMode ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-red-500 hover:bg-red-600 text-white')
                }
              >
                <LogOut size={20} className="mr-2" />
                Logout
              </button>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className={
                  "flex items-center px-4 py-2 rounded-md font-semibold " +
                  (isDarkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white')
                }
              >
                <User size={20} className="mr-2" />
                Sign In
              </button>
            )}
            
            <button onClick={toggleDarkMode} className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              {isDarkMode ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-gray-600" />}
            </button>
          </div>

          <div className="md:hidden flex items-center">
             <button onClick={toggleDarkMode} className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2">
              {isDarkMode ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-gray-600" />}
            </button>
            <button onClick={toggleMenu} className="text-gray-800 focus:outline-none">
              {isOpen ? <X size={24} className={isDarkMode ? 'text-white' : 'text-gray-800'} /> : <Menu size={24} className={isDarkMode ? 'text-white' : 'text-gray-800'} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className={
            (isDarkMode ? 'bg-gray-800' : 'bg-white') +
            ' flex flex-col space-y-2 px-4 py-2 md:hidden'
          }>
            <NavLink to="/" icon={<Home size={20} />} label="Home" />
            <NavLink to="/webdev" icon={<Code size={20} />} label="Web Dev" />
            <NavLink to="/corecs" icon={<Database size={20} />} label="Core CS" />
            <NavLink to="/dsa" icon={<Brain size={20} />} label="DSA" />
            <NavLink to="/aptitude" icon={<Calculator size={20} />} label="Aptitude" />
             <NavLink to="/discussion" icon={<MessageCircle size={20} />} label="Discussion" />
            <NavLink to="/leaderboard" icon={<Trophy size={20} />} label="Leaderboard" />
            {currentUser && <NavLink to="/profile" icon={<User size={20} />} label="Profile" />} {/* Only show profile if logged in */}

            {currentUser ? (
              <button
                onClick={handleLogout}
                className={
                  "flex items-center px-4 py-2 rounded-md font-semibold " +
                  (isDarkMode ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-red-500 hover:bg-red-600 text-white')
                }
              >
                 <LogOut size={20} className="mr-2" />
                Logout
              </button>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className={
                  "flex items-center px-4 py-2 rounded-md font-semibold " +
                  (isDarkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white')
                }
              >
                 <User size={20} className="mr-2" />
                Sign In
              </button>
            )}
          </div>
        )}
      </div>

      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
    </nav>
  );
};
