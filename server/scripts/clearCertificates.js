#!/usr/bin/env node
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';
import { connectDatabase } from '../src/config/database.js';
import { User } from '../src/models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: '../.env' });

async function clearCertificates() {
  try {
    console.log('🔌 Connecting to database...');
    await connectDatabase();

    console.log('🗑️  Clearing existing certificates...');
    const result = await User.updateMany(
      { certificates: { $exists: true, $ne: [] } },
      { $unset: { certificates: "" } }
    );

    console.log(`✅ Cleared certificates for ${result.modifiedCount} users`);
    
    // Also remove the webdev-certificate badge so it can be re-earned
    const badgeResult = await User.updateMany(
      { badges: 'webdev-certificate' },
      { $pull: { badges: 'webdev-certificate' } }
    );

    console.log(`✅ Removed webdev-certificate badge from ${badgeResult.modifiedCount} users`);
    
    console.log('🎉 Database cleared! Users can now regenerate certificates with the new layout.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error clearing certificates:', error);
    process.exit(1);
  }
}

clearCertificates();
