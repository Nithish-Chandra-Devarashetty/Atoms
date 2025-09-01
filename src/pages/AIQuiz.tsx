import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { 
  ArrowRight, 
  Zap, 
  Cpu, 
  Brain, 
  Code, 
  Database, 
  Globe, 
  Server, 
  Box,
  Monitor,
  X,
  CheckCircle,
  XCircle
} from 'lucide-react';

type Track = 'webdev' | 'core';
type Phase = 'select' | 'topics' | 'quiz' | 'results';

const WEBDEV_TOPICS = [
  { name: 'HTML', icon: Globe, color: 'from-orange-500 to-red-500' },
  { name: 'CSS', icon: Monitor, color: 'from-blue-500 to-purple-500' },
  { name: 'JavaScript', icon: Code, color: 'from-yellow-400 to-orange-500' },
  { name: 'Node.js', icon: Server, color: 'from-green-500 to-emerald-500' },
  { name: 'Express', icon: Box, color: 'from-gray-500 to-slate-600' },
  { name: 'MongoDB', icon: Database, color: 'from-green-600 to-teal-600' }
];

const CORE_TOPICS = [
  { name: 'Operating Systems', icon: Cpu, color: 'from-indigo-500 to-blue-600' },
  { name: 'DBMS', icon: Database, color: 'from-purple-500 to-pink-500' },
  { name: 'Computer Networks', icon: Globe, color: 'from-cyan-500 to-blue-500' }
];

interface Question {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const AIQuiz: React.FC = () => {
  const [phase, setPhase] = useState<Phase>('select');
  const [track, setTrack] = useState<Track | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [score, setScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [battleAnimation, setBattleAnimation] = useState(0);

  // Battle animation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setBattleAnimation(prev => (prev + 1) % 100);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const startQuiz = async (topicName: string) => {
    setLoading(true);
    setError(null);
    setSelectedTopic(topicName);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setUserAnswers([]);
    setScore(null);

    try {
      const data = await apiService.generateAIQuiz({ 
        track: track!, 
        topic: topicName, 
        n: 15 
      });
      setQuestions(data.questions);
      setPhase('quiz');
    } catch (e: any) {
      setError(e?.message || 'Failed to start quiz');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (showExplanation) return;
    setSelectedAnswer(answerIndex);
    setShowExplanation(true);
    
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setUserAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      // Calculate final score
      let finalScore = 0;
      questions.forEach((q, index) => {
        if (userAnswers[index] === q.correctIndex) finalScore++;
      });
      setScore(finalScore);
      setPhase('results');
    }
  };

  const resetQuiz = () => {
    setPhase('select');
    setTrack(null);
    setSelectedTopic(null);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setUserAnswers([]);
    setScore(null);
    setError(null);
  };

  const currentQuestion = questions[currentQuestionIndex];

  // Battle Elements Component - Subtle version
  const BattleBackground = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
      {/* Minimal grid */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '100px 100px',
          transform: `translate(${battleAnimation % 100}px, ${battleAnimation % 100}px)`
        }}
      />
      
      {/* Floating elements */}
      {Array.from({length: 4}).map((_, i) => (
        <div
          key={i}
          className="absolute w-4 h-4 text-white/10"
          style={{
            left: `${20 + (i * 20)}%`,
            top: `${30 + Math.sin(battleAnimation * 0.05 + i) * 10}%`,
            transform: `translateY(${Math.cos(battleAnimation * 0.03 + i) * 15}px)`
          }}
        >
          {i % 2 === 0 ? <Cpu /> : <Brain />}
        </div>
      ))}
    </div>
  );

  return (
    <div className="relative min-h-[calc(100vh-var(--navbar-height))] text-white bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800">
      {/* Minimal animated background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/[0.03] rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/[0.03] rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        {/* Subtle battle background during quiz */}
        {phase === 'quiz' && <BattleBackground />}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20 relative z-10">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="heading-font text-4xl sm:text-6xl md:text-7xl font-light tracking-wide text-white mb-4 sm:mb-6">
            Compete with AI
          </h1>
          <p className="text-base sm:text-lg text-gray-300 font-light max-w-2xl mx-auto leading-relaxed px-4">
            {phase === 'quiz' ? 'Test your knowledge against artificial intelligence' : 'Select your domain and challenge the AI'}
          </p>
        </div>

        {/* Phase: Track Selection */}
        {phase === 'select' && (
          <div className="space-y-8 sm:space-y-12">
            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl font-light text-white mb-4 tracking-wide">Choose Your Domain</h2>
              <div className="w-16 sm:w-24 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent mx-auto mb-6 sm:mb-8"></div>
              <p className="text-gray-300 font-light px-4">Select between Web Development or Core Computer Science</p>
            </div>
            
            <div className="grid gap-6 sm:gap-8 max-w-5xl mx-auto px-4">
              {/* Web Development */}
              <div 
                onClick={() => { setTrack('webdev'); setPhase('topics'); }}
                className="group relative p-8 sm:p-12 bg-white/[0.03] border border-white/20 hover:border-white/30 cursor-pointer transition-all duration-500 hover:bg-white/[0.06] backdrop-blur-sm"
              >
                <div className="text-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-6 sm:mb-8 flex items-center justify-center">
                    <Code className="w-8 h-8 sm:w-12 sm:h-12 text-white/70 group-hover:text-blue-300 transition-colors duration-300" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-light text-white mb-3 sm:mb-4 tracking-wide">Web Development</h3>
                  <p className="text-sm sm:text-base text-gray-300 font-light leading-relaxed px-2">Frontend and backend technologies, frameworks, and modern web standards</p>
                  <div className="mt-6 sm:mt-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-6 sm:w-8 h-px bg-blue-300/50 mx-auto"></div>
                  </div>
                </div>
              </div>

              {/* Core Subjects */}
              <div 
                onClick={() => { setTrack('core'); setPhase('topics'); }}
                className="group relative p-8 sm:p-12 bg-white/[0.03] border border-white/20 hover:border-white/30 cursor-pointer transition-all duration-500 hover:bg-white/[0.06] backdrop-blur-sm"
              >
                <div className="text-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-6 sm:mb-8 flex items-center justify-center">
                    <Database className="w-8 h-8 sm:w-12 sm:h-12 text-white/70 group-hover:text-purple-300 transition-colors duration-300" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-light text-white mb-3 sm:mb-4 tracking-wide">Core Subjects</h3>
                  <p className="text-sm sm:text-base text-gray-300 font-light leading-relaxed px-2">Computer science fundamentals, systems, and theoretical concepts</p>
                  <div className="mt-6 sm:mt-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-6 sm:w-8 h-px bg-purple-300/50 mx-auto"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Phase: Topic Selection */}
        {phase === 'topics' && (
          <div className="space-y-8 sm:space-y-12">
            <div className="flex items-center justify-between px-4">
              <div className="text-center flex-1">
                <h2 className="text-2xl sm:text-3xl font-light text-white tracking-wide mb-2">
                  {track === 'webdev' ? 'Web Technologies' : 'Core Subjects'}
                </h2>
                <div className="w-12 sm:w-16 h-px bg-white/30 mx-auto"></div>
              </div>
              <button 
                onClick={() => setPhase('select')}
                className="p-2 sm:p-3 hover:bg-white/10 text-white/50 hover:text-white transition-colors duration-300 border border-white/10 hover:border-white/20"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto px-4">
              {(track === 'webdev' ? WEBDEV_TOPICS : CORE_TOPICS).map((topic, index) => {
                const Icon = topic.icon;
                return (
                  <div
                    key={topic.name}
                    onClick={() => startQuiz(topic.name)}
                    className="group relative p-6 sm:p-8 bg-white/[0.03] border border-white/20 hover:border-white/30 cursor-pointer transition-all duration-500 hover:bg-white/[0.06] backdrop-blur-sm"
                    style={{ 
                      animationDelay: `${index * 100}ms`,
                      transform: 'translateY(20px)',
                      animation: `fadeInUp 0.6s ease-out forwards ${index * 100}ms`
                    }}
                  >
                    <div className="text-center">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-4 sm:mb-6 flex items-center justify-center">
                        <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-white/70 group-hover:text-white transition-colors duration-300" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-light text-white mb-3 sm:mb-4 tracking-wide">{topic.name}</h3>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-4 sm:w-6 h-px bg-white/40 mx-auto"></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {loading && (
              <div className="text-center py-8 sm:py-12 px-4">
                <div className="w-6 h-6 sm:w-8 sm:h-8 border border-white/20 border-t-white/60 rounded-full animate-spin mx-auto mb-3 sm:mb-4"></div>
                <div className="text-sm sm:text-base text-white/60 font-light">Preparing your challenge...</div>
              </div>
            )}
            
            {error && (
              <div className="text-center py-4 sm:py-6 px-4">
                <div className="inline-block px-4 sm:px-6 py-2 sm:py-3 bg-red-500/10 border border-red-500/30 text-red-400 font-light text-sm sm:text-base">
                  {error}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Phase: Quiz */}
        {phase === 'quiz' && currentQuestion && (
          <div className="space-y-6 sm:space-y-8 px-4">
            {/* Progress */}
            <div className="flex items-center justify-between mb-6 sm:mb-8 text-xs sm:text-sm text-white/50">
              <div>Question {currentQuestionIndex + 1} of {questions.length}</div>
              <div className="text-right">{selectedTopic}</div>
            </div>

            <div className="w-full bg-white/10 h-px mb-8 sm:mb-12">
              <div 
                className="bg-white h-full transition-all duration-500 ease-out"
                style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
              />
            </div>

            {/* Question */}
            <div className="max-w-4xl mx-auto">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-light text-white mb-8 sm:mb-12 leading-relaxed text-center px-2">
                {currentQuestion.question}
              </h3>
              
              <div className="space-y-3 sm:space-y-4">
                {currentQuestion.options.map((option, index) => {
                  const isSelected = selectedAnswer === index;
                  const isCorrect = index === currentQuestion.correctIndex;
                  const showResult = showExplanation;
                  
                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      disabled={showExplanation}
                      className={`
                        w-full text-left p-4 sm:p-6 border transition-all duration-300 font-light backdrop-blur-sm text-sm sm:text-base
                        ${!showResult 
                          ? 'border-white/20 bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/30' 
                          : isSelected 
                            ? isCorrect 
                              ? 'border-green-400/60 bg-green-500/15' 
                              : 'border-red-400/60 bg-red-500/15'
                            : isCorrect 
                              ? 'border-green-400/40 bg-green-500/10'
                              : 'border-white/20 bg-white/[0.03]'
                        }
                        ${showResult ? 'cursor-default' : 'cursor-pointer'}
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center border border-white/20 text-xs sm:text-sm text-white/60 mr-3 sm:mr-4 flex-shrink-0">
                            {String.fromCharCode(65 + index)}
                          </span>
                          <span className="text-white leading-relaxed">{option}</span>
                        </div>
                        {showResult && isCorrect && (
                          <div className="w-4 h-4 sm:w-5 sm:h-5 border border-green-400 bg-green-400/20 flex items-center justify-center flex-shrink-0">
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400"></div>
                          </div>
                        )}
                        {showResult && isSelected && !isCorrect && (
                          <div className="w-4 h-4 sm:w-5 sm:h-5 border border-red-400 bg-red-400/20 flex items-center justify-center flex-shrink-0">
                            <X className="w-2 h-2 sm:w-3 sm:h-3 text-red-400" />
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {showExplanation && (
                <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-white/[0.03] border border-white/20 backdrop-blur-sm">
                  <div className="text-white/60 text-xs sm:text-sm font-light mb-2">Explanation</div>
                  <div className="text-white/90 font-light leading-relaxed text-sm sm:text-base">{currentQuestion.explanation}</div>
                </div>
              )}
            </div>

            {/* Next Button */}
            {showExplanation && (
              <div className="flex justify-center pt-6 sm:pt-8">
                <button
                  onClick={nextQuestion}
                  className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-black font-light hover:bg-white/90 transition-all duration-300 tracking-wide text-sm sm:text-base"
                >
                  {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'View Results'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Phase: Results */}
        {phase === 'results' && (
          <div className="px-4">
            <div className="text-center space-y-8 sm:space-y-12 max-w-2xl mx-auto mb-8 sm:mb-12">
              <div>
                <h2 className="text-3xl sm:text-4xl font-light text-white mb-6 sm:mb-8 tracking-wide">Challenge Complete</h2>
                <div className="text-6xl sm:text-8xl font-extralight mb-4 sm:mb-6 text-white">
                  {score}/{questions.length}
                </div>
                <div className="w-16 sm:w-24 h-px bg-white/30 mx-auto mb-4 sm:mb-6"></div>
                <p className="text-base sm:text-lg text-white/60 font-light">
                  {score! >= questions.length * 0.8 
                    ? 'Exceptional performance' 
                    : score! >= questions.length * 0.6 
                    ? 'Well done' 
                    : 'Keep practicing'
                  }
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <button
                  onClick={resetQuiz}
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white text-black font-light hover:bg-white/90 transition-all duration-300 tracking-wide text-sm sm:text-base"
                >
                  New Challenge
                </button>
                <button
                  onClick={() => setPhase('topics')}
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 border border-white/20 text-white font-light hover:bg-white/[0.04] hover:border-white/30 transition-all duration-300 tracking-wide text-sm sm:text-base"
                >
                  Change Topic
                </button>
              </div>
            </div>

            {/* Question Review */}
            <div className="max-w-3xl mx-auto">
              <h3 className="text-lg sm:text-xl font-light text-white mb-4 sm:mb-6 text-center">Question Review</h3>
              <div className="space-y-4 sm:space-y-6">
                {questions.map((question, index) => {
                  const userAnswer = userAnswers[index];
                  const isCorrect = userAnswer === question.correctIndex;
                  
                  return (
                    <div key={index} className="text-left p-4 sm:p-6 bg-white/[0.03] border border-white/10">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 sm:mb-4">
                        <span className="text-sm sm:text-base text-white/60 font-light">Question {index + 1}</span>
                        <div className={`flex items-center gap-2 text-xs sm:text-sm font-light mt-1 sm:mt-0 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                          {isCorrect ? <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" /> : <XCircle className="w-3 h-3 sm:w-4 sm:h-4" />}
                          {isCorrect ? 'Correct' : 'Incorrect'}
                        </div>
                      </div>
                      <p className="text-white font-light mb-3 sm:mb-4 leading-relaxed text-sm sm:text-base">{question.question}</p>
                      <div className="space-y-2">
                        <div className="text-xs sm:text-sm">
                          <span className="text-white/60">Your answer: </span>
                          <span className={userAnswer === question.correctIndex ? 'text-green-400' : 'text-red-400'}>
                            {String.fromCharCode(65 + userAnswer)} - {question.options[userAnswer]}
                          </span>
                        </div>
                        {userAnswer !== question.correctIndex && (
                          <div className="text-xs sm:text-sm">
                            <span className="text-white/60">Correct answer: </span>
                            <span className="text-green-400">
                              {String.fromCharCode(65 + question.correctIndex)} - {question.options[question.correctIndex]}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIQuiz;
