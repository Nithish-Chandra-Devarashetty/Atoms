import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';
import { CheckCircle, Clock, Star, Filter, Search } from 'lucide-react';
import { dsaProblems, type DsaProblem } from '../data/dsaProblems';

// Extend DsaProblem with a solved flag for local UI state
type Problem = DsaProblem & { solved?: boolean };

export const DSA: React.FC = () => {
  const { currentUser } = useAuth();
  const [problems, setProblems] = useState<Problem[]>([]);
  const [topics, setTopics] = useState<Record<string, Problem[]>>({});
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDSAProgress();
    // Listen for updates from topic pages
    const onProgressUpdate = () => loadDSAProgress();
    window.addEventListener('dsa-progress-updated', onProgressUpdate as EventListener);
    return () => window.removeEventListener('dsa-progress-updated', onProgressUpdate as EventListener);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  const loadDSAProgress = async () => {
    try {
      setLoading(true);
      let solvedArray: string[] = [];

      if (currentUser) {
        // Prefer fresh data from backend to avoid stale AuthContext
        const response = await apiService.getDSAProgress();
        solvedArray = response?.dsaProgress?.solvedProblems || [];
      } else {
        // Fallback for logged-out users
        solvedArray = [];
      }

      const solvedSet = new Set<string>(solvedArray);
      const problemsData: Problem[] = dsaProblems.map((p) => ({
        ...p,
        solved: solvedSet.has(p.Name),
      }));
      setProblems(problemsData);

      const topicsData: Record<string, Problem[]> = {};
      problemsData.forEach((p) => {
        if (!topicsData[p.Topic]) topicsData[p.Topic] = [];
        topicsData[p.Topic].push(p);
      });
      setTopics(topicsData);
    } catch (e) {
      console.error('Failed to load DSA progress:', e);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'text-green-600 bg-green-100';
      case 'Medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'Hard':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getSolvedCount = (topic: string) => problems.filter((p) => p.Topic === topic && p.solved).length;
  const getTotalSolved = () => problems.filter((p) => p.solved).length;

  const getTopicIcon = (topic: string) => {
    const iconMap: Record<string, string> = {
      Arrays: '🔢',
      Strings: '📝',
      'Two Pointers': '👆',
      'Linked List': '🔗',
      'Binary Search': '🔍',
      'Dynamic Programming': '⚡',
      Trees: '🌳',
    };
    return iconMap[topic] || '💡';
  };

  const filteredTopics = Object.entries(topics)
    .map(([topic, topicProblems]) => {
      const filtered = selectedDifficulty === 'All' ? topicProblems : topicProblems.filter((p) => p.Difficulty === selectedDifficulty);
      return [topic, filtered] as [string, Problem[]];
    })
    .filter(([topic, topicProblems]) => {
      const matchesSearch = searchQuery === '' || topic.toLowerCase().includes(searchQuery.toLowerCase());
      return topicProblems.length > 0 && matchesSearch;
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="text-white text-xl">Loading DSA data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-6 sm:py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden text-white">
      {/* Animated background elements (to match style) */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500/10 blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-cyan-500/10 blur-3xl animate-pulse delay-2000" />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-16 relative z-10">
          <h1 className="heading-font text-3xl sm:text-5xl md:text-7xl font-black text-white mb-4 sm:mb-6 tracking-tight">Data Structures & Algorithms</h1>
          <p className="text-base sm:text-xl text-gray-300 max-w-3xl mx-auto font-light">Master DSA with curated LeetCode problems organized by topics</p>
        </div>

        {/* Stats Overview */}
        <div className="relative bg-white/5 backdrop-blur-md border border-white/10 p-4 sm:p-8 mb-8 sm:mb-16 z-10">
          <h2 className="text-xl sm:text-3xl font-black text-white mb-6 sm:mb-8">Your DSA Journey</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div className="text-center">
              <div className="text-2xl sm:text-4xl font-black text-purple-400 mb-2">{problems.length}</div>
              <div className="text-gray-300 text-sm sm:text-base">Total Problems</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-4xl font-black text-green-400 mb-2">{getTotalSolved()}</div>
              <div className="text-gray-300 text-sm sm:text-base">Solved ({problems.length > 0 ? Math.round((getTotalSolved() / problems.length) * 100) : 0}%)</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-4xl font-black text-cyan-400 mb-2">{Object.keys(topics).length}</div>
              <div className="text-gray-300 text-sm sm:text-base">Topics</div>
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="mb-6 sm:mb-8 relative z-10 space-y-4">
          {/* Search Bar */}
          <div className="relative bg-white/5 backdrop-blur-md border border-white/10 p-4 sm:p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                placeholder="Search topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
              />
            </div>
          </div>

          {/* Difficulty Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300" />
              <span className="text-white font-medium text-sm sm:text-base">Filter by difficulty:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {['All', 'Easy', 'Medium', 'Hard'].map((difficulty) => (
                <button
                  key={difficulty}
                  onClick={() => setSelectedDifficulty(difficulty)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium transition-all duration-200 ${
                    selectedDifficulty === difficulty
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                      : 'bg-white/10 backdrop-blur-sm border border-white/20 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  {difficulty}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Topics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 relative z-10">
          {filteredTopics.map(([topic, topicProblems]) => (
            <div
              key={topic}
              className="relative bg-white/5 backdrop-blur-md border border-white/10 p-4 sm:p-8 hover:bg-white/10 transition-all duration-300 overflow-hidden"
            >
              {/* Hover gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 hover:opacity-100 transition-opacity duration-500" />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
                <div className="flex items-center relative z-10">
                  <span className="text-2xl sm:text-3xl mr-2 sm:mr-3">{getTopicIcon(topic)}</span>
                  <div>
                    <h3 className="text-lg sm:text-xl font-black text-white">{topic}</h3>
                    <p className="text-gray-300 text-sm sm:text-base">{topicProblems.length} problems</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 relative z-10">
                  <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
                  <span className="text-xs sm:text-sm text-gray-300">{getSolvedCount(topic)}/{topicProblems.length} solved</span>
                </div>
              </div>

              <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6 relative z-10">
                {topicProblems.slice(0, 3).map((problem, index) => (
                  <div key={index} className="flex items-center justify-between p-2 sm:p-3 bg-white/5 backdrop-blur-sm border border-white/10">
                    <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                      {problem.solved ? (
                        <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
                      ) : (
                        <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0" />
                      )}
                      <span className="text-xs sm:text-sm font-medium text-white truncate">{problem.Name}</span>
                    </div>
                    <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs font-medium flex-shrink-0 ml-2 ${getDifficultyColor(problem.Difficulty)}`}>
                      {problem.Difficulty}
                    </span>
                  </div>
                ))}
                {topicProblems.length > 3 && (
                  <div className="text-center text-gray-400 text-xs sm:text-sm">+{topicProblems.length - 3} more problems</div>
                )}
              </div>

              <Link
                to={`/dsa/${topic}/all`}
                className="relative block w-full text-center py-2.5 sm:py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black hover:shadow-lg transform hover:scale-105 transition-all duration-200 z-10 text-sm sm:text-base"
              >
                Start Practicing
              </Link>
            </div>
          ))}
        </div>
        </div>
      </div>
  );
};