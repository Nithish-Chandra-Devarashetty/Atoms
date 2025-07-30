import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { WebDev } from './pages/WebDev';
import { CoreCS } from './pages/CoreCS';
import { DSA } from './pages/DSA';
import { Aptitude } from './pages/Aptitude';
import { Profile } from './pages/Profile';
import { Discussion } from './pages/Discussion';
import { Messages } from './pages/Messages';
import { Leaderboard } from './pages/Leaderboard';
import { SubjectPage } from './pages/SubjectPage';
import { DSATopicPage } from './pages/DSATopicPage';
import { AptitudeTopicPage } from './pages/AptitudeTopicPage';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
            <Navbar />
            <main className="pt-16">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/webdev" element={<WebDev />} />
                <Route path="/webdev/:subject" element={<SubjectPage />} />
                <Route path="/core" element={<CoreCS />} />
                <Route path="/core/:subject" element={<SubjectPage />} />
                <Route path="/dsa" element={<DSA />} />
                <Route path="/dsa/:topic/:difficulty" element={<DSATopicPage />} />
                <Route path="/dsa/:topic" element={<DSATopicPage />} />
                <Route path="/aptitude" element={<Aptitude />} />
                <Route path="/aptitude/:topic" element={<AptitudeTopicPage />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/discussion" element={<Discussion />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
              </Routes>
            </main>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;