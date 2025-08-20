import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/api';

interface User {
  _id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  provider: string;
  totalPoints: number;
  badges: string[];
  streak: number;
  progress: any;
}

interface AuthContextType {
  currentUser: User | null;
  logout: () => Promise<void>;
  emailSignup: (email: string, password: string, displayName: string) => Promise<void>;
  emailLogin: (email: string, password: string) => Promise<void>;
  loading: boolean;
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
  const [loading, setLoading] = useState(true);

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
    try {
      const response = await apiService.getProfile();
      setCurrentUser(response.user);
    } catch (error) {
      console.error('Failed to load user profile:', error);
      localStorage.removeItem('authToken');
    } finally {
      setLoading(false);
    }
  };

  // Email Signup
  const emailSignup = async (email: string, password: string, displayName: string) => {
    const response = await apiService.register(email, password, displayName);
    localStorage.setItem('authToken', response.token);
    setCurrentUser(response.user);
  };

  // Email Login
  const emailLogin = async (email: string, password: string) => {
    const response = await apiService.login(email, password);
    localStorage.setItem('authToken', response.token);
    setCurrentUser(response.user);
  };

  const logout = async () => {
    localStorage.removeItem('authToken');
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    logout,
    emailSignup,
    emailLogin,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};