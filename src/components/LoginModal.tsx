import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../contexts/AuthContext';

interface LoginModalProps {
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [isEmailFlow, setIsEmailFlow] = useState(false);

  const { emailLogin, emailSignup } = useAuth();

  useEffect(() => {
    // Clear error when switching between login and signup
    setError('');
  }, [isSignUp]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (isSignUp) {
        if (!displayName.trim()) {
          setError('Display name is required');
          return;
        }
        await emailSignup(email.trim(), password.trim(), displayName.trim());
      } else {
        await emailLogin(email.trim(), password.trim());
      }
      onClose();
    } catch (error: any) {
      setError(error.message);
    }
  };

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-40" style={{ top: 'var(--navbar-height, 0)' }}>
      <div className="relative p-8 bg-white/10 backdrop-blur-md border border-white/20 w-96 shadow-2xl">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-300"
          onClick={onClose}
        >
          <span className="text-2xl">&times;</span>
        </button>
        <h2 className="text-3xl font-black mb-8 text-center text-white">{isSignUp ? 'Sign Up' : 'Login'}</h2>

        {error && <p className="text-red-400 text-sm mb-6 text-center bg-red-500/10 backdrop-blur-sm border border-red-500/20 p-3">{error}</p>}

        {!isEmailFlow ? (
          <div className="space-y-6">
            <button
              className="w-full py-4 px-6 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold hover:from-cyan-400 hover:to-purple-500 transition-all duration-300 transform hover:scale-105"
              onClick={() => setIsEmailFlow(true)}
            >
              Login
            </button>
            <div className="text-gray-300 text-center">
              Or continue with
            </div>
            <div className="text-center text-gray-400 text-sm">
              Google Sign-In coming soon
            </div>
          </div>
        ) : (
          <form onSubmit={handleEmailSubmit}>
            {isSignUp && (
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2" htmlFor="displayName">
                  Display Name
                </label>
                <input
                  type="text"
                  id="displayName"
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Enter your display name"
                  required
                />
              </div>
            )}
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
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
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-4 px-6 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold hover:from-cyan-400 hover:to-purple-500 transition-all duration-300 transform hover:scale-105"
            >
              {isSignUp ? 'Sign Up' : 'Login'}
            </button>
          </form>
        )}

        <p className="text-gray-300 text-sm text-center mt-6">
          {isEmailFlow
            ? isSignUp
              ? 'Already have an account? '
              : 'Don\'t have an account? '
            : ''}
          <button
            className="text-cyan-400 hover:text-cyan-300 transition-colors duration-300 ml-1 font-semibold"
            onClick={() => {
              if (isEmailFlow) {
                setIsSignUp(!isSignUp);
                setDisplayName('');
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
          <p className="text-gray-400 text-xs text-center mt-4">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        )}
      </div>
    </div>,
    document.body
  );
};

export default LoginModal;