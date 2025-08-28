import mongoose from 'mongoose';
import { User } from '../src/models/User.js';
import { QuizAttempt } from '../src/models/Progress.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/atoms';

async function checkWebDevCompletion() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find the user we just seeded
    const user = await User.findOne({ email: 'nithishchandra16@gmail.com' });
    
    if (!user) {
      console.log('❌ User not found');
      return;
    }

    console.log(`\n📝 Checking completion for: ${user.displayName}`);
    console.log('='.repeat(50));

    // Check WebDev progress
    const webdevSubjects = ['html', 'css', 'javascript', 'react', 'nodejs', 'mongodb'];
    let allCompleted = true;

    for (const subject of webdevSubjects) {
      const subjectProgress = user.progress.webdev[subject];
      const videosWatched = subjectProgress?.videosWatched || 0;
      const quizPassed = subjectProgress?.quizPassed || false;
      const score = subjectProgress?.score || 0;

      console.log(`${subject.toUpperCase()}: ${videosWatched}/11 videos, Quiz: ${quizPassed ? '✅' : '❌'}, Score: ${score}`);

      if (videosWatched < 11) {
        allCompleted = false;
        console.log(`  ⚠️  Need ${11 - videosWatched} more videos`);
      }

      // Check quiz requirements
      if (['html', 'css'].includes(subject)) {
        if (!quizPassed) {
          allCompleted = false;
          console.log(`  ⚠️  Need to pass main quiz`);
        }
      } else {
        // For multi-quiz subjects, check if any quizzes passed
        const quizAttempts = await QuizAttempt.find({ 
          userId: user._id, 
          subject,
          $expr: { $gte: [ { $divide: ["$score", "$totalQuestions"] }, 0.7 ] }
        });
        
        console.log(`  📝 Passed quizzes: ${quizAttempts.length}`);
        
        if (quizAttempts.length === 0) {
          allCompleted = false;
          console.log(`  ⚠️  Need to pass at least one quiz`);
        }
      }
    }

    console.log('\n' + '='.repeat(50));
    console.log(`🎯 OVERALL COMPLETION: ${allCompleted ? '✅ ELIGIBLE FOR CERTIFICATE' : '❌ NOT YET ELIGIBLE'}`);
    
    if (allCompleted) {
      console.log('\n🎉 User can now download their Web Development certificate!');
      console.log('📋 Steps to test:');
      console.log('1. Login with: nithishchandra16@gmail.com');
      console.log('2. Go to Profile page');
      console.log('3. Look for "Download Certificate" button');
      console.log('4. Click it to generate and download certificate');
    }

    // Check if certificate already exists
    const existingCert = user.certificates?.find(cert => cert.type === 'webdev');
    if (existingCert) {
      console.log('\n📜 Certificate already exists:');
      console.log(`   ID: ${existingCert.certificateId}`);
      console.log(`   Issued: ${existingCert.issuedDate}`);
      console.log(`   URL: ${existingCert.downloadUrl}`);
    }

    console.log(`\n📊 User Stats:`);
    console.log(`   Total Points: ${user.totalPoints}`);
    console.log(`   Badges: ${user.badges.length}`);
    console.log(`   Latest badges: ${user.badges.slice(-5).join(', ')}`);

  } catch (error) {
    console.error('❌ Error checking completion:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

// Run the check
checkWebDevCompletion();
