import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const validateRequest = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    console.log('🔍 Validating request body:', req.body);
    const { error } = schema.validate(req.body);
    
    if (error) {
      console.error('❌ Validation failed:', error.details);
      res.status(400).json({
        error: 'Validation failed',
        details: error.details.map(detail => ({
          message: detail.message,
          path: detail.path,
          value: detail.context?.value
        }))
      });
      return;
    }
    
    console.log('✅ Validation passed');
    next();
  };
};

// Validation schemas
export const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  displayName: Joi.string().min(2).max(50).required()
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

export const updateProfileSchema = Joi.object({
  displayName: Joi.string().min(2).max(50),
  photoURL: Joi.string().uri().allow('')
});

export const quizSubmissionSchema = Joi.object({
  subject: Joi.string().required(),
  topic: Joi.string(),
  score: Joi.number().min(0).required(),
  totalQuestions: Joi.number().min(1).required(),
  timeSpent: Joi.number().min(0).required(),
  answers: Joi.array().items(
    Joi.object({
      questionIndex: Joi.number().required(),
      selectedAnswer: Joi.number().required(),
      isCorrect: Joi.boolean().required()
    })
  ).required()
});

export const discussionSchema = Joi.object({
  content: Joi.string().min(10).max(2000).required(),
  tags: Joi.array().items(Joi.string().max(20)).max(5)
});

export const replySchema = Joi.object({
  content: Joi.string().min(1).max(1000).required()
});

export const messageSchema = Joi.object({
  content: Joi.string().min(1).max(1000).required()
});