import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import BadgeDisplay from './BadgeDisplay';
import { Award, Code, Brain, Calculator, BookOpen } from 'lucide-react';

const BadgeSystemInfo: React.FC = () => {
  const [badgeMetadata, setBadgeMetadata] = useState<any>(null);
  const [categories, setCategories] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBadgeData();
  }, []);

  const loadBadgeData = async () => {
    try {
      const response = await apiService.getBadgeMetadata();
      setBadgeMetadata(response.badges);
      setCategories(response.categories);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load badge data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8 rounded-lg">
        <div className="animate-pulse">
          <div className="h-8 bg-white/20 rounded w-64 mb-4"></div>
          <div className="h-4 bg-white/10 rounded w-96 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-white/10 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const categoryIcons = {
    webdev: <Code className="w-6 h-6" />,
    core: <BookOpen className="w-6 h-6" />,
    dsa: <Brain className="w-6 h-6" />,
    aptitude: <Calculator className="w-6 h-6" />,
    achievement: <Award className="w-6 h-6" />
  };

  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 text-white">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold mb-4 flex items-center justify-center">
          <Award className="w-10 h-10 mr-3 text-yellow-400" />
          Badge System
        </h2>
        <p className="text-xl text-gray-200 max-w-3xl mx-auto">
          Earn badges by completing modules, solving problems, and achieving milestones. 
          Show off your learning journey with beautiful achievement badges!
        </p>
      </div>

      {categories && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {Object.entries(categories).map(([categoryId, category]: [string, any]) => {
            const categoryBadges = Object.entries(badgeMetadata || {})
              .filter(([_, badge]: [string, any]) => badge.category === categoryId)
              .slice(0, 3); // Show first 3 badges as examples

            return (
              <div key={categoryId} className="bg-white/10 backdrop-blur-md p-6 border border-white/20">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-white/10 mr-3">
                    {categoryIcons[categoryId as keyof typeof categoryIcons]}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{category.name}</h3>
                    <p className="text-sm text-gray-300">{category.description}</p>
                  </div>
                </div>

                <div className="flex space-x-3 justify-center mb-4">
                  {categoryBadges.map(([badgeId]: [string, any]) => (
                    <BadgeDisplay
                      key={badgeId}
                      badgeId={badgeId}
                      metadata={badgeMetadata}
                      size="small"
                      showName={false}
                    />
                  ))}
                </div>

                <div className="text-center text-sm text-gray-300">
                  {getCategoryDescription(categoryId)}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="bg-white/5 p-6 border border-white/10">
        <h3 className="text-2xl font-bold mb-4 text-center">How to Earn Badges</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="w-8 h-8 bg-blue-500 flex items-center justify-center text-white font-bold mr-3 mt-1">1</div>
              <div>
                <h4 className="font-semibold">Complete WebDev Modules</h4>
                <p className="text-sm text-gray-300">Watch all videos and pass quizzes in each module (HTML, CSS, JavaScript, React, Node.js, MongoDB)</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-8 h-8 bg-red-500 flex items-center justify-center text-white font-bold mr-3 mt-1">2</div>
              <div>
                <h4 className="font-semibold">Master Core CS Subjects</h4>
                <p className="text-sm text-gray-300">Complete topics and quizzes in Operating Systems, DBMS, and Computer Networks</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start">
              <div className="w-8 h-8 bg-purple-500 flex items-center justify-center text-white font-bold mr-3 mt-1">3</div>
              <div>
                <h4 className="font-semibold">Solve DSA Problems</h4>
                <p className="text-sm text-gray-300">Progress through DSA challenges: Beginner (10+), Intermediate (50+), Advanced (100+), Grandmaster (All problems!)</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-8 h-8 bg-green-500 flex items-center justify-center text-white font-bold mr-3 mt-1">4</div>
              <div>
                <h4 className="font-semibold">Complete Aptitude Topics</h4>
                <p className="text-sm text-gray-300">Master ALL quantitative aptitude topics to earn the prestigious Aptitude Genius badge</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const getCategoryDescription = (categoryId: string): string => {
  switch (categoryId) {
    case 'webdev':
      return 'Earn a badge for each completed module, plus the champion badge for completing all 6!';
    case 'core':
      return 'Master entire subjects to earn subject badges, then become a Core CS Master!';
    case 'dsa':
      return 'Progress badges based on problems solved, culminating in the ultimate Grandmaster badge!';
    case 'aptitude':
      return 'Complete ALL aptitude topics to earn the most prestigious Genius badge!';
    case 'achievement':
      return 'Special badges for streaks, perfect scores, and community participation!';
    default:
      return '';
  }
};

export default BadgeSystemInfo;
