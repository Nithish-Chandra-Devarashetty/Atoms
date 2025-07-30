import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

interface LoginModalProps {
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isEmailFlow, setIsEmailFlow] = useState(false);

  const { emailLogin, emailSignup, login } = useAuth();
  const { isDarkMode } = useTheme();

  useEffect(() => {
    // Clear error when switching between login and signup
    setError('');
  }, [isSignUp]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isSignUp) {
        await emailSignup(email.trim(), password.trim());
      } else {
        await emailLogin(email.trim(), password.trim());
      }
      onClose();
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await login();
      onClose();
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 h-screen">
      <div className={`relative p-8 rounded-lg shadow-lg w-96 ${
        isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
      }`}>
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-6 text-center">{isSignUp ? 'Sign Up' : 'Login'}</h2>

        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

        {!isEmailFlow ? (
          <div className="space-y-4">
            <button
              className={
                "w-full py-3 px-4 rounded-lg font-semibold " +
                (isDarkMode
                  ? 'bg-blue-700 hover:bg-blue-800 text-white'
                  : 'bg-blue-500 hover:bg-blue-600 text-white')
              }
              onClick={() => setIsEmailFlow(true)}
            >
              Login
            </button>
            <div className={
              (isDarkMode ? 'text-gray-400' : 'text-gray-500') +
              ' text-center'
            }>
              Or continue with
            </div>
            <button
              className={
                "w-full py-3 px-4 rounded-lg font-semibold flex items-center justify-center space-x-2 " +
                (isDarkMode
                  ? 'bg-red-700 hover:bg-red-800 text-white'
                  : 'bg-red-500 hover:bg-red-600 text-white')
              }
              onClick={handleGoogleSignIn}
            >
              <svg className="w-5 h-5" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M43.611 20.0834H42V20H24C16.5367 20 10.4733 26.0633 10.4733 33.5267C10.4733 40.99 16.5367 47.0533 24 47.0533C30.6533 47.0533 36.2167 43.1333 38.68 37.5933L44.2033 40.8C40.1333 44.9333 35.1733 47.96 29.6667 48C17.83 48 8 38.17 8 26.3333C8 14.4967 17.83 4.66667 29.6667 4.66667C35.95 4.66667 41.1167 6.94 44.9267 10.68L39.45 16.2033C37.0433 13.92 33.6733 12.5333 29.6667 12.5333C21.5733 12.5333 15.1267 18.98 15.1267 27.0733C15.1267 35.1667 21.5733 41.6133 29.6667 41.6133C33.4333 41.6133 36.59 40.2933 39.09 37.9533C40.7767 36.3333 41.8 34.0833 41.8 31.2833H24V20.0834Z" fill="#4285F4"/>
                <path d="M46.98 24.5333C46.98 23.12 46.86 21.7467 46.6533 20.4267H24V28.8H38.8133C38.1867 32.1333 36.0333 34.8933 33.0133 36.8333L33.08 36.8933L39.45 40.8C43.2467 37.2133 45.6767 32.4667 46.7333 27.0667C46.9333 26.2 46.98 25.36 46.98 24.5333Z" fill="#34A853"/>
                <path d="M15.1267 27.0733C15.1267 24.4467 15.8933 21.9867 17.2933 19.9333L17.22 19.86L10.68 16.06C8.12 19.2133 6.66667 23.1333 6.66667 27.0733C6.66667 31.0133 8.12 34.9333 10.68 38.0867L17.22 34.2867L17.2933 34.22C15.8933 32.1667 15.1267 29.7067 15.1267 27.0733Z" fill="#FBBC05"/>
                <path d="M29.6667 12.5333C33.6733 12.5333 37.0433 13.92 39.09 17.9533L44.2033 14.8C41.1167 11.06 35.95 8.66667 29.6667 8.66667C21.5733 8.66667 15.1267 15.1133 15.1267 23.2067H24V14.8H29.6667V12.5333Z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>
          </div>
        ) : (
          <form onSubmit={handleEmailSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                className={
                  "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 " +
                  (isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-600'
                    : 'border-gray-300 text-gray-900 focus:ring-blue-500')
                }
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
                className={
                  "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 " +
                  (isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-600'
                    : 'border-gray-300 text-gray-900 focus:ring-blue-500')
                }
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className={
                "w-full py-3 px-4 rounded-lg font-semibold " +
                (isDarkMode
                  ? 'bg-blue-700 hover:bg-blue-800 text-white'
                  : 'bg-blue-500 hover:bg-blue-600 text-white')
              }
            >
              {isSignUp ? 'Sign Up' : 'Login'}
            </button>
          </form>
        )}

        <p
          className={
            (isDarkMode ? 'text-gray-400' : 'text-gray-500') +
            ' text-xs text-center mt-4'
          }
        >
          {isEmailFlow
            ? isSignUp
              ? 'Already have an account? '
              : 'Don\'t have an account? '
            : ''}
          <button
            className="text-blue-500 hover:underline ml-1"
            onClick={() => {
              if (isEmailFlow) {
                setIsSignUp(!isSignUp);
                setError(''); // Clear error on switch
              }
              else {
                setIsEmailFlow(true);
                setIsSignUp(true);
                setError(''); // Clear error on switch
              }
            }}
          >
            {isEmailFlow ? (isSignUp ? 'Login' : 'Sign Up') : 'Sign Up'}
          </button>
        </p>

        {!isEmailFlow && (
          <p
            className={
              (isDarkMode ? 'text-gray-400' : 'text-gray-500') +
              ' text-xs text-center mt-2'
            }
          >
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        )}
      </div>
    </div>
  );
};

export default LoginModal;