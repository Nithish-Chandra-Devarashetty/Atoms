import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Code, Lightbulb, CheckCircle } from 'lucide-react';

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

        <div className="space-y-6">
          {projects.map((project) => (
            <div 
              key={project.id} 
              className="relative bg-white/5 backdrop-blur-md border border-white/10 overflow-hidden hover:bg-white/10 transition-all duration-300"
            >
              {/* Hover gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${getSubjectColor(subject)} opacity-0 hover:opacity-5 transition-opacity duration-500`}></div>
              
              <button
                className="w-full px-6 py-6 text-left hover:bg-white/5 focus:outline-none transition-all duration-300 relative z-10"
                onClick={() => toggleProject(project.id)}
                aria-expanded={expandedProject === project.id}
                aria-controls={`project-${project.id}-content`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex items-center justify-center w-10 h-10 bg-white/10 backdrop-blur-sm border border-white/20 mr-4">
                      {expandedProject === project.id ? (
                        <ChevronDown className="w-5 h-5 text-cyan-400" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-white mb-1">{project.title}</h3>
                      <p className="text-gray-300 text-sm">{project.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-400">
                      {project.concepts.length} concepts
                    </span>
                    <div className={`w-2 h-2 bg-gradient-to-r ${getSubjectColor(subject)}`}></div>
                  </div>
                </div>
              </button>
              
              <div 
                id={`project-${project.id}-content`}
                className={`px-6 pb-6 transition-all duration-300 relative z-10 ${
                  expandedProject === project.id ? 'block' : 'hidden'
                }`}
              >
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Concepts Section */}
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6">
                    <div className="flex items-center mb-4">
                      <Lightbulb className="w-5 h-5 text-yellow-400 mr-2" />
                      <h4 className="text-lg font-black text-white">Concepts Practiced</h4>
                    </div>
                    <div className="space-y-3">
                      {project.concepts.map((concept, index) => (
                        <div key={index} className="flex items-start">
                          <div className={`w-2 h-2 bg-gradient-to-r ${getSubjectColor(subject)} mt-2 mr-3 flex-shrink-0`}></div>
                          <span className="text-gray-300 text-sm leading-relaxed">{concept}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Features Section */}
                  {project.features && project.features.length > 0 && (
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6">
                      <div className="flex items-center mb-4">
                        <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                        <h4 className="text-lg font-black text-white">Features to Include</h4>
                      </div>
                      <div className="space-y-3">
                        {project.features.map((feature, index) => (
                          <div key={index} className="flex items-start">
                            <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 mr-3 flex-shrink-0" />
                            <span className="text-gray-300 text-sm leading-relaxed">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Button */}
                <div className="mt-6 text-center">
                  <button className={`px-8 py-3 bg-gradient-to-r ${getSubjectColor(subject)} text-white font-black hover:shadow-lg transform hover:scale-105 transition-all duration-200`}>
                    Start Building
                  </button>
                </div>
              </div>
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