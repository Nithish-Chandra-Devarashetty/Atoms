import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Play, 
  Clock, 
  Target, 
  Award,
  ArrowRight,
  RotateCcw,
  CheckCircle,
  X
} from 'lucide-react';

interface Question {
  question: string;
  options: string[];
  correct: number;
  explanation?: string;
}

export const AptitudeTopicPage: React.FC = () => {
  const { topic } = useParams<{ topic: string }>();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [answers, setAnswers] = useState<(number | null)[]>([]);

  useEffect(() => {
    loadTopicQuestions(topic || '');
  }, [topic]);

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
    // In a real app, this would call the API
    // For now, using sample questions
    const sampleQuestions: Question[] = [
      {
        question: "A mixture contains wine and water in the ratio 3:2. If 5 liters of water is added to the mixture, the ratio becomes 3:3. Find the original quantity of the mixture.",
        options: ["25 liters", "30 liters", "35 liters", "40 liters"],
        correct: 0,
        explanation: "Let the original quantities be 3x and 2x. After adding 5L water: 3x:(2x+5) = 3:3. Solving: 3x = 2x+5, so x=5. Original mixture = 5x = 25L."
      },
      {
        question: "In what ratio should tea costing Rs. 60 per kg be mixed with tea costing Rs. 65 per kg so that the mixture costs Rs. 62 per kg?",
        options: ["3:2", "2:3", "1:2", "2:1"],
        correct: 0,
        explanation: "Using alligation: (65-62):(62-60) = 3:2. So tea costing Rs.60 should be mixed with tea costing Rs.65 in ratio 3:2."
      },
      {
        question: "A vessel contains 60 liters of milk. 12 liters of milk is taken out and replaced with water. This process is repeated once more. What is the final ratio of milk to water?",
        options: ["16:9", "9:16", "4:1", "1:4"],
        correct: 0,
        explanation: "After first replacement: milk = 60×(48/60) = 48L. After second: milk = 48×(48/60) = 38.4L. Water = 21.6L. Ratio = 38.4:21.6 = 16:9."
      }
    ];

    setQuestions(sampleQuestions);
    setAnswers(new Array(sampleQuestions.length).fill(null));
  };

  const getTopicInfo = (topicName: string) => {
    const info: { [key: string]: { title: string, description: string, color: string, icon: string } } = {
      'mixture-and-alligation': {
        title: 'Mixture and Alligation',
        description: 'Problems involving mixing of different quantities and ratios',
        color: 'from-blue-500 to-cyan-500',
        icon: '🧪'
      },
      'profit-and-loss': {
        title: 'Profit and Loss',
        description: 'Calculate profit, loss, cost price, and selling price',
        color: 'from-green-500 to-emerald-500',
        icon: '💰'
      },
      'pipes-and-cisterns': {
        title: 'Pipes and Cisterns',
        description: 'Time and work problems involving filling and emptying tanks',
        color: 'from-purple-500 to-pink-500',
        icon: '🚰'
      },
      'random': {
        title: 'Random Practice',
        description: 'Mixed questions from all aptitude topics',
        color: 'from-orange-500 to-red-500',
        icon: '🎲'
      }
    };

    return info[topicName || ''] || { 
      title: 'Aptitude Topic', 
      description: 'Practice aptitude questions', 
      color: 'from-gray-500 to-gray-600',
      icon: '📊'
    };
  };

  const startQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestionIndex(0);
    setScore(0);
    setTimeLeft(300);
    setQuizCompleted(false);
    setAnswers(new Array(questions.length).fill(null));
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
        setScore(score + 1);
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
        finalScore++;
      }
    });
    setScore(finalScore);
    setQuizCompleted(true);
    setQuizStarted(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const topicInfo = getTopicInfo(topic || '');

  if (!quizStarted && !quizCompleted) {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
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

          {/* Quiz Info */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Quiz Information</h2>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-6 bg-gray-50 rounded-xl">
                <Target className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-900">{questions.length}</div>
                <div className="text-gray-600">Questions</div>
              </div>
              <div className="text-center p-6 bg-gray-50 rounded-xl">
                <Clock className="w-8 h-8 text-green-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-900">5:00</div>
                <div className="text-gray-600">Time Limit</div>
              </div>
              <div className="text-center p-6 bg-gray-50 rounded-xl">
                <Award className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-900">100</div>
                <div className="text-gray-600">Max Points</div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <h3 className="font-semibold text-blue-900 mb-3">Instructions:</h3>
              <ul className="space-y-2 text-blue-800 text-sm">
                <li>• You have 5 minutes to complete all questions</li>
                <li>• Each question carries equal marks</li>
                <li>• You can navigate between questions</li>
                <li>• Click "Submit Quiz" when you're done</li>
                <li>• No negative marking for wrong answers</li>
              </ul>
            </div>

            <div className="text-center">
              <button
                onClick={startQuiz}
                disabled={questions.length === 0}
                className="flex items-center justify-center mx-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
    const percentage = Math.round((score / questions.length) * 100);
    
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center">
            <div className="mb-8">
              <div className={`w-24 h-24 bg-gradient-to-r ${topicInfo.color} rounded-full flex items-center justify-center mx-auto mb-6`}>
                <Award className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Quiz Completed!</h1>
              <p className="text-xl text-gray-600">You scored {score} out of {questions.length} questions</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-6 bg-gray-50 rounded-xl">
                <div className="text-3xl font-bold text-blue-600 mb-2">{percentage}%</div>
                <div className="text-gray-600">Accuracy</div>
              </div>
              <div className="text-center p-6 bg-gray-50 rounded-xl">
                <div className="text-3xl font-bold text-green-600 mb-2">{score}</div>
                <div className="text-gray-600">Correct</div>
              </div>
              <div className="text-center p-6 bg-gray-50 rounded-xl">
                <div className="text-3xl font-bold text-red-600 mb-2">{questions.length - score}</div>
                <div className="text-gray-600">Incorrect</div>
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <button
                onClick={() => {
                  setQuizCompleted(false);
                  setQuizStarted(false);
                }}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Back to Topic
              </button>
              <button
                onClick={startQuiz}
                className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Quiz Header */}
        <div className="bg-white rounded-2xl p-6 mb-8 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">{topicInfo.title} Quiz</h1>
            <div className={`px-4 py-2 rounded-lg font-semibold ${
              timeLeft <= 60 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
            }`}>
              <Clock className="w-4 h-4 inline mr-2" />
              {formatTime(timeLeft)}
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
            <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
            <span>Score: {score}/{questions.length}</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 bg-gradient-to-r ${topicInfo.color} rounded-full transition-all duration-500`}
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">{currentQuestion.question}</h2>
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                    selectedAnswer === index
                      ? showResult
                        ? index === currentQuestion.correct
                          ? 'border-green-500 bg-green-50'
                          : 'border-red-500 bg-red-50'
                        : 'border-blue-500 bg-blue-50'
                      : showResult && index === currentQuestion.correct
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
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
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        )}
                        {selectedAnswer === index && index !== currentQuestion.correct && (
                          <X className="w-5 h-5 text-red-600" />
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
            <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Explanation:</h3>
              <p className="text-blue-800">{currentQuestion.explanation}</p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between">
            <div className="flex space-x-3">
              <button
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              {!showResult && selectedAnswer !== null && (
                <button
                  onClick={() => setShowResult(true)}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                >
                  Show Answer
                </button>
              )}
            </div>
            
            <div className="flex space-x-3">
              {currentQuestionIndex < questions.length - 1 ? (
                <button
                  onClick={handleNextQuestion}
                  className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Next Question
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              ) : (
                <button
                  onClick={handleQuizComplete}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Submit Quiz
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Question Navigator */}
        <div className="bg-white rounded-2xl p-6 mt-8 shadow-lg border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">Question Navigator</h3>
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentQuestionIndex(index);
                  setSelectedAnswer(answers[index]);
                  setShowResult(false);
                }}
                className={`w-10 h-10 rounded-lg font-semibold text-sm transition-colors ${
                  index === currentQuestionIndex
                    ? 'bg-blue-600 text-white'
                    : answers[index] !== null
                      ? 'bg-green-100 text-green-700 border border-green-300'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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