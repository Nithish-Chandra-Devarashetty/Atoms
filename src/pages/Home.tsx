import React from 'react';
import { Link } from 'react-router-dom';
import BadgeSystemInfo from '../components/BadgeSystemInfo';
import { 
  Code, 
  Database, 
  Brain, 
  Calculator, 
  Trophy, 
  Users, 
  BookOpen,
  Zap,
  Target,
  Award,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';

export const Home: React.FC = () => {
  const features = [
    {
      icon: Code,
      title: 'Web Development',
      description: 'Master HTML, CSS, JavaScript, React, Node.js and more',
      path: '/webdev',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Database,
      title: 'Core CS Subjects',
      description: 'Operating Systems, DBMS, Computer Networks',
      path: '/core',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Brain,
      title: 'DSA Practice',
      description: 'Data Structures & Algorithms with LeetCode problems',
      path: '/dsa',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Calculator,
      title: 'Aptitude Tests',
      description: 'Quantitative aptitude and logical reasoning',
      path: '/aptitude',
      color: 'from-orange-500 to-red-500'
    }
  ];

  const stats = [
    { icon: BookOpen, label: 'Learning Modules', value: '50+' },
    { icon: Users, label: 'Active Learners', value: '10K+' },
    { icon: Award, label: 'Badges Available', value: '25+' },
    { icon: Target, label: 'Practice Problems', value: '500+' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-blue-500/20 blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-pink-500/20 blur-3xl animate-pulse delay-2000"></div>
      </div>
      
      {/* Hero Section */}
      <section className="relative py-12 sm:py-20 px-4 sm:px-6 lg:px-8 z-10">
        <div className="max-w-7xl mx-auto text-center">
          {/* Floating badge */}
          <div className="inline-flex items-center px-3 sm:px-4 py-2 mb-6 sm:mb-8 bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs sm:text-sm font-medium">
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-yellow-400" />
            AI-Powered Learning Platform
            <div className="ml-2 w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
          </div>
          
          <div className="mb-6 sm:mb-8">
            <h1 className="heading-font text-4xl sm:text-6xl md:text-8xl font-black text-white mb-4 sm:mb-6 tracking-tight">
              Welcome to Atoms
            </h1>
            <p className="text-base sm:text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-light">
              Your AI-powered, gamified learning companion for mastering web development, 
              computer science, DSA, and aptitude skills.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-12 sm:mb-20">
            <Link
              to="/webdev"
              className="group relative w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold text-base sm:text-lg overflow-hidden transform hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/25 text-center"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center justify-center">
              Start Learning
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </Link>
            <Link
              to="/ai"
              className="group relative w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold text-base sm:text-lg hover:bg-white/20 transition-all duration-300 hover:shadow-xl text-center"
            >
              <div className="relative flex items-center justify-center">
                Compete with AI
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </Link>
            <Link
              to="/leaderboard"
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold text-base sm:text-lg hover:bg-white/20 transition-all duration-300 hover:shadow-xl text-center"
            >
              View Leaderboard
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 mb-12 sm:mb-20">
            {stats.map(({ icon: Icon, label, value }) => (
              <div key={label} className="text-center group">
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-white/10 backdrop-blur-md border border-white/20 mb-2 sm:mb-4 group-hover:bg-white/20 transition-all duration-300">
                  <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400" />
                </div>
                <div className="text-xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">{value}</div>
                <div className="text-sm sm:text-base text-gray-300">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Contests (Glassmorphism) - Featured prominently */}
      <section className="relative py-12 sm:py-20 px-4 sm:px-6 lg:px-8 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center px-3 sm:px-4 py-2 mb-4 bg-gradient-to-r from-red-500/20 to-orange-500/20 backdrop-blur-md border border-red-400/30 text-red-200 text-xs sm:text-sm font-medium rounded-full">
              🔥 FEATURED
            </div>
            <h2 className="heading-font text-3xl sm:text-5xl font-black text-white mb-3 sm:mb-4">
              Live Contests
            </h2>
            <p className="text-base sm:text-xl text-gray-300 max-w-3xl mx-auto">
              Join scheduled competitions and earn up to 200 points based on your performance
            </p>
          </div>
          
          <div className="relative border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden">
            {/* subtle gradient overlay */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10" />
            <div className="relative p-6 sm:p-8 md:p-12">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 sm:gap-8">
                <div className="max-w-2xl">
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-2 sm:mb-3">Compete in Timed Challenges</h3>
                  <p className="text-sm sm:text-base text-gray-200/90 leading-relaxed">
                    Join scheduled, time-bound challenges with curated questions.
                  </p>
                </div>
                <div className="shrink-0">
                  <RouterLink
                    to="/contests"
                    className="group inline-flex items-center w-full sm:w-auto justify-center px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold text-base sm:text-lg transform hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/25"
                  >
                    Join Contests Now
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                  </RouterLink>
                </div>
              </div>

              {/* Feature bullets removed as requested */}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-12 sm:py-20 px-4 sm:px-6 lg:px-8 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="heading-font text-3xl sm:text-5xl font-black text-white mb-3 sm:mb-4">
              Everything You Need to Excel
            </h2>
            <p className="text-base sm:text-xl text-gray-300 max-w-2xl mx-auto">
              Comprehensive learning paths designed to take you from beginner to expert
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {features.map(({ icon: Icon, title, description, path, color }) => (
              <Link
                key={title}
                to={path}
                className="group relative p-6 sm:p-8 bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl overflow-hidden"
              >
                {/* Hover gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                
                <div className={`relative inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r ${color} mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300 clip-path-hexagon`}>
                  <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="relative text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">{title}</h3>
                <p className="relative text-sm sm:text-base text-gray-300 leading-relaxed">{description}</p>
                
                {/* Arrow indicator */}
                <div className="relative mt-3 sm:mt-4 flex items-center text-cyan-400 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-0 group-hover:translate-x-2">
                  <span className="text-xs sm:text-sm font-semibold">Explore</span>
                  <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-2" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Gamification Section */}
      <section className="relative py-12 sm:py-20 px-4 sm:px-6 lg:px-8 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 p-6 sm:p-8 md:p-12 text-center text-white overflow-hidden">
            {/* Geometric patterns */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-20 sm:w-32 h-20 sm:h-32 border-2 border-white transform rotate-45"></div>
              <div className="absolute top-4 sm:top-10 right-4 sm:right-10 w-16 sm:w-24 h-16 sm:h-24 border-2 border-white transform rotate-12"></div>
              <div className="absolute bottom-4 sm:bottom-10 left-1/4 w-12 sm:w-20 h-12 sm:h-20 border-2 border-white transform -rotate-12"></div>
            </div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-md mb-4 sm:mb-6">
                <Zap className="w-8 h-8 sm:w-10 sm:h-10" />
              </div>
              <h2 className="heading-font text-2xl sm:text-3xl md:text-5xl font-black mb-4 sm:mb-6">Gamified Learning Experience</h2>
              <p className="text-base sm:text-xl mb-6 sm:mb-10 max-w-2xl mx-auto opacity-90 font-light">
              Earn badges, climb leaderboards, and track your progress as you master new skills
            </p>
              <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-8 text-sm sm:text-lg">
              <div className="flex items-center justify-center space-x-2 sm:space-x-3 bg-white/10 backdrop-blur-md px-4 sm:px-6 py-2 sm:py-3">
                <Trophy className="w-4 h-4 sm:w-6 sm:h-6" />
                <span>Leaderboards</span>
              </div>
              <div className="flex items-center justify-center space-x-2 sm:space-x-3 bg-white/10 backdrop-blur-md px-4 sm:px-6 py-2 sm:py-3">
                <Award className="w-4 h-4 sm:w-6 sm:h-6" />
                <span>Achievement Badges</span>
              </div>
              <div className="flex items-center justify-center space-x-2 sm:space-x-3 bg-white/10 backdrop-blur-md px-4 sm:px-6 py-2 sm:py-3">
                <Target className="w-4 h-4 sm:w-6 sm:h-6" />
                <span>Progress Tracking</span>
              </div>
            </div>
            </div>
          </div>
        </div>
      </section>

      {/* Badge System Section */}
      <section className="relative py-12 sm:py-20 px-4 sm:px-6 lg:px-8 z-10">
        <div className="max-w-7xl mx-auto">
          <BadgeSystemInfo />
        </div>
      </section>

      {/* Points System Section */}
      <section className="relative py-12 sm:py-20 px-4 sm:px-6 lg:px-8 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 sm:p-10 text-white">
            <h2 className="text-2xl sm:text-4xl font-black mb-4 sm:mb-6">Points System</h2>
            <p className="text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base">Earn points as you learn. These points determine your position on the leaderboard.</p>
            <ul className="space-y-2 sm:space-y-3 text-sm sm:text-lg">
              <li className="flex items-start"><span className="mt-1 mr-2 sm:mr-3 text-cyan-400">•</span> Live Contests: +100 points for participating; Top 10 finish: +100 bonus; Ranks 11-100: +50 bonus.</li>
              <li className="flex items-start"><span className="mt-1 mr-2 sm:mr-3 text-cyan-400">•</span> Web Development: +10 points for each quiz passed (per topic) and +10 points for each video watched (first time only).</li>
              <li className="flex items-start"><span className="mt-1 mr-2 sm:mr-3 text-cyan-400">•</span> Core CS (OS/DBMS/CN): +10 points for each topic quiz you pass.</li>
              <li className="flex items-start"><span className="mt-1 mr-2 sm:mr-3 text-cyan-400">•</span> DSA Practice: +2 points for each unique problem you solve.</li>
              <li className="flex items-start"><span className="mt-1 mr-2 sm:mr-3 text-cyan-400">•</span> Aptitude: +30 points for each topic you complete.</li>
              <li className="flex items-start"><span className="mt-1 mr-2 sm:mr-3 text-cyan-400">•</span> Daily Login: +1 point the first time you log in each day.</li>
            </ul>
            <div className="mt-4 sm:mt-6 text-cyan-300 font-semibold text-sm sm:text-base">Users with the most points will be at the top of the leaderboard.</div>
          </div>
        </div>
      </section>
    </div>
  );
};