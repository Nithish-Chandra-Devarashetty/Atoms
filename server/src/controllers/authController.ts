import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { User } from '../models/User.js';
import { POINTS } from '../utils/points.js';
import { AuthRequest } from '../middleware/auth.js';

const generateToken = (userId: string): string => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error('JWT_SECRET not configured');
  }
  
  return jwt.sign(
    { userId },
    jwtSecret,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } as jwt.SignOptions
  );
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, displayName } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ error: 'User already exists with this email' });
      return;
    }

    // Create new user
    const user = new User({
      email,
      password,
      displayName,
      provider: 'email'
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    // Return user data without password
    const userResponse = {
      _id: user._id,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      provider: user.provider,
      isEmailVerified: user.isEmailVerified,
      totalPoints: user.totalPoints,
      badges: user.badges,
      streak: user.streak,
      progress: user.progress,
      createdAt: user.createdAt
    };

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: userResponse
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    // Update login and streak tracking
    const today = new Date();
    const lastLogin = user.lastLogin ? new Date(user.lastLogin) : today;
    const lastActive = user.lastActiveDate ? new Date(user.lastActiveDate) : today;
    
    // Calculate days since last login
    const daysSinceLastLogin = Math.floor((today.getTime() - lastLogin.getTime()) / (1000 * 60 * 60 * 24));
    
    // Update streak logic
    if (daysSinceLastLogin === 1) {
      user.streak = (user.streak || 0) + 1;
    } else if (daysSinceLastLogin > 1) {
      user.streak = 1;
    }
    // Daily login points: +1 if logging in on a new day
    if (daysSinceLastLogin >= 1) {
      user.totalPoints = (user.totalPoints || 0) + POINTS.DAILY_LOGIN;
    }
    
    // Update timestamps
    user.lastLogin = today;
    user.lastActiveDate = today;
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    // Return user data without password
    const userResponse = {
      _id: user._id,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      provider: user.provider,
      isEmailVerified: user.isEmailVerified,
      totalPoints: user.totalPoints,
      badges: user.badges,
      streak: user.streak,
      progress: user.progress,
      createdAt: user.createdAt
    };

    res.json({
      message: 'Login successful',
      token,
      user: userResponse
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    // Get user with populated followers/following to get counts
    const user = await User.findById(req.user._id)
      .populate('followers', 'displayName photoURL')
      .populate('following', 'displayName photoURL');

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const userResponse = {
      _id: user._id,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      provider: user.provider,
      isEmailVerified: user.isEmailVerified,
      totalPoints: user.totalPoints,
      badges: user.badges,
      streak: user.streak,
      progress: user.progress,
      createdAt: user.createdAt,
      followersCount: user.followers.length,
      followingCount: user.following.length
    };

    res.json({ user: userResponse });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const { displayName, photoURL } = req.body;
    
    const updateData: any = {};
    if (displayName) updateData.displayName = displayName;
    if (photoURL !== undefined) updateData.photoURL = photoURL;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const googleAuth = async (req: Request, res: Response): Promise<void> => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      res.status(400).json({ error: 'ID token is required' });
      return;
    }

    // Initialize Google OAuth client
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

    // Verify the ID token
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      res.status(400).json({ error: 'Invalid Google token' });
      return;
    }

    // Extract user information from Google
    const { email, name, picture, sub: googleId } = payload;

    // Check if user already exists
    let user = await User.findOne({ 
      $or: [
        { email },
        { googleId }
      ]
    });

    if (user) {
      // Update existing user with Google info if needed
      if (!user.googleId) {
        user.googleId = googleId;
      }
      if (!user.photoURL && picture) {
        user.photoURL = picture;
      }
      if (user.provider === 'email' && !user.isEmailVerified) {
        user.isEmailVerified = true; // Google accounts are verified
      }
      
      // Update login tracking
      const today = new Date();
      const lastLogin = user.lastLogin ? new Date(user.lastLogin) : today;
      
  const daysSinceLastLogin = Math.floor((today.getTime() - lastLogin.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysSinceLastLogin === 1) {
        user.streak = (user.streak || 0) + 1;
      } else if (daysSinceLastLogin > 1) {
        user.streak = 1;
      }
      
      user.lastLogin = today;
      user.lastActiveDate = today;
      // Daily login points: +1 if logging in on a new day
      if (daysSinceLastLogin >= 1) {
        user.totalPoints = (user.totalPoints || 0) + POINTS.DAILY_LOGIN;
      }
      
      await user.save();
    } else {
      // Create new user with Google account
      user = new User({
        email,
        displayName: name || email.split('@')[0],
        photoURL: picture || '',
        provider: 'google',
        googleId,
        isEmailVerified: true,
        lastLogin: new Date(),
        lastActiveDate: new Date(),
        streak: 1
      });

      await user.save();
    }

    // Generate JWT token
    const token = generateToken(user._id);

    // Return user data
    const userResponse = {
      _id: user._id,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      provider: user.provider,
      isEmailVerified: user.isEmailVerified,
      totalPoints: user.totalPoints,
      badges: user.badges,
      streak: user.streak,
      progress: user.progress,
      createdAt: user.createdAt
    };

    res.json({
      message: 'Google authentication successful',
      token,
      user: userResponse
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({ error: 'Google authentication failed' });
  }
};