import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Brain, 
  Trophy, 
  Target, 
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
  const [problems, setProblems] = useState<Problem[]>([]);
  const [topics, setTopics] = useState<{[key: string]: Problem[]}>({});
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [solvedProblems, setSolvedProblems] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Load solved problems from localStorage
    const savedSolved = localStorage.getItem('solvedProblems');
    let solvedSet = new Set<string>();
    let savedProblems: string[] = [];
    
    if (savedSolved) {
      try {
        const parsed = JSON.parse(savedSolved);
        // Ensure we have an array of strings
        savedProblems = Array.isArray(parsed) 
          ? parsed.filter((item): item is string => typeof item === 'string')
          : typeof parsed === 'object' && parsed !== null
            ? Object.keys(parsed).filter(key => parsed[key] === true)
            : [];
        savedProblems.forEach(problem => solvedSet.add(problem));
      } catch (e) {
        console.error('Error parsing solved problems:', e);
      }
    }
    
    setSolvedProblems(solvedSet);

    // Process problems data
    const problemsData: Problem[] = dsaProblems.map(problem => ({
      ...problem,
      solved: savedProblems.includes(problem.Name) // Changed from problem.Link to problem.Name
    }));

    setProblems(problemsData);

    // Group by topic
    const topicsData: {[key: string]: Problem[]} = {};
    problemsData.forEach(problem => {
      if (!topicsData[problem.Topic]) {
        topicsData[problem.Topic] = [];
      }
      topicsData[problem.Topic].push(problem);
    });
    setTopics(topicsData);
  }, []);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSolvedCount = (topic: string) => {
    return problems.filter(p => p.Topic === topic && solvedProblems.has(p.Link)).length;
  };

  const getTotalSolved = () => {
    return solvedProblems.size;
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
          <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-6 tracking-tight">
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
              <div className="text-4xl font-black text-orange-400 mb-2">3</div>
              <div className="text-gray-300">Badges Earned</div>
            </div>
          </div>
        </div>

        {/* Badges Section */}
        <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 p-8 mb-16 text-white z-10 overflow-hidden">
          {/* Geometric patterns */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-32 h-32 border-2 border-white transform rotate-45"></div>
            <div className="absolute top-10 right-10 w-24 h-24 border-2 border-white transform rotate-12"></div>
            <div className="absolute bottom-10 left-1/4 w-20 h-20 border-2 border-white transform -rotate-12"></div>
          </div>
          
          <h2 className="text-3xl font-black mb-8 flex items-center relative z-10">
            <Award className="w-8 h-8 mr-3" />
            Achievement Badges
          </h2>
          <div className="grid md:grid-cols-3 gap-6 relative z-10">
            <div className="text-center p-6 bg-white/10 backdrop-blur-sm border border-white/20">
              <div className="text-4xl mb-3">🥈</div>
              <div className="font-black">Silver Badge</div>
              <div className="text-sm opacity-90">Solve 1 problem in a topic</div>
            </div>
            <div className="text-center p-6 bg-white/10 backdrop-blur-sm border border-white/20">
              <div className="text-4xl mb-3">🥇</div>
              <div className="font-black">Gold Badge</div>
              <div className="text-sm opacity-90">Complete all problems in a topic</div>
            </div>
            <div className="text-center p-6 bg-white/10 backdrop-blur-sm border border-white/20">
              <div className="text-4xl mb-3">💎</div>
              <div className="font-black">Diamond Badge</div>
              <div className="text-sm opacity-90">Complete all DSA problems</div>
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