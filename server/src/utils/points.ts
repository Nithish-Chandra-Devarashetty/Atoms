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
  // WebDev Module Badges (Individual modules)
  HTML_MASTER: 'html-master',
  CSS_EXPERT: 'css-expert',
  JS_NINJA: 'javascript-ninja', 
  REACT_PRO: 'react-pro',
  NODE_GURU: 'node-guru',
  MONGO_MASTER: 'mongo-master',
  WEBDEV_CHAMPION: 'webdev-champion', // All 6 modules completed
  
  // Core CS Subject Badges (Complete subjects)
  OS_SCHOLAR: 'os-scholar',
  DBMS_EXPERT: 'dbms-expert', 
  CN_SPECIALIST: 'cn-specialist',
  CORE_CS_MASTER: 'core-cs-master', // All 3 subjects completed
  
  // DSA Progress Badges
  DSA_BEGINNER: 'dsa-beginner', // 10+ problems
  DSA_INTERMEDIATE: 'dsa-intermediate', // 50+ problems
  DSA_ADVANCED: 'dsa-advanced', // 100+ problems
  DSA_GRANDMASTER: 'dsa-grandmaster', // All problems completed
  
  // Aptitude Badge (Biggest achievement)
  APTITUDE_GENIUS: 'aptitude-genius', // All topics completed
  
  // Achievement badges
  FIRST_QUIZ: 'first-quiz',
  PERFECT_SCORE: 'perfect-score',
  WEEK_STREAK: 'week-streak',
  MONTH_STREAK: 'month-streak',
  DISCUSSION_STARTER: 'discussion-starter',
  HELPFUL_MEMBER: 'helpful-member'
};

export const BADGE_METADATA = {
  // WebDev Module Badges
  'html-master': { 
    name: 'HTML Master', 
    description: 'Completed HTML module',
    category: 'webdev',
    size: 'small',
    color: 'orange',
    icon: '🌐'
  },
  'css-expert': { 
    name: 'CSS Expert', 
    description: 'Completed CSS module',
    category: 'webdev',
    size: 'small',
    color: 'blue',
    icon: '🎨'
  },
  'javascript-ninja': { 
    name: 'JavaScript Ninja', 
    description: 'Completed JavaScript module',
    category: 'webdev',
    size: 'small',
    color: 'yellow',
    icon: '⚡'
  },
  'react-pro': { 
    name: 'React Pro', 
    description: 'Completed React module',
    category: 'webdev',
    size: 'small',
    color: 'cyan',
    icon: '⚛️'
  },
  'node-guru': { 
    name: 'Node.js Guru', 
    description: 'Completed Node.js module',
    category: 'webdev',
    size: 'small',
    color: 'green',
    icon: '🚀'
  },
  'mongo-master': { 
    name: 'MongoDB Master', 
    description: 'Completed MongoDB module',
    category: 'webdev',
    size: 'small',
    color: 'green',
    icon: '🍃'
  },
  'webdev-champion': { 
    name: 'WebDev Champion', 
    description: 'Completed all 6 WebDev modules',
    category: 'webdev',
    size: 'medium',
    color: 'purple',
    icon: '👑'
  },
  
  // Core CS Subject Badges
  'os-scholar': { 
    name: 'OS Scholar', 
    description: 'Mastered Operating Systems',
    category: 'core',
    size: 'medium',
    color: 'red',
    icon: '💻'
  },
  'dbms-expert': { 
    name: 'DBMS Expert', 
    description: 'Mastered Database Management Systems',
    category: 'core',
    size: 'medium',
    color: 'blue',
    icon: '🗄️'
  },
  'cn-specialist': { 
    name: 'CN Specialist', 
    description: 'Mastered Computer Networks',
    category: 'core',
    size: 'medium',
    color: 'indigo',
    icon: '🌐'
  },
  'core-cs-master': { 
    name: 'Core CS Master', 
    description: 'Completed all Core CS subjects',
    category: 'core',
    size: 'large',
    color: 'red',
    icon: '🎓'
  },
  
  // DSA Badges
  'dsa-beginner': { 
    name: 'DSA Beginner', 
    description: 'Solved 10+ problems',
    category: 'dsa',
    size: 'small',
    color: 'green',
    icon: '🔰'
  },
  'dsa-intermediate': { 
    name: 'DSA Intermediate', 
    description: 'Solved 50+ problems',
    category: 'dsa',
    size: 'medium',
    color: 'blue',
    icon: '🏅'
  },
  'dsa-advanced': { 
    name: 'DSA Advanced', 
    description: 'Solved 100+ problems',
    category: 'dsa',
    size: 'large',
    color: 'purple',
    icon: '🏆'
  },
  'dsa-grandmaster': { 
    name: 'DSA Grandmaster', 
    description: 'Solved ALL DSA problems',
    category: 'dsa',
    size: 'huge',
    color: 'gold',
    icon: '👑'
  },
  
  // Aptitude Badge (Biggest)
  'aptitude-genius': { 
    name: 'Aptitude Genius', 
    description: 'Completed ALL aptitude topics',
    category: 'aptitude',
    size: 'huge',
    color: 'rainbow',
    icon: '🧠'
  },
  
  // Achievement Badges
  'first-quiz': { 
    name: 'First Steps', 
    description: 'Completed your first quiz',
    category: 'achievement',
    size: 'small',
    color: 'green',
    icon: '🌟'
  },
  'perfect-score': { 
    name: 'Perfect Score', 
    description: 'Got 100% on a quiz',
    category: 'achievement',
    size: 'small',
    color: 'gold',
    icon: '💯'
  },
  'week-streak': { 
    name: 'Week Warrior', 
    description: '7-day learning streak',
    category: 'achievement',
    size: 'small',
    color: 'orange',
    icon: '🔥'
  },
  'month-streak': { 
    name: 'Month Master', 
    description: '30-day learning streak',
    category: 'achievement',
    size: 'medium',
    color: 'red',
    icon: '🔥'
  },
  'discussion-starter': { 
    name: 'Discussion Starter', 
    description: 'Started your first discussion',
    category: 'achievement',
    size: 'small',
    color: 'blue',
    icon: '💬'
  },
  'helpful-member': { 
    name: 'Helpful Member', 
    description: 'Helped others in discussions',
    category: 'achievement',
    size: 'small',
    color: 'green',
    icon: '🤝'
  }
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
      // First quiz badge
      if (!user.badges.includes(BADGES.FIRST_QUIZ)) {
        newBadges.push(BADGES.FIRST_QUIZ);
      }
      
      // Perfect score badge
      if (data.percentage === 100 && !user.badges.includes(BADGES.PERFECT_SCORE)) {
        newBadges.push(BADGES.PERFECT_SCORE);
      }
      break;
      
    case 'webdev_module_completed':
      const moduleMap: Record<string, string> = {
        'html': BADGES.HTML_MASTER,
        'css': BADGES.CSS_EXPERT,
        'javascript': BADGES.JS_NINJA,
        'react': BADGES.REACT_PRO,
        'nodejs': BADGES.NODE_GURU,
        'mongodb': BADGES.MONGO_MASTER
      };
      
      const badgeId = moduleMap[data.module];
      if (badgeId && !user.badges.includes(badgeId)) {
        newBadges.push(badgeId);
      }
      
      // Check for WebDev Champion (all 6 modules)
      const webdevModules = ['html', 'css', 'javascript', 'react', 'nodejs', 'mongodb'];
      const completedModules = webdevModules.filter(module => 
        user.progress?.webdev?.[module]?.videosWatched >= 11 && 
        user.progress?.webdev?.[module]?.quizPassed
      );
      
      if (completedModules.length === 6 && !user.badges.includes(BADGES.WEBDEV_CHAMPION)) {
        newBadges.push(BADGES.WEBDEV_CHAMPION);
      }
      break;
      
    case 'core_subject_completed':
      const coreSubjectMap: Record<string, string> = {
        'os': BADGES.OS_SCHOLAR,
        'dbms': BADGES.DBMS_EXPERT,
        'cn': BADGES.CN_SPECIALIST
      };
      
      const coreBadgeId = coreSubjectMap[data.subject];
      if (coreBadgeId && !user.badges.includes(coreBadgeId)) {
        newBadges.push(coreBadgeId);
      }
      
      // Check for Core CS Master (all 3 subjects)
      const coreSubjects = ['os', 'dbms', 'cn'];
      const completedCoreSubjects = coreSubjects.filter(subject => {
        const subjectData = user.progress?.core?.[subject];
        // Assuming completion means significant topics completed and quizzes passed
        return subjectData?.topicsCompleted?.length >= 10 && subjectData?.quizzesPassed >= 5;
      });
      
      if (completedCoreSubjects.length === 3 && !user.badges.includes(BADGES.CORE_CS_MASTER)) {
        newBadges.push(BADGES.CORE_CS_MASTER);
      }
      break;
      
    case 'dsa_problem_solved':
      const solvedCount = user.progress?.dsa?.solvedProblems?.length || 0;
      
      if (solvedCount >= 10 && !user.badges.includes(BADGES.DSA_BEGINNER)) {
        newBadges.push(BADGES.DSA_BEGINNER);
      }
      
      if (solvedCount >= 50 && !user.badges.includes(BADGES.DSA_INTERMEDIATE)) {
        newBadges.push(BADGES.DSA_INTERMEDIATE);
      }
      
      if (solvedCount >= 100 && !user.badges.includes(BADGES.DSA_ADVANCED)) {
        newBadges.push(BADGES.DSA_ADVANCED);
      }
      
      // Check for DSA Grandmaster (all problems - you'll need to define total count)
      const totalDSAProblems = data.totalProblems || 200; // Adjust this number
      if (solvedCount >= totalDSAProblems && !user.badges.includes(BADGES.DSA_GRANDMASTER)) {
        newBadges.push(BADGES.DSA_GRANDMASTER);
      }
      break;
      
    case 'aptitude_completed':
      const completedAptitudeTopics = user.progress?.aptitude?.completedTopics?.length || 0;
      const totalAptitudeTopics = data.totalTopics || 50; // Adjust this number
      
      if (completedAptitudeTopics >= totalAptitudeTopics && !user.badges.includes(BADGES.APTITUDE_GENIUS)) {
        newBadges.push(BADGES.APTITUDE_GENIUS);
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

// Helper function to check all badge eligibility for a user
export const checkAllBadgeEligibility = (user: any): string[] => {
  const newBadges: string[] = [];
  
  // Check WebDev module badges
  const webdevModules = ['html', 'css', 'javascript', 'react', 'nodejs', 'mongodb'];
  webdevModules.forEach(module => {
    const moduleProgress = user.progress?.webdev?.[module];
    if (moduleProgress?.videosWatched >= 11 && moduleProgress?.quizPassed) {
      const moduleMap: Record<string, string> = {
        'html': BADGES.HTML_MASTER,
        'css': BADGES.CSS_EXPERT,
        'javascript': BADGES.JS_NINJA,
        'react': BADGES.REACT_PRO,
        'nodejs': BADGES.NODE_GURU,
        'mongodb': BADGES.MONGO_MASTER
      };
      
      const badgeId = moduleMap[module];
      if (badgeId && !user.badges.includes(badgeId)) {
        newBadges.push(badgeId);
      }
    }
  });
  
  // Check WebDev Champion
  const completedWebdevModules = webdevModules.filter(module => 
    user.progress?.webdev?.[module]?.videosWatched >= 11 && 
    user.progress?.webdev?.[module]?.quizPassed
  );
  
  if (completedWebdevModules.length === 6 && !user.badges.includes(BADGES.WEBDEV_CHAMPION)) {
    newBadges.push(BADGES.WEBDEV_CHAMPION);
  }
  
  // Check DSA badges
  const solvedCount = user.progress?.dsa?.solvedProblems?.length || 0;
  
  if (solvedCount >= 10 && !user.badges.includes(BADGES.DSA_BEGINNER)) {
    newBadges.push(BADGES.DSA_BEGINNER);
  }
  
  if (solvedCount >= 50 && !user.badges.includes(BADGES.DSA_INTERMEDIATE)) {
    newBadges.push(BADGES.DSA_INTERMEDIATE);
  }
  
  if (solvedCount >= 100 && !user.badges.includes(BADGES.DSA_ADVANCED)) {
    newBadges.push(BADGES.DSA_ADVANCED);
  }
  
  // Add other checks as needed...
  
  return newBadges;
};