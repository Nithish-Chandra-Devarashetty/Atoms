import React from 'react';
import { X, Chrome } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { login } = useAuth();
  const { isDarkMode } = useTheme();

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    try {
      await login();
      onClose();
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Welcome to Zuno</h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-8 text-center`}>
          Sign in to track your progress, earn badges, and connect with other learners
        </p>

        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center space-x-3 py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
        >
          <Chrome className="w-5 h-5" />
          <span>Continue with Google</span>
        </button>

        <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-xs text-center mt-6`}>
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};