import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle, Clock, Award, Pizza as QuizIcon, ArrowRight, Lock } from 'lucide-react';
import { PracticeProjects } from '../components/PracticeProjects';
import { apiService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { htmlData as rawHtmlData } from '../data/webdev/htmlData';
import { cssData as rawCssData } from '../data/webdev/cssData';
import { javascriptData as rawJavascriptData } from '../data/webdev/javascriptData';
import { reactData as rawReactData } from '../data/webdev/reactData';
import { nodeData as rawNodeData } from '../data/webdev/nodeData';
import { mongoData as rawMongoData } from '../data/webdev/mongoData';
import { Project as ReactProject, reactProjects } from '../data/reactProjects';
import { Project as NodeProject, nodeProjects } from '../data/nodeProjects';
import { Project as MongoProject, mongoProjects } from '../data/mongoProjects';

const htmlData: {
  url: string;
  title: string;
  subjectInfo: { title: string; description: string; color: string };
  videos: Video[];
  quiz: QuizQuestion[];
  projectIdeas: { title: string; topics: string[] }[];
} = rawHtmlData;

const cssData: {
  url: string;
  title: string;
  subjectInfo: { title: string; description: string; color: string };
  videos: Video[];
  quiz: QuizQuestion[];
  projectIdeas: { title: string; topics: string[] }[];
} = rawCssData;

const javascriptData: {
  url: string;
  title: string;
  subjectInfo: { title: string; description: string; color: string };
  videos: Video[];
  quizzes: { [videoId: string]: QuizQuestion[] };
  projectIdeas: { title: string; topics: string[] }[];
} = rawJavascriptData;

const reactData: {
  url: string;
  title: string;
  subjectInfo: { title: string; description: string; color: string };
  videos: Video[];
  quizzes: { [videoId: string]: QuizQuestion[] };
  projectIdeas: { title: string; topics: string[] }[];
} = rawReactData;

const nodeData: {
  url: string;
  title: string;
  subjectInfo: { title: string; description: string; color: string };
  videos: Video[];
  quizzes: { [videoId: string]: QuizQuestion[] };
  projectIdeas: { title: string; topics: string[] }[];
} = rawNodeData;

const mongoData: {
  url: string;
  title: string;
  subjectInfo: { title: string; description: string; color: string };
  videos: Video[];
  quizzes: { [videoId: string]: QuizQuestion[] };
  projectIdeas: { title: string; topics: string[] }[];
} = rawMongoData;

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

// Helper to map projectIdeas to Project[]
const mapProjectIdeasToProjects = (projectIdeas: { title: string; topics: string[] }[], subject: string): ReactProject[] | NodeProject[] | MongoProject[] => {
  if (subject === 'react') {
    return reactProjects;
  }
  
  if (subject === 'nodejs') {
    return nodeProjects;
  }

  if (subject === 'mongodb') {
    return mongoProjects;
  }
  
  return projectIdeas.map((idea, idx) => ({
    id: `${subject}-${idx}`,
    title: idea.title,
    description: `Build a project: ${idea.title}`,
    concepts: idea.topics,
    features: [],
  }));
};

export const SubjectPage: React.FC = () => {
  const { subject } = useParams<{ subject: 'html' | 'css' | 'javascript' | 'react' | 'nodejs' | 'mongodb' }>();
  const { currentUser } = useAuth();
  const [videos, setVideos] = useState<Video[]>([]);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [isQuizPassed, setIsQuizPassed] = useState(false);
  const [submittingQuiz, setSubmittingQuiz] = useState(false);

  useEffect(() => {
    // Load subject data based on the subject parameter
    loadSubjectData(subject || '');
    
    // Load user progress from API if logged in
    if (currentUser) {
      loadUserProgress();
    }
  }, [subject, currentUser]);

  const loadUserProgress = async () => {
    try {
      const response = await apiService.getProgress();
      const webdevProgress = response.progress.webdev[subject as keyof typeof response.progress.webdev];
      if (webdevProgress?.quizPassed) {
        setIsQuizPassed(true);
      }
    } catch (error) {
      console.error('Failed to load user progress:', error);
    }
  };

  // Add a useEffect to update quizQuestions when currentVideo changes (for javascript, react, nodejs)
  useEffect(() => {
    if ((subject === 'javascript' || subject === 'react' || subject === 'nodejs' || subject === 'mongodb') && currentVideo) {
      const quizzes = 
        subject === 'javascript' ? javascriptData.quizzes :
        subject === 'react' ? reactData.quizzes :
        subject === 'nodejs' ? nodeData.quizzes :
        mongoData.quizzes;
      setQuizQuestions(quizzes[currentVideo.id] || []);
    }
    // For other subjects, quizQuestions are not per-video
    // eslint-disable-next-line
  }, [currentVideo, subject]);

  const loadSubjectData = (subjectName: string) => {
    console.log('Loading subject data for:', subjectName);
    let data: { videos: Video[], quiz: QuizQuestion[], quizzes?: { [videoId: string]: QuizQuestion[] } } = { videos: [], quiz: [] };
    
    console.log('Available subjects:', {
      html: !!htmlData,
      css: !!cssData,
      javascript: !!javascriptData,
      react: !!reactData,
      nodejs: !!nodeData,
      mongodb: !!mongoData
    });
    
    switch (subjectName) {
      case 'html':
        data = {
          videos: htmlData.videos,
          quiz: htmlData.quiz
        };
        break;
      case 'css':
        data = {
          videos: cssData.videos,
          quiz: cssData.quiz
        };
        break;
      case 'javascript':
        data = {
          videos: javascriptData.videos,
          quiz: javascriptData.quizzes[javascriptData.videos[0]?.id] || []
        };
        break;
      case 'react':
        data = {
          videos: reactData.videos,
          quiz: reactData.quizzes[reactData.videos[0]?.id] || []
        };
        break;
      case 'nodejs':
        console.log('Loading Node.js data:', nodeData);
        data = {
          videos: nodeData.videos,
          quiz: nodeData.quizzes[nodeData.videos[0]?.id] || []
        };
        console.log('Node.js data loaded:', data);
        break;
      case 'mongodb':
        console.log('Loading MongoDB data:', mongoData);
        data = {
          videos: mongoData.videos,
          quiz: mongoData.quizzes[mongoData.videos[0]?.id] || []
        };
        console.log('MongoDB data loaded:', data);
        break;
      default:
        // Fallback for other subjects (OS, etc.)
        data = {
          videos: [
            {
              id: '1',
              title: 'Subject Overview',
              url: 'https://youtu.be/example',
              duration: '20:00',
              watched: false
            }
          ],
          quiz: [
            {
              question: 'Sample question for this subject?',
              options: ['Option A', 'Option B', 'Option C', 'Option D'],
              correct: 0
            }
          ]
        };
    }

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

    // Send to API if user is logged in
    if (currentUser && subject) {
      apiService.markVideoWatched(subject, videoId).catch(error => {
        console.error('Failed to mark video as watched:', error);
      });
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
      handleQuizComplete();
    }
  };

  const handleQuizComplete = async () => {
    setSubmittingQuiz(true);
    
    // Calculate final score
    const finalScore = selectedAnswer === quizQuestions[currentQuestionIndex].correct ? score + 1 : score;
    const percentage = (finalScore / quizQuestions.length) * 100;
    const passed = percentage >= 70;
    
    setScore(finalScore);
    setQuizCompleted(true);
    
    if (passed) {
      setIsQuizPassed(true);
    }

    // Submit to API if user is logged in
    if (currentUser && subject) {
      try {
        // Prepare answers array
        const answers = quizQuestions.map((question, index) => ({
          questionIndex: index,
          selectedAnswer: index === currentQuestionIndex ? (selectedAnswer || 0) : 0,
          isCorrect: index === currentQuestionIndex 
            ? (selectedAnswer === question.correct)
            : (0 === question.correct) // Default for unanswered questions
        }));

        await apiService.submitQuiz({
          subject,
          score: finalScore,
          totalQuestions: quizQuestions.length,
          timeSpent: 300, // Default 5 minutes
          answers
        });
      } catch (error) {
        console.error('Failed to submit quiz:', error);
      }
    }
    
    setSubmittingQuiz(false);
  };

  const getSubjectInfo = (subject: string) => {
    switch (subject) {
      case 'html':
        return htmlData.subjectInfo;
      case 'css':
        return cssData.subjectInfo;
      case 'javascript':
        return javascriptData.subjectInfo;
      case 'react':
        return reactData.subjectInfo;
      case 'nodejs':
        return nodeData.subjectInfo;
      case 'mongodb':
        return mongoData.subjectInfo;
      default:
        // Fallback for other subjects
        const info: { [key: string]: { title: string, description: string, color: string } } = {
          'operating-system': {
            title: 'Operating Systems',
            description: 'Learn about process management, memory management, and other OS concepts',
            color: 'from-purple-500 to-indigo-600'
          },
          'dbms': {
            title: 'Database Management',
            description: 'Master database concepts, SQL, and database design',
            color: 'from-blue-500 to-cyan-500'
          },
          'networking': {
            title: 'Computer Networks',
            description: 'Understand network protocols, architectures, and security',
            color: 'from-green-500 to-emerald-500'
          },
          'oops': {
            title: 'Object-Oriented Programming',
            description: 'Master OOP concepts and design patterns',
            color: 'from-amber-500 to-orange-500'
          },
          'dsa': {
            title: 'Data Structures & Algorithms',
            description: 'Learn fundamental data structures and algorithms',
            color: 'from-red-500 to-pink-500'
          }
        };
        
        return info[subject] || {
          title: subject.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
          description: `Learn about ${subject.replace('-', ' ')}`,
          color: 'from-gray-500 to-gray-600'
        };
    }
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
                disabled={submittingQuiz}
                disabled={selectedAnswer === null}
                className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {submittingQuiz ? 'Submitting...' : currentQuestionIndex < quizQuestions.length - 1 ? 'Next Question' : 'Finish Quiz'}
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
                  ✓ Quiz completed successfully
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-cyan-500/10 blur-3xl animate-pulse delay-2000"></div>
      </div>
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 relative z-10">
          <h1 className={`text-5xl md:text-7xl font-black bg-gradient-to-r ${subjectInfo.color} bg-clip-text text-transparent mb-6 tracking-tight`}>
            {subjectInfo.title}
          </h1>
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
              className={`h-3 bg-gradient-to-r ${subjectInfo.color} rounded-full transition-all duration-500`}
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>

                     <div className="grid md:grid-cols-3 gap-6">
             <div className="text-center">
               <div className="text-3xl font-black text-green-400 mb-2">{watchedCount}</div>
               <div className="text-gray-300">Videos Watched</div>
             </div>
             <div className="text-center">
               <div className="text-3xl font-black text-purple-400 mb-2">1</div>
               <div className="text-gray-300">Total Videos</div>
             </div>
             <div className="text-center">
               <div className="text-3xl font-black text-orange-400 mb-2">1</div>
               <div className="text-gray-300">Total Quizzes</div>
             </div>
           </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Video Section */}
          <div className="lg:col-span-2">
            <div className="relative bg-white/5 backdrop-blur-md border border-white/10 p-8 z-10">
              <h2 className="text-3xl font-black text-white mb-6">Video Lesson</h2>
              {/* Video Dropdown Selector */}
              <div className="mb-6">
                <label htmlFor="video-select" className="block mb-2 font-medium text-white">Select Video:</label>
                <select
                  id="video-select"
                  value={currentVideo?.id || ''}
                  onChange={e => {
                    const selected = videos.find(v => v.id === e.target.value);
                    if (selected) setCurrentVideo(selected);
                  }}
                  className="w-full p-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                >
                  {videos.map(video => (
                    <option key={video.id} value={video.id}>
                      {video.title}
                    </option>
                  ))}
                </select>
              </div>
              
              {currentVideo && (
                <>
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-white mb-2">{currentVideo.title}</h3>
                    <div className="flex items-center text-sm text-gray-300 mb-4">
                      <Clock className="w-4 h-4 mr-1 text-cyan-400" />
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
                        className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-black hover:shadow-lg transform hover:scale-105 transition-all duration-200"
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
            <div className={`relative bg-white/5 backdrop-blur-md border border-white/10 p-8 z-10 ${!currentVideo?.watched ? 'opacity-50' : ''}`}>
              <h3 className="text-2xl font-black text-white mb-4">Quiz</h3>
              
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-2xl font-black text-white">
                    {isQuizPassed ? 'Completed' : '15 Questions'}
                  </div>
                  <div className="text-sm text-gray-300">
                    {isQuizPassed ? '100%' : 'HTML Fundamentals'}
                  </div>
                </div>
                
                <div className="w-full bg-white/20 h-2 mb-4">
                  <div 
                    className={`h-2 bg-gradient-to-r ${subjectInfo.color} rounded-full transition-all duration-500`}
                    style={{ width: isQuizPassed ? '100%' : '0%' }}
                  ></div>
                </div>
                
                <p className="text-gray-300 text-sm">
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
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white font-black hover:shadow-lg transform hover:scale-105' 
                      : currentVideo?.watched
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black hover:shadow-lg transform hover:scale-105'
                        : 'bg-white/20 text-gray-500 cursor-not-allowed'
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
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center backdrop-blur-sm">
                    <Lock className="w-8 h-8 text-gray-400" />
                  </div>
                )}
              </div>
              
                             {/* Quiz Stats */}
               <div className="mt-6 pt-6 border-t border-white/20">
                 <div className="text-center">
                   <div className="font-black text-white">15</div>
                   <div className="text-gray-300">Questions</div>
                 </div>
               </div>
            </div>
          </div>
          
                     {/* Practice Projects Section */}
           {(subject === 'html' || subject === 'css' || subject === 'javascript' || subject === 'react' || subject === 'nodejs' || subject === 'mongodb') && (
             <div className="mt-12 relative z-10">
               {subject === 'html' && (
                 <PracticeProjects
                   projects={mapProjectIdeasToProjects(htmlData.projectIdeas, 'html')}
                   subject="HTML"
                 />
               )}
               {subject === 'css' && (
                 <PracticeProjects
                   projects={mapProjectIdeasToProjects(cssData.projectIdeas, 'css')}
                   subject="CSS"
                 />
               )}
               {subject === 'javascript' && (
                 <PracticeProjects
                   projects={mapProjectIdeasToProjects(javascriptData.projectIdeas, 'javascript')}
                   subject="JavaScript"
                 />
               )}
               {subject === 'react' && (
                 <PracticeProjects
                   projects={mapProjectIdeasToProjects(reactData.projectIdeas, 'react')}
                   subject="React"
                 />
               )}
               {subject === 'nodejs' && (
                 <PracticeProjects
                   projects={nodeProjects}
                   subject="Node.js"
                 />
               )}
               {subject === 'mongodb' && (
                 <PracticeProjects
                   projects={mongoProjects}
                   subject="MongoDB"
                 />
               )}
             </div>
           )}
        </div>
      </div>
    </div>
  );
};