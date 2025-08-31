import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { signInWithGoogle, getGoogleRedirectResult } from '../config/firebase';

export interface User {
  _id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  provider: string;
  role?: 'user' | 'admin';
  totalPoints: number;
  badges: string[];
  streak: number;
  progress: any;
  createdAt?: string;
  updatedAt?: string;
}

type AuthError = {
  message: string;
  code?: string;
};

interface AuthContextType {
  currentUser: User | null;
  logout: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  googleSignIn: () => Promise<void>;
  emailSignup: (email: string, password: string, displayName: string) => Promise<void>;
  emailLogin: (email: string, password: string) => Promise<void>;
  loading: boolean;
  error: AuthError | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);

  useEffect(() => {
    const loadUser = async () => {
  setLoading(true);
      try {
        // First, check for Google redirect result
        const redirectResult = await getGoogleRedirectResult();
        if (redirectResult) {
          // User just completed Google OAuth redirect
          const idToken = await redirectResult.user.getIdToken();
          const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/google`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idToken }),
          });
          
          const data = await response.json();
          if (response.ok) {
            setCurrentUser(data.user);
            localStorage.setItem('authToken', data.token);
    setLoading(false);
    return; // Exit early, we're done
          }
        }
        
        // Otherwise, check for existing token
        const token = localStorage.getItem('authToken');
        if (token) {
          try {
            const response = await apiService.getProfile();
            setCurrentUser(response.user);
          } catch (error) {
            // Invalid token, remove it
            localStorage.removeItem('authToken');
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // Clean up on error
        localStorage.removeItem('authToken');
  } finally {
    setLoading(false);
      }
    };

    loadUser();
  }, []);

  const emailSignup = async (email: string, password: string, displayName: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.signup({ email, password, displayName });
      setCurrentUser(response.user);
      localStorage.setItem('authToken', response.token);
    } catch (error: any) {
      const errorMessage = error.message || 'Registration failed';
      setError({ message: errorMessage, code: error.code });
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const emailLogin = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.login({ email, password });
      setCurrentUser(response.user);
      localStorage.setItem('authToken', response.token);
    } catch (error: any) {
      const errorMessage = error.message || 'Login failed';
      setError({ message: errorMessage, code: error.code });
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Aliases for consistency with Auth page
  const login = emailLogin;
  const register = emailSignup;

  const googleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      // signInWithGoogle now triggers a redirect, so this function won't return normally
      // The actual authentication will be handled in the useEffect when the user returns
      await signInWithGoogle();
      // This line won't be reached because of the redirect
    } catch (error: any) {
      const errorMessage = error.message || 'Google sign-in failed';
      setError({ message: errorMessage, code: error.code });
      setLoading(false);
      throw new Error(errorMessage);
    }
  };

  const logout = async () => {
    setCurrentUser(null);
    localStorage.removeItem('authToken');
    await apiService.logout();
  };

  const clearError = () => setError(null);

  const value = {
    currentUser,
    logout,
    login,
    register,
    googleSignIn,
    emailSignup,
    emailLogin,
    loading,
    error,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Export both the context and the hook
export { AuthContext };
export default AuthContext;