import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/api';

export interface User {
  _id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  provider: string;
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
  emailSignup: (email: string, password: string, displayName: string) => Promise<void>;
  emailLogin: (email: string, password: string) => Promise<void>;
  loading: boolean;
  error: AuthError | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<AuthError | null>(null);

  useEffect(() => {
    // Check for existing token on app load
    const token = localStorage.getItem('authToken');
    if (token) {
      loadUserProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const loadUserProfile = async () => {
    setLoading(true);
    clearError();
    try {
      const response = await apiService.getProfile();
      setCurrentUser(response.user);
    } catch (error: any) {
      console.error('Failed to load user profile:', error);
      const errorMessage = error.response?.data?.error || 'Failed to load user profile';
      setError({ message: errorMessage });
      // Clear invalid token if exists
      localStorage.removeItem('authToken');
      setCurrentUser(null);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  // Email Signup
  const emailSignup = async (email: string, password: string, displayName: string) => {
    setLoading(true);
    clearError();
    try {
      const response = await apiService.signup({ email, password, displayName });
      localStorage.setItem('authToken', response.token);
      setCurrentUser(response.user);
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Signup failed. Please try again.';
      setError({ message: errorMessage });
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const emailLogin = async (email: string, password: string) => {
    setLoading(true);
    clearError();
    try {
      const response = await apiService.login({ email, password });
      localStorage.setItem('authToken', response.token);
      setCurrentUser(response.user);
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Login failed. Please check your credentials.';
      setError({ message: errorMessage });
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    clearError();
    try {
      await apiService.logout();
      localStorage.removeItem('authToken');
      setCurrentUser(null);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Logout failed. Please try again.';
      setError({ message: errorMessage });
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    currentUser,
    logout,
    emailSignup,
    emailLogin,
    loading,
    error,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};