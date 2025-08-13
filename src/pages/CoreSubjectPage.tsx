import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  CheckCircle, 
  Clock, 
  Play, 
  BookOpen, 
  ArrowRight, 
  ArrowLeft,
  Award,
  Target,
  Brain,
  Code,
  X
} from 'lucide-react';
import { osTopics, Topic } from '../data/osTopics';
import { dbmsTopics } from '../data/dbmsTopics';
import { cnTopics } from '../data/cnTopics';

export const CoreSubjectPage: React.FC = () => {
  const { subject } = useParams<{ subject: string }>();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    loadSubjectData(subject || '');
  }, [subject]);

  const loadSubjectData = (subjectName: string) => {
    if (subjectName === 'os') {
      setTopics(osTopics);
    } else if (subjectName === 'dbms') {
      setTopics(dbmsTopics);
    } else if (subjectName === 'cn') {
      setTopics(cnTopics);
    } else {
      setTopics([]);
    }
  };

  const getSubjectInfo = (subjectName: string) => {
    const info: { [key: string]: { title: string, description: string, color: string, icon: any } } = {
      os: {
        title: 'Operating Systems',
        description: 'Master the fundamentals of operating systems including process management, memory management, and system calls',
        color: 'from-blue-500 to-cyan-500',
        icon: Code
      },
      dbms: {
        title: 'Database Management Systems',
        description: 'Learn about databases, SQL, normalization, transactions, and data management',
        color: 'from-green-500 to-emerald-500',
        icon: BookOpen
      },
      cn: {
        title: 'Computer Networks',
        description: 'Explore networking protocols, OSI model, TCP/IP, and network security',
        color: 'from-purple-500 to-pink-500',
        icon: Target
      }
    };

    return info[subjectName] || { 
      title: 'Subject', 
      description: 'Learn new concepts', 
      color: 'from-gray-500 to-gray-600',
      icon: Brain
    };
  };

  const markTopicAsCompleted = (topicId: string) => {
    setTopics(topics.map(topic => 
      topic.id === topicId ? { ...topic, completed: true } : topic
    ));
  };

  const startQuiz = (topic: Topic) => {
    setSelectedTopic(topic);
    setShowQuiz(true);
    setCurrentQuestionIndex(0);
    setScore(0);
    setQuizCompleted(false);
    setSelectedAnswer(null);
    setShowExplanation(false);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === selectedTopic?.quiz[currentQuestionIndex].correct) {
      setScore(score + 1);
    }

    if (currentQuestionIndex < (selectedTopic?.quiz.length || 0) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setQuizCompleted(true);
      if (selectedTopic && score >= (selectedTopic.quiz.length * 0.7)) {
        markTopicAsCompleted(selectedTopic.id);
      }
    }
  };

  const subjectInfo = getSubjectInfo(subject || '');
  const completedTopics = topics.filter(t => t.completed).length;
  const progressPercentage = topics.length > 0 ? (completedTopics / topics.length) * 100 : 0;

  if (showQuiz && !quizCompleted && selectedTopic) {
    const currentQuestion = selectedTopic.quiz[currentQuestionIndex];
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-cyan-500/10 blur-3xl animate-pulse delay-2000"></div>
        </div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="relative bg-white/5 backdrop-blur-md border border-white/10 p-8">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-black text-white">Quiz: {selectedTopic.title}</h1>
                  <p className="text-gray-300">{subjectInfo.title}</p>
                </div>
                <button
                  onClick={() => setShowQuiz(false)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-300 mb-4">
                <span>Question {currentQuestionIndex + 1} of {selectedTopic.quiz.length}</span>
                <span>Score: {score}/{selectedTopic.quiz.length}</span>
              </div>
              <div className="w-full bg-white/20 h-2">
                <div 
                  className={`h-2 bg-gradient-to-r ${subjectInfo.color} transition-all duration-500`}
                  style={{ width: `${((currentQuestionIndex + 1) / selectedTopic.quiz.length) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-6">{currentQuestion.question}</h2>
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={showExplanation}
                    className={`w-full p-4 text-left transition-all duration-200 ${
                      selectedAnswer === index
                        ? showExplanation
                          ? index === currentQuestion.correct
                            ? 'bg-green-500/20 border border-green-500/50 text-white'
                            : 'bg-red-500/20 border border-red-500/50 text-white'
                          : 'bg-cyan-500/20 border border-cyan-500/50 text-white'
                        : showExplanation && index === currentQuestion.correct
                          ? 'bg-green-500/20 border border-green-500/50 text-white'
                          : 'bg-white/5 backdrop-blur-sm border border-white/20 text-gray-300 hover:bg-white/10 hover:border-white/30'
                    } ${showExplanation ? 'cursor-default' : 'cursor-pointer'}`}
                  >
                    <span className="font-medium">{String.fromCharCode(65 + index)}.</span> {option}
                  </button>
                ))}
              </div>
            </div>

            {showExplanation && currentQuestion.explanation && (
              <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/30 backdrop-blur-sm">
                <h3 className="font-semibold text-blue-300 mb-2">Explanation:</h3>
                <p className="text-blue-200">{currentQuestion.explanation}</p>
              </div>
            )}

            <div className="flex justify-between">
              <button
                onClick={() => setShowQuiz(false)}
                className="px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-gray-300 hover:bg-white/20 transition-colors"
              >
                Exit Quiz
              </button>
              <div className="flex space-x-3">
                {!showExplanation && selectedAnswer !== null && (
                  <button
                    onClick={() => setShowExplanation(true)}
                    className="px-6 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 text-white hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                  >
                    Check Answer
                  </button>
                )}
                {showExplanation && (
                  <button
                    onClick={handleNextQuestion}
                    className="flex items-center px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                  >
                    {currentQuestionIndex < selectedTopic.quiz.length - 1 ? 'Next Question' : 'Finish Quiz'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (quizCompleted && selectedTopic) {
    const percentage = Math.round((score / selectedTopic.quiz.length) * 100);
    const passed = percentage >= 70;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-cyan-500/10 blur-3xl animate-pulse delay-2000"></div>
        </div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="relative bg-white/5 backdrop-blur-md border border-white/10 p-8 text-center">
            <div className="mb-8">
              <div className={`w-24 h-24 bg-gradient-to-r ${passed ? 'from-green-500 to-emerald-500' : 'from-red-500 to-pink-500'} flex items-center justify-center mx-auto mb-6 clip-path-hexagon`}>
                {passed ? <Award className="w-12 h-12 text-white" /> : <Clock className="w-12 h-12 text-white" />}
              </div>
              <h1 className="text-4xl font-black text-white mb-4">
                {passed ? 'Quiz Passed!' : 'Quiz Failed'}
              </h1>
              <p className="text-xl text-gray-300">
                You scored {score} out of {selectedTopic.quiz.length} questions
              </p>
            </div>

            <div className="mb-8">
              <div className={`text-5xl font-black mb-2 ${passed ? 'text-green-400' : 'text-red-400'}`}>
                {percentage}%
              </div>
              <div className="text-gray-300">Accuracy</div>
              {passed && (
                <div className="mt-4 text-green-400 font-semibold">
                  ✓ Topic marked as completed!
                </div>
              )}
            </div>

            <div className="flex justify-center space-x-4">
              <button
                onClick={() => {
                  setShowQuiz(false);
                  setQuizCompleted(false);
                  setSelectedTopic(null);
                }}
                className="px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-gray-300 hover:bg-white/20 transition-colors"
              >
                Back to Topics
              </button>
              <button
                onClick={() => startQuiz(selectedTopic)}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                Retake Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/10 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-pink-500/10 blur-3xl animate-pulse delay-2000"></div>
      </div>
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 relative z-10">
          <div className="flex items-center justify-center mb-4">
            <Link to="/core" className="mr-4">
              <ArrowLeft className="w-6 h-6 text-gray-400 hover:text-white transition-colors" />
            </Link>
            <div className={`w-16 h-16 bg-gradient-to-r ${subjectInfo.color} flex items-center justify-center mr-4 clip-path-hexagon`}>
              <subjectInfo.icon className="w-8 h-8 text-white" />
            </div>
            <h1 className={`text-5xl md:text-7xl font-black bg-gradient-to-r ${subjectInfo.color} bg-clip-text text-transparent tracking-tight`}>
              {subjectInfo.title}
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto font-light">
            {subjectInfo.description}
          </p>
        </div>

        {/* Progress Overview */}
        <div className="relative bg-white/5 backdrop-blur-md border border-white/10 p-8 mb-16 z-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-black text-white">Your Progress</h2>
            <div className="text-right">
              <div className="text-3xl font-black text-cyan-400">{Math.round(progressPercentage)}%</div>
              <div className="text-gray-300">Complete</div>
            </div>
          </div>
          
          <div className="w-full bg-white/20 h-3 mb-6">
            <div 
              className={`h-3 bg-gradient-to-r ${subjectInfo.color} transition-all duration-500`}
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-black text-green-400 mb-2">{completedTopics}</div>
              <div className="text-gray-300">Topics Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-purple-400 mb-2">{topics.length}</div>
              <div className="text-gray-300">Total Topics</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-orange-400 mb-2">
                {topics.reduce((acc, topic) => acc + topic.quiz.length, 0)}
              </div>
              <div className="text-gray-300">Quiz Questions</div>
            </div>
          </div>
        </div>

        {/* Topics Grid */}
        <div className="grid lg:grid-cols-2 gap-8 relative z-10">
          {topics.map((topic) => (
            <div
              key={topic.id}
              className="relative bg-white/5 backdrop-blur-md border border-white/10 p-8 hover:bg-white/10 transition-all duration-300 overflow-hidden"
            >
              {/* Hover gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${subjectInfo.color} opacity-0 hover:opacity-10 transition-opacity duration-500`}></div>
              
              <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="flex items-center">
                  <div className={`w-12 h-12 flex items-center justify-center mr-4 ${
                    topic.completed ? 'bg-green-500/20 border border-green-500/50' : 'bg-white/10 backdrop-blur-sm border border-white/20'
                  } clip-path-hexagon`}>
                    {topic.completed ? (
                      <CheckCircle className="w-6 h-6 text-green-400" />
                    ) : (
                      <Play className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white">{topic.title}</h3>
                    <p className="text-gray-300">{topic.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-400">{topic.quiz.length} questions</div>
                  {topic.completed && (
                    <div className="text-sm text-green-400 font-semibold">Completed</div>
                  )}
                </div>
              </div>

              {/* Concepts */}
              <div className="mb-6 relative z-10">
                <h4 className="text-sm font-semibold text-white mb-3 flex items-center">
                  <BookOpen className="w-4 h-4 mr-1" />
                  Key Concepts
                </h4>
                <div className="space-y-2">
                  {topic.concepts.slice(0, 3).map((concept, index) => (
                    <div key={index} className="text-sm text-gray-300 flex items-center">
                      <div className="w-1 h-1 bg-cyan-400 mr-2"></div>
                      {concept}
                    </div>
                  ))}
                  {topic.concepts.length > 3 && (
                    <div className="text-sm text-gray-500">
                      +{topic.concepts.length - 3} more concepts
                    </div>
                  )}
                </div>
              </div>

              {/* Quiz and Read Buttons */}
              <div className="flex gap-3 relative z-10">
                {topic.readUrl && (
                  <a
                    href={topic.readUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-cyan-400 font-semibold hover:bg-white/20 text-center transition-colors"
                  >
                    Read
                  </a>
                )}
                <button
                  onClick={() => startQuiz(topic)}
                  className={`flex-1 py-3 transition-all duration-200 ${
                    topic.completed
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:shadow-lg transform hover:scale-105'
                      : 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:shadow-lg transform hover:scale-105'
                  }`}
                >
                  {topic.completed ? 'Review Quiz' : 'Take Quiz'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {topics.length === 0 && (
          <div className="text-center py-12 relative z-10">
            <div className="text-gray-400 text-lg">
              Content for {subjectInfo.title} is coming soon!
            </div>
          </div>
        )}
      </div>
    </div>
  );
};