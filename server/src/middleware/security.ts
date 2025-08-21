import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { Request, Response, NextFunction } from 'express';

// Rate limiting
export const createRateLimit = (windowMs: number, max: number, message: string) => {
  return rateLimit({
    windowMs,
    max,
    message: { error: message },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

// General rate limit - disabled in development
export const generalLimiter = (req: any, res: any, next: any) => {
  if (process.env.NODE_ENV === 'development') return next();
  return createRateLimit(
    15 * 60 * 1000, // 15 minutes
    100, // limit each IP to 100 requests per windowMs
    'Too many requests from this IP, please try again later'
  )(req, res, next);
};

// Auth rate limit - disabled in development
export const authLimiter = (req: any, res: any, next: any) => {
  if (process.env.NODE_ENV === 'development') return next();
  return createRateLimit(
    15 * 60 * 1000, // 15 minutes
    5, // limit each IP to 5 auth requests per windowMs
    'Too many authentication attempts, please try again later'
  )(req, res, next);
};

// Security headers
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false,
});

// Request logging middleware
export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`);
  });
  
  next();
};

// CORS configuration
export const corsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    const allowedOrigins = [
      process.env.FRONTEND_URL || 'http://localhost:5173',
      'http://localhost:5174', // Added for Vite default port
      'http://localhost:3000',
      'https://atoms-learning.netlify.app' // Add your production domain
    ];
    
    // Log CORS origin for debugging
    console.log('Origin:', origin);
    console.log('Allowed origins:', allowedOrigins);
    
    // Allow requests with no origin (mobile apps, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};