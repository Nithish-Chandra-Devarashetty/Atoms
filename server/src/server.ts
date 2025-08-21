import express from 'express';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Import middleware
import { connectDatabase } from './config/database.js';
import { errorHandler, notFoundHandler } from './utils/errorHandler.js';
import { generalLimiter, authLimiter, securityHeaders, corsOptions } from './middleware/security.js';

// Import routes
import authRoutes from './routes/auth.js';
import progressRoutes from './routes/progress.js';
import discussionRoutes from './routes/discussion.js';
import dsaRoutes from './routes/dsa.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to database
connectDatabase();

// Security middleware
app.use(securityHeaders);

// Handle preflight requests
app.options('*', cors(corsOptions));

// Apply CORS and rate limiting
app.use(cors(corsOptions));
app.use(generalLimiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression and logging
app.use(compression());
app.use(morgan('combined'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/discussions', discussionRoutes);
app.use('/api/dsa', dsaRoutes);

// API info endpoint
app.get('/api', (req, res) => {
  res.json({
    name: 'Atoms Learning Platform API',
    version: '1.0.0',
    description: 'Backend API for the Atoms learning platform',
    endpoints: {
      auth: '/api/auth',
      progress: '/api/progress',
      discussions: '/api/discussions',
      dsa: '/api/dsa'
    }
  });
});

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
});

export default app;