import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Play, CheckCircle, Clock, Award, BookOpen, Youtube, Pizza as QuizIcon, ArrowRight, Lock } from 'lucide-react';
import { PracticeProjects } from '../components/PracticeProjects';

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
  const [isQuizPassed, setIsQuizPassed] = useState(false);

  useEffect(() => {
    // Load subject data based on the subject parameter
    loadSubjectData(subject || '');
    
    // Check if quiz was previously passed
    const savedQuizStatus = localStorage.getItem(`quiz_${subject}_passed`);
    if (savedQuizStatus === 'true') {
      setIsQuizPassed(true);
    }
  }, [subject]);

  const loadSubjectData = (subjectName: string) => {
    // This would normally load from the uploaded .txt files
    // For now, using sample data
    
    const sampleData: { [key: string]: { videos: Video[], quiz: QuizQuestion[] } } = {
      html: {
        videos: [
          {
            id: '1',
            title: 'HTML Fundamentals - Complete Guide',
            url: 'https://youtu.be/HcOc7P5BMi4',
            duration: '25:30',
            watched: false
          }
        ],
        quiz: [
          {
            question: 'What does HTML stand for?',
            options: [
              'Hyper Trainer Marking Language',
              'Hyper Text Markup Language',
              'Hyper Text Marketing Language',
              'Hyperlink Markup Language'
            ],
            correct: 1
          },
          {
            question: 'Which tag is used to create a hyperlink in HTML?',
            options: ['<img>', '<a>', '<link>', '<href>'],
            correct: 1
          },
          {
            question: 'Which of the following is a void (empty) element in HTML?',
            options: ['<div>', '<p>', '<img>', '<span>'],
            correct: 2
          },
          {
            question: 'What is the correct syntax to write an HTML comment?',
            options: [
              '// Comment goes here',
              '/* Comment goes here */',
              '<!-- Comment goes here -->',
              "' Comment goes here"
            ],
            correct: 2
          },
          {
            question: 'What is the function of the <meta charset="UTF-8"> tag?',
            options: [
              'Set the web page title',
              'Specify the character encoding used in the document',
              'Create a table',
              'Link to a CSS style'
            ],
            correct: 1
          },
          {
            question: 'Which is NOT a semantic HTML element?',
            options: ['<article>', '<section>', '<div>', '<footer>'],
            correct: 2
          },
          {
            question: 'What does the DOCTYPE declaration do?',
            options: [
              'Links to the CSS file',
              'Tells the browser which HTML or XHTML version is being used',
              'Adds metadata to the webpage',
              'Marks a comment'
            ],
            correct: 1
          },
          {
            question: "What's the difference between <b> and <strong>?",
            options: [
              'No difference, both make text bold',
              '<b> is for bolding, <strong> is for semantic importance and accessibility',
              '<b> is deprecated',
              '<strong> is only for headings'
            ],
            correct: 1
          },
          {
            question: 'How can you embed a webpage inside another HTML page?',
            options: ['<span>', '<iframe>', '<embed>', '<object>'],
            correct: 1
          },
          {
            question: 'Which attribute would you use to open a link in a new tab?',
            options: ['target="_blank"', 'newtab="yes"', 'href="newtab"', 'window="open"'],
            correct: 0
          },
          {
            question: 'What is the difference between "id" and "class" attributes?',
            options: [
              'No difference',
              'id can appear multiple times; class only once',
              'id is unique per page; class can be used on multiple elements',
              'class is deprecated'
            ],
            correct: 2
          },
          {
            question: 'Which is the correct way to add a line break in HTML?',
            options: ['<lb>', '<break>', '<br>', '<linebreak>'],
            correct: 2
          },
          {
            question: 'Which HTML element is used to define important text with emphasis, not just italic style?',
            options: ['<i>', '<b>', '<em>', '<mark>'],
            correct: 2
          },
          {
            question: 'Which tag is used for inserting a video into HTML5?',
            options: ['<media>', '<movie>', '<video>', '<source>'],
            correct: 2
          },
          {
            question: 'What new attribute in HTML5 helps with responsive images?',
            options: ['data-src', 'srcset', 'lazy', 'srcnext'],
            correct: 1
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
    // Also update the current video if it's the one being marked as watched
    if (currentVideo && currentVideo.id === videoId) {
      setCurrentVideo({ ...currentVideo, watched: true });
    }
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
      // Check if quiz was passed (70% or higher)
      const finalScore = selectedAnswer === quizQuestions[currentQuestionIndex].correct ? score + 1 : score;
      const percentage = (finalScore / quizQuestions.length) * 100;
      if (percentage >= 70) {
        setIsQuizPassed(true);
        localStorage.setItem(`quiz_${subject}_passed`, 'true');
      }
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
  const progressPercentage = isQuizPassed ? 100 : (videos.length > 0 ? (watchedCount / videos.length) * 50 : 0);

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
    const isPassed = percentage >= 70;
    
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center">
            <div className="mb-8">
              <div className={`w-24 h-24 bg-gradient-to-r ${isPassed ? 'from-green-500 to-emerald-500' : 'from-red-500 to-pink-500'} rounded-full flex items-center justify-center mx-auto mb-6`}>
                {isPassed ? (
                  <CheckCircle className="w-12 h-12 text-white" />
                ) : (
                  <Award className="w-12 h-12 text-white" />
                )}
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {isPassed ? 'Quiz Passed!' : 'Quiz Completed!'}
              </h1>
              <p className="text-xl text-gray-600">You scored {score} out of {quizQuestions.length} questions</p>
            </div>

            <div className="mb-8">
              <div className={`text-4xl font-bold mb-2 ${isPassed ? 'text-green-600' : 'text-red-600'}`}>{percentage}%</div>
              <div className="text-gray-600">Accuracy</div>
              {isPassed && (
                <div className="mt-2 text-sm text-green-600 font-medium">
                  ✓ Quiz marked as completed
                </div>
              )}
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
               <div className="text-2xl font-bold text-purple-600 mb-2">1</div>
               <div className="text-gray-600">Total Videos</div>
             </div>
             <div className="text-center">
               <div className="text-2xl font-bold text-orange-600 mb-2">1</div>
               <div className="text-gray-600">Total Quizzes</div>
             </div>
           </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Video Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Video Lesson</h2>
              
              {currentVideo && (
                <>
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{currentVideo.title}</h3>
                    <div className="flex items-center text-sm text-gray-600 mb-4">
                      <Clock className="w-4 h-4 mr-1" />
                      {currentVideo.duration}
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <div className="relative w-full h-0 pb-[56.25%] rounded-lg overflow-hidden">
                      <iframe
                        src={currentVideo.url.replace('youtu.be/', 'youtube.com/embed/').replace('youtube.com/watch?v=', 'youtube.com/embed/')}
                        title={currentVideo.title}
                        className="absolute top-0 left-0 w-full h-full"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {!currentVideo.watched && (
                      <button
                        onClick={() => markVideoAsWatched(currentVideo.id)}
                        className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Mark as Watched
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

                    {/* Quiz Section */}
          <div className="space-y-8">
            <div className={`bg-white rounded-2xl p-8 shadow-lg border border-gray-100 relative ${!currentVideo?.watched ? 'opacity-50' : ''}`}>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Quiz</h3>
              
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-2xl font-bold text-gray-900">
                    {isQuizPassed ? 'Completed' : '15 Questions'}
                  </div>
                  <div className="text-sm text-gray-600">
                    {isQuizPassed ? '100%' : 'HTML Fundamentals'}
                  </div>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div 
                    className={`h-2 bg-gradient-to-r ${subjectInfo.color} rounded-full transition-all duration-500`}
                    style={{ width: isQuizPassed ? '100%' : '0%' }}
                  ></div>
                </div>
                
                <p className="text-gray-600 text-sm">
                  {isQuizPassed 
                    ? 'You have successfully completed the HTML quiz!'
                    : 'Test your knowledge with 15 comprehensive HTML questions.'
                  }
                </p>
              </div>
              
              {/* Quiz Button */}
              <div className="relative">
                <button
                  onClick={currentVideo?.watched ? startQuiz : undefined}
                  disabled={!currentVideo?.watched || quizQuestions.length === 0}
                  className={`flex items-center justify-center w-full py-4 rounded-lg transition-all duration-300 ${
                    isQuizPassed 
                      ? 'bg-green-600 text-white hover:bg-green-700' 
                      : currentVideo?.watched
                        ? 'bg-purple-600 text-white hover:bg-purple-700'
                        : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                  }`}
                >
                  {isQuizPassed ? (
                    <>
                      <CheckCircle className="w-6 h-6 mr-3" />
                      Quiz Completed
                    </>
                  ) : (
                    <>
                      {currentVideo?.watched ? (
                        <QuizIcon className="w-6 h-6 mr-3" />
                      ) : (
                        <Lock className="w-6 h-6 mr-3" />
                      )}
                      Take Quiz
                    </>
                  )}
                </button>
                
                {/* Lock overlay when video not watched */}
                {!currentVideo?.watched && (
                  <div className="absolute inset-0 bg-gray-900 bg-opacity-30 rounded-lg flex items-center justify-center backdrop-blur-sm">
                    <Lock className="w-8 h-8 text-gray-600" />
                  </div>
                )}
              </div>
              
                             {/* Quiz Stats */}
               <div className="mt-6 pt-6 border-t border-gray-200">
                 <div className="text-center">
                   <div className="font-semibold text-gray-900">15</div>
                   <div className="text-gray-600">Questions</div>
                 </div>
               </div>
            </div>
          </div>
          
          {/* Practice Projects Section */}
          {subject === 'html' && (
            <div className="mt-12">
              <PracticeProjects />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};