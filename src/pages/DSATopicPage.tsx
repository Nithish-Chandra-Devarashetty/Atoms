import React from 'react';
import { useParams } from 'react-router-dom';
import { DsaProblem, dsaProblems } from '../data/dsaProblems'; 

export const DSATopicPage: React.FC = () => {
  const { topic, difficulty } = useParams<{ topic: string; difficulty: string }>();

  // Filter problems based on topic and difficulty
  const filteredProblems = dsaProblems.filter(
    (problem: DsaProblem) =>
      problem.Topic === topic && problem.Difficulty === difficulty
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{topic} - {difficulty} Problems</h1>

      {filteredProblems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProblems.map((problem: DsaProblem, index: number) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-2">{problem.Name}</h2>
              <p className={`text-sm mb-4 ${
                problem.Difficulty === 'Easy' ? 'text-green-600' :
                problem.Difficulty === 'Medium' ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                Difficulty: {problem.Difficulty}
              </p>
              <a
                href={problem.Link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Solve Problem
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
