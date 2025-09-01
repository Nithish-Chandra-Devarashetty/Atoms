import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';
import { 
  Trophy, 
  Medal, 
  Crown, 
  TrendingUp, 
  Award,
  Target
} from 'lucide-react';

interface LeaderboardEntry {
  rank: number;
  _id: string;
  name: string;
  points: number;
  badges: number;
  streak: number;
  change: number; // Position change from last week
}

export const Leaderboard: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRank, setUserRank] = useState<number | null>(null);
  // Removed totalUsers display; keep only userRank

  React.useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    setLoading(true);
    try {
      // Remove timeframe and category parameters since we only use overall points
      const response = await apiService.getLeaderboard('all', 'overall');
      const formattedData = response.leaderboard.map((entry: any, index: number) => ({
        rank: index + 1,
        _id: entry._id,
        name: entry.name,
        points: entry.points,
        badges: entry.badges,
        streak: entry.streak,
        change: 0 // Would need historical data to calculate
      }));
      setLeaderboardData(formattedData);
      setUserRank(response.userRank);
  // totalUsers not displayed
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2: return <Medal className="w-6 h-6 text-gray-400" />;
      case 3: return <Medal className="w-6 h-6 text-amber-600" />;
      default: return <span className="text-lg font-bold text-white">#{rank}</span>;
    }
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (change < 0) return <TrendingUp className="w-4 h-4 text-red-500 transform rotate-180" />;
    return <div className="w-4 h-4 bg-gray-300 rounded-full"></div>;
  };

  const getRowStyle = (name: string) => {
    // Only highlight current user's row
    if (currentUser && name === currentUser.displayName) return 'bg-blue-500/10 border-blue-500/30 border-2';
    // All other rows have the same normal styling
    return 'bg-white/5 border border-white/10';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-yellow-900 to-slate-900 py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-500/10 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-orange-500/10 blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-amber-500/10 blur-3xl animate-pulse delay-2000"></div>
      </div>
      
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16 relative z-10">
          <h1 className="heading-font text-3xl sm:text-5xl md:text-7xl font-black text-white mb-4 sm:mb-6 tracking-tight">
            Leaderboard
          </h1>
          <p className="text-base sm:text-xl text-gray-300 font-light mb-3 sm:mb-4">
            See how you rank against other learners in the community
          </p>
      {currentUser && userRank && (
            <div className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm sm:text-base">
              <Trophy className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-yellow-400" />
              <span className="font-semibold">
        Your Rank: #{userRank}
              </span>
            </div>
          )}
        </div>

        {/* Top 3 Podium */}
        {leaderboardData.length >= 3 && !loading && (
          <div className="mb-12 sm:mb-20 relative z-10">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-4xl font-black text-white mb-2">Top 3 Champions</h2>
              <div className="w-24 sm:w-32 h-1 bg-gradient-to-r from-yellow-400 to-orange-400 mx-auto"></div>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center items-center sm:items-end space-y-4 sm:space-y-0 sm:space-x-8 lg:space-x-12 max-w-4xl mx-auto">
              {/* 2nd Place */}
              <div className="text-center w-full sm:flex-1 max-w-xs order-2 sm:order-1">
                <div className="w-20 h-28 sm:w-32 sm:h-40 bg-gradient-to-t from-gray-300 to-gray-400 flex items-center justify-center mb-3 sm:mb-6 mx-auto shadow-lg">
                  <span className="text-2xl sm:text-5xl font-black text-white">2</span>
                </div>
                <div className="font-black text-white text-sm sm:text-lg mb-1">{leaderboardData[1]?.name || 'N/A'}</div>
                <div className="text-white text-sm sm:text-lg font-semibold">{leaderboardData[1]?.points?.toLocaleString() || 0} pts</div>
                <div className="text-xs text-gray-300 mt-1 sm:mt-2">Silver Medal</div>
              </div>

              {/* 1st Place */}
              <div className="text-center w-full sm:flex-1 max-w-xs order-1 sm:order-2 mb-2 sm:mb-0">
                <div className="w-24 h-32 sm:w-36 sm:h-48 bg-gradient-to-t from-yellow-400 to-yellow-500 flex items-center justify-center mb-3 sm:mb-6 mx-auto shadow-xl">
                  <span className="text-3xl sm:text-6xl font-black text-white">1</span>
                </div>
                <div className="font-black text-white text-base sm:text-xl mb-1">{leaderboardData[0]?.name || 'N/A'}</div>
                <div className="text-white text-base sm:text-xl font-semibold">{leaderboardData[0]?.points?.toLocaleString() || 0} pts</div>
                <div className="text-xs sm:text-sm text-yellow-400 mt-1 sm:mt-2 font-semibold">👑 Champion</div>
              </div>

              {/* 3rd Place */}
              <div className="text-center w-full sm:flex-1 max-w-xs order-3">
                <div className="w-20 h-24 sm:w-32 sm:h-36 bg-gradient-to-t from-amber-500 to-amber-600 flex items-center justify-center mb-3 sm:mb-6 mx-auto shadow-lg">
                  <span className="text-2xl sm:text-5xl font-black text-white">3</span>
                </div>
                <div className="font-black text-white text-sm sm:text-lg mb-1">{leaderboardData[2]?.name || 'N/A'}</div>
                <div className="text-white text-sm sm:text-lg font-semibold">{leaderboardData[2]?.points?.toLocaleString() || 0} pts</div>
                <div className="text-xs text-amber-400 mt-1 sm:mt-2">Bronze Medal</div>
              </div>
            </div>
          </div>
        )}

        {/* Top 100 Users Section Header */}
        <div className="relative mb-4 sm:mb-6 z-10">
          <h2 className="text-2xl sm:text-3xl font-black text-white text-center mb-2">Top 100 Users</h2>
          <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-yellow-400 to-orange-400 mx-auto"></div>
        </div>

        {/* Leaderboard Table */}
        <div className="relative bg-white/5 backdrop-blur-md border border-white/10 overflow-hidden z-10">
          {loading ? (
            <div className="text-center py-8 sm:py-12">
              <div className="text-gray-400">Loading leaderboard...</div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5 border-b border-white/10">
                  <tr>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-black text-white">Rank</th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-black text-white">User</th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-center text-xs sm:text-sm font-black text-white">Points</th>
                    <th className="hidden sm:table-cell px-6 py-4 text-center text-sm font-black text-white">Badges</th>
                    <th className="hidden sm:table-cell px-6 py-4 text-center text-sm font-black text-white">Streak</th>
                    <th className="hidden sm:table-cell px-6 py-4 text-center text-sm font-black text-white">Change</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboardData.map((entry) => (
                    <tr 
                      key={entry.rank}
                      className={`${getRowStyle(entry.name)} hover:bg-white/10 transition-all duration-200 border-b border-white/5`}
                    >
                      <td className="px-3 sm:px-6 py-3 sm:py-4">
                        <div className="flex items-center">
                          {getRankIcon(entry.rank)}
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4">
                        <div
                          className="flex items-center cursor-pointer hover:opacity-90"
                          onClick={() => {
                            if (currentUser && entry._id === currentUser._id) {
                              navigate('/profile');
                            } else {
                              navigate(`/user/${entry._id}`);
                            }
                          }}
                        >
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white mr-2 sm:mr-3 font-bold text-sm sm:text-base">
                            {entry.name?.charAt(0)?.toUpperCase() || 'U'}
                          </div>
                          <div>
                            <div className="font-semibold text-white text-sm sm:text-base">{entry.name}</div>
                            {currentUser && entry._id === currentUser._id && (
                              <div className="text-xs sm:text-sm text-cyan-400">Your Position</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-center">
                        <div className="font-bold text-white text-sm sm:text-base">{entry.points.toLocaleString()}</div>
                      </td>
                      <td className="hidden sm:table-cell px-6 py-4 text-center">
                        <div className="flex items-center justify-center">
                          <Award className="w-4 h-4 text-yellow-500 mr-1" />
                          <span className="font-semibold text-white">{entry.badges}</span>
                        </div>
                      </td>
                      <td className="hidden sm:table-cell px-6 py-4 text-center">
                        <div className="flex items-center justify-center">
                          <Target className="w-4 h-4 text-orange-500 mr-1" />
                          <span className="font-semibold text-white">{entry.streak}</span>
                        </div>
                      </td>
                      <td className="hidden sm:table-cell px-6 py-4 text-center">
                        <div className="flex items-center justify-center">
                          {getChangeIcon(entry.change)}
                          <span className={`ml-1 text-sm font-medium text-white ${
                            entry.change > 0 ? 'text-green-400' : 
                            entry.change < 0 ? 'text-red-400' : 'text-gray-400'
                          }`}>
                            {entry.change > 0 ? `+${entry.change}` : entry.change || '-'}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Your Stats */}
        {currentUser && (
          <div className="relative mt-6 sm:mt-8 bg-gradient-to-r from-blue-600 to-purple-600 p-6 sm:p-8 text-white z-10 overflow-hidden">
            {/* Geometric patterns */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-20 sm:w-32 h-20 sm:h-32 border-2 border-white transform rotate-45"></div>
              <div className="absolute top-4 sm:top-10 right-4 sm:right-10 w-16 sm:w-24 h-16 sm:h-24 border-2 border-white transform rotate-12"></div>
              <div className="absolute bottom-4 sm:bottom-10 left-1/4 w-12 sm:w-20 h-12 sm:h-20 border-2 border-white transform -rotate-12"></div>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-black mb-6 sm:mb-8 relative z-10">Your Performance</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 relative z-10">
              <div className="text-center">
                <div className="text-2xl sm:text-4xl font-black mb-1 sm:mb-2">
                  {userRank ? `#${userRank}` : 'N/A'}
                </div>
                <div className="opacity-90 text-sm sm:text-base">Your Rank</div>
                {/* Removed total users text per requirement */}
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-4xl font-black mb-1 sm:mb-2">--</div>
                <div className="opacity-90 text-sm sm:text-base">Weekly Change</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-4xl font-black mb-1 sm:mb-2">{currentUser.totalPoints.toLocaleString()}</div>
                <div className="opacity-90 text-sm sm:text-base">Total Points</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-4xl font-black mb-1 sm:mb-2">{currentUser.streak}</div>
                <div className="opacity-90 text-sm sm:text-base">Day Streak</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};