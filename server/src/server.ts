import express from 'express';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';

// Import middleware
import { connectDatabase } from './config/database.js';
import { errorHandler, notFoundHandler } from './utils/errorHandler.js';
import logger from './utils/logger.js';
import { generalLimiter, authLimiter, securityHeaders, corsOptions } from './middleware/security.js';

// Import routes
import authRoutes from './routes/auth.js';
import progressRoutes from './routes/progress.js';
import discussionRoutes from './routes/discussion.js';
import dsaRoutes from './routes/dsa.js';
import userRoutes from './routes/user.js';
import messageRoutes from './routes/messages.js';
import notificationRoutes from './routes/notifications.js';
import certificateRoutes from './routes/certificates.js';
import badgeRoutes from './routes/badges.js';
import contestRoutes from './routes/contests.js';
import adminRoutes from './routes/admin.js';
import aiQuizRoutes from './routes/aiquiz.js';

// Import controllers to set up WebSocket
import { setSocketIO as setMessageSocketIO } from './controllers/messageController.js';
import { setSocketIO as setDiscussionSocketIO } from './controllers/discussionController.js';
import { setSocketIO as setNotificationSocketIO } from './controllers/notificationController.js';
import { setSocketIO as setContestSocketIO } from './controllers/contestController.js';

// Load environment variables
dotenv.config();

const app = express();
// Serve local certificate fallbacks
import path from 'path';
import fs from 'fs';
const staticCertDir = path.resolve(process.cwd(), 'temp', 'certificates');
if (!fs.existsSync(staticCertDir)) {
  fs.mkdirSync(staticCertDir, { recursive: true });
}
app.use('/static/certificates', express.static(staticCertDir));
const server = createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: (origin, callback) => {
      // Allow all local development origins similar to REST CORS
      if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV !== 'production') {
        if (!origin) return callback(null, true);
        const isLocalhost = origin.includes('localhost') || origin.includes('127.0.0.1');
        const isLocalNetwork = /^https?:\/\/(10\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.)/.test(origin);
        const isViteHMR = origin.includes('5173') || origin.includes('5174') || origin.includes('4173');
        const isLocalDev = /^https?:\/\/\d+\.\d+\.\d+\.\d+:(5173|5174|4173)$/.test(origin);
        if (isLocalhost || isLocalNetwork || isViteHMR || isLocalDev) return callback(null, true);
      }
      
      // Production: Build allowed origins from environment variables
      const fromEnv = (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/$/, '');
      const extra = (process.env.ALLOWED_ORIGINS || '')
        .split(',')
        .map(s => s.trim())
        .filter(Boolean)
        .map(s => s.replace(/\/$/, ''));
      
      const allowed = [
        fromEnv,
        ...extra,
        'http://localhost:5173',
        'http://localhost:5174',
        'http://localhost:3000'
      ];
      
      const normalized = origin ? origin.replace(/\/$/, '') : undefined;
      
      // Log for debugging production issues
      console.log(`🔗 WebSocket CORS check - Origin: ${origin}, Allowed: ${allowed.join(', ')}`);
      
      if (!origin || allowed.includes(normalized || '')) {
        return callback(null, true);
      }
      
      console.error(`❌ WebSocket CORS blocked origin: ${origin}`);
      return callback(new Error(`Socket.IO CORS blocked origin: ${origin}`));
    },
    methods: ["GET", "POST"],
    credentials: true
  },
  // Start with polling for better production compatibility, allow upgrade to websocket
  transports: ['polling', 'websocket'],
  // Increased timeouts for production reliability
  pingTimeout: 20000,
  pingInterval: 25000,
  // Additional production settings
  allowEIO3: true, // Allow older socket.io clients
  serveClient: false // Don't serve socket.io client files
});
const PORT = parseInt(process.env.PORT || '5000', 10);

// Connect to database
connectDatabase();

// Set up Socket.IO for controllers
setMessageSocketIO(io);
setDiscussionSocketIO(io);
setNotificationSocketIO(io);
setContestSocketIO(io);

// Security middleware
app.use(securityHeaders);

// Request logging middleware
if (process.env.REQUEST_LOG !== 'minimal') {
  app.use((req, _res, next) => {
    logger.debug(`${req.method} ${req.path}`);
    next();
  });
}

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
  logger.debug('Health check');
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    server: 'Atoms Learning Platform',
    requestOrigin: req.get('Origin'),
    requestIP: req.ip
  });
});

// CORS test endpoint
app.get('/api/test', (req, res) => {
  logger.debug('API connectivity test');
  res.json({ 
    message: 'CORS and API connection working!',
    origin: req.get('Origin'),
    ip: req.ip,
    timestamp: new Date().toISOString()
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
app.use('/api/certificates', certificateRoutes);
app.use('/api/badges', badgeRoutes);
app.use('/api/contests', contestRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/aiquiz', aiQuizRoutes);

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

// WebSocket connection handling
io.on('connection', (socket) => {
  logger.debug(`WS connect ${socket.id}`);

  // Auto-join user room if userId provided in auth
  const authUserId = (socket as any).handshake?.auth?.userId;
  if (authUserId) {
    socket.join(`user-${authUserId}`);
  logger.debug(`WS auto join user-${authUserId}`);
  }

  // Join user-specific room for private messages
  socket.on('join-user-room', (userId) => {
    if (userId) {
      socket.join(`user-${userId}`);
  logger.debug(`WS join user-${userId}`);
    }
  });

  // Join discussion room
  socket.on('join-discussion', (discussionId) => {
    if (discussionId) {
      socket.join(`discussion-${discussionId}`);
  logger.debug(`WS join discussion-${discussionId}`);
    }
  });

  // Leave discussion room
  socket.on('leave-discussion', (discussionId) => {
    if (discussionId) {
      socket.leave(`discussion-${discussionId}`);
  logger.debug(`WS leave discussion-${discussionId}`);
    }
  });

  // Handle new message in discussion
  socket.on('new-discussion-message', (data) => {
    const { discussionId, message } = data;
    if (discussionId && message) {
      // Broadcast to all users in the discussion room except sender
      socket.to(`discussion-${discussionId}`).emit('discussion-message-received', message);
  logger.debug(`WS broadcast discussion-${discussionId}`);
    }
  });

  // Handle new private message
  socket.on('new-private-message', (data) => {
    const { recipientId, message } = data;
    if (recipientId && message) {
      // Send to recipient's room
      socket.to(`user-${recipientId}`).emit('private-message-received', message);
  logger.debug(`WS private message user-${recipientId}`);
    }
  });

  // Handle typing indicators for discussions
  socket.on('discussion-typing', (data) => {
    const { discussionId, user } = data;
    if (discussionId && user) {
      socket.to(`discussion-${discussionId}`).emit('user-typing-discussion', { user, discussionId });
    }
  });

  // Handle typing indicators for private messages
  socket.on('private-typing', (data) => {
    const { recipientId, user } = data;
    if (recipientId && user) {
      socket.to(`user-${recipientId}`).emit('user-typing-private', { user });
    }
  });

  // Handle user disconnect
  socket.on('disconnect', () => {
  logger.debug(`WS disconnect ${socket.id}`);
  });
});

// Start server
server.listen(PORT, '0.0.0.0', () => {
  logger.info(`Server listening on :${PORT}`);
  logger.info(`Env: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`Frontend: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
});

export { io };
export default app;