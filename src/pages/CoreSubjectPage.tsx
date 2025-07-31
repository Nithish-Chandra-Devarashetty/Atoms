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
  Code
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
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Quiz: {selectedTopic.title}</h1>
                  <p className="text-gray-600">{subjectInfo.title}</p>
                </div>
                <span className="text-sm text-gray-600">
                  Question {currentQuestionIndex + 1} of {selectedTopic.quiz.length}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 bg-gradient-to-r ${subjectInfo.color} rounded-full transition-all duration-500`}
                  style={{ width: `${((currentQuestionIndex + 1) / selectedTopic.quiz.length) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">{currentQuestion.question}</h2>
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={showExplanation}
                    className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                      selectedAnswer === index
                        ? showExplanation
                          ? index === currentQuestion.correct
                            ? 'border-green-500 bg-green-50'
                            : 'border-red-500 bg-red-50'
                          : `border-blue-500 bg-blue-50`
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    } ${showExplanation ? 'cursor-default' : 'cursor-pointer'}`}
                  >
                    <span className="font-medium">{String.fromCharCode(65 + index)}.</span> {option}
                  </button>
                ))}
              </div>
            </div>

            {showExplanation && currentQuestion.explanation && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">Explanation:</h3>
                <p className="text-blue-800">{currentQuestion.explanation}</p>
              </div>
            )}

            <div className="flex justify-between">
              <button
                onClick={() => setShowQuiz(false)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Exit Quiz
              </button>
              <div className="flex space-x-3">
                {!showExplanation && selectedAnswer !== null && (
                  <button
                    onClick={() => setShowExplanation(true)}
                    className="px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                  >
                    Check Answer
                  </button>
                )}
                {showExplanation && (
                  <button
                    onClick={handleNextQuestion}
                    className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center">
            <div className="mb-8">
              <div className={`w-24 h-24 bg-gradient-to-r ${passed ? 'from-green-500 to-emerald-500' : 'from-red-500 to-pink-500'} rounded-full flex items-center justify-center mx-auto mb-6`}>
                {passed ? <Award className="w-12 h-12 text-white" /> : <Clock className="w-12 h-12 text-white" />}
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {passed ? 'Quiz Passed!' : 'Quiz Failed'}
              </h1>
              <p className="text-xl text-gray-600">
                You scored {score} out of {selectedTopic.quiz.length} questions
              </p>
            </div>

            <div className="mb-8">
              <div className={`text-4xl font-bold mb-2 ${passed ? 'text-green-600' : 'text-red-600'}`}>
                {percentage}%
              </div>
              <div className="text-gray-600">Accuracy</div>
              {passed && (
                <div className="mt-4 text-green-600 font-semibold">
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
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Back to Topics
              </button>
              <button
                onClick={() => startQuiz(selectedTopic)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Link to="/core" className="mr-4">
              <ArrowLeft className="w-6 h-6 text-gray-600 hover:text-gray-800 transition-colors" />
            </Link>
            <div className={`w-16 h-16 bg-gradient-to-r ${subjectInfo.color} rounded-xl flex items-center justify-center mr-4`}>
              <subjectInfo.icon className="w-8 h-8 text-white" />
            </div>
            <h1 className={`text-4xl md:text-5xl font-bold bg-gradient-to-r ${subjectInfo.color} bg-clip-text text-transparent`}>
              {subjectInfo.title}
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {subjectInfo.description}
          </p>
        </div>

        {/* Progress Overview */}
        <div className="bg-white rounded-2xl p-8 mb-12 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Your Progress</h2>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{Math.round(progressPercentage)}%</div>
              <div className="text-gray-600">Complete</div>
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
            <div 
              className={`h-3 bg-gradient-to-r ${subjectInfo.color} rounded-full transition-all duration-500`}
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-2">{completedTopics}</div>
              <div className="text-gray-600">Topics Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 mb-2">{topics.length}</div>
              <div className="text-gray-600">Total Topics</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 mb-2">
                {topics.reduce((acc, topic) => acc + topic.quiz.length, 0)}
              </div>
              <div className="text-gray-600">Quiz Questions</div>
            </div>
          </div>
        </div>

        {/* Topics Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {topics.map((topic) => (
            <div
              key={topic.id}
              className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
                    topic.completed ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    {topic.completed ? (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    ) : (
                      <Play className="w-6 h-6 text-gray-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{topic.title}</h3>
                    <p className="text-gray-600">{topic.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">{topic.quiz.length} questions</div>
                  {topic.completed && (
                    <div className="text-sm text-green-600 font-semibold">Completed</div>
                  )}
                </div>
              </div>

              {/* Concepts */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                  <BookOpen className="w-4 h-4 mr-1" />
                  Key Concepts
                </h4>
                <div className="space-y-2">
                  {topic.concepts.slice(0, 3).map((concept, index) => (
                    <div key={index} className="text-sm text-gray-600 flex items-center">
                      <div className="w-1 h-1 bg-gray-400 rounded-full mr-2"></div>
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
              <div className="flex gap-3">
                {topic.readUrl && (
                  <a
                    href={topic.readUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-1/2 py-3 rounded-lg bg-gray-100 text-blue-700 font-semibold hover:bg-blue-100 text-center transition-colors"
                    style={{ display: 'inline-block' }}
                  >
                    Read
                  </a>
                )}
                <button
                  onClick={() => startQuiz(topic)}
                  className={`w-1/2 py-3 rounded-lg transition-colors ${
                    topic.completed
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {topic.completed ? 'Review Quiz' : 'Take Quiz'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {topics.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">
              Content for {subjectInfo.title} is coming soon!
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 