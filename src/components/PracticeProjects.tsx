import React, { useState } from 'react';

interface Project {
  id: string;
  title: string;
  description: string;
  skills: string[];
  features: string[];
}

const projects: Project[] = [
  {
    id: 'portfolio',
    title: '1. Personal Portfolio Website',
    description: 'Create a personal portfolio to showcase your work and skills',
    skills: ['HTML structure', 'links', 'images', 'sections'],
    features: [
      'About Me section',
      'Projects list',
      'Contact info',
      'Profile picture',
      'Links to social media'
    ]
  },
  {
    id: 'resume',
    title: '2. Simple Resume Webpage',
    description: 'Build a clean, professional resume webpage',
    skills: ['Lists', 'headings', 'sections', 'semantic HTML'],
    features: [
      'Name and profession',
      'Education and skills',
      'Experience',
      'Downloadable resume (PDF link)'
    ]
  },
  {
    id: 'landing',
    title: '3. Product Landing Page',
    description: 'Design an engaging landing page for a product',
    skills: ['Layouts', 'images', 'forms', 'anchor links'],
    features: [
      'Hero banner',
      'Product features',
      'Testimonials',
      'Newsletter signup (with form)',
      'Footer'
    ]
  },
  {
    id: 'menu',
    title: '4. Restaurant Menu Page',
    description: 'Create an appealing restaurant menu page',
    skills: ['Tables', 'divs', 'formatting text'],
    features: [
      'Restaurant name and logo',
      'Food categories (starters, mains, desserts)',
      'Prices and item descriptions',
      'Opening hours'
    ]
  },
  {
    id: 'survey',
    title: '5. Survey Form',
    description: 'Build an interactive survey form',
    skills: ['Forms', 'input types', 'labels', 'buttons'],
    features: [
      'Name, email, age fields',
      'Dropdowns and radio buttons',
      'Textarea for comments',
      'Submit button'
    ]
  },
  {
    id: 'gallery',
    title: '6. Image Gallery',
    description: 'Create a responsive image gallery',
    skills: ['<img> tags', 'layout with <div> or <figure>'],
    features: [
      'A grid of images',
      'Captions for each image',
      'Optional: Lightbox effect using only CSS'
    ]
  },
  {
    id: 'blog',
    title: '7. Basic Blog Layout',
    description: 'Design a clean blog layout',
    skills: ['Article and section tags', 'dates', 'titles'],
    features: [
      'Blog title and logo',
      'Blog posts with title, content, and author',
      'Sidebar with recent posts or tags'
    ]
  },
  {
    id: 'tribute',
    title: '8. Tribute Page',
    description: 'Create a tribute to someone you admire',
    skills: ['Text formatting', 'links', 'images'],
    features: [
      'Photo',
      'Biography',
      'Achievements',
      'External links'
    ]
  },
  {
    id: 'countdown',
    title: '9. Countdown Launch Page',
    description: 'Build an engaging coming soon page',
    skills: ['Centering content', 'countdown placeholder'],
    features: [
      '“Coming Soon” message',
      'Static countdown (use HTML and placeholder)',
      'Email signup box'
    ]
  },
  {
    id: 'todo',
    title: '10. Simple To-Do List',
    description: 'Create a basic to-do list interface',
    skills: ['Lists', 'inputs', 'structure'],
    features: [
      'Input field for tasks',
      'List of tasks (static for now)',
      'Submit button (without functionality — focus on layout)'
    ]
  }
];

export const PracticeProjects: React.FC = () => {
  const [expandedProject, setExpandedProject] = useState<string | null>(null);

  const toggleProject = (id: string) => {
    setExpandedProject(expandedProject === id ? null : id);
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">HTML Practice Projects</h2>
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
                  <h4 className="font-medium text-gray-900 mb-2">Skills Practiced:</h4>
                  <div className="flex flex-wrap gap-2">
                    {project.skills.map((skill, index) => (
                      <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Features to Include:</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {project.features.map((feature, index) => (
                      <li key={index} className="text-sm text-gray-700">{feature}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
