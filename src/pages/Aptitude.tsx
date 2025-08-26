import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Clock, 
  Target, 
  TrendingUp,
  CheckCircle,
  Play,
  Award,
  BarChart3
} from 'lucide-react';
import { aptitudeTopics } from '../data/aptitudeData';

export const Aptitude: React.FC = () => {
  // Get completed topics from localStorage instead of hardcoding
  const [completedTopics] = useState<string[]>(() => {
    const completed: string[] = [];
    aptitudeTopics.forEach(topic => {
      if (localStorage.getItem(`aptitude_${topic.id}_completed`) === 'true') {
        completed.push(topic.id);
      }
    });
    return completed;
  });

  const topics = aptitudeTopics.map(topic => ({
    id: topic.id,
    title: topic.title,
    description: topic.description,
    icon: topic.icon,
    difficulty: 'Medium',
    questionsCount: topic.questions.length,
    avgTime: '15 min',
    completed: completedTopics.includes(topic.id)
  }));

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const completedCount = topics.filter(topic => topic.completed).length;
  const totalQuestions = topics.reduce((sum, topic) => sum + topic.questionsCount, 0);
  const completedQuestions = topics.filter(topic => topic.completed).reduce((sum, topic) => sum + topic.questionsCount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-pink-500/10 blur-3xl animate-pulse delay-2000"></div>
      </div>
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 relative z-10">
          <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-6 tracking-tight">
            Quantitative Aptitude
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto font-light">
            Master quantitative aptitude with practice tests and detailed explanations
          </p>
        </div>

        {/* Stats Overview */}
        <div className="relative bg-white/5 backdrop-blur-md border border-white/10 p-8 mb-16 z-10">
          <h2 className="text-3xl font-black text-white mb-8">Your Progress</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl font-black text-orange-400 mb-2">{completedCount}</div>
              <div className="text-gray-300">Topics Completed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-green-400 mb-2">{completedQuestions}</div>
              <div className="text-gray-300">Questions Solved</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-cyan-400 mb-2">85%</div>
              <div className="text-gray-300">Average Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-purple-400 mb-2">2.1</div>
              <div className="text-gray-300">Avg Time (min)</div>
            </div>
          </div>
        </div>

        {/* Performance Chart */}
        <div className="relative bg-gradient-to-r from-orange-600 to-red-600 p-8 mb-16 text-white z-10 overflow-hidden">
          {/* Geometric patterns */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-32 h-32 border-2 border-white transform rotate-45"></div>
            <div className="absolute top-10 right-10 w-24 h-24 border-2 border-white transform rotate-12"></div>
            <div className="absolute bottom-10 left-1/4 w-20 h-20 border-2 border-white transform -rotate-12"></div>
          </div>
          
          <h2 className="text-3xl font-black mb-8 flex items-center relative z-10">
            <BarChart3 className="w-8 h-8 mr-3" />
            Performance Analytics
          </h2>
          <div className="grid md:grid-cols-3 gap-6 relative z-10">
            <div className="text-center p-6 bg-white/10 backdrop-blur-sm border border-white/20">
              <TrendingUp className="w-8 h-8 mx-auto mb-3" />
              <div className="font-black">Improvement Rate</div>
              <div className="text-2xl font-black">+15%</div>
              <div className="text-sm opacity-90">This week</div>
            </div>
            <div className="text-center p-6 bg-white/10 backdrop-blur-sm border border-white/20">
              <Target className="w-8 h-8 mx-auto mb-3" />
              <div className="font-black">Accuracy Goal</div>
              <div className="text-2xl font-black">90%</div>
              <div className="text-sm opacity-90">Current: 85%</div>
            </div>
            <div className="text-center p-6 bg-white/10 backdrop-blur-sm border border-white/20">
              <Award className="w-8 h-8 mx-auto mb-3" />
              <div className="font-black">Rank</div>
              <div className="text-2xl font-black">#42</div>
              <div className="text-sm opacity-90">Out of 1,250</div>
            </div>
          </div>
        </div>

        {/* Random Practice */}
        <div className="relative bg-white/5 backdrop-blur-md border border-white/10 p-8 mb-16 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-black text-white mb-2">Quick Practice</h2>
              <p className="text-gray-300">Take a random quiz with mixed questions from all topics</p>
            </div>
            <Link
              to="/aptitude/random"
              className="px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white font-black hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              Start Random Quiz
            </Link>
          </div>
        </div>

        {/* Topics Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
          {topics.map((topic) => (
            <div
              key={topic.id}
              className="relative bg-white/5 backdrop-blur-md border border-white/10 p-8 hover:bg-white/10 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl overflow-hidden"
            >
              {/* Hover gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${topic.color} opacity-0 hover:opacity-10 transition-opacity duration-500`}></div>
              
              {/* Header */}
              <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="flex items-center">
                  <span className="text-3xl mr-3">{topic.icon}</span>
                  <div>
                    <h3 className="text-lg font-black text-white">{topic.title}</h3>
                    <div className="flex items-center mt-1">
                      {topic.completed ? (
                        <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                      ) : (
                        <Play className="w-4 h-4 text-gray-400 mr-1" />
                      )}
                      <span className="text-sm text-gray-400">
                        {topic.completed ? 'Completed' : 'Not Started'}
                      </span>
                    </div>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(topic.difficulty)}`}>
                  {topic.difficulty}
                </span>
              </div>

              {/* Description */}
              <p className="text-gray-300 mb-6 leading-relaxed relative z-10">{topic.description}</p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6 text-sm relative z-10">
                <div className="text-center p-3 bg-white/5 backdrop-blur-sm border border-white/10">
                  <div className="font-semibold text-white">{topic.questionsCount}</div>
                  <div className="text-gray-400">Questions</div>
                </div>
                <div className="text-center p-3 bg-white/5 backdrop-blur-sm border border-white/10">
                  <div className="font-semibold text-white flex items-center justify-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {topic.avgTime}
                  </div>
                  <div className="text-gray-400">Avg Time</div>
                </div>
              </div>

              {/* Action Button */}
              <Link
                to={`/aptitude/${topic.id}`}
                className={`relative block w-full text-center py-3 font-black transition-all duration-200 z-10 ${
                  topic.completed
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gradient-to-r from-orange-600 to-red-600 text-white hover:shadow-lg transform hover:scale-105'
                }`}
              >
                {topic.completed ? 'Review' : 'Start Practice'}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};