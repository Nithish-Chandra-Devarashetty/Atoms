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
  Play
} from 'lucide-react';
import { htmlData } from '../data/webdev/htmlData';
import { cssData } from '../data/webdev/cssData';
import { javascriptData } from '../data/webdev/javascriptData';
import { reactData } from '../data/webdev/reactData';
import { nodeData } from '../data/webdev/nodeData';
import { mongoData } from '../data/webdev/mongoData';

export const WebDev: React.FC = () => {
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
      totalQuizzes: javascriptData.videos.length // 11 quizzes for 11 videos
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

  const calculateProgress = () => {
    console.log('Calculating progress...');
    
    // Get fresh subjects data
    const currentSubjects = [
      {
        id: 'html',
        totalVideos: htmlData.videos.length,
        totalQuizzes: 1
      },
      {
        id: 'css',
        totalVideos: cssData.videos.length,
        totalQuizzes: 1
      },
      {
        id: 'javascript',
        totalVideos: javascriptData.videos.length,
        totalQuizzes: javascriptData.videos.length // 11 quizzes for 11 videos
      },
      {
        id: 'react',
        totalVideos: reactData.videos.length,
        totalQuizzes: 1
      },
      {
        id: 'nodejs',
        totalVideos: nodeData.videos.length,
        totalQuizzes: 1
      },
      {
        id: 'mongodb',
        totalVideos: mongoData.videos.length,
        totalQuizzes: 1
      }
    ];
    
    // Update subjects with actual progress from localStorage
    setSubjects(prevSubjects => prevSubjects.map(subject => {
      const currentSubject = currentSubjects.find(s => s.id === subject.id);
      if (!currentSubject) return subject;
      
      let videosWatched = 0;
      let quizzesPassed = 0;

      console.log(`Checking progress for ${subject.id}:`);

      if (subject.id === 'javascript') {
        // JavaScript has 11 videos and 11 quizzes
        for (let i = 1; i <= currentSubject.totalVideos; i++) {
          const videoKey = `video_${subject.id}_${i}_watched`;
          const quizKey = `quiz_${subject.id}_${i}_passed`;
          
          if (localStorage.getItem(videoKey) === 'true') {
            videosWatched++;
            console.log(`  Video ${i} watched`);
          }
          if (localStorage.getItem(quizKey) === 'true') {
            quizzesPassed++;
            console.log(`  Quiz ${i} passed`);
          }
        }
      } else {
        // Other subjects have 1 video and 1 quiz each
        const videoKey = `video_${subject.id}_1_watched`;
        const quizKey = `quiz_${subject.id}_passed`;
        
        console.log(`  Checking ${videoKey}: ${localStorage.getItem(videoKey)}`);
        console.log(`  Checking ${quizKey}: ${localStorage.getItem(quizKey)}`);
        
        if (localStorage.getItem(videoKey) === 'true') {
          videosWatched = 1;
          console.log(`  ${subject.id} video watched`);
        }
        if (localStorage.getItem(quizKey) === 'true') {
          quizzesPassed = 1;
          console.log(`  ${subject.id} quiz passed`);
        }
      }

      // Calculate progress based on both videos and quizzes (50% each)
      const videoProgress = (videosWatched / currentSubject.totalVideos) * 50;
      const quizProgress = (quizzesPassed / currentSubject.totalQuizzes) * 50;
      const totalProgress = Math.round(videoProgress + quizProgress);

      console.log(`  ${subject.id} progress: ${totalProgress}% (videos: ${videosWatched}/${currentSubject.totalVideos}, quizzes: ${quizzesPassed}/${currentSubject.totalQuizzes})`);

      return {
        ...subject,
        progress: totalProgress,
        videosWatched,
        quizzesPassed
      };
    }));
  };

  useEffect(() => {
    // Calculate progress on component mount
    calculateProgress();

    // Add focus listener to recalculate when window gains focus
    const handleFocus = () => {
      console.log('Window gained focus, recalculating progress...');
      calculateProgress();
    };

    // Add visibility change listener
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('Page became visible, recalculating progress...');
        calculateProgress();
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []); // Empty dependency array, but calculateProgress uses current state

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 relative z-10">
          <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-6 tracking-tight">
            Web Development
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto font-light">
            Master the complete web development stack from frontend to backend
          </p>
        </div>

        {/* Progress Overview */}
        <div className="relative bg-white/5 backdrop-blur-md border border-white/10 p-8 mb-16 z-10">
          <h2 className="text-3xl font-bold text-white mb-8">Your Progress</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl font-black text-cyan-400 mb-2">
                {subjects.reduce((acc, s) => acc + s.videosWatched, 0)}
              </div>
              <div className="text-gray-300">Videos Watched</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-green-400 mb-2">
                {subjects.reduce((acc, s) => acc + s.quizzesPassed, 0)}
              </div>
              <div className="text-gray-300">Quizzes Passed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-purple-400 mb-2">
                {Math.round(subjects.reduce((acc, s) => acc + s.progress, 0) / subjects.length)}%
              </div>
              <div className="text-gray-300">Overall Progress</div>
            </div>
          </div>
        </div>

        {/* Subjects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
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
              className="group relative bg-white/5 backdrop-blur-md border border-white/10 p-8 hover:bg-white/10 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl overflow-hidden"
            >
              {/* Hover gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
              
              {/* Icon and Title */}
              <div className="flex items-center mb-6 relative z-10">
                <div className={`p-4 bg-gradient-to-r ${color} mr-4 group-hover:scale-110 transition-transform duration-300 clip-path-hexagon`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{title}</h3>
                  <div className="flex items-center mt-1">
                    {progress === 100 ? (
                      <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                    ) : progress > 0 ? (
                      <Clock className="w-4 h-4 text-yellow-500 mr-1" />
                    ) : (
                      <Play className="w-4 h-4 text-gray-400 mr-1" />
                    )}
                    <span className="text-sm text-gray-400">
                      {progress === 100 ? 'Completed' : progress > 0 ? 'In Progress' : 'Not Started'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-300 mb-6 leading-relaxed relative z-10">{description}</p>

              {/* Progress Bar */}
              <div className="mb-6 relative z-10">
                <div className="flex justify-between text-sm text-gray-400 mb-2">
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
              <div className="grid grid-cols-2 gap-4 text-sm relative z-10">
                <div className="text-center p-3 bg-white/5 backdrop-blur-sm border border-white/10">
                  <div className="font-semibold text-white">{videosWatched}/{totalVideos}</div>
                  <div className="text-gray-400">Videos</div>
                </div>
                <div className="text-center p-3 bg-white/5 backdrop-blur-sm border border-white/10">
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