import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithRedirect,
  signInWithPopup,
  getRedirectResult,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAWQ3C9jlfEwfxe8kZq-a9fa81MXu21_WI",
  authDomain: "zuno-ceba7.firebaseapp.com",
  projectId: "zuno-ceba7",
  storageBucket: "zuno-ceba7.firebasestorage.app",
  messagingSenderId: "508260542193",
  appId: "1:508260542193:web:37f3c4821fb05e2e816b50",
  measurementId: "G-VY82HQSG0T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Google provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});
googleProvider.addScope('email');
googleProvider.addScope('profile');

export { auth, googleProvider };

// Use redirect instead of popup to avoid Cross-Origin-Opener-Policy issues
export const signInWithGoogle = () => {
  return signInWithRedirect(auth, googleProvider);
};

// Popup variant (useful as a fallback in local dev)
export const signInWithGooglePopup = () => {
  return signInWithPopup(auth, googleProvider);
};

// Function to handle the redirect result
export const getGoogleRedirectResult = () => {
  return getRedirectResult(auth);
};

export const signOutUser = () => {
  return signOut(auth);
};

export const onAuthStateChange = onAuthStateChanged;

export default app;
