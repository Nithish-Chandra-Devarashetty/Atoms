import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { Request, Response, NextFunction, RequestHandler } from 'express';

// Pre-create limiter instances at module load (required by express-rate-limit)
const generalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { error: 'Too many requests from this IP, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: { error: 'Too many authentication attempts, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Export middlewares that no-op in development but reuse single limiter instances in prod
const noop: RequestHandler = (_req, _res, next) => next();

export const generalLimiter: RequestHandler =
  process.env.NODE_ENV === 'development' ? noop : generalRateLimiter;

export const authLimiter: RequestHandler =
  process.env.NODE_ENV === 'development' ? noop : authRateLimiter;

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