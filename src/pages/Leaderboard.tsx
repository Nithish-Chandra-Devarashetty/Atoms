import React, { useState } from 'react';
import { 
  Trophy, 
  Medal, 
  Crown, 
  TrendingUp, 
  User, 
  Award,
  Star,
  Target,
  Filter
} from 'lucide-react';

interface LeaderboardEntry {
  rank: number;
  name: string;
  avatar: string;
  points: number;
  badges: number;
  feasts: number;
  streak: number;
  change: number; // Position change from last week
}

export const Leaderboard: React.FC = () => {
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'all'>('all');
  const [category, setCategory] = useState<'overall' | 'webdev' | 'core' | 'dsa' | 'aptitude'>('overall');

  const leaderboardData: LeaderboardEntry[] = [
    {
      rank: 1,
      name: 'Alex Chen',
      avatar: '👑',
      points: 4850,
      badges: 15,
      feasts: 8,
      streak: 45,
      change: 0
    },
    {
      rank: 2,
      name: 'Sarah Johnson',
      avatar: '🥈',
      points: 4720,
      badges: 14,
      feasts: 7,
      streak: 38,
      change: 1
    },
    {
      rank: 3,
      name: 'Mike Rodriguez',
      avatar: '🥉',
      points: 4650,
      badges: 13,
      feasts: 6,
      streak: 42,
      change: -1
    },
    {
      rank: 4,
      name: 'Emma Wilson',
      avatar: '👩‍💻',
      points: 4200,
      badges: 12,
      feasts: 5,
      streak: 28,
      change: 2
    },
    {
      rank: 5,
      name: 'David Kim',
      avatar: '👨‍🔬',
      points: 3950,
      badges: 11,
      feasts: 5,
      streak: 35,
      change: -1
    },
    {
      rank: 6,
      name: 'Lisa Zhang',
      avatar: '👩‍🎓',
      points: 3800,
      badges: 10,
      feasts: 4,
      streak: 22,
      change: 0
    },
    {
      rank: 7,
      name: 'James Brown',
      avatar: '👨‍💼',
      points: 3650,
      badges: 9,
      feasts: 4,
      streak: 31,
      change: 3
    },
    {
      rank: 8,
      name: 'Maria Garcia',
      avatar: '👩‍🔬',
      points: 3500,
      badges: 8,
      feasts: 3,
      streak: 19,
      change: -2
    },
    {
      rank: 9,
      name: 'Ryan Taylor',
      avatar: '👨‍🎓',
      points: 3350,
      badges: 8,
      feasts: 3,
      streak: 26,
      change: 1
    },
    {
      rank: 10,
      name: 'You',
      avatar: '👤',
      points: 2450,
      badges: 5,
      feasts: 2,
      streak: 15,
      change: 5
    }
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2: return <Medal className="w-6 h-6 text-gray-400" />;
      case 3: return <Medal className="w-6 h-6 text-amber-600" />;
      default: return <span className="text-lg font-bold text-gray-600">#{rank}</span>;
    }
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (change < 0) return <TrendingUp className="w-4 h-4 text-red-500 transform rotate-180" />;
    return <div className="w-4 h-4 bg-gray-300 rounded-full"></div>;
  };

  const getRowStyle = (rank: number, name: string) => {
    if (name === 'You') return 'bg-blue-50 border-blue-200 border-2';
    if (rank <= 3) return 'bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200';
    return 'bg-white border border-gray-100';
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
        <div className="text-center mb-16 relative z-10">
          <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent mb-6 tracking-tight">
            Leaderboard
          </h1>
          <p className="text-xl text-gray-300 font-light">
            See how you rank against other learners in the community
          </p>
        </div>

        {/* Top 3 Podium */}
        <div className="mb-16 relative z-10">
          <div className="flex justify-center items-end space-x-8">
            {/* 2nd Place */}
            <div className="text-center">
              <div className="w-24 h-32 bg-gradient-to-t from-gray-300 to-gray-400 flex items-end justify-center pb-4 mb-4 clip-path-diamond">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-2xl clip-path-hexagon">
                  {leaderboardData[1].avatar}
                </div>
              </div>
              <div className="font-black text-white">{leaderboardData[1].name}</div>
              <div className="text-gray-300">{leaderboardData[1].points} pts</div>
              <Medal className="w-8 h-8 text-gray-400 mx-auto mt-2" />
            </div>

            {/* 1st Place */}
            <div className="text-center">
              <div className="w-24 h-40 bg-gradient-to-t from-yellow-400 to-yellow-500 flex items-end justify-center pb-4 mb-4 clip-path-diamond">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-3xl clip-path-hexagon">
                  {leaderboardData[0].avatar}
                </div>
              </div>
              <div className="font-black text-white text-lg">{leaderboardData[0].name}</div>
              <div className="text-gray-300">{leaderboardData[0].points} pts</div>
              <Crown className="w-10 h-10 text-yellow-500 mx-auto mt-2" />
            </div>

            {/* 3rd Place */}
            <div className="text-center">
              <div className="w-24 h-28 bg-gradient-to-t from-amber-500 to-amber-600 flex items-end justify-center pb-4 mb-4 clip-path-diamond">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-2xl clip-path-hexagon">
                  {leaderboardData[2].avatar}
                </div>
              </div>
              <div className="font-black text-white">{leaderboardData[2].name}</div>
              <div className="text-gray-300">{leaderboardData[2].points} pts</div>
              <Medal className="w-8 h-8 text-amber-600 mx-auto mt-2" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="relative bg-white/5 backdrop-blur-md border border-white/10 p-6 mb-8 z-10">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center space-x-4">
              <Filter className="w-5 h-5 text-gray-300" />
              <span className="font-medium text-white">Filters:</span>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <div className="flex space-x-2">
                <span className="text-sm text-gray-300">Timeframe:</span>
                {(['week', 'month', 'all'] as const).map((period) => (
                  <button
                    key={period}
                    onClick={() => setTimeframe(period)}
                    className={`px-3 py-1 text-sm transition-colors ${
                      timeframe === period
                        ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
                        : 'bg-white/10 backdrop-blur-sm border border-white/20 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    {period.charAt(0).toUpperCase() + period.slice(1)}
                  </button>
                ))}
              </div>
              
              <div className="flex space-x-2">
                <span className="text-sm text-gray-300">Category:</span>
                {(['overall', 'webdev', 'core', 'dsa', 'aptitude'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`px-3 py-1 text-sm transition-colors ${
                      category === cat
                        ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
                        : 'bg-white/10 backdrop-blur-sm border border-white/20 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    {cat === 'webdev' ? 'Web Dev' : 
                     cat === 'core' ? 'Core CS' :
                     cat === 'dsa' ? 'DSA' :
                     cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="relative bg-white/5 backdrop-blur-md border border-white/10 overflow-hidden z-10">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-black text-white">Rank</th>
                  <th className="px-6 py-4 text-left text-sm font-black text-white">User</th>
                  <th className="px-6 py-4 text-center text-sm font-black text-white">Points</th>
                  <th className="px-6 py-4 text-center text-sm font-black text-white">Badges</th>
                  <th className="px-6 py-4 text-center text-sm font-black text-white">Feasts</th>
                  <th className="px-6 py-4 text-center text-sm font-black text-white">Streak</th>
                  <th className="px-6 py-4 text-center text-sm font-black text-white">Change</th>
                </tr>
              </thead>
              <tbody>
                {leaderboardData.map((entry) => (
                  <tr 
                    key={entry.rank}
                    className={`${getRowStyle(entry.rank, entry.name)} hover:bg-white/10 transition-all duration-200 border-b border-white/5`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {getRankIcon(entry.rank)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white mr-3 clip-path-hexagon">
                          {entry.avatar}
                        </div>
                        <div>
                          <div className="font-semibold text-white">{entry.name}</div>
                          {entry.name === 'You' && (
                            <div className="text-sm text-cyan-400">Your Position</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="font-bold text-white">{entry.points.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center">
                        <Award className="w-4 h-4 text-yellow-500 mr-1" />
                        <span className="font-semibold text-white">{entry.badges}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center">
                        <Trophy className="w-4 h-4 text-green-500 mr-1" />
                        <span className="font-semibold text-white">{entry.feasts}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center">
                        <Target className="w-4 h-4 text-orange-500 mr-1" />
                        <span className="font-semibold text-white">{entry.streak}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
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
        </div>

        {/* Your Stats */}
        <div className="relative mt-8 bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white z-10 overflow-hidden">
          {/* Geometric patterns */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-32 h-32 border-2 border-white transform rotate-45"></div>
            <div className="absolute top-10 right-10 w-24 h-24 border-2 border-white transform rotate-12"></div>
            <div className="absolute bottom-10 left-1/4 w-20 h-20 border-2 border-white transform -rotate-12"></div>
          </div>
          
          <h2 className="text-3xl font-black mb-8 relative z-10">Your Performance</h2>
          <div className="grid md:grid-cols-4 gap-6 relative z-10">
            <div className="text-center">
              <div className="text-4xl font-black mb-2">10th</div>
              <div className="opacity-90">Current Rank</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black mb-2">+5</div>
              <div className="opacity-90">Positions Up</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black mb-2">2,450</div>
              <div className="opacity-90">Total Points</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black mb-2">15</div>
              <div className="opacity-90">Day Streak</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};