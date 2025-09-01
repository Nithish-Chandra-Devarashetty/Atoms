import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  CheckCircle, 
  Clock,
  Award,
  Star,
  Filter,
  Search
} from 'lucide-react';
import { DsaProblem, dsaProblems } from '../data/dsaProblems';

interface Problem extends DsaProblem {
  solved?: boolean;
}

export const DSA: React.FC = () => {
  const { currentUser } = useAuth();
  const [problems, setProblems] = useState<Problem[]>([]);
  const [topics, setTopics] = useState<{[key: string]: Problem[]}>({});
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  // solved state derived from problems.solved per item
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDSAProgress();
  }, [currentUser]);

  const loadDSAProgress = () => {
    // Use currentUser progress directly; no shared localStorage
  const solvedArray = currentUser?.progress?.dsa?.solvedProblems || [];
  const solvedSet = new Set<string>(solvedArray);

    const problemsData: Problem[] = dsaProblems.map(problem => ({
      ...problem,
      solved: solvedSet.has(problem.Name)
    }));
    setProblems(problemsData);

    const topicsData: {[key: string]: Problem[]} = {};
    problemsData.forEach(problem => {
      if (!topicsData[problem.Topic]) topicsData[problem.Topic] = [];
      topicsData[problem.Topic].push(problem);
    });
    setTopics(topicsData);
    setLoading(false);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSolvedCount = (topic: string) => problems.filter(p => p.Topic === topic && p.solved).length;
  const getTotalSolved = () => problems.filter(p => p.solved).length;

  // Calculate DSA badge count based on solved problems
  const getDSABadgeCount = () => {
    const solvedCount = getTotalSolved();
    let badges = 0;
    if (solvedCount >= 10) badges++; // Beginner
    if (solvedCount >= 50) badges++; // Intermediate  
    if (solvedCount >= 100) badges++; // Advanced
    if (solvedCount >= problems.length && problems.length > 0) badges++; // Grandmaster
    return badges;
  };

  const getTopicIcon = (topic: string) => {
    const iconMap: {[key: string]: string} = {
      'Arrays': '🔢',
      'Strings': '📝',
      'Two Pointers': '👆',
      'Linked List': '🔗',
      'Binary Search': '🔍',
      'Dynamic Programming': '⚡',
      'Trees': '🌳'
    };
    return iconMap[topic] || '💡';
  };

  const filteredTopics = Object.entries(topics).map(([topic, topicProblems]) => {
    const filtered = selectedDifficulty === 'All' 
      ? topicProblems 
      : topicProblems.filter(p => p.Difficulty === selectedDifficulty);
    return [topic, filtered] as [string, Problem[]];
  }).filter(([topic, topicProblems]) => {
    const matchesSearch = searchQuery === '' || 
      topic.toLowerCase().includes(searchQuery.toLowerCase());
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500/10 blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-cyan-500/10 blur-3xl animate-pulse delay-2000"></div>
      </div>
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 relative z-10">
          <h1 className="heading-font text-5xl md:text-7xl font-black text-white mb-6 tracking-tight">
            Data Structures & Algorithms
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto font-light">
            Master DSA with curated LeetCode problems organized by topics
          </p>
        </div>

        {/* Stats Overview */}
        <div className="relative bg-white/5 backdrop-blur-md border border-white/10 p-8 mb-16 z-10">
          <h2 className="text-3xl font-black text-white mb-8">Your DSA Journey</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl font-black text-purple-400 mb-2">{problems.length}</div>
              <div className="text-gray-300">Total Problems</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-green-400 mb-2">{getTotalSolved()}</div>
              <div className="text-gray-300">Solved ({problems.length > 0 ? Math.round((getTotalSolved() / problems.length) * 100) : 0}%)</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-cyan-400 mb-2">{Object.keys(topics).length}</div>
              <div className="text-gray-300">Topics</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-orange-400 mb-2">{getDSABadgeCount()}</div>
              <div className="text-gray-300">DSA Badges Earned</div>
            </div>
          </div>
        </div>

        {/* Badges Section */}
        <div className="relative bg-transparent backdrop-blur-md border border-white/20 p-8 mb-16 text-white z-10 overflow-hidden">
          {/* Subtle geometric patterns */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 left-0 w-32 h-32 border border-white/20 transform rotate-45"></div>
            <div className="absolute top-10 right-10 w-24 h-24 border border-white/20 transform rotate-12"></div>
            <div className="absolute bottom-10 left-1/4 w-20 h-20 border border-white/20 transform -rotate-12"></div>
          </div>
          
          <h2 className="text-3xl font-black mb-8 flex items-center relative z-10">
            <Award className="w-8 h-8 mr-3" />
            DSA Badging System
          </h2>
          
          <div className="relative z-10">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">🏆</div>
              <h3 className="text-2xl font-bold mb-4">Earn Badges as You Progress</h3>
              <p className="text-gray-300 text-lg max-w-3xl mx-auto">
                Our DSA badge system rewards your problem-solving journey with beautiful achievement badges. 
                Progress through 4 levels of mastery as you solve more problems!
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg text-center hover:bg-white/10 transition-all duration-300">
                <div className="text-4xl mb-4">🔰</div>
                <h4 className="text-xl font-bold mb-2 text-green-400">DSA Beginner</h4>
                <div className="text-sm text-gray-300 mb-3">Your first milestone</div>
                <div className="text-xs text-gray-400 bg-white/5 p-2 rounded">
                  <strong>Requirement:</strong> Solve 10+ problems
                </div>
              </div>
              
              <div className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg text-center hover:bg-white/10 transition-all duration-300">
                <div className="text-4xl mb-4">🏅</div>
                <h4 className="text-xl font-bold mb-2 text-blue-400">DSA Intermediate</h4>
                <div className="text-sm text-gray-300 mb-3">Getting serious</div>
                <div className="text-xs text-gray-400 bg-white/5 p-2 rounded">
                  <strong>Requirement:</strong> Solve 50+ problems
                </div>
              </div>
              
              <div className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg text-center hover:bg-white/10 transition-all duration-300">
                <div className="text-4xl mb-4">🏆</div>
                <h4 className="text-xl font-bold mb-2 text-purple-400">DSA Advanced</h4>
                <div className="text-sm text-gray-300 mb-3">Expert level</div>
                <div className="text-xs text-gray-400 bg-white/5 p-2 rounded">
                  <strong>Requirement:</strong> Solve 100+ problems
                </div>
              </div>
              
              <div className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg text-center hover:bg-white/10 transition-all duration-300">
                <div className="text-4xl mb-4">👑</div>
                <h4 className="text-xl font-bold mb-2 text-yellow-400">DSA Grandmaster</h4>
                <div className="text-sm text-gray-300 mb-3">Ultimate achievement</div>
                <div className="text-xs text-gray-400 bg-white/5 p-2 rounded">
                  <strong>Requirement:</strong> Solve ALL problems
                </div>
              </div>
            </div>

            <div className="text-center p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg">
              <h4 className="text-xl font-bold mb-3 text-cyan-400">How It Works</h4>
              <div className="grid md:grid-cols-3 gap-6 text-sm">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 mt-1">1</div>
                  <div className="text-left">
                    <div className="font-semibold mb-1">Solve Problems</div>
                    <div className="text-gray-300">Practice with our curated LeetCode problems</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 mt-1">2</div>
                  <div className="text-left">
                    <div className="font-semibold mb-1">Track Progress</div>
                    <div className="text-gray-300">Your solved count automatically updates</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 mt-1">3</div>
                  <div className="text-left">
                    <div className="font-semibold mb-1">Earn Badges</div>
                    <div className="text-gray-300">Badges appear in your profile automatically</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="mb-8 relative z-10 space-y-4">
          {/* Search Bar */}
          <div className="relative bg-white/5 backdrop-blur-md border border-white/10 p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Search topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
          
          {/* Difficulty Filter */}
          <div className="flex items-center space-x-4">
            <Filter className="w-5 h-5 text-gray-300" />
            <span className="text-white font-medium">Filter by difficulty:</span>
            <div className="flex space-x-2">
              {['All', 'Easy', 'Medium', 'Hard'].map((difficulty) => (
                <button
                  key={difficulty}
                  onClick={() => setSelectedDifficulty(difficulty)}
                  className={`px-4 py-2 text-sm font-medium transition-all duration-200 ${
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
        <div className="grid lg:grid-cols-2 gap-8 relative z-10">
          {filteredTopics.map(([topic, topicProblems]) => (
            <div key={topic} className="relative bg-white/5 backdrop-blur-md border border-white/10 p-8 hover:bg-white/10 transition-all duration-300 overflow-hidden">
              {/* Hover gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center relative z-10">
                  <span className="text-3xl mr-3">{getTopicIcon(topic)}</span>
                  <div>
                    <h3 className="text-xl font-black text-white">{topic}</h3>
                    <p className="text-gray-300">{topicProblems.length} problems</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 relative z-10">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <span className="text-sm text-gray-300">{getSolvedCount(topic)}/{topicProblems.length} solved</span>
                </div>
              </div>

              <div className="space-y-3 mb-6 relative z-10">
                {topicProblems.slice(0, 3).map((problem, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/5 backdrop-blur-sm border border-white/10">
                    <div className="flex items-center space-x-3">
                      {problem.solved ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Clock className="w-4 h-4 text-gray-500" />}
                      <span className="text-sm font-medium text-white truncate">
                        {problem.Name}
                      </span>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(problem.Difficulty)}`}>
                      {problem.Difficulty}
                    </span>
                  </div>
                ))}
                {topicProblems.length > 3 && (
                  <div className="text-center text-gray-400 text-sm">
                    +{topicProblems.length - 3} more problems
                  </div>
                )}
              </div>

              <Link 
                to={`/dsa/${topic}/all`} 
                className="relative block w-full text-center py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black hover:shadow-lg transform hover:scale-105 transition-all duration-200 z-10"
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
