#!/usr/bin/env node
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';
import { connectDatabase } from '../src/config/database.js';
import { User } from '../src/models/User.js';
import { checkAllBadgeEligibility } from '../src/utils/points.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: '../.env' });

async function awardExistingBadges() {
  try {
    console.log('🔌 Connecting to database...');
    await connectDatabase();

    console.log('🏅 Checking badge eligibility for all users...');
    const users = await User.find({});

    let updatedUsers = 0;
    let totalBadgesAwarded = 0;

    for (const user of users) {
      const newBadges = checkAllBadgeEligibility(user);
      
      if (newBadges.length > 0) {
        console.log(`👤 User ${user.displayName}: awarding ${newBadges.length} badges`);
        console.log(`   New badges: ${newBadges.join(', ')}`);
        
        newBadges.forEach(badge => {
          if (!user.badges.includes(badge)) {
            user.badges.push(badge);
            totalBadgesAwarded++;
          }
        });
        
        await user.save();
        updatedUsers++;
      }
    }

    console.log(`\n✅ Badge eligibility check complete!`);
    console.log(`📊 Updated ${updatedUsers} users`);
    console.log(`🏆 Awarded ${totalBadgesAwarded} total badges`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error awarding badges:', error);
    process.exit(1);
  }
}

awardExistingBadges();
