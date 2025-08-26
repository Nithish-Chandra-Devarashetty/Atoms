import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithRedirect,
  getRedirectResult,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBtYslkFY9WrqWg3KmOXjQ7k9l1_Aj5xvg",
  authDomain: "atoms-439417.firebaseapp.com",
  projectId: "atoms-439417",
  storageBucket: "atoms-439417.firebasestorage.app",
  messagingSenderId: "866135141015",
  appId: "1:866135141015:web:2c8e8c9e5f5e1b2a3b4c5d"
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

// Function to handle the redirect result
export const getGoogleRedirectResult = () => {
  return getRedirectResult(auth);
};

export const signOutUser = () => {
  return signOut(auth);
};

export const onAuthStateChange = onAuthStateChanged;

export default app;
