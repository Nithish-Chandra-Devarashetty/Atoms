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
    // In development, allow all local network origins
    if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV !== 'production') {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);
      
      // Allow localhost and local network IPs
      const isLocalhost = origin.includes('localhost') || origin.includes('127.0.0.1');
      const isLocalNetwork = /^https?:\/\/(10\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.)/.test(origin);
      const isViteHMR = origin.includes('5173') || origin.includes('5174') || origin.includes('4173');
      
      // More permissive check for local development - allow any local IP with Vite ports
      const isLocalDev = /^https?:\/\/\d+\.\d+\.\d+\.\d+:(5173|5174|4173)$/.test(origin);
      
      if (isLocalhost || isLocalNetwork || isViteHMR || isLocalDev) {
        console.log('✅ CORS: Allowing local development origin:', origin);
        return callback(null, true);
      }
      
      console.log('❌ CORS: Rejecting origin:', origin);
    }
    
    // Production allowed origins
    const allowedOrigins = [
      process.env.FRONTEND_URL || 'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:3000',
      'https://atoms-learning.netlify.app'
    ];
    
    console.log('Origin:', origin);
    console.log('Allowed origins:', allowedOrigins);
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
};