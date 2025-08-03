import React from 'react';
import { Link } from 'react-router-dom';
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
  Award
} from 'lucide-react';

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
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
              Welcome to Atoms
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Your AI-powered, gamified learning companion for mastering web development, 
              computer science, DSA, and aptitude skills.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link
              to="/webdev"
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              Start Learning
            </Link>
            <Link
              to="/leaderboard"
              className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold text-lg hover:border-gray-400 hover:shadow-md transition-all duration-200"
            >
              View Leaderboard
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
            {stats.map(({ icon: Icon, label, value }) => (
              <div key={label} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl mb-4">
                  <Icon className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{value}</div>
                <div className="text-gray-600">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Excel
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive learning paths designed to take you from beginner to expert
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map(({ icon: Icon, title, description, path, color }) => (
              <Link
                key={title}
                to={path}
                className="group p-8 bg-white rounded-2xl border border-gray-200 hover:border-transparent hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${color} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
                <p className="text-gray-600 leading-relaxed">{description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Gamification Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center text-white">
            <Zap className="w-16 h-16 mx-auto mb-6" />
            <h2 className="text-4xl font-bold mb-4">Gamified Learning Experience</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Earn badges, climb leaderboards, and track your progress as you master new skills
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-lg">
              <div className="flex items-center space-x-2">
                <Trophy className="w-6 h-6" />
                <span>Leaderboards</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="w-6 h-6" />
                <span>Achievement Badges</span>
              </div>
              <div className="flex items-center space-x-2">
                <Target className="w-6 h-6" />
                <span>Progress Tracking</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};