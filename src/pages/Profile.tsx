import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { ProfilePhotoUpload } from '../components/ProfilePhotoUpload';
import { 
  User, 
  Trophy, 
  Users, 
  Target, 
  Calendar,
  Award,
  TrendingUp,
  BookOpen,
  Code,
  Brain,
  Calculator,
  LogOut
} from 'lucide-react';

export const Profile: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const userStats = {
    name: currentUser?.displayName || 'Anonymous User',
    username: currentUser?.email || '@user',
    rank: 42,
    totalUsers: 1250,
    followers: 156,
    following: 89,
    joinDate: 'March 2024',
    totalPoints: 2450,
    streak: 15
  };

  const badges = [
    { name: 'HTML Master', icon: '🏅', type: 'feast', earned: true },
    { name: 'Arrays Silver', icon: '🥈', type: 'silver', earned: true },
    { name: 'Strings Gold', icon: '🥇', type: 'gold', earned: true },
    { name: 'CSS Expert', icon: '🏅', type: 'feast', earned: true },
    { name: 'Trees Silver', icon: '🥈', type: 'silver', earned: true },
    { name: 'JavaScript Pro', icon: '🏅', type: 'feast', earned: false },
    { name: 'DP Gold', icon: '🥇', type: 'gold', earned: false },
    { name: 'Diamond Master', icon: '💎', type: 'diamond', earned: false }
  ];

  const progress = {
    webdev: { completed: 3, total: 6, percentage: 50 },
    core: { completed: 2, total: 3, percentage: 67 },
    dsa: { completed: 12, total: 150, percentage: 8 },
    aptitude: { completed: 2, total: 8, percentage: 25 }
  };

  const recentActivity = [
    { type: 'quiz', subject: 'HTML', score: 95, date: '2 hours ago' },
    { type: 'problem', subject: 'Arrays', name: 'Two Sum', date: '1 day ago' },
    { type: 'badge', subject: 'CSS Expert', date: '2 days ago' },
    { type: 'quiz', subject: 'Operating Systems', score: 88, date: '3 days ago' }
  ];

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'silver': return 'from-gray-400 to-gray-500';
      case 'gold': return 'from-yellow-400 to-yellow-500';
      case 'diamond': return 'from-blue-400 to-purple-500';
      case 'feast': return 'from-green-400 to-green-500';
      default: return 'from-gray-300 to-gray-400';
    }
  };

  return (
    <div className={`min-h-screen py-8 px-4 sm:px-6 lg:px-8 ${isDarkMode ? 'bg-gray-900' : ''} transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto">
        {/* Profile Header */}
        <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-100'} rounded-2xl p-8 mb-8 shadow-lg border transition-colors duration-300`}>
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
            {/* Avatar */}
            <div className="relative">
              <ProfilePhotoUpload 
                currentPhotoURL={currentUser?.photoURL || undefined}
                onPhotoUpdate={(url) => console.log('Photo updated:', url)}
              />
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>{userStats.name}</h1>
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}>{userStats.username}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">#{userStats.rank}</div>
                  <div className="text-gray-600 text-sm">Global Rank</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{userStats.totalPoints}</div>
                  <div className="text-gray-600 text-sm">Total Points</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{userStats.followers}</div>
                  <div className="text-gray-600 text-sm">Followers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{userStats.streak}</div>
                  <div className="text-gray-600 text-sm">Day Streak</div>
                </div>
              </div>

              <div className={`flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  <span>{userStats.following} Following</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>Joined {userStats.joinDate}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Progress Overview */}
            <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-100'} rounded-2xl p-8 shadow-lg border transition-colors duration-300`}>
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-6`}>Learning Progress</h2>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Code className="w-6 h-6 text-blue-600 mr-3" />
                    <div>
                      <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Web Development</div>
                      <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{progress.webdev.completed}/{progress.webdev.total} modules</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                        style={{ width: `${progress.webdev.percentage}%` }}
                      ></div>
                    </div>
                    <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{progress.webdev.percentage}%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <BookOpen className="w-6 h-6 text-green-600 mr-3" />
                    <div>
                      <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Core CS</div>
                      <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{progress.core.completed}/{progress.core.total} subjects</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                        style={{ width: `${progress.core.percentage}%` }}
                      ></div>
                    </div>
                    <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{progress.core.percentage}%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Brain className="w-6 h-6 text-purple-600 mr-3" />
                    <div>
                      <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>DSA Practice</div>
                      <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{progress.dsa.completed}/{progress.dsa.total} problems</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                        style={{ width: `${progress.dsa.percentage}%` }}
                      ></div>
                    </div>
                    <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{progress.dsa.percentage}%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Calculator className="w-6 h-6 text-orange-600 mr-3" />
                    <div>
                      <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Aptitude</div>
                      <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{progress.aptitude.completed}/{progress.aptitude.total} topics</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
                        style={{ width: `${progress.aptitude.percentage}%` }}
                      ></div>
                    </div>
                    <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{progress.aptitude.percentage}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-100'} rounded-2xl p-8 shadow-lg border transition-colors duration-300`}>
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-6`}>Recent Activity</h2>
              
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className={`flex items-center justify-between p-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg transition-colors duration-300`}>
                    <div className="flex items-center">
                      {activity.type === 'quiz' && <Target className="w-5 h-5 text-blue-600 mr-3" />}
                      {activity.type === 'problem' && <Brain className="w-5 h-5 text-purple-600 mr-3" />}
                      {activity.type === 'badge' && <Award className="w-5 h-5 text-green-600 mr-3" />}
                      
                      <div>
                        <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {activity.type === 'quiz' && `${activity.subject} Quiz`}
                          {activity.type === 'problem' && activity.name}
                          {activity.type === 'badge' && `Earned ${activity.subject}`}
                        </div>
                        <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {activity.type === 'quiz' && `Score: ${activity.score}%`}
                          {activity.type === 'problem' && activity.subject}
                          {activity.type === 'badge' && 'Achievement unlocked'}
                        </div>
                      </div>
                    </div>
                    <span className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>{activity.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Badges */}
            <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-100'} rounded-2xl p-8 shadow-lg border transition-colors duration-300`}>
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-6`}>Achievement Badges</h2>
              
              <div className="grid grid-cols-2 gap-4">
                {badges.map((badge, index) => (
                  <div 
                    key={index}
                    className={`p-4 rounded-lg text-center transition-all duration-200 ${
                      badge.earned 
                        ? `bg-gradient-to-r ${getBadgeColor(badge.type)} text-white shadow-lg` 
                        : `${isDarkMode ? 'bg-gray-700 text-gray-500' : 'bg-gray-100 text-gray-400'}`
                    }`}
                  >
                    <div className="text-2xl mb-2">{badge.earned ? badge.icon : '🔒'}</div>
                    <div className="text-sm font-medium">{badge.name}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Stats */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
              <h2 className="text-2xl font-bold mb-6">Performance</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Quiz Average</span>
                  <span className="font-bold">87%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Problems Solved</span>
                  <span className="font-bold">42</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Study Streak</span>
                  <span className="font-bold">{userStats.streak} days</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Time Spent</span>
                  <span className="font-bold">24h 30m</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Logout Button */}
          <div className="mt-12 text-center">
            <button
              onClick={handleLogout}
              className={`flex items-center justify-center mx-auto px-8 py-3 rounded-lg font-semibold text-lg transition-colors ${
                isDarkMode 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-red-500 hover:bg-red-600 text-white'
              }`}
            >
              <LogOut size={20} className="mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};