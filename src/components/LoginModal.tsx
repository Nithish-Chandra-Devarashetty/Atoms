// src/components/LoginModal.tsx
import React, { useState } from 'react';
import { Chrome } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { login, emailLogin, emailSignup } = useAuth();
  const { isDarkMode } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    try {
      setError('');
      await login();
      onClose();
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (isSignUp) {
        await emailSignup(email, password);
      } else {
        await emailLogin(email, password);
      }
      onClose();
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      {/* Modified line 49 */}
      <div className={"relative p-8 rounded-lg shadow-lg w-96 " + (isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900')}>
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-6 text-center">{isSignUp ? 'Sign Up' : 'Login'}</h2>

        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

        <form onSubmit={handleEmailSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              className={"w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 " + (isDarkMode ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-600' : 'border-gray-300 text-gray-900 focus:ring-blue-500')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              className={"w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 " + (isDarkMode ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-600' : 'border-gray-300 text-gray-900 focus:ring-blue-500')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className={"w-full py-3 px-4 rounded-lg font-semibold " + (isDarkMode ? 'bg-blue-700 hover:bg-blue-800 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white')}
          >
            {isSignUp ? 'Sign Up' : 'Login'}
          </button>
        </form>

        <div className="my-6 text-center text-sm">
          <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Or continue with</span>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center space-x-3 py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
        >
          <Chrome className="w-5 h-5" />
          <span>Continue with Google</span>
        </button>

        <p className={ (isDarkMode ? 'text-gray-400' : 'text-gray-500') + ' text-xs text-center mt-6'}>
        {isSignUp ? "Already have an account?" : "Don't have an account?"}
          <button
            className="text-blue-500 hover:underline ml-1"
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp ? 'Login' : 'Sign Up'}
          </button>
        </p>

        <p className={ (isDarkMode ? 'text-gray-400' : 'text-gray-500') + ' text-xs text-center mt-2'}>
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

