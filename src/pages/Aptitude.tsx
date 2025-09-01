import React, { useState, useEffect } from 'react';
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
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';

export const Aptitude: React.FC = () => {
  const { currentUser } = useAuth();
  const [userProgress, setUserProgress] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const fetchProgress = async () => {
      if (currentUser) {
        try {
          const response = await apiService.getProgress();
          setUserProgress(response);
        } catch (error) {
          console.error('Failed to fetch progress:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [currentUser]);

  const topics = aptitudeTopics.map(topic => ({
    id: topic.id,
    title: topic.title,
    description: topic.description,
    icon: topic.icon,
    color: topic.color,
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

  // Merge completed topics from backend progress and localStorage for robustness
  const completedFromBackend: string[] = userProgress?.progress?.aptitude?.completedTopics || [];
  const completedSet = new Set<string>([...completedTopics, ...completedFromBackend]);

  const completedCount = topics.filter(t => completedSet.has(t.id)).length;
  const completedQuestions = topics
    .filter(t => completedSet.has(t.id))
    .reduce((sum, t) => sum + t.questionsCount, 0);

  // Prefer backend score sum for accuracy; fallback to topic question totals when only local flags exist
  const scoreSum = Object.values(userProgress?.progress?.aptitude?.scores || {}).reduce(
    (sum: number, val: any) => sum + (typeof val === 'number' ? val : 0),
    0
  );
  const questionsSolved = scoreSum > 0 ? scoreSum : completedQuestions;

  // Calculate dynamic performance metrics
  const getPerformanceMetrics = () => {
    const aptitudeProgress = userProgress?.progress?.aptitude || {};
    const scores = aptitudeProgress.scores || {};
    const completedTopicsFromProgress = aptitudeProgress.completedTopics || [];

    // Build a map of total questions per topic
    const questionsPerTopic: Record<string, number> = Object.fromEntries(
      aptitudeTopics.map(t => [t.id, t.questions.length])
    );

    // Calculate average accuracy as a percentage across topics that have scores
    const percentValues = Object.entries(scores)
      .map(([topicId, val]) => {
        const correct = typeof val === 'number' ? val : 0;
        const total = questionsPerTopic[topicId] || 0;
        return total > 0 ? (correct / total) * 100 : null;
      })
      .filter((v): v is number => v !== null);

    const averageAccuracy = percentValues.length > 0
      ? Math.round(percentValues.reduce((a, b) => a + b, 0) / percentValues.length)
      : 0;

    // Keep raw values for simple improvement heuristic
    const scoreValues = Object.values(scores) as number[];
    // Calculate improvement rate (mock for now, could be based on recent vs older scores)
    const improvementRate = scoreValues.length > 2 
      ? Math.round(((scoreValues[scoreValues.length - 1] as number) - (scoreValues[0] as number)) * 100) / 100
      : 0;
    
    // Calculate rank (mock based on progress)
    const rank = completedTopicsFromProgress.length > 0 ? Math.max(1, 500 - completedTopicsFromProgress.length * 50) : 999;
    
    return {
      completedTopics: completedTopicsFromProgress.length,
      averageAccuracy,
      improvementRate,
      rank,
      totalUsers: 1250
    };
  };

  const metrics = getPerformanceMetrics();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-6 sm:py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-pink-500/10 blur-3xl animate-pulse delay-2000"></div>
      </div>
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-16 relative z-10">
          <h1 className="heading-font text-3xl sm:text-5xl md:text-7xl font-black text-white mb-4 sm:mb-6 tracking-tight">
            Quantitative Aptitude
          </h1>
          <p className="text-base sm:text-xl text-gray-300 max-w-3xl mx-auto font-light">
            Master quantitative aptitude with practice tests and detailed explanations
          </p>
        </div>

        {/* Stats Overview */}
        <div className="relative bg-white/5 backdrop-blur-md border border-white/10 p-4 sm:p-8 mb-8 sm:mb-16 z-10">
          <h2 className="text-xl sm:text-3xl font-black text-white mb-6 sm:mb-8">Your Progress</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            <div className="text-center">
              <div className="text-2xl sm:text-4xl font-black text-orange-400 mb-2">{completedCount}</div>
              <div className="text-gray-300 text-xs sm:text-base">Topics Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-4xl font-black text-green-400 mb-2">{questionsSolved}</div>
              <div className="text-gray-300 text-xs sm:text-base">Questions Solved</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-4xl font-black text-cyan-400 mb-2">{metrics.averageAccuracy}%</div>
              <div className="text-gray-300 text-xs sm:text-base">Average Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-4xl font-black text-purple-400 mb-2">{metrics.completedTopics}</div>
              <div className="text-gray-300 text-xs sm:text-base">Topics Mastered</div>
            </div>
          </div>
        </div>

        {/* Performance Chart */}
        <div className="relative bg-white/5 backdrop-blur-md border border-white/10 p-4 sm:p-8 mb-8 sm:mb-16 text-white z-10 overflow-hidden">
          {/* Geometric patterns */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-32 h-32 border-2 border-white transform rotate-45"></div>
            <div className="absolute top-10 right-10 w-24 h-24 border-2 border-white transform rotate-12"></div>
            <div className="absolute bottom-10 left-1/4 w-20 h-20 border-2 border-white transform -rotate-12"></div>
          </div>
          
          <h2 className="text-xl sm:text-3xl font-black mb-6 sm:mb-8 flex items-center relative z-10">
            <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3" />
            Performance Analytics
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 relative z-10">
            <div className="text-center p-4 sm:p-6 bg-white/10 backdrop-blur-sm border border-white/20">
              <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 sm:mb-3" />
              <div className="font-black text-sm sm:text-base">Improvement Rate</div>
              <div className="text-lg sm:text-2xl font-black">
                {metrics.improvementRate > 0 ? `+${metrics.improvementRate}%` : `${metrics.improvementRate}%`}
              </div>
              <div className="text-xs sm:text-sm opacity-90">Based on scores</div>
            </div>
            <div className="text-center p-4 sm:p-6 bg-white/10 backdrop-blur-sm border border-white/20">
              <Target className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 sm:mb-3" />
              <div className="font-black text-sm sm:text-base">Average Accuracy</div>
              <div className="text-lg sm:text-2xl font-black">{metrics.averageAccuracy}%</div>
              <div className="text-xs sm:text-sm opacity-90">Across all topics</div>
            </div>
            <div className="text-center p-4 sm:p-6 bg-white/10 backdrop-blur-sm border border-white/20">
              <Award className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 sm:mb-3" />
              <div className="font-black text-sm sm:text-base">Rank</div>
              <div className="text-lg sm:text-2xl font-black">#{metrics.rank}</div>
              <div className="text-xs sm:text-sm opacity-90">Out of {metrics.totalUsers.toLocaleString()}</div>
            </div>
          </div>
        </div>

        {/* Random Practice */}
        <div className="relative bg-white/5 backdrop-blur-md border border-white/10 p-4 sm:p-8 mb-8 sm:mb-16 z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
            <div>
              <h2 className="text-xl sm:text-3xl font-black text-white mb-2">Quick Practice</h2>
              <p className="text-gray-300 text-sm sm:text-base">Take a random quiz with mixed questions from all topics</p>
            </div>
            <Link
              to="/aptitude/random"
              className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white font-black hover:shadow-lg transform hover:scale-105 transition-all duration-200 text-center text-sm sm:text-base"
            >
              Start Random Quiz
            </Link>
          </div>
        </div>

        {/* Topics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 relative z-10">
          {topics.map((topic) => (
            <div
              key={topic.id}
              className="relative bg-white/5 backdrop-blur-md border border-white/10 p-4 sm:p-8 hover:bg-white/10 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl overflow-hidden"
            >
              {/* Hover gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${topic.color} opacity-0 hover:opacity-10 transition-opacity duration-500`}></div>
              
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 relative z-10 space-y-2 sm:space-y-0">
                <div className="flex items-center">
                  <span className="text-2xl sm:text-3xl mr-2 sm:mr-3">{topic.icon}</span>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-white">{topic.title}</h3>
                    <div className="flex items-center mt-1">
                      {completedSet.has(topic.id) ? (
                        <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-1" />
                      ) : (
                        <Play className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 mr-1" />
                      )}
                      <span className="text-sm text-gray-400">
                        {completedSet.has(topic.id) ? 'Completed' : 'Not Started'}
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
                  completedSet.has(topic.id)
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gradient-to-r from-orange-600 to-red-600 text-white hover:shadow-lg transform hover:scale-105'
                }`}
              >
                {completedSet.has(topic.id) ? 'Review' : 'Start Practice'}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};