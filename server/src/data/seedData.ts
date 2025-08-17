import { User } from '../models/User.js';
import { Discussion } from '../models/Discussion.js';
import { connectDatabase } from '../config/database.js';

const seedUsers = [
  {
    email: 'sarah.chen@example.com',
    displayName: 'Sarah Chen',
    provider: 'email',
    totalPoints: 4850,
    badges: ['html-quiz-passed', 'css-quiz-passed', 'javascript-quiz-passed', 'react-quiz-passed'],
    streak: 45
  },
  {
    email: 'mike.rodriguez@example.com',
    displayName: 'Mike Rodriguez',
    provider: 'email',
    totalPoints: 4720,
    badges: ['html-quiz-passed', 'css-quiz-passed', 'javascript-quiz-passed'],
    streak: 38
  },
  {
    email: 'emma.wilson@example.com',
    displayName: 'Emma Wilson',
    provider: 'email',
    totalPoints: 4650,
    badges: ['html-quiz-passed', 'css-quiz-passed'],
    streak: 42
  }
];

const seedDiscussions = [
  {
    content: 'Can someone explain the difference between let, const, and var in JavaScript? I keep getting confused about their scope and hoisting behavior.',
    tags: ['JavaScript', 'Variables', 'Scope']
  },
  {
    content: 'Just solved the "Two Sum" problem on LeetCode! The key insight was using a HashMap to store complements. Here\'s my approach...',
    tags: ['DSA', 'Arrays', 'HashMap']
  },
  {
    content: 'Struggling with CSS Grid vs Flexbox. When should I use which? Any good resources or rules of thumb?',
    tags: ['CSS', 'Layout', 'Grid', 'Flexbox']
  }
];

export const seedDatabase = async (): Promise<void> => {
  try {
    await connectDatabase();
    
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Discussion.deleteMany({});

    // Create users
    const createdUsers = [];
    for (const userData of seedUsers) {
      const user = new User({
        ...userData,
        password: 'password123', // Default password for demo users
        isEmailVerified: true
      });
      await user.save();
      createdUsers.push(user);
    }

    // Create discussions
    for (let i = 0; i < seedDiscussions.length; i++) {
      const discussion = new Discussion({
        ...seedDiscussions[i],
        author: createdUsers[i % createdUsers.length]._id
      });
      await discussion.save();
    }

    console.log('✅ Database seeded successfully');
    console.log(`👥 Created ${createdUsers.length} users`);
    console.log(`💬 Created ${seedDiscussions.length} discussions`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

// Run seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase();
}