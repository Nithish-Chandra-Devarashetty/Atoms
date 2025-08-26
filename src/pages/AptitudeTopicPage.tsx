import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Play, 
  Clock, 
  Target, 
  Award,
  ArrowRight,
  RotateCcw,
  CheckCircle,
  X,
  ArrowLeft
} from 'lucide-react';
import { Question, Topic, aptitudeTopics } from '../data/aptitudeData';

export const AptitudeTopicPage: React.FC = () => {
  const { topic } = useParams<{ topic: string }>();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [answers, setAnswers] = useState<(number | null)[]>([]);

  useEffect(() => {
    loadTopicQuestions(topic || '');
  }, [topic]);

  // Generate random questions from different topics
  const generateRandomQuestions = (count: number): Question[] => {
    const allQuestions: Question[] = [];
    
    // Collect all questions from all topics
    aptitudeTopics.forEach(topic => {
      allQuestions.push(...topic.questions);
    });
    
    // Shuffle the array to ensure different questions each time
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
    
    // Return the first 'count' questions
    return shuffled.slice(0, count);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (quizStarted && !quizCompleted && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && quizStarted) {
      handleQuizComplete();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, quizStarted, quizCompleted]);

  const loadTopicQuestions = async (topicName: string) => {
    const loadQuestions = () => {
      if (topicName === 'random') {
        // Generate 15 random questions from different topics
        const randomQuestions = generateRandomQuestions(15);
        setQuestions(randomQuestions);
        setAnswers(new Array(randomQuestions.length).fill(null));
      } else {
        const topic = aptitudeTopics.find(t => t.id === topicName);
        if (topic) {
          setQuestions(topic.questions);
          setAnswers(new Array(topic.questions.length).fill(null));
        }
      }
    };
    loadQuestions();
  };

  const getTopicInfo = (topicId: string) => {
    if (topicId === 'random') {
      return {
        title: 'Random Quiz',
        description: 'Mixed questions from all aptitude topics',
        color: 'from-orange-500 to-red-500',
        icon: '🎲'
      };
    }
    
    const topic = aptitudeTopics.find(t => t.id === topicId);
    if (topic) {
      return {
        title: topic.title,
        description: topic.description,
        color: topic.color,
        icon: topic.icon
      };
    }
    
    // Default values if topic not found
    return {
      title: 'Aptitude Topic', 
      description: 'Practice aptitude questions', 
      color: 'from-gray-500 to-gray-600',
      icon: '📚'
    };
  };

  const startQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestionIndex(0);
    setScore(0);
    setTimeLeft(900); // 15 minutes
    setQuizCompleted(false);
    
    // For random quiz, generate new questions each time
    if (topic === 'random') {
      const newQuestions = generateRandomQuestions(15);
      setQuestions(newQuestions);
      setAnswers(new Array(newQuestions.length).fill(null));
    } else {
      setAnswers(new Array(questions.length).fill(null));
    }
    
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer !== null) {
      if (selectedAnswer === questions[currentQuestionIndex].correct) {
        setScore(score + 10);
      }
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(answers[currentQuestionIndex + 1]);
      setShowResult(false);
    } else {
      handleQuizComplete();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedAnswer(answers[currentQuestionIndex - 1]);
      setShowResult(false);
    }
  };

  const handleQuizComplete = () => {
    let finalScore = 0;
    answers.forEach((answer, index) => {
      if (answer === questions[index].correct) {
        finalScore += 10;
      }
    });
    setScore(finalScore);
    setQuizCompleted(true);
    setQuizStarted(false);
    
    // Mark topic as completed if score is good (let's say >= 70%) and it's not a random quiz
    if (topic !== 'random' && finalScore >= (questions.length * 10 * 0.7)) {
      localStorage.setItem(`aptitude_${topic}_completed`, 'true');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const topicInfo = getTopicInfo(topic || '');

  if (!quizStarted && !quizCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-orange-900 to-slate-900 py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500/10 blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-red-500/10 blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-yellow-500/10 blur-3xl animate-pulse delay-2000"></div>
        </div>
        
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 relative z-10">
            <div className="flex items-center justify-center mb-4">
              <Link to="/aptitude" className="mr-4">
                <ArrowLeft className="w-6 h-6 text-gray-400 hover:text-white transition-colors" />
              </Link>
              <div className="text-6xl mb-4">{topicInfo.icon}</div>
            </div>
            <h1 className={`text-5xl md:text-7xl font-black bg-gradient-to-r ${topicInfo.color} bg-clip-text text-transparent mb-6 tracking-tight`}>
              {topicInfo.title}
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto font-light">
              {topicInfo.description}
            </p>
          </div>

          {/* Quiz Info */}
          <div className="relative bg-white/5 backdrop-blur-md border border-white/10 p-8 z-10">
            <h2 className="text-3xl font-black text-white mb-8">Quiz Information</h2>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-6 bg-white/5 backdrop-blur-sm border border-white/10">
                <Target className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
                <div className="text-3xl font-black text-white">{questions.length}</div>
                <div className="text-gray-300">Questions</div>
              </div>
              <div className="text-center p-6 bg-white/5 backdrop-blur-sm border border-white/10">
                <Clock className="w-8 h-8 text-green-400 mx-auto mb-3" />
                <div className="text-3xl font-black text-white">15:00</div>
                <div className="text-gray-300">Time Limit</div>
              </div>
              <div className="text-center p-6 bg-white/5 backdrop-blur-sm border border-white/10">
                <Award className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                <div className="text-3xl font-black text-white">{questions.length * 10}</div>
                <div className="text-gray-300">Max Points</div>
              </div>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/30 p-6 mb-8 backdrop-blur-sm">
              <h3 className="font-semibold text-blue-300 mb-3">Instructions:</h3>
              <ul className="space-y-2 text-blue-200 text-sm">
                <li>• You have 15 minutes to complete all questions</li>
                <li>• Each question carries 10 points (Max {questions.length * 10} points)</li>
                <li>• You can navigate between questions</li>
                <li>• Click "Submit Quiz" when you're done</li>
                <li>• No negative marking for wrong answers</li>
                {topic === 'random' && <li>• Questions are randomly selected from different topics</li>}
              </ul>
            </div>

            <div className="text-center">
              <button
                onClick={startQuiz}
                disabled={questions.length === 0}
                className="flex items-center justify-center mx-auto px-8 py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white font-black text-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Play className="w-6 h-6 mr-3" />
                Start Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (quizCompleted) {
    const percentage = Math.round((score / (questions.length * 10)) * 100);
    const correctAnswers = score / 10;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-orange-900 to-slate-900 py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500/10 blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-red-500/10 blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-yellow-500/10 blur-3xl animate-pulse delay-2000"></div>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-white/5 backdrop-blur-md border border-white/10 p-8 text-center z-10">
            <div className="mb-8">
              <div className={`w-24 h-24 bg-gradient-to-r ${topicInfo.color} flex items-center justify-center mx-auto mb-6 clip-path-hexagon`}>
                <Award className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-4xl font-black text-white mb-4">Quiz Completed!</h1>
              <p className="text-xl text-gray-300">You scored {score} points out of {questions.length * 10} points</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-6 bg-white/5 backdrop-blur-sm border border-white/10">
                <div className="text-4xl font-black text-cyan-400 mb-2">{percentage}%</div>
                <div className="text-gray-300">Accuracy</div>
              </div>
              <div className="text-center p-6 bg-white/5 backdrop-blur-sm border border-white/10">
                <div className="text-4xl font-black text-green-400 mb-2">{score}</div>
                <div className="text-gray-300">Points</div>
              </div>
              <div className="text-center p-6 bg-white/5 backdrop-blur-sm border border-white/10">
                <div className="text-4xl font-black text-red-400 mb-2">{questions.length - correctAnswers}</div>
                <div className="text-gray-300">Incorrect</div>
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <button
                onClick={() => {
                  setQuizCompleted(false);
                  setQuizStarted(false);
                }}
                className="px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-gray-300 hover:bg-white/20 transition-colors"
              >
                Back to Topic
              </button>
              <button
                onClick={startQuiz}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Retake Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-orange-900 to-slate-900 py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500/10 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-red-500/10 blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-yellow-500/10 blur-3xl animate-pulse delay-2000"></div>
      </div>
      
      <div className="max-w-4xl mx-auto">
        {/* Quiz Header */}
        <div className="relative bg-white/5 backdrop-blur-md border border-white/10 p-6 mb-8 z-10">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-black text-white">{topicInfo.title} Quiz</h1>
            <div className={`px-4 py-2 font-semibold ${
              timeLeft <= 60 ? 'bg-red-500/20 border border-red-500/50 text-red-300' : 'bg-blue-500/20 border border-blue-500/50 text-blue-300'
            } backdrop-blur-sm`}>
              <Clock className="w-4 h-4 inline mr-2" />
              {formatTime(timeLeft)}
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm text-gray-300 mb-4">
            <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
            <span>Points: {score}/{questions.length * 10}</span>
          </div>
          
          <div className="w-full bg-white/20 h-2">
            <div 
              className={`h-2 bg-gradient-to-r ${topicInfo.color} transition-all duration-500`}
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question */}
        <div className="relative bg-white/5 backdrop-blur-md border border-white/10 p-8 mb-8 z-10">
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-6">{currentQuestion.question}</h2>
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full p-4 text-left transition-all duration-200 ${
                    selectedAnswer === index
                      ? showResult
                        ? index === currentQuestion.correct
                          ? 'bg-green-500/20 border border-green-500/50 text-white'
                          : 'bg-red-500/20 border border-red-500/50 text-white'
                        : 'bg-cyan-500/20 border border-cyan-500/50 text-white'
                      : showResult && index === currentQuestion.correct
                        ? 'bg-green-500/20 border border-green-500/50 text-white'
                        : 'bg-white/5 backdrop-blur-sm border border-white/20 text-gray-300 hover:bg-white/10 hover:border-white/30'
                  }`}
                  disabled={showResult}
                >
                  <div className="flex items-center justify-between">
                    <span>
                      <span className="font-medium">{String.fromCharCode(65 + index)}.</span> {option}
                    </span>
                    {showResult && (
                      <div>
                        {index === currentQuestion.correct && (
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        )}
                        {selectedAnswer === index && index !== currentQuestion.correct && (
                          <X className="w-5 h-5 text-red-400" />
                        )}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Explanation */}
          {showResult && currentQuestion.explanation && (
            <div className="mb-8 p-4 bg-blue-500/10 border border-blue-500/30 backdrop-blur-sm">
              <h3 className="font-semibold text-blue-300 mb-2">Explanation:</h3>
              <p className="text-blue-200">{currentQuestion.explanation}</p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between">
            <div className="flex space-x-3">
              <button
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
                className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 text-gray-300 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              {!showResult && selectedAnswer !== null && (
                <button
                  onClick={() => setShowResult(true)}
                  className="px-4 py-2 bg-gradient-to-r from-yellow-600 to-orange-600 text-white hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  Show Answer
                </button>
              )}
            </div>
            
            <div className="flex space-x-3">
              {currentQuestionIndex < questions.length - 1 ? (
                <button
                  onClick={handleNextQuestion}
                  className="flex items-center px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  Next Question
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              ) : (
                <button
                  onClick={handleQuizComplete}
                  className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  Submit Quiz
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Question Navigator */}
        <div className="relative bg-white/5 backdrop-blur-md border border-white/10 p-6 z-10">
          <h3 className="font-semibold text-white mb-4">Question Navigator</h3>
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentQuestionIndex(index);
                  setSelectedAnswer(answers[index]);
                  setShowResult(false);
                }}
                className={`w-10 h-10 font-semibold text-sm transition-colors ${
                  index === currentQuestionIndex
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                    : answers[index] !== null
                      ? 'bg-green-500/20 border border-green-500/50 text-green-300 hover:bg-green-500/30'
                      : 'bg-white/10 backdrop-blur-sm border border-white/20 text-gray-300 hover:bg-white/20'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};