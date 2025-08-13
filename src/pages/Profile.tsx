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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-500/10 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-blue-500/10 blur-3xl animate-pulse delay-2000"></div>
      </div>
      
      <div className="max-w-7xl mx-auto">
        {/* Profile Header */}
        <div className="relative bg-white/5 backdrop-blur-md border border-white/10 p-8 mb-8 text-white z-10">
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
              <h1 className="text-4xl font-black text-white mb-2">{userStats.name}</h1>
              <p className="text-gray-300 mb-4">{userStats.username}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-3xl font-black text-cyan-400">#{userStats.rank}</div>
                  <div className="text-gray-300 text-sm">Global Rank</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-green-400">{userStats.totalPoints}</div>
                  <div className="text-gray-300 text-sm">Total Points</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-purple-400">{userStats.followers}</div>
                  <div className="text-gray-300 text-sm">Followers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-orange-400">{userStats.streak}</div>
                  <div className="text-gray-300 text-sm">Day Streak</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 text-gray-300">
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
            <div className="relative bg-white/5 backdrop-blur-md border border-white/10 p-8 text-white z-10">
              <h2 className="text-3xl font-black text-white mb-8">Learning Progress</h2>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Code className="w-6 h-6 text-cyan-400 mr-3" />
                    <div>
                      <div className="font-semibold text-white">Web Development</div>
                      <div className="text-sm text-gray-300">{progress.webdev.completed}/{progress.webdev.total} modules</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-white/20 h-2">
                      <div 
                        className="h-2 bg-gradient-to-r from-cyan-400 to-blue-500"
                        style={{ width: `${progress.webdev.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-300">{progress.webdev.percentage}%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <BookOpen className="w-6 h-6 text-green-400 mr-3" />
                    <div>
                      <div className="font-semibold text-white">Core CS</div>
                      <div className="text-sm text-gray-300">{progress.core.completed}/{progress.core.total} subjects</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-white/20 h-2">
                      <div 
                        className="h-2 bg-gradient-to-r from-green-400 to-emerald-400"
                        style={{ width: `${progress.core.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-300">{progress.core.percentage}%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Brain className="w-6 h-6 text-purple-400 mr-3" />
                    <div>
                      <div className="font-semibold text-white">DSA Practice</div>
                      <div className="text-sm text-gray-300">{progress.dsa.completed}/{progress.dsa.total} problems</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-white/20 h-2">
                      <div 
                        className="h-2 bg-gradient-to-r from-purple-400 to-pink-400"
                        style={{ width: `${progress.dsa.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-300">{progress.dsa.percentage}%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Calculator className="w-6 h-6 text-orange-400 mr-3" />
                    <div>
                      <div className="font-semibold text-white">Aptitude</div>
                      <div className="text-sm text-gray-300">{progress.aptitude.completed}/{progress.aptitude.total} topics</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-white/20 h-2">
                      <div 
                        className="h-2 bg-gradient-to-r from-orange-400 to-red-400"
                        style={{ width: `${progress.aptitude.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-300">{progress.aptitude.percentage}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="relative bg-white/5 backdrop-blur-md border border-white/10 p-8 text-white z-10">
              <h2 className="text-3xl font-black text-white mb-8">Recent Activity</h2>
              
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-sm border border-white/10">
                    <div className="flex items-center">
                      {activity.type === 'quiz' && <Target className="w-5 h-5 text-cyan-400 mr-3" />}
                      {activity.type === 'problem' && <Brain className="w-5 h-5 text-purple-400 mr-3" />}
                      {activity.type === 'badge' && <Award className="w-5 h-5 text-green-400 mr-3" />}
                      
                      <div>
                        <div className="font-medium text-white">
                          {activity.type === 'quiz' && `${activity.subject} Quiz`}
                          {activity.type === 'problem' && activity.name}
                          {activity.type === 'badge' && `Earned ${activity.subject}`}
                        </div>
                        <div className="text-sm text-gray-300">
                          {activity.type === 'quiz' && `Score: ${activity.score}%`}
                          {activity.type === 'problem' && activity.subject}
                          {activity.type === 'badge' && 'Achievement unlocked'}
                        </div>
                      </div>
                    </div>
                    <span className="text-sm text-gray-400">{activity.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Badges */}
            <div className="relative bg-white/5 backdrop-blur-md border border-white/10 p-8 text-white z-10">
              <h2 className="text-3xl font-black text-white mb-8">Achievement Badges</h2>
              
              <div className="grid grid-cols-2 gap-4">
                {badges.map((badge, index) => (
                  <div 
                    key={index}
                    className={`p-4 text-center transition-all duration-200 ${
                      badge.earned 
                        ? `bg-gradient-to-r ${getBadgeColor(badge.type)} text-white border border-white/20` 
                        : 'bg-white/5 backdrop-blur-sm border border-white/10 text-gray-500'
                    }`}
                  >
                    <div className="text-2xl mb-2">{badge.earned ? badge.icon : '🔒'}</div>
                    <div className="text-sm font-medium">{badge.name}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Stats */}
            <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white z-10 overflow-hidden">
              {/* Geometric patterns */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-32 h-32 border-2 border-white transform rotate-45"></div>
                <div className="absolute top-10 right-10 w-24 h-24 border-2 border-white transform rotate-12"></div>
                <div className="absolute bottom-10 left-1/4 w-20 h-20 border-2 border-white transform -rotate-12"></div>
              </div>
              
              <h2 className="text-3xl font-black mb-8 relative z-10">Performance</h2>
              
              <div className="space-y-4 relative z-10">
                <div className="flex items-center justify-between">
                  <span>Quiz Average</span>
                  <span className="font-black">87%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Problems Solved</span>
                  <span className="font-black">42</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Study Streak</span>
                  <span className="font-black">{userStats.streak} days</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Time Spent</span>
                  <span className="font-black">24h 30m</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Logout Button */}
          <div className="mt-12 text-center relative z-10">
            <button
              onClick={handleLogout}
              className="flex items-center justify-center mx-auto px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-black text-lg transition-colors"
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