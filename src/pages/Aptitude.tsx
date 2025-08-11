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
  const [completedTopics] = useState<string[]>(['mixture-and-alligation']);

  const topics = aptitudeTopics.map(topic => ({
    id: topic.id,
    title: topic.title,
    description: topic.description,
    icon: topic.icon,
    difficulty: 'Medium',
    questionsCount: topic.questions.length,
    avgTime: '2 min',
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
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-4">
            Quantitative Aptitude
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Master quantitative aptitude with practice tests and detailed explanations
          </p>
        </div>

        {/* Stats Overview */}
        <div className="bg-white rounded-2xl p-8 mb-12 shadow-lg border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Progress</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">{completedCount}</div>
              <div className="text-gray-600">Topics Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{completedQuestions}</div>
              <div className="text-gray-600">Questions Solved</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">85%</div>
              <div className="text-gray-600">Average Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">2.1</div>
              <div className="text-gray-600">Avg Time (min)</div>
            </div>
          </div>
        </div>

        {/* Performance Chart */}
        <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl p-8 mb-12 text-white">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <BarChart3 className="w-8 h-8 mr-3" />
            Performance Analytics
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-white/10 rounded-xl backdrop-blur-sm">
              <TrendingUp className="w-8 h-8 mx-auto mb-3" />
              <div className="font-semibold">Improvement Rate</div>
              <div className="text-2xl font-bold">+15%</div>
              <div className="text-sm opacity-90">This week</div>
            </div>
            <div className="text-center p-6 bg-white/10 rounded-xl backdrop-blur-sm">
              <Target className="w-8 h-8 mx-auto mb-3" />
              <div className="font-semibold">Accuracy Goal</div>
              <div className="text-2xl font-bold">90%</div>
              <div className="text-sm opacity-90">Current: 85%</div>
            </div>
            <div className="text-center p-6 bg-white/10 rounded-xl backdrop-blur-sm">
              <Award className="w-8 h-8 mx-auto mb-3" />
              <div className="font-semibold">Rank</div>
              <div className="text-2xl font-bold">#42</div>
              <div className="text-sm opacity-90">Out of 1,250</div>
            </div>
          </div>
        </div>

        {/* Random Practice */}
        <div className="bg-white rounded-2xl p-8 mb-12 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Quick Practice</h2>
              <p className="text-gray-600">Take a random quiz with mixed questions from all topics</p>
            </div>
            <Link
              to="/aptitude/random"
              className="px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              Start Random Quiz
            </Link>
          </div>
        </div>

        {/* Topics Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {topics.map((topic) => (
            <div
              key={topic.id}
              className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <span className="text-3xl mr-3">{topic.icon}</span>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{topic.title}</h3>
                    <div className="flex items-center mt-1">
                      {topic.completed ? (
                        <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                      ) : (
                        <Play className="w-4 h-4 text-gray-400 mr-1" />
                      )}
                      <span className="text-sm text-gray-500">
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
              <p className="text-gray-600 mb-6 leading-relaxed">{topic.description}</p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="font-semibold text-gray-900">{topic.questionsCount}</div>
                  <div className="text-gray-600">Questions</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="font-semibold text-gray-900 flex items-center justify-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {topic.avgTime}
                  </div>
                  <div className="text-gray-600">Avg Time</div>
                </div>
              </div>

              {/* Action Button */}
              <Link
                to={`/aptitude/${topic.id}`}
                className={`block w-full text-center py-3 rounded-lg font-semibold transition-all duration-200 ${
                  topic.completed
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
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