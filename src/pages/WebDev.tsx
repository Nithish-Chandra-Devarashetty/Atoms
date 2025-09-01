import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Palette, 
  Code, 
  Server, 
  Database, 
  Layers,
  CheckCircle,
  Clock,
  Play,
  Award
} from 'lucide-react';
import { htmlData } from '../data/webdev/htmlData';
import { cssData } from '../data/webdev/cssData';
import { javascriptData } from '../data/webdev/javascriptData';
import { reactData } from '../data/webdev/reactData';
import { nodeData } from '../data/webdev/nodeData';
import { mongoData } from '../data/webdev/mongoData';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';

export const WebDev: React.FC = () => {
  const { currentUser } = useAuth();
  const [subjects, setSubjects] = useState([
    {
      id: 'html',
      title: 'HTML',
      description: 'HyperText Markup Language - The foundation of web development',
      icon: FileText,
      color: 'from-orange-500 to-red-500',
      progress: 0,
      videosWatched: 0,
      totalVideos: htmlData.videos.length,
      quizzesPassed: 0,
      totalQuizzes: 1
    },
    {
      id: 'css',
      title: 'CSS',
      description: 'Cascading Style Sheets - Style and layout for beautiful web pages',
      icon: Palette,
      color: 'from-blue-500 to-cyan-500',
      progress: 0,
      videosWatched: 0,
      totalVideos: cssData.videos.length,
      quizzesPassed: 0,
      totalQuizzes: 1
    },
    {
      id: 'javascript',
      title: 'JavaScript',
      description: 'Dynamic programming language for interactive web experiences',
      icon: Code,
      color: 'from-yellow-500 to-orange-500',
      progress: 0,
      videosWatched: 0,
      totalVideos: javascriptData.videos.length,
      quizzesPassed: 0,
  totalQuizzes: 1
    },
    {
      id: 'react',
      title: 'React',
      description: 'Modern JavaScript library for building user interfaces',
      icon: Layers,
      color: 'from-cyan-500 to-blue-500',
      progress: 0,
      videosWatched: 0,
      totalVideos: reactData.videos.length,
      quizzesPassed: 0,
      totalQuizzes: 1
    },
    {
      id: 'nodejs',
      title: 'Node.js',
      description: 'JavaScript runtime for server-side development',
      icon: Server,
      color: 'from-green-500 to-emerald-500',
      progress: 0,
      videosWatched: 0,
      totalVideos: nodeData.videos.length,
      quizzesPassed: 0,
      totalQuizzes: 1
    },
    {
      id: 'mongodb',
      title: 'MongoDB',
      description: 'NoSQL database for modern applications',
      icon: Database,
      color: 'from-green-600 to-green-500',
      progress: 0,
      videosWatched: 0,
      totalVideos: mongoData.videos.length,
      quizzesPassed: 0,
      totalQuizzes: 1
    }
  ]);
  useEffect(() => {
    const loadProgress = async () => {
      try {
        if (!currentUser) return;
        const res = await apiService.getProgress();
        const webdev = res.progress?.webdev || {};
        const vids = res.videoProgress || [];
        const passedBy = res.passedQuizzesBySubject || {};

        const currentSubjects = [
          { id: 'html', totalVideos: htmlData.videos.length, totalQuizzes: 1 },
          { id: 'css', totalVideos: cssData.videos.length, totalQuizzes: 1 },
          { id: 'javascript', totalVideos: javascriptData.videos.length, totalQuizzes: javascriptData.videos.length },
          { id: 'react', totalVideos: reactData.videos.length, totalQuizzes: 1 },
          { id: 'nodejs', totalVideos: nodeData.videos.length, totalQuizzes: 1 },
          { id: 'mongodb', totalVideos: mongoData.videos.length, totalQuizzes: 1 }
        ];

        setSubjects(prev => prev.map(s => {
          const meta = currentSubjects.find(cs => cs.id === s.id)!;
          const watched = vids.filter((v: any) => v.subject === s.id).length;
          // For single-quiz subjects use flag; for JS use per-video passed topics
          const isMultiQuiz = s.id === 'javascript';
          const passed = isMultiQuiz
            ? (Array.isArray(passedBy[s.id]) ? passedBy[s.id].length : 0)
            : (webdev[s.id]?.quizPassed ? 1 : 0);
          const videoProgress = (watched / meta.totalVideos) * 50;
          const quizProgress = (passed / meta.totalQuizzes) * 50;
          const total = Math.round(videoProgress + quizProgress);
          return {
            ...s,
            totalVideos: meta.totalVideos,
            totalQuizzes: meta.totalQuizzes,
            videosWatched: watched,
            quizzesPassed: passed,
            progress: total
          };
        }));
      } catch (e) {
        console.error('Failed to load progress', e);
      }
    };

    loadProgress();
  }, [currentUser]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-6 sm:py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16 relative z-10">
          <h1 className="heading-font text-3xl sm:text-5xl md:text-7xl font-black text-white mb-4 sm:mb-6 tracking-tight">
            Web Development
          </h1>
          <p className="text-base sm:text-xl text-gray-300 max-w-3xl mx-auto font-light">
            Master the complete web development stack from frontend to backend
          </p>
        </div>

        {/* Certificate Notice */}
        <div className="relative bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-md border border-green-400/30 p-4 sm:p-6 mb-8 sm:mb-12 mx-auto max-w-4xl z-10">
          <div className="flex items-center justify-center text-center">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Earn Your Certificate!</h3>
              <p className="text-sm sm:text-base text-gray-200 leading-relaxed">
                Complete all 6 Web Development modules to earn your 
                <span className="font-semibold text-green-400"> official Web Development Certificate</span>. 
                Download it instantly once you finish all modules!
              </p>
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="relative bg-white/5 backdrop-blur-md border border-white/10 p-4 sm:p-8 mb-8 sm:mb-16 z-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8">Your Progress</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-black text-cyan-400 mb-1 sm:mb-2">
                {subjects.reduce((acc, s) => acc + s.videosWatched, 0)}
              </div>
              <div className="text-gray-300 text-sm sm:text-base">Videos Watched</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-black text-green-400 mb-1 sm:mb-2">
                {subjects.reduce((acc, s) => acc + s.quizzesPassed, 0)}
              </div>
              <div className="text-gray-300 text-sm sm:text-base">Quizzes Passed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-black text-purple-400 mb-1 sm:mb-2">
                {Math.round(subjects.reduce((acc, s) => acc + s.progress, 0) / subjects.length)}%
              </div>
              <div className="text-gray-300 text-sm sm:text-base">Overall Progress</div>
            </div>
          </div>
        </div>

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 relative z-10">
          {subjects.map(({ 
            id, 
            title, 
            description, 
            icon: Icon, 
            color, 
            progress, 
            videosWatched, 
            totalVideos, 
            quizzesPassed, 
            totalQuizzes 
          }) => (
            <Link
              key={id}
              to={`/webdev/${id}`}
              className="group relative bg-white/5 backdrop-blur-md border border-white/10 p-4 sm:p-8 hover:bg-white/10 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl overflow-hidden"
            >
              {/* Hover gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
              
              {/* Icon and Title */}
              <div className="flex items-center mb-4 sm:mb-6 relative z-10">
                <div className={`p-3 sm:p-4 bg-gradient-to-r ${color} mr-3 sm:mr-4 group-hover:scale-110 transition-transform duration-300 clip-path-hexagon`}>
                  <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-white">{title}</h3>
                  <div className="flex items-center mt-1">
                    {progress === 100 ? (
                      <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-1" />
                    ) : progress > 0 ? (
                      <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 mr-1" />
                    ) : (
                      <Play className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 mr-1" />
                    )}
                    <span className="text-xs sm:text-sm text-gray-400">
                      {progress === 100 ? 'Completed' : progress > 0 ? 'In Progress' : 'Not Started'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-300 mb-4 sm:mb-6 leading-relaxed relative z-10 text-sm sm:text-base">{description}</p>

              {/* Progress Bar */}
              <div className="mb-4 sm:mb-6 relative z-10">
                <div className="flex justify-between text-xs sm:text-sm text-gray-400 mb-2">
                  <span>Progress</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-white/10 h-2">
                  <div 
                    className={`h-2 bg-gradient-to-r ${color} transition-all duration-500`}
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm relative z-10">
                <div className="text-center p-2 sm:p-3 bg-white/5 backdrop-blur-sm border border-white/10">
                  <div className="font-semibold text-white">{videosWatched}/{totalVideos}</div>
                  <div className="text-gray-400">Videos</div>
                </div>
                <div className="text-center p-2 sm:p-3 bg-white/5 backdrop-blur-sm border border-white/10">
                  <div className="font-semibold text-white">{quizzesPassed}/{totalQuizzes}</div>
                  <div className="text-gray-400">Quizzes</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};