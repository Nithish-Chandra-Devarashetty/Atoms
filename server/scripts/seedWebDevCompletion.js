import mongoose from 'mongoose';
import { User } from '../src/models/User.js';
import { QuizAttempt, VideoProgress } from '../src/models/Progress.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/atoms';

async function seedWebDevCompletion() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get the first user (or create a test user)
    let user = await User.findOne().sort({ createdAt: 1 });
    
    if (!user) {
      // Create a test user if none exists
      user = new User({
        email: 'test@atoms.com',
        password: 'password123',
        displayName: 'Test User',
        provider: 'email',
        isEmailVerified: true
      });
      await user.save();
      console.log('✅ Created test user');
    }

    console.log(`📝 Working with user: ${user.displayName} (${user.email})`);

    // WebDev subjects and their video counts
    const webdevSubjects = ['html', 'css', 'javascript', 'react', 'nodejs', 'mongodb'];
    const videosPerSubject = 11;

    // Update user progress to show 100% completion
    for (const subject of webdevSubjects) {
      // Set videos watched to 11 and quiz passed to true
      const subjectKey = subject;
      user.progress.webdev[subjectKey] = {
        videosWatched: videosPerSubject,
        quizPassed: true,
        score: 95 // High score
      };

      // Create video progress records for each video
      for (let videoIndex = 1; videoIndex <= videosPerSubject; videoIndex++) {
        const videoId = `${subject}-video-${videoIndex}`;
        
        await VideoProgress.findOneAndUpdate(
          { userId: user._id, subject, videoId },
          {
            userId: user._id,
            subject,
            videoId,
            watchedAt: new Date(),
            watchTime: 300 // 5 minutes watch time
          },
          { upsert: true }
        );
      }

      // Create quiz attempts for the subject
      if (['html', 'css'].includes(subject)) {
        // Single quiz for HTML and CSS
        await QuizAttempt.findOneAndUpdate(
          { userId: user._id, subject, topic: { $exists: false } },
          {
            userId: user._id,
            subject,
            score: 9, // 9 out of 10 questions correct
            totalQuestions: 10,
            timeSpent: 300,
            answers: Array.from({ length: 10 }, (_, i) => ({
              questionIndex: i,
              selectedAnswer: 0,
              isCorrect: i < 9 // 9 correct answers
            }))
          },
          { upsert: true }
        );
      } else {
        // Multiple quizzes for JS, React, Node, MongoDB (one per video)
        for (let quizIndex = 1; quizIndex <= videosPerSubject; quizIndex++) {
          const topicId = `${subject}-video-${quizIndex}`;
          
          await QuizAttempt.findOneAndUpdate(
            { userId: user._id, subject, topic: topicId },
            {
              userId: user._id,
              subject,
              topic: topicId,
              score: 8, // 8 out of 10 questions correct
              totalQuestions: 10,
              timeSpent: 240,
              answers: Array.from({ length: 10 }, (_, i) => ({
                questionIndex: i,
                selectedAnswer: 0,
                isCorrect: i < 8 // 8 correct answers
              }))
            },
            { upsert: true }
          );
        }
      }

      console.log(`✅ Completed ${subject}: ${videosPerSubject} videos, quizzes passed`);
    }

    // Add some bonus points for completion
    user.totalPoints += 320; // 10 points per video (66 videos) + 10 points per quiz
    
    // Add some relevant badges
    const webdevBadges = [
      'html-quiz-passed',
      'css-quiz-passed', 
      'javascript-quiz-passed',
      'react-quiz-passed',
      'nodejs-quiz-passed',
      'mongodb-quiz-passed',
      'webdev-completion'
    ];

    for (const badge of webdevBadges) {
      if (!user.badges.includes(badge)) {
        user.badges.push(badge);
      }
    }

    await user.save();

    console.log('🎉 WebDev completion data inserted successfully!');
    console.log(`📊 User now has:`);
    console.log(`   - Total Points: ${user.totalPoints}`);
    console.log(`   - Badges: ${user.badges.length}`);
    console.log(`   - HTML: ${user.progress.webdev.html.videosWatched}/11 videos, Quiz: ${user.progress.webdev.html.quizPassed}`);
    console.log(`   - CSS: ${user.progress.webdev.css.videosWatched}/11 videos, Quiz: ${user.progress.webdev.css.quizPassed}`);
    console.log(`   - JavaScript: ${user.progress.webdev.javascript.videosWatched}/11 videos, Quiz: ${user.progress.webdev.javascript.quizPassed}`);
    console.log(`   - React: ${user.progress.webdev.react.videosWatched}/11 videos, Quiz: ${user.progress.webdev.react.quizPassed}`);
    console.log(`   - Node.js: ${user.progress.webdev.nodejs.videosWatched}/11 videos, Quiz: ${user.progress.webdev.nodejs.quizPassed}`);
    console.log(`   - MongoDB: ${user.progress.webdev.mongodb.videosWatched}/11 videos, Quiz: ${user.progress.webdev.mongodb.quizPassed}`);
    
    console.log('\n🎯 Next steps:');
    console.log('1. Login with this user account');
    console.log('2. Go to Profile page');
    console.log('3. Look for the "Download Certificate" button in the Certificates section');
    console.log('4. Click it to test certificate generation!');

  } catch (error) {
    console.error('❌ Error seeding data:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the seeding function
seedWebDevCompletion();
