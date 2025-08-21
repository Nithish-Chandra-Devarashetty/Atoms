import mongoose from 'mongoose';

export const connectDatabase = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/atoms';
    
    console.log('🔌 Attempting to connect to MongoDB...');
    console.log('   URI:', mongoUri);
    
    await mongoose.connect(mongoUri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000, // Increased timeout
      socketTimeoutMS: 45000,
      family: 4, // Force IPv4 to prevent IPv6 issues
    });

    console.log('✅ MongoDB connected successfully');
    
    // Handle connection events with more detailed logging
    mongoose.connection.on('connecting', () => {
      console.log('🔄 Connecting to MongoDB...');
    });
    
    mongoose.connection.on('connected', () => {
      console.log('✅ MongoDB connection established');
      console.log('   Database name:', mongoose.connection.name);
      console.log('   Host:', mongoose.connection.host);
      console.log('   Port:', mongoose.connection.port);
    });
    
    mongoose.connection.on('error', (error) => {
      console.error('❌ MongoDB connection error:', error);
      if (error.name === 'MongoNetworkError') {
        console.error('   Network error - Please check if MongoDB is running');
      }
      console.error('   Error details:', JSON.stringify(error, null, 2));
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
    });

    process.on('SIGINT', async () => {
      try {
        await mongoose.connection.close();
        console.log('🔌 MongoDB connection closed through app termination');
        process.exit(0);
      } catch (err) {
        console.error('Error closing MongoDB connection:', err);
        process.exit(1);
      }
    });

  } catch (error: any) {
    console.error('❌ Failed to connect to MongoDB');
    console.error('   Error name:', error.name);
    console.error('   Error message:', error.message);
    console.error('   Error code:', (error as any).code);
    console.error('   Error stack:', error.stack);
    
    if (error.name === 'MongoServerError') {
      console.error('   MongoDB server error - Check your connection string and credentials');
    } else if (error.name === 'MongooseServerSelectionError') {
      console.error('   Could not connect to MongoDB server - Is it running?');
    }
    
    process.exit(1);
  }
};