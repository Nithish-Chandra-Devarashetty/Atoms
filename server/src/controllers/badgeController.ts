import { Request, Response } from 'express';
import { BADGE_METADATA } from '../utils/points.js';

export const getBadgeMetadata = async (req: Request, res: Response): Promise<void> => {
  try {
    res.json({
      badges: BADGE_METADATA,
      categories: {
        webdev: {
          name: 'Web Development',
          description: 'Master modern web technologies',
          icon: '💻',
          color: 'blue'
        },
        core: {
          name: 'Core Computer Science',
          description: 'Fundamental CS concepts',
          icon: '🎓',
          color: 'red'
        },
        dsa: {
          name: 'Data Structures & Algorithms',
          description: 'Problem-solving mastery',
          icon: '🧮',
          color: 'purple'
        },
        aptitude: {
          name: 'Quantitative Aptitude',
          description: 'Mathematical reasoning',
          icon: '🧠',
          color: 'green'
        },
        achievement: {
          name: 'Achievements',
          description: 'Special accomplishments',
          icon: '🏆',
          color: 'gold'
        }
      }
    });
  } catch (error) {
    console.error('Get badge metadata error:', error);
    res.status(500).json({ error: 'Failed to get badge metadata' });
  }
};
