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
  Filter
} from 'lucide-react';
import { DsaProblem, dsaProblems } from '../data/dsaProblems';

interface Problem extends DsaProblem {
  solved?: boolean;
}

export const DSA: React.FC = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [topics, setTopics] = useState<{[key: string]: Problem[]}>({});
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
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
  }).filter(([, topicProblems]) => topicProblems.length > 0);

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Data Structures & Algorithms
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Master DSA with curated LeetCode problems organized by topics
          </p>
        </div>

        {/* Stats Overview */}
        <div className="bg-white rounded-2xl p-8 mb-12 shadow-lg border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your DSA Journey</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">{problems.length}</div>
              <div className="text-gray-600">Total Problems</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{getTotalSolved()}</div>
              <div className="text-gray-600">Solved ({problems.length > 0 ? Math.round((getTotalSolved() / problems.length) * 100) : 0}%)</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{Object.keys(topics).length}</div>
              <div className="text-gray-600">Topics</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">3</div>
              <div className="text-gray-600">Badges Earned</div>
            </div>
          </div>
        </div>

        {/* Badges Section */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 mb-12 text-white">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <Award className="w-8 h-8 mr-3" />
            Achievement Badges
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-white/10 rounded-xl backdrop-blur-sm">
              <div className="text-4xl mb-3">🥈</div>
              <div className="font-semibold">Silver Badge</div>
              <div className="text-sm opacity-90">Solve 1 problem in a topic</div>
            </div>
            <div className="text-center p-6 bg-white/10 rounded-xl backdrop-blur-sm">
              <div className="text-4xl mb-3">🥇</div>
              <div className="font-semibold">Gold Badge</div>
              <div className="text-sm opacity-90">Complete all problems in a topic</div>
            </div>
            <div className="text-center p-6 bg-white/10 rounded-xl backdrop-blur-sm">
              <div className="text-4xl mb-3">💎</div>
              <div className="font-semibold">Diamond Badge</div>
              <div className="text-sm opacity-90">Complete all DSA problems</div>
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="mb-8">
          <div className="flex items-center space-x-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <span className="text-gray-700 font-medium">Filter by difficulty:</span>
            <div className="flex space-x-2">
              {['All', 'Easy', 'Medium', 'Hard'].map((difficulty) => (
                <button
                  key={difficulty}
                  onClick={() => setSelectedDifficulty(difficulty)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    selectedDifficulty === difficulty
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {difficulty}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Topics Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {filteredTopics.map(([topic, topicProblems]) => (
            <div key={topic} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <span className="text-3xl mr-3">{getTopicIcon(topic)}</span>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{topic}</h3>
                    <p className="text-gray-600">{topicProblems.length} problems</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <span className="text-sm text-gray-600">{getSolvedCount(topic)}/{topicProblems.length} solved</span>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {topicProblems.slice(0, 3).map((problem, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {problem.solved ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Clock className="w-4 h-4 text-gray-500" />}
                      <span className="text-sm font-medium text-gray-900 truncate">
                        {problem.Name}
                      </span>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(problem.Difficulty)}`}>
                      {problem.Difficulty}
                    </span>
                  </div>
                ))}
                {topicProblems.length > 3 && (
                  <div className="text-center text-gray-500 text-sm">
                    +{topicProblems.length - 3} more problems
                  </div>
                )}
              </div>

              <Link 
                to={`/dsa/${topic}/all`} 
                className="block w-full text-center py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
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