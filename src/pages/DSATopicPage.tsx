import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  ExternalLink, 
  CheckCircle, 
  Clock, 
  Award, 
  Target,
  Filter,
  Star,
  TrendingUp
} from 'lucide-react';

interface Problem {
  Topic: string;
  Name: string;
  Link: string;
  Difficulty: string;
}

export const DSATopicPage: React.FC = () => {
  const { topic } = useParams<{ topic: string }>();
  const [problems, setProblems] = useState<Problem[]>([]);
  const [solvedProblems, setSolvedProblems] = useState<string[]>(['Move Zeroes', 'Majority Element']);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');

  useEffect(() => {
    loadTopicProblems(topic || '');
  }, [topic]);

  const loadTopicProblems = (topicName: string) => {
    // Sample data - in real app, this would filter from the CSV data
    const allProblems: Problem[] = [
      { Topic: 'Arrays', Name: 'Move Zeroes', Link: 'https://leetcode.com/problems/move-zeroes/', Difficulty: 'Easy' },
      { Topic: 'Arrays', Name: 'Majority Element', Link: 'https://leetcode.com/problems/majority-element/', Difficulty: 'Easy' },
      { Topic: 'Arrays', Name: 'Remove Duplicates from Sorted Array', Link: 'https://leetcode.com/problems/remove-duplicates-from-sorted-array/', Difficulty: 'Easy' },
      { Topic: 'Arrays', Name: 'Best Time to Buy and Sell Stock', Link: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/', Difficulty: 'Easy' },
      { Topic: 'Arrays', Name: 'Rotate Array', Link: 'https://leetcode.com/problems/rotate-array/', Difficulty: 'Medium' },
      { Topic: 'Arrays', Name: 'Product of Array Except Self', Link: 'https://leetcode.com/problems/product-of-array-except-self/', Difficulty: 'Medium' },
      { Topic: 'Arrays', Name: 'Best Time to Buy and Sell Stock II', Link: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/', Difficulty: 'Medium' },
      { Topic: 'Arrays', Name: 'Increasing Triplet Subsequence', Link: 'https://leetcode.com/problems/increasing-triplet-subsequence/', Difficulty: 'Medium' },
      { Topic: 'Arrays', Name: 'First Missing Positive', Link: 'https://leetcode.com/problems/first-missing-positive/', Difficulty: 'Hard' }
    ];

    // Filter by topic (convert topic param back to proper format)
    const formattedTopic = topicName.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');

    const topicProblems = allProblems.filter(p => p.Topic === formattedTopic);
    setProblems(topicProblems);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100 border-green-200';
      case 'Medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'Hard': return 'text-red-600 bg-red-100 border-red-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const toggleProblemSolved = (problemName: string) => {
    if (solvedProblems.includes(problemName)) {
      setSolvedProblems(solvedProblems.filter(p => p !== problemName));
    } else {
      setSolvedProblems([...solvedProblems, problemName]);
    }
  };

  const filteredProblems = selectedDifficulty === 'All' 
    ? problems 
    : problems.filter(p => p.Difficulty === selectedDifficulty);

  const solvedCount = problems.filter(p => solvedProblems.includes(p.Name)).length;
  const progressPercentage = problems.length > 0 ? (solvedCount / problems.length) * 100 : 0;

  const getTopicInfo = (topicName: string) => {
    const info: { [key: string]: { title: string, description: string, color: string, icon: string } } = {
      'arrays': {
        title: 'Arrays',
        description: 'Master array manipulation, searching, and sorting algorithms',
        color: 'from-blue-500 to-cyan-500',
        icon: '🔢'
      },
      'strings': {
        title: 'Strings',
        description: 'String processing, pattern matching, and text algorithms',
        color: 'from-green-500 to-emerald-500',
        icon: '📝'
      },
      'two-pointers': {
        title: 'Two Pointers',
        description: 'Efficient array and string problems using two pointer technique',
        color: 'from-purple-500 to-pink-500',
        icon: '👆'
      },
      'linked-list': {
        title: 'Linked List',
        description: 'Linear data structure problems and pointer manipulation',
        color: 'from-orange-500 to-red-500',
        icon: '🔗'
      }
    };

    return info[topicName || ''] || { 
      title: 'DSA Topic', 
      description: 'Practice problems for this topic', 
      color: 'from-gray-500 to-gray-600',
      icon: '💡'
    };
  };

  const topicInfo = getTopicInfo(topic || '');

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">{topicInfo.icon}</div>
          <h1 className={`text-4xl md:text-5xl font-bold bg-gradient-to-r ${topicInfo.color} bg-clip-text text-transparent mb-4`}>
            {topicInfo.title}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {topicInfo.description}
          </p>
        </div>

        {/* Progress Overview */}
        <div className="bg-white rounded-2xl p-8 mb-12 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Your Progress</h2>
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-600">{Math.round(progressPercentage)}%</div>
              <div className="text-gray-600">Complete</div>
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
            <div 
              className={`h-3 bg-gradient-to-r ${topicInfo.color} rounded-full transition-all duration-500`}
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-2">{solvedCount}</div>
              <div className="text-gray-600">Problems Solved</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-2">{problems.length}</div>
              <div className="text-gray-600">Total Problems</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 mb-2">
                {problems.filter(p => p.Difficulty === 'Easy').length}
              </div>
              <div className="text-gray-600">Easy Problems</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600 mb-2">
                {problems.filter(p => p.Difficulty === 'Hard').length}
              </div>
              <div className="text-gray-600">Hard Problems</div>
            </div>
          </div>
        </div>

        {/* Badge Progress */}
        <div className={`bg-gradient-to-r ${topicInfo.color} rounded-2xl p-8 mb-12 text-white`}>
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <Award className="w-8 h-8 mr-3" />
            Badge Progress
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-white/10 rounded-xl backdrop-blur-sm">
              <div className="text-4xl mb-3">
                {solvedCount >= 1 ? '🥈' : '🔒'}
              </div>
              <div className="font-semibold">Silver Badge</div>
              <div className="text-sm opacity-90">
                {solvedCount >= 1 ? 'Earned!' : 'Solve 1 problem'}
              </div>
            </div>
            <div className="text-center p-6 bg-white/10 rounded-xl backdrop-blur-sm">
              <div className="text-4xl mb-3">
                {solvedCount === problems.length ? '🥇' : '🔒'}
              </div>
              <div className="font-semibold">Gold Badge</div>
              <div className="text-sm opacity-90">
                {solvedCount === problems.length ? 'Earned!' : `Solve all ${problems.length} problems`}
              </div>
            </div>
            <div className="text-center p-6 bg-white/10 rounded-xl backdrop-blur-sm">
              <div className="text-4xl mb-3">💎</div>
              <div className="font-semibold">Diamond Badge</div>
              <div className="text-sm opacity-90">Complete all DSA topics</div>
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

        {/* Problems List */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Problems</h2>
          </div>
          
          <div className="divide-y divide-gray-100">
            {filteredProblems.map((problem, index) => {
              const isSolved = solvedProblems.includes(problem.Name);
              
              return (
                <div key={index} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => toggleProblemSolved(problem.Name)}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                          isSolved 
                            ? 'bg-green-500 border-green-500' 
                            : 'border-gray-300 hover:border-green-400'
                        }`}
                      >
                        {isSolved && <CheckCircle className="w-4 h-4 text-white" />}
                      </button>
                      
                      <div>
                        <h3 className={`font-semibold ${isSolved ? 'text-green-700' : 'text-gray-900'}`}>
                          {problem.Name}
                        </h3>
                        <div className="flex items-center space-x-3 mt-1">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getDifficultyColor(problem.Difficulty)}`}>
                            {problem.Difficulty}
                          </span>
                          {isSolved && (
                            <span className="flex items-center text-xs text-green-600">
                              <Star className="w-3 h-3 mr-1" />
                              Solved
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <a
                        href={problem.Link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Solve on LeetCode
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Study Tips */}
        <div className="mt-12 grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Target className="w-6 h-6 mr-2 text-blue-600" />
              Study Strategy
            </h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Start with Easy problems to build confidence
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Understand the problem before coding
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Practice time and space complexity analysis
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Review solutions even after solving
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="w-6 h-6 mr-2 text-green-600" />
              Progress Tips
            </h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Solve at least one problem daily
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Track your solving time improvements
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Revisit problems after a week
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Discuss solutions with peers
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};