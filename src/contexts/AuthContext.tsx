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
          const idToken = await extractGoogleIdToken(redirectResult);
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

  // Extract Google ID token from Firebase UserCredential with multiple fallbacks
  const extractGoogleIdToken = async (result: any): Promise<string | undefined> => {
    // Priority 1: Credential object
    try {
      const cred = GoogleAuthProvider.credentialFromResult(result as any);
      if (cred?.idToken) return cred.idToken as string;
    } catch (e) {
      console.warn('[GoogleAuth] credentialFromResult failed:', e);
    }
    // Priority 2: _tokenResponse fields
    try {
      const tokenResponse = (result as any)?._tokenResponse;
      const oauthIdToken = tokenResponse?.oauthIdToken || tokenResponse?.idToken;
      if (oauthIdToken) return oauthIdToken as string;
    } catch (e) {
      console.warn('[GoogleAuth] tokenResponse parse failed:', e);
    }
    // Priority 3: Ask Firebase user directly
    try {
      const user = (result as any)?.user;
      if (user && typeof user.getIdToken === 'function') {
        const direct = await user.getIdToken();
        if (direct) return direct as string;
      }
    } catch (e) {
      console.warn('[GoogleAuth] user.getIdToken() failed:', e);
    }
    console.error('[GoogleAuth] Failed to extract Google ID token from sign-in result');
    return undefined;
  };

  // Complete app login by exchanging Google ID token with backend
  const completeBackendLogin = async (googleIdToken: string) => {
    // Build base API URL robustly (avoid duplicate /api)
    const rawBase = (import.meta as any).env?.VITE_API_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const base = rawBase.replace(/\/$/, '');
    const apiBase = base.endsWith('/api') ? base : `${base}`; // we already expect api route base
    const endpoint = `${apiBase}/auth/google`;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken: googleIdToken }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        console.error('[GoogleAuth] Backend auth failed', { status: response.status, data });
        throw new Error(data?.error || data?.message || 'Google authentication failed');
      }
      if (!data?.token || !data?.user) {
        console.error('[GoogleAuth] Backend response missing token or user', data);
        throw new Error('Invalid authentication response');
      }
      localStorage.setItem('authToken', data.token);
      setCurrentUser(data.user);
      // Soft navigation rather than hard reload to preserve SPA state; fallback to full reload if needed
      window.location.replace('/');
    } catch (e: any) {
      setError({ message: e?.message || 'Google authentication failed' });
      throw e;
    }
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
          const idTokenExtracted = await extractGoogleIdToken(popupResult);
            if (!idTokenExtracted) throw new Error('Google sign-in failed: missing ID token');
          await completeBackendLogin(idTokenExtracted);
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
    // If we reached here without redirect or completion, stop loading
    setLoading(false);
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