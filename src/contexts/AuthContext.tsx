import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { signInWithGoogle, getGoogleRedirectResult, signInWithGooglePopup } from '../config/firebase';
import { GoogleAuthProvider } from 'firebase/auth';

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
        // Handle Google redirect result (popup doesn't use this)
        const redirectResult = await getGoogleRedirectResult();
        if (redirectResult && redirectResult.user) {
          const idToken = extractGoogleIdToken(redirectResult);
          if (!idToken) throw new Error('Google sign-in failed: missing ID token');
          await completeBackendLogin(idToken);
          return;
        }

        // Otherwise, try existing session (our backend JWT)
        const token = localStorage.getItem('authToken');
        if (token) {
          try {
            const response = await apiService.getProfile();
            setCurrentUser(response.user);
          } catch {
            localStorage.removeItem('authToken');
          }
        }
      } catch (e: any) {
        setError({ message: e?.message || 'Authentication initialization failed' });
        localStorage.removeItem('authToken');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Extract Google ID token from Firebase UserCredential
  const extractGoogleIdToken = (result: any): string | undefined => {
    const cred = GoogleAuthProvider.credentialFromResult(result as any);
    if (cred?.idToken) return cred.idToken as string;
    // Fallback to internal token response if available
    const oauthIdToken = (result as any)?._tokenResponse?.oauthIdToken;
    return oauthIdToken as string | undefined;
  };

  // Complete app login by exchanging Google ID token with backend
  const completeBackendLogin = async (googleIdToken: string) => {
    const apiUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/google`;
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken: googleIdToken }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data?.error || data?.message || 'Google authentication failed');
    setCurrentUser(data.user);
    localStorage.setItem('authToken', data.token);
    // Hard redirect to ensure full app state updates
    window.location.href = '/';
  };

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
      // Try popup first for smoother UX
      try {
        const popupResult = await signInWithGooglePopup();
        if (popupResult && popupResult.user) {
          const idToken = extractGoogleIdToken(popupResult);
          if (!idToken) throw new Error('Google sign-in failed: missing ID token');
          await completeBackendLogin(idToken);
          return;
        }
      } catch (popupError) {
        // Fallback to redirect when popup blocked
        await signInWithGoogle();
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Google sign-in failed';
      setError({ message: errorMessage, code: error?.code });
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