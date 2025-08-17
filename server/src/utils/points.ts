export const POINTS = {
  VIDEO_WATCHED: 50,
  QUIZ_PASSED: {
    BASE: 100,
    PERFECT_BONUS: 200
  },
  DSA_PROBLEM: {
    EASY: 100,
    MEDIUM: 200,
    HARD: 300
  },
  DISCUSSION_CREATED: 25,
  REPLY_CREATED: 15,
  DAILY_LOGIN: 10,
  STREAK_BONUS: {
    WEEK: 100,
    MONTH: 500,
    HUNDRED_DAYS: 1000
  }
};

export const BADGES = {
  // Subject completion badges
  HTML_MASTER: 'html-master',
  CSS_EXPERT: 'css-expert',
  JS_NINJA: 'javascript-ninja',
  REACT_PRO: 'react-pro',
  NODE_GURU: 'node-guru',
  MONGO_MASTER: 'mongo-master',
  
  // DSA badges
  ARRAYS_SILVER: 'arrays-silver',
  ARRAYS_GOLD: 'arrays-gold',
  STRINGS_SILVER: 'strings-silver',
  STRINGS_GOLD: 'strings-gold',
  TREES_SILVER: 'trees-silver',
  TREES_GOLD: 'trees-gold',
  
  // Achievement badges
  FIRST_QUIZ: 'first-quiz',
  PERFECT_SCORE: 'perfect-score',
  WEEK_STREAK: 'week-streak',
  MONTH_STREAK: 'month-streak',
  DISCUSSION_STARTER: 'discussion-starter',
  HELPFUL_MEMBER: 'helpful-member'
};

export const calculateQuizPoints = (score: number, totalQuestions: number): number => {
  const percentage = (score / totalQuestions) * 100;
  let points = Math.floor(percentage * 10); // Base points
  
  if (percentage === 100) {
    points += POINTS.QUIZ_PASSED.PERFECT_BONUS; // Perfect score bonus
  }
  
  return points;
};

export const calculateStreakBonus = (streak: number): number => {
  if (streak >= 100) return POINTS.STREAK_BONUS.HUNDRED_DAYS;
  if (streak >= 30) return POINTS.STREAK_BONUS.MONTH;
  if (streak >= 7) return POINTS.STREAK_BONUS.WEEK;
  return 0;
};

export const checkBadgeEligibility = (user: any, action: string, data: any): string[] => {
  const newBadges: string[] = [];
  
  switch (action) {
    case 'quiz_passed':
      if (!user.badges.includes(BADGES.FIRST_QUIZ)) {
        newBadges.push(BADGES.FIRST_QUIZ);
      }
      
      if (data.percentage === 100 && !user.badges.includes(BADGES.PERFECT_SCORE)) {
        newBadges.push(BADGES.PERFECT_SCORE);
      }
      
      // Subject-specific badges
      if (data.subject === 'html' && !user.badges.includes(BADGES.HTML_MASTER)) {
        newBadges.push(BADGES.HTML_MASTER);
      }
      break;
      
    case 'streak_updated':
      if (data.streak >= 7 && !user.badges.includes(BADGES.WEEK_STREAK)) {
        newBadges.push(BADGES.WEEK_STREAK);
      }
      
      if (data.streak >= 30 && !user.badges.includes(BADGES.MONTH_STREAK)) {
        newBadges.push(BADGES.MONTH_STREAK);
      }
      break;
      
    case 'discussion_created':
      if (!user.badges.includes(BADGES.DISCUSSION_STARTER)) {
        newBadges.push(BADGES.DISCUSSION_STARTER);
      }
      break;
  }
  
  return newBadges;
};