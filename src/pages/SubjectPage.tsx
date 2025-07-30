import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Play, CheckCircle, Clock, Award, BookOpen, Youtube, Pizza as QuizIcon, ArrowRight } from 'lucide-react';

interface Video {
  id: string;
  title: string;
  url: string;
  duration: string;
  watched: boolean;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
}

export const SubjectPage: React.FC = () => {
  const { subject } = useParams<{ subject: string }>();
  const [videos, setVideos] = useState<Video[]>([]);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  useEffect(() => {
    // Load subject data based on the subject parameter
    loadSubjectData(subject || '');
  }, [subject]);

  const loadSubjectData = (subjectName: string) => {
    // This would normally load from the uploaded .txt files
    // For now, using sample data
    
    const sampleData: { [key: string]: { videos: Video[], quiz: QuizQuestion[] } } = {
      html: {
        videos: [
          {
            id: '1',
            title: 'HTML Basics - Introduction to HTML',
            url: 'https://youtu.be/HcOc7P5BMi4',
            duration: '15:30',
            watched: true
          },
          {
            id: '2',
            title: 'HTML Elements and Tags',
            url: 'https://youtu.be/HcOc7P5BMi4',
            duration: '12:45',
            watched: true
          },
          {
            id: '3',
            title: 'HTML Forms and Input Elements',
            url: 'https://youtu.be/HcOc7P5BMi4',
            duration: '18:20',
            watched: false
          }
        ],
        quiz: [
          {
            question: 'What does HTML stand for?',
            options: [
              'Hyper Trainer Marking Language',
              'Hyper Text Marketing Language',
              'Hyper Text Markup Language',
              'Hyper Text Markup Level'
            ],
            correct: 2
          },
          {
            question: 'Which tag is used to define the main content of an HTML document?',
            options: ['<main>', '<body>', '<content>', '<section>'],
            correct: 0
          },
          {
            question: 'Which element is used for the largest heading?',
            options: ['<h6>', '<heading>', '<h1>', '<header>'],
            correct: 2
          }
        ]
      },
      os: {
        videos: [
          {
            id: '1',
            title: 'Operating Systems Overview',
            url: 'https://youtu.be/8XBtAjKwCm4',
            duration: '20:15',
            watched: true
          },
          {
            id: '2',
            title: 'Process Management',
            url: 'https://youtu.be/8XBtAjKwCm4',
            duration: '25:30',
            watched: false
          }
        ],
        quiz: [
          {
            question: 'What is the primary purpose of an operating system?',
            options: [
              'Provide hardware only',
              'Manage system resources',
              'Create web applications',
              'Perform calculations'
            ],
            correct: 1
          }
        ]
      }
    };

    const data = sampleData[subjectName] || { videos: [], quiz: [] };
    setVideos(data.videos);
    setQuizQuestions(data.quiz);
    setCurrentVideo(data.videos[0] || null);
  };

  const markVideoAsWatched = (videoId: string) => {
    setVideos(videos.map(video => 
      video.id === videoId ? { ...video, watched: true } : video
    ));
  };

  const startQuiz = () => {
    setShowQuiz(true);
    setCurrentQuestionIndex(0);
    setScore(0);
    setQuizCompleted(false);
    setSelectedAnswer(null);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === quizQuestions[currentQuestionIndex].correct) {
      setScore(score + 1);
    }

    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
    } else {
      setQuizCompleted(true);
    }
  };

  const getSubjectInfo = (subjectName: string) => {
    const info: { [key: string]: { title: string, description: string, color: string } } = {
      html: {
        title: 'HTML Fundamentals',
        description: 'Learn the building blocks of web development with HTML',
        color: 'from-orange-500 to-red-500'
      },
      css: {
        title: 'CSS Styling',
        description: 'Master the art of styling web pages with CSS',
        color: 'from-blue-500 to-cyan-500'
      },
      javascript: {
        title: 'JavaScript Programming',
        description: 'Add interactivity to your web pages with JavaScript',
        color: 'from-yellow-500 to-orange-500'
      },
      os: {
        title: 'Operating Systems',
        description: 'Understand how operating systems manage computer resources',
        color: 'from-blue-500 to-cyan-500'
      },
      dbms: {
        title: 'Database Management Systems',
        description: 'Learn about databases, SQL, and data management',
        color: 'from-green-500 to-emerald-500'
      },
      cn: {
        title: 'Computer Networks',
        description: 'Explore networking protocols and communication systems',
        color: 'from-purple-500 to-pink-500'
      }
    };

    return info[subjectName] || { title: 'Subject', description: 'Learn new concepts', color: 'from-gray-500 to-gray-600' };
  };

  const subjectInfo = getSubjectInfo(subject || '');
  const watchedCount = videos.filter(v => v.watched).length;
  const progressPercentage = videos.length > 0 ? (watchedCount / videos.length) * 100 : 0;

  if (showQuiz && !quizCompleted) {
    const currentQuestion = quizQuestions[currentQuestionIndex];
    
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-gray-900">Quiz: {subjectInfo.title}</h1>
                <span className="text-sm text-gray-600">
                  Question {currentQuestionIndex + 1} of {quizQuestions.length}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 bg-gradient-to-r ${subjectInfo.color} rounded-full transition-all duration-500`}
                  style={{ width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%` }}
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
                    className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                      selectedAnswer === index
                        ? `border-blue-500 bg-blue-50`
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <span className="font-medium">{String.fromCharCode(65 + index)}.</span> {option}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setShowQuiz(false)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Exit Quiz
              </button>
              <button
                onClick={handleNextQuestion}
                disabled={selectedAnswer === null}
                className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {currentQuestionIndex < quizQuestions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (quizCompleted) {
    const percentage = Math.round((score / quizQuestions.length) * 100);
    
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center">
            <div className="mb-8">
              <div className={`w-24 h-24 bg-gradient-to-r ${subjectInfo.color} rounded-full flex items-center justify-center mx-auto mb-6`}>
                <Award className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Quiz Completed!</h1>
              <p className="text-xl text-gray-600">You scored {score} out of {quizQuestions.length} questions</p>
            </div>

            <div className="mb-8">
              <div className="text-4xl font-bold text-blue-600 mb-2">{percentage}%</div>
              <div className="text-gray-600">Accuracy</div>
            </div>

            <div className="flex justify-center space-x-4">
              <button
                onClick={() => {
                  setShowQuiz(false);
                  setQuizCompleted(false);
                }}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Back to Videos
              </button>
              <button
                onClick={startQuiz}
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
          <h1 className={`text-4xl md:text-5xl font-bold bg-gradient-to-r ${subjectInfo.color} bg-clip-text text-transparent mb-4`}>
            {subjectInfo.title}
          </h1>
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
              <div className="text-2xl font-bold text-green-600 mb-2">{watchedCount}</div>
              <div className="text-gray-600">Videos Watched</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 mb-2">{videos.length}</div>
              <div className="text-gray-600">Total Videos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 mb-2">{quizQuestions.length}</div>
              <div className="text-gray-600">Quiz Questions</div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Video List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Video Lessons</h2>
              
              <div className="space-y-4">
                {videos.map((video, index) => (
                  <div
                    key={video.id}
                    onClick={() => setCurrentVideo(video)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                      currentVideo?.id === video.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                          video.watched ? 'bg-green-100' : 'bg-gray-100'
                        }`}>
                          {video.watched ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <Play className="w-5 h-5 text-gray-600" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{video.title}</h3>
                          <div className="flex items-center text-sm text-gray-600">
                            <Clock className="w-4 h-4 mr-1" />
                            {video.duration}
                          </div>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">#{index + 1}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Current Video & Actions */}
          <div className="space-y-8">
            {/* Current Video */}
            {currentVideo && (
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Now Playing</h3>
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">{currentVideo.title}</h4>
                  <div className="flex items-center text-sm text-gray-600 mb-4">
                    <Clock className="w-4 h-4 mr-1" />
                    {currentVideo.duration}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <a
                    href={currentVideo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <Youtube className="w-5 h-5 mr-2" />
                    Watch on YouTube
                  </a>
                  
                  {!currentVideo.watched && (
                    <button
                      onClick={() => markVideoAsWatched(currentVideo.id)}
                      className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Mark as Watched
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Quiz Section */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Practice Quiz</h3>
              <p className="text-gray-600 mb-6">
                Test your knowledge with {quizQuestions.length} questions about {subjectInfo.title.toLowerCase()}.
              </p>
              
              <button
                onClick={startQuiz}
                disabled={quizQuestions.length === 0}
                className="flex items-center justify-center w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <QuizIcon className="w-5 h-5 mr-2" />
                Start Quiz
              </button>
            </div>

            {/* Study Tips */}
            <div className={`bg-gradient-to-r ${subjectInfo.color} rounded-2xl p-8 text-white`}>
              <h3 className="text-xl font-bold mb-4">Study Tips</h3>
              <ul className="space-y-2 text-sm opacity-90">
                <li>• Watch videos in order for best understanding</li>
                <li>• Take notes while watching</li>
                <li>• Practice with the quiz after each video</li>
                <li>• Review concepts you find challenging</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};