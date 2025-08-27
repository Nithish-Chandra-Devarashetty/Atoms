import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Monitor, 
  Database, 
  Network,
  CheckCircle,
  Clock,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { osTopics } from '../data/osTopics';
import { dbmsTopics } from '../data/dbmsTopics';
import { cnTopics } from '../data/cnTopics';
import { useAuth } from '../contexts/AuthContext';

export const CoreCS: React.FC = () => {
  const { currentUser } = useAuth();
  const core = currentUser?.progress?.core;

  const osCompleted = core?.os?.topicsCompleted?.length || 0;
  const dbmsCompleted = core?.dbms?.topicsCompleted?.length || 0;
  const cnCompleted = core?.cn?.topicsCompleted?.length || 0;

  const osProgress = {
    completed: osCompleted,
    total: osTopics.length,
    percentage: Math.round((osCompleted / osTopics.length) * 100)
  };
  const dbmsProgress = {
    completed: dbmsCompleted,
    total: dbmsTopics.length,
    percentage: Math.round((dbmsCompleted / dbmsTopics.length) * 100)
  };
  const cnProgress = {
    completed: cnCompleted,
    total: cnTopics.length,
    percentage: Math.round((cnCompleted / cnTopics.length) * 100)
  };

  const subjects = [
    {
      id: 'os',
      title: 'Operating Systems',
      description: 'Process management, memory management, file systems, and system calls',
      icon: Monitor,
      color: 'from-cyan-400 to-blue-500',
      progress: osProgress.percentage,
      topicsCompleted: osProgress.completed,
      totalTopics: osProgress.total,
      topics: ['Process Management', 'Memory Management', 'File Systems', 'Deadlocks', 'Scheduling', 'Synchronization', 'Virtual Memory', 'I/O Systems', 'Security', 'Distributed Systems']
    },
    {
      id: 'dbms',
      title: 'Database Management Systems',
      description: 'Relational databases, SQL, normalization, transactions, and indexing',
      icon: Database,
      color: 'from-emerald-400 to-green-500',
      progress: dbmsProgress.percentage,
      topicsCompleted: dbmsProgress.completed,
      totalTopics: dbmsProgress.total,
      topics: ['SQL Queries', 'Normalization', 'Transactions', 'Indexing', 'ER Diagrams', 'Relational Algebra', 'Concurrency Control', 'Recovery', 'Distributed Databases']
    },
    {
      id: 'cn',
      title: 'Computer Networks',
      description: 'Network protocols, OSI model, TCP/IP, routing, and network security',
      icon: Network,
      color: 'from-purple-400 to-pink-500',
      progress: cnProgress.percentage,
      topicsCompleted: cnProgress.completed,
      totalTopics: cnProgress.total,
      topics: ['OSI Model', 'TCP/IP', 'Routing', 'Network Security', 'HTTP/HTTPS', 'DNS', 'DHCP', 'Switching', 'Error Control', 'Flow Control']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/10 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-pink-500/10 blur-3xl animate-pulse delay-2000"></div>
      </div>
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 relative z-10">
          <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-6 tracking-tight">
            Core Computer Science
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto font-light">
            Master the fundamental concepts that every computer science professional should know
          </p>
        </div>

        {/* Progress Overview */}
        <div className="relative bg-white/5 backdrop-blur-md border border-white/10 p-8 mb-16 z-10">
          <h2 className="text-3xl font-black text-white mb-8">Your Progress</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl font-black text-cyan-400 mb-2">
                {subjects.reduce((acc, s) => acc + s.topicsCompleted, 0)}
              </div>
              <div className="text-gray-300">Topics Completed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-green-400 mb-2">
                {subjects.reduce((acc, s) => acc + s.totalTopics, 0)}
              </div>
              <div className="text-gray-300">Total Topics</div>
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
        <div className="grid lg:grid-cols-3 gap-8 relative z-10">
          {subjects.map(({ 
            id, 
            title, 
            description, 
            icon: Icon, 
            color, 
            progress, 
            topicsCompleted, 
            totalTopics,
            topics 
          }) => (
            <Link
              key={id}
              to={`/core/${id}`}
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
                  <h3 className="text-xl font-black text-white">{title}</h3>
                  <div className="flex items-center mt-1">
                    {progress === 100 ? (
                      <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                    ) : progress > 0 ? (
                      <Clock className="w-4 h-4 text-yellow-500 mr-1" />
                    ) : (
                      <BookOpen className="w-4 h-4 text-gray-400 mr-1" />
                    )}
                    <span className="text-sm text-gray-400">
                      {progress === 100 ? 'Completed' : progress > 0 ? 'In Progress' : 'Not Started'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-300 mb-6 leading-relaxed relative z-10">{description}</p>

              {/* Topics */}
              <div className="mb-6 relative z-10">
                <h4 className="text-sm font-semibold text-white mb-3 flex items-center">
                  <BookOpen className="w-4 h-4 mr-1" />
                  Key Topics
                </h4>
                <div className="flex flex-wrap gap-2">
                  {topics.map((topic) => (
                    <span 
                      key={topic}
                      className="px-3 py-1 bg-white/10 backdrop-blur-sm border border-white/20 text-gray-300 text-xs"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4 relative z-10">
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
                  <div className="font-semibold text-white">{topicsCompleted}/{totalTopics}</div>
                  <div className="text-gray-400">Topics</div>
                </div>
                <div className="text-center p-3 bg-white/5 backdrop-blur-sm border border-white/10">
                  <div className="font-semibold text-white">{topicsCompleted}</div>
                  <div className="text-gray-400">Completed</div>
                </div>
              </div>
              
              {/* Arrow indicator */}
              <div className="relative mt-4 flex items-center text-cyan-400 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-0 group-hover:translate-x-2 z-10">
                <span className="text-sm font-semibold">Explore</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};