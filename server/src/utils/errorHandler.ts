import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  statusCode: number;
  isOperational: boolean;
}

export const createError = (message: string, statusCode: number): AppError => {
  const error = new Error(message) as AppError;
  error.statusCode = statusCode;
  error.isOperational = true;
  return error;
};

export const errorHandler = (
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', error);
  let { statusCode = 500, message } = error;

  const isDevelopment = process.env.NODE_ENV === 'development';

  // Mongoose validation error
  if (error.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';
  }

  // Mongoose duplicate key error
  if (error.name === 'MongoServerError' && (error as any).code === 11000) {
    statusCode = 400;
    message = 'Duplicate field value';
  }

  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }

  if (error.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  const errorResponse: any = {
    status: 'error',
    statusCode,
    message
  };

  // Add more details in development mode
  if (isDevelopment) {
    errorResponse.error = {
      name: error.name,
      message: error.message,
      stack: error.stack,
      ...(error as any)._errors
    };
  }

  res.status(statusCode).json(errorResponse);
};

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl
  });
};