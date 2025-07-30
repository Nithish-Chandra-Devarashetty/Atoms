import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { DsaProblem, dsaProblems } from '../data/dsaProblems';

interface SolvedProblems {
  [key: string]: boolean;
}

export const DSATopicPage: React.FC = () => {
  const { topic, difficulty } = useParams<{ topic: string; difficulty: string }>();
  const [solvedProblems, setSolvedProblems] = useState<SolvedProblems>({});

  // Load solved problems from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem('solvedProblems');
    if (saved) {
      setSolvedProblems(JSON.parse(saved));
    }
  }, []);

  // Filter problems based on topic and difficulty
  const filteredProblems = dsaProblems.filter((problem: DsaProblem) => {
    const matchesTopic = problem.Topic === topic;
    const matchesDifficulty = difficulty === 'all' || problem.Difficulty === difficulty;
    return matchesTopic && matchesDifficulty;
  });

  // Toggle problem solved status
  const toggleSolved = (problemName: string) => {
    const newSolvedProblems = {
      ...solvedProblems,
      [problemName]: !solvedProblems[problemName]
    };
    setSolvedProblems(newSolvedProblems);
    localStorage.setItem('solvedProblems', JSON.stringify(newSolvedProblems));
  };

  // Sort problems by difficulty: Easy -> Medium -> Hard
  const sortedProblems = [...filteredProblems].sort((a, b) => {
    const difficultyOrder = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
    return difficultyOrder[a.Difficulty] - difficultyOrder[b.Difficulty];
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">
        {topic} {difficulty === 'all' ? 'All Problems' : `${difficulty} Problems`}
      </h1>

      {sortedProblems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedProblems.map((problem: DsaProblem, index: number) => (
            <div 
              key={index} 
              className={`bg-white rounded-lg shadow-md p-6 relative ${
                solvedProblems[problem.Name] ? 'ring-2 ring-green-500' : ''
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold mb-2">{problem.Name}</h2>
                  <p className={`text-sm mb-4 ${
                    problem.Difficulty === 'Easy' ? 'text-green-600' :
                    problem.Difficulty === 'Medium' ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    Difficulty: {problem.Difficulty}
                  </p>
                </div>
                <button
                  onClick={() => toggleSolved(problem.Name)}
                  className={`p-2 rounded-full ${
                    solvedProblems[problem.Name] 
                      ? 'text-green-500 hover:text-green-700' 
                      : 'text-gray-300 hover:text-gray-500'
                  }`}
                  aria-label={solvedProblems[problem.Name] ? 'Mark as unsolved' : 'Mark as solved'}
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-6 w-6" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M5 13l4 4L19 7" 
                    />
                  </svg>
                </button>
              </div>
              <a
                href={problem.Link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline inline-flex items-center"
              >
                Solve Problem
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-4 w-4 ml-1" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                  <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                </svg>
              </a>
            </div>
          ))}
        </div>
      ) : (
        <p>No problems found for this topic and difficulty.</p>
      )}
    </div>
  );
};
