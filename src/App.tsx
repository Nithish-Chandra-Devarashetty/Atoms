import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import  Navbar  from './components/Navbar';
import { Home } from './pages/Home';
import Auth from './pages/Auth';
import { WebDev } from './pages/WebDev';
import { CoreCS } from './pages/CoreCS';
import { DSA } from './pages/DSA';
import { Aptitude } from './pages/Aptitude';
import { Profile } from './pages/Profile';
import { UserProfile } from './pages/UserProfile';
import { Discussion } from './pages/Discussion';
import { Messages } from './pages/Messages';
import { Notifications } from './pages/Notifications';
import { Leaderboard } from './pages/Leaderboard';
import Contests from './pages/Contests';
import AdminContests from './pages/AdminContests';
import AIQuiz from './pages/AIQuiz';
import { SubjectPage } from './pages/SubjectPage';
import { CoreSubjectPage } from './pages/CoreSubjectPage';
import { DSATopicPage } from './pages/DSATopicPage';
import { AptitudeTopicPage } from './pages/AptitudeTopicPage';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import Contact from './pages/Contact';
import { TestAuth } from './pages/TestAuth';
import { Footer } from './components/Footer';
import { WebSocketDebugger } from './components/WebSocketDebugger';
import { ActiveTimeManager } from './components/ActiveTimeManager';

function App() {
  useEffect(() => {
    document.documentElement.style.setProperty('--navbar-height', '4rem'); // 4rem = h-16
  }, []);

  // Heartbeat is managed by ActiveTimeManager inside AuthProvider

  return (
    <ThemeProvider>
      <AuthProvider>
  <ActiveTimeManager />
        <Router>
          <div className="min-h-screen bg-black text-white transition-colors duration-300">
            <Navbar />
            <main>
              <Routes>
                {/* Public routes */}
                <Route path="/auth" element={<Auth />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/admin/contests" element={<AdminContests />} />

                {/* All other routes require authentication */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/webdev" element={<WebDev />} />
                  <Route path="/webdev/:subject" element={<SubjectPage />} />
                  <Route path="/core" element={<CoreCS />} />
                  <Route path="/core/:subject" element={<CoreSubjectPage />} />
                  <Route path="/dsa" element={<DSA />} />
                  <Route path="/dsa/:topic/:difficulty" element={<DSATopicPage />} />
                  <Route path="/dsa/:topic" element={<DSATopicPage />} />
                  <Route path="/aptitude" element={<Aptitude />} />
                  <Route path="/aptitude/:topic" element={<AptitudeTopicPage />} />
                  <Route path="/user/:userId" element={<UserProfile />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/discussion" element={<Discussion />} />
                  <Route path="/messages" element={<Messages />} />
                  <Route path="/notifications" element={<Notifications />} />
                  <Route path="/leaderboard" element={<Leaderboard />} />
                  <Route path="/contests" element={<Contests />} />
                  <Route path="/ai" element={<AIQuiz />} />
                  <Route path="/AIQuiz" element={<Navigate to="/ai" replace />} />
                  <Route path="/test-auth" element={<TestAuth />} />
                </Route>
              </Routes>
            </main>
            <Footer />
            {/* WebSocket Debugger - only show in development or when needed */}
            {((import.meta as any)?.env?.DEV || window.location.search.includes('debug=ws')) && <WebSocketDebugger />}
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;