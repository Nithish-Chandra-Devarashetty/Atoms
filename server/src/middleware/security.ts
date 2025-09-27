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
  windowMs: 1 * 60 * 1000, 
  max: 100,
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
        return callback(null, true);
      }
    }
    
    // Production allowed origins
    // Build allowed origins from env
    const fromEnv = (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/$/, '');
    const extra = (process.env.ALLOWED_ORIGINS || '')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)
      .map(s => s.replace(/\/$/, ''));
    const allowedOrigins = [
      fromEnv,
      ...extra,
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:3000',
    ];
    
    const normalized = origin ? origin.replace(/\/$/, '') : undefined;
    
    // Log for debugging production issues
    console.log(`🔗 REST CORS check - Origin: ${origin}, Allowed: ${allowedOrigins.join(', ')}`);
    
    if (!normalized || allowedOrigins.includes(normalized)) {
      callback(null, true);
    } else {
      console.error(`❌ REST CORS blocked origin: ${origin}`);
      callback(new Error(`Not allowed by CORS: ${origin}`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
};