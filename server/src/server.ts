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
import userRoutes from './routes/user.js';
import messageRoutes from './routes/messages.js';
import notificationRoutes from './routes/notifications.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '5000', 10);

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
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/notifications', notificationRoutes);

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
      dsa: '/api/dsa',
      users: '/api/users',
      messages: '/api/messages'
    }
  });
});

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
  console.log(`📡 Server accessible on all network interfaces`);
  console.log(`🔗 Local: http://localhost:${PORT}`);
  console.log(`🔗 Network: http://[YOUR_IP]:${PORT}`);
});

export default app;