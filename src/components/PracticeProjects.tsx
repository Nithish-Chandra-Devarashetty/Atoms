import React, { useState } from 'react';

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

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {subject} Practice Projects
      </h2>
      <div className="space-y-6">
        {projects.map((project) => (
          <div 
            key={project.id} 
            className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            <button
              className="w-full px-6 py-5 text-left hover:bg-gray-50 focus:outline-none"
              onClick={() => toggleProject(project.id)}
              aria-expanded={expandedProject === project.id}
              aria-controls={`project-${project.id}-content`}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">{project.title}</h3>
                <svg
                  className={`h-6 w-6 text-gray-500 transform transition-transform duration-200 ${
                    expandedProject === project.id ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              <p className="mt-2 text-gray-700">{project.description}</p>
            </button>
            
            <div 
              id={`project-${project.id}-content`}
              className={`px-6 pb-6 pt-2 bg-gray-50 transition-all duration-200 ${
                expandedProject === project.id ? 'block' : 'hidden'
              }`}
            >
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-200">
                  Concepts Practiced:
                </h4>
                <ul className="space-y-2">
                  {project.concepts.map((concept, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <span className="text-gray-800">{concept}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-200">
                  Features to Include:
                </h4>
                <ul className="space-y-2">
                  {project.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span className="text-gray-800">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
