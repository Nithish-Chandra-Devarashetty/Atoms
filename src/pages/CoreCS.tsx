import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Monitor, 
  Database, 
  Network,
  CheckCircle,
  Clock,
  Play,
  BookOpen
} from 'lucide-react';

export const CoreCS: React.FC = () => {
  const subjects = [
    {
      id: 'os',
      title: 'Operating Systems',
      description: 'Process management, memory management, file systems, and system calls',
      icon: Monitor,
      color: 'from-blue-500 to-cyan-500',
      progress: 70,
      videosWatched: 8,
      totalVideos: 12,
      quizzesPassed: 6,
      totalQuizzes: 8,
      topics: ['Process Management', 'Memory Management', 'File Systems', 'Deadlocks']
    },
    {
      id: 'dbms',
      title: 'Database Management Systems',
      description: 'Relational databases, SQL, normalization, transactions, and indexing',
      icon: Database,
      color: 'from-green-500 to-emerald-500',
      progress: 45,
      videosWatched: 5,
      totalVideos: 10,
      quizzesPassed: 3,
      totalQuizzes: 7,
      topics: ['SQL Queries', 'Normalization', 'Transactions', 'Indexing']
    },
    {
      id: 'cn',
      title: 'Computer Networks',
      description: 'Network protocols, OSI model, TCP/IP, routing, and network security',
      icon: Network,
      color: 'from-purple-500 to-pink-500',
      progress: 30,
      videosWatched: 3,
      totalVideos: 11,
      quizzesPassed: 2,
      totalQuizzes: 6,
      topics: ['OSI Model', 'TCP/IP', 'Routing', 'Network Security']
    }
  ];

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Core Computer Science
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Master the fundamental concepts that every computer science professional should know
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
        <div className="grid lg:grid-cols-3 gap-8">
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
            totalQuizzes,
            topics 
          }) => (
            <Link
              key={id}
              to={`/core/${id}`}
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

              {/* Topics */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                  <BookOpen className="w-4 h-4 mr-1" />
                  Key Topics
                </h4>
                <div className="flex flex-wrap gap-2">
                  {topics.map((topic) => (
                    <span 
                      key={topic}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

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