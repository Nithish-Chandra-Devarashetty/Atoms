import React, { useState, useEffect } from 'react';
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
  LogOut
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { currentUser, logout } = useAuth();
  const { isDarkMode } = useTheme();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

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
