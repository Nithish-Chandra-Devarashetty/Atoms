import React, { useState } from 'react';

interface Project {
  id: string;
  title: string;
  description: string;
  skills: string[];
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
      <div className="space-y-4">
        {projects.map((project) => (
          <div key={project.id} className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              className="w-full px-6 py-4 text-left hover:bg-gray-50 focus:outline-none"
              onClick={() => toggleProject(project.id)}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">{project.title}</h3>
                <svg
                  className={`h-5 w-5 text-gray-500 transform transition-transform ${
                    expandedProject === project.id ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              <p className="mt-1 text-sm text-gray-600">{project.description}</p>
            </button>
            {expandedProject === project.id && (
              <div className="px-6 pb-4 pt-2 bg-gray-50">
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Concepts Practiced:</h4>
                  <div className="flex flex-wrap gap-2">
                    {project.skills.map((skill, index) => (
                      <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                {project.features.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Features to Include:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {project.features.map((feature, index) => (
                        <li key={index} className="text-sm text-gray-700">{feature}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
