import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Code, Lightbulb, CheckCircle, Rocket } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  concepts: string[];
  features: string[];
}

interface PracticeProjectsProps {
  projects: Project[];
  subject: string;
}

export const PracticeProjects: React.FC<PracticeProjectsProps> = ({ projects, subject }) => {
  const [expandedProject, setExpandedProject] = useState<string | null>(null);

  const toggleProject = (id: string) => {
    setExpandedProject(expandedProject === id ? null : id);
  };

  const getSubjectColor = (subject: string) => {
    const colorMap: { [key: string]: string } = {
      'HTML': 'from-orange-500 to-red-500',
      'CSS': 'from-blue-500 to-cyan-500',
      'JavaScript': 'from-yellow-500 to-orange-500',
      'React': 'from-cyan-500 to-blue-500',
      'Node.js': 'from-green-500 to-emerald-500',
      'MongoDB': 'from-green-600 to-green-500'
    };
    return colorMap[subject] || 'from-gray-500 to-gray-600';
  };

  return (
    <div className="mt-16 relative z-10">
      <div className="relative bg-white/5 backdrop-blur-md border border-white/10 p-8">
        <div className="flex items-center mb-8">
          <div className={`p-3 bg-gradient-to-r ${getSubjectColor(subject)} mr-4 clip-path-hexagon`}>
            <Code className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-3xl font-black text-white">
            {subject} Practice Projects
          </h2>
        </div>
        
        <p className="text-gray-300 mb-8 leading-relaxed">
          Apply your {subject} knowledge with these hands-on projects designed to reinforce key concepts and build real-world skills.
        </p>

        {/* Horizontal Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {projects.map((project) => (
            <div 
              key={project.id} 
              className="relative bg-white/5 backdrop-blur-md border border-white/10 overflow-hidden hover:bg-white/10 transition-all duration-300 group"
            >
              {/* Hover gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${getSubjectColor(subject)} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
              
              {/* Project Header */}
              <div className="p-6 relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-black text-white mb-2 leading-tight">{project.title}</h3>
                    <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">{project.description}</p>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="flex items-center justify-between mb-4 text-sm">
                  <div className="flex items-center text-gray-400">
                    <Lightbulb className="w-4 h-4 mr-1 text-yellow-400" />
                    <span>{project.concepts.length} concepts</span>
                  </div>
                  {project.features && project.features.length > 0 && (
                    <div className="flex items-center text-gray-400">
                      <CheckCircle className="w-4 h-4 mr-1 text-green-400" />
                      <span>{project.features.length} features</span>
                    </div>
                  )}
                </div>

                {/* Dropdown Toggle Button */}
                <button
                  onClick={() => toggleProject(project.id)}
                  className="w-full flex items-center justify-between p-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-200"
                >
                  <span className="font-semibold">View Details</span>
                  {expandedProject === project.id ? (
                    <ChevronDown className="w-5 h-5 text-cyan-400" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              </div>

              {/* Expanded Content */}
              {expandedProject === project.id && (
                <div className="px-6 pb-6 relative z-10 border-t border-white/10">
                  <div className="pt-6 space-y-6">
                    {/* Concepts Section */}
                    <div>
                      <div className="flex items-center mb-3">
                        <Lightbulb className="w-4 h-4 text-yellow-400 mr-2" />
                        <h4 className="text-sm font-black text-white">Key Concepts</h4>
                      </div>
                      <div className="space-y-2">
                        {project.concepts.slice(0, 6).map((concept, index) => (
                          <div key={index} className="flex items-start">
                            <div className={`w-1.5 h-1.5 bg-gradient-to-r ${getSubjectColor(subject)} mt-2 mr-2 flex-shrink-0`}></div>
                            <span className="text-gray-300 text-xs leading-relaxed">{concept}</span>
                          </div>
                        ))}
                        {project.concepts.length > 6 && (
                          <div className="text-xs text-gray-500">
                            +{project.concepts.length - 6} more concepts
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Features Section */}
                    {project.features && project.features.length > 0 && (
                      <div>
                        <div className="flex items-center mb-3">
                          <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                          <h4 className="text-sm font-black text-white">Features to Build</h4>
                        </div>
                        <div className="space-y-2">
                          {project.features.slice(0, 4).map((feature, index) => (
                            <div key={index} className="flex items-start">
                              <CheckCircle className="w-3 h-3 text-green-400 mt-1 mr-2 flex-shrink-0" />
                              <span className="text-gray-300 text-xs leading-relaxed">{feature}</span>
                            </div>
                          ))}
                          {project.features.length > 4 && (
                            <div className="text-xs text-gray-500">
                              +{project.features.length - 4} more features
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Action Button */}
                    <button className={`w-full flex items-center justify-center py-3 bg-gradient-to-r ${getSubjectColor(subject)} text-white font-black hover:shadow-lg transform hover:scale-105 transition-all duration-200`}>
                      <Rocket className="w-4 h-4 mr-2" />
                      Start Building
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-12">
            <Code className="w-16 h-16 text-gray-500 mx-auto mb-4 opacity-50" />
            <p className="text-gray-400 text-lg">Practice projects coming soon for {subject}!</p>
          </div>
        )}
      </div>
    </div>
  );
};