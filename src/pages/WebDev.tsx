import React from 'react';
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

export const WebDev: React.FC = () => {
  const subjects = [
    {
      id: 'html',
      title: 'HTML',
      description: 'HyperText Markup Language - The foundation of web development',
      icon: FileText,
      color: 'from-orange-500 to-red-500',
      progress: 85,
      videosWatched: 12,
      totalVideos: 15,
      quizzesPassed: 8,
      totalQuizzes: 10
    },
    {
      id: 'css',
      title: 'CSS',
      description: 'Cascading Style Sheets - Style and layout for beautiful web pages',
      icon: Palette,
      color: 'from-blue-500 to-cyan-500',
      progress: 60,
      videosWatched: 8,
      totalVideos: 12,
      quizzesPassed: 5,
      totalQuizzes: 8
    },
    {
      id: 'javascript',
      title: 'JavaScript',
      description: 'Dynamic programming language for interactive web experiences',
      icon: Code,
      color: 'from-yellow-500 to-orange-500',
      progress: 40,
      videosWatched: 6,
      totalVideos: 18,
      quizzesPassed: 3,
      totalQuizzes: 12
    },
    {
      id: 'react',
      title: 'React',
      description: 'Modern JavaScript library for building user interfaces',
      icon: Layers,
      color: 'from-cyan-500 to-blue-500',
      progress: 25,
      videosWatched: 3,
      totalVideos: 16,
      quizzesPassed: 1,
      totalQuizzes: 10
    },
    {
      id: 'nodejs',
      title: 'Node.js',
      description: 'JavaScript runtime for server-side development',
      icon: Server,
      color: 'from-green-500 to-emerald-500',
      progress: 10,
      videosWatched: 1,
      totalVideos: 14,
      quizzesPassed: 0,
      totalQuizzes: 8
    },
    {
      id: 'mongodb',
      title: 'MongoDB',
      description: 'NoSQL database for modern applications',
      icon: Database,
      color: 'from-green-600 to-green-500',
      progress: 0,
      videosWatched: 0,
      totalVideos: 10,
      quizzesPassed: 0,
      totalQuizzes: 6
    }
  ];

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Web Development
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Master the complete web development stack from frontend to backend
          </p>
        </div>

        {/* Progress Overview */}
        <div className="bg-white rounded-2xl p-8 mb-12 shadow-lg border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Progress</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {subjects.reduce((acc, s) => acc + s.videosWatched, 0)}
              </div>
              <div className="text-gray-600">Videos Watched</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {subjects.reduce((acc, s) => acc + s.quizzesPassed, 0)}
              </div>
              <div className="text-gray-600">Quizzes Passed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {Math.round(subjects.reduce((acc, s) => acc + s.progress, 0) / subjects.length)}%
              </div>
              <div className="text-gray-600">Overall Progress</div>
            </div>
          </div>
        </div>

        {/* Subjects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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
              className="group bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              {/* Icon and Title */}
              <div className="flex items-center mb-6">
                <div className={`p-4 bg-gradient-to-r ${color} rounded-xl mr-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                  <div className="flex items-center mt-1">
                    {progress === 100 ? (
                      <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                    ) : progress > 0 ? (
                      <Clock className="w-4 h-4 text-yellow-500 mr-1" />
                    ) : (
                      <Play className="w-4 h-4 text-gray-400 mr-1" />
                    )}
                    <span className="text-sm text-gray-500">
                      {progress === 100 ? 'Completed' : progress > 0 ? 'In Progress' : 'Not Started'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 mb-6 leading-relaxed">{description}</p>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Progress</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 bg-gradient-to-r ${color} rounded-full transition-all duration-500`}
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="font-semibold text-gray-900">{videosWatched}/{totalVideos}</div>
                  <div className="text-gray-600">Videos</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="font-semibold text-gray-900">{quizzesPassed}/{totalQuizzes}</div>
                  <div className="text-gray-600">Quizzes</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};