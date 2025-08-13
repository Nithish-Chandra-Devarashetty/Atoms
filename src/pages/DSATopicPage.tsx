import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DsaProblem, dsaProblems } from '../data/dsaProblems';
import { 
  CheckCircle, 
  Clock, 
  ExternalLink, 
  ArrowLeft,
  Target,
  Trophy,
  Star,
  Filter
} from 'lucide-react';

interface SolvedProblems {
  [key: string]: boolean;
}

export const DSATopicPage: React.FC = () => {
  const { topic, difficulty } = useParams<{ topic: string; difficulty: string }>();
  const [solvedProblems, setSolvedProblems] = useState<SolvedProblems>({});
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>(difficulty || 'all');

  // Load solved problems from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem('solvedProblems');
    if (saved) {
      setSolvedProblems(JSON.parse(saved));
    }
  }, []);

  // Filter problems based on topic and difficulty
  const filteredProblems = dsaProblems.filter((problem: DsaProblem) => {
    const matchesTopic = problem.Topic === topic;
    const matchesDifficulty = selectedDifficulty === 'all' || problem.Difficulty === selectedDifficulty;
    return matchesTopic && matchesDifficulty;
  });

  // Toggle problem solved status
  const toggleSolved = (problemName: string) => {
    const newSolvedProblems = {
      ...solvedProblems,
      [problemName]: !solvedProblems[problemName]
    };
    setSolvedProblems(newSolvedProblems);
    localStorage.setItem('solvedProblems', JSON.stringify(newSolvedProblems));
  };

  // Sort problems by difficulty: Easy -> Medium -> Hard
  const sortedProblems = [...filteredProblems].sort((a, b) => {
    const difficultyOrder = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
    return difficultyOrder[a.Difficulty] - difficultyOrder[b.Difficulty];
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'from-green-500 to-emerald-500';
      case 'Medium': return 'from-yellow-500 to-orange-500';
      case 'Hard': return 'from-red-500 to-pink-500';
      default: return 'from-gray-500 to-gray-600';
    }
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

  const solvedCount = sortedProblems.filter(p => solvedProblems[p.Name]).length;
  const progressPercentage = sortedProblems.length > 0 ? (solvedCount / sortedProblems.length) * 100 : 0;

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
          <div className="flex items-center justify-center mb-4">
            <Link to="/dsa" className="mr-4">
              <ArrowLeft className="w-6 h-6 text-gray-400 hover:text-white transition-colors" />
            </Link>
            <span className="text-4xl mr-4">{getTopicIcon(topic || '')}</span>
            <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent tracking-tight">
              {topic}
            </h1>
          </div>
          <p className="text-xl text-gray-300 font-light">
            {selectedDifficulty === 'all' ? 'All Problems' : `${selectedDifficulty} Problems`}
          </p>
        </div>

        {/* Progress Overview */}
        <div className="relative bg-white/5 backdrop-blur-md border border-white/10 p-8 mb-16 z-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-black text-white">Your Progress</h2>
            <div className="text-right">
              <div className="text-3xl font-black text-purple-400">{Math.round(progressPercentage)}%</div>
              <div className="text-gray-300">Complete</div>
            </div>
          </div>
          
          <div className="w-full bg-white/20 h-3 mb-6">
            <div 
              className="h-3 bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-black text-green-400 mb-2">{solvedCount}</div>
              <div className="text-gray-300">Problems Solved</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-purple-400 mb-2">{sortedProblems.length}</div>
              <div className="text-gray-300">Total Problems</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-orange-400 mb-2">
                {sortedProblems.filter(p => p.Difficulty === 'Hard').length}
              </div>
              <div className="text-gray-300">Hard Problems</div>
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="mb-8 relative z-10">
          <div className="flex items-center space-x-4">
            <Filter className="w-5 h-5 text-gray-300" />
            <span className="text-white font-medium">Filter by difficulty:</span>
            <div className="flex space-x-2">
              {['all', 'Easy', 'Medium', 'Hard'].map((diff) => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`px-4 py-2 text-sm font-medium transition-all duration-200 ${
                    selectedDifficulty === diff
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                      : 'bg-white/10 backdrop-blur-sm border border-white/20 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  {diff === 'all' ? 'All' : diff}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Problems Grid */}
        {sortedProblems.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
            {sortedProblems.map((problem: DsaProblem, index: number) => (
              <div 
                key={index} 
                className={`relative bg-white/5 backdrop-blur-md border border-white/10 p-6 hover:bg-white/10 transition-all duration-300 overflow-hidden ${
                  solvedProblems[problem.Name] ? 'ring-2 ring-green-500/50' : ''
                }`}
              >
                {/* Hover gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${getDifficultyColor(problem.Difficulty)} opacity-0 hover:opacity-10 transition-opacity duration-500`}></div>
                
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div className="flex-1">
                    <h2 className="text-lg font-black text-white mb-2 leading-tight">{problem.Name}</h2>
                    <div className={`inline-flex items-center px-3 py-1 text-sm font-medium bg-gradient-to-r ${getDifficultyColor(problem.Difficulty)} text-white`}>
                      <Target className="w-3 h-3 mr-1" />
                      {problem.Difficulty}
                    </div>
                  </div>
                  <button
                    onClick={() => toggleSolved(problem.Name)}
                    className={`p-2 transition-colors ${
                      solvedProblems[problem.Name] 
                        ? 'text-green-400 hover:text-green-300' 
                        : 'text-gray-500 hover:text-gray-300'
                    }`}
                    aria-label={solvedProblems[problem.Name] ? 'Mark as unsolved' : 'Mark as solved'}
                  >
                    {solvedProblems[problem.Name] ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <Clock className="w-6 h-6" />
                    )}
                  </button>
                </div>

                {/* Problem Stats */}
                <div className="flex items-center space-x-4 mb-4 text-sm text-gray-400 relative z-10">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 mr-1 text-yellow-500" />
                    <span>LeetCode</span>
                  </div>
                  <div className="flex items-center">
                    <Trophy className="w-4 h-4 mr-1 text-purple-400" />
                    <span>{problem.Topic}</span>
                  </div>
                </div>

                <a
                  href={problem.Link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 relative z-10"
                >
                  Solve Problem
                  <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 relative z-10">
            <div className="text-gray-400 text-lg">
              No problems found for this topic and difficulty.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};