# Atoms Backend API

Backend server for the Atoms learning platform built with Node.js, Express, and MongoDB.

## Features

- 🔐 User authentication (email/password + Google OAuth)
- 📊 Progress tracking for all learning modules
- 🏆 Gamification system with points and badges
- 💬 Discussion forum with likes and replies
- 📈 Leaderboard system
- 🔒 Security middleware and rate limiting
- ✅ Input validation and error handling

## Quick Start

1. **Install dependencies:**
   ```bash
   cd server
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start MongoDB:**
   ```bash
   # Using Docker
   docker run -d -p 27017:27017 --name atoms-mongo mongo:latest
   
   # Or install MongoDB locally
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Seed the database (optional):**
   ```bash
   npm run seed
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Progress Tracking
- `POST /api/progress/quiz` - Submit quiz results
- `POST /api/progress/video-watched` - Mark video as watched
- `GET /api/progress/me` - Get user progress
- `GET /api/progress/leaderboard` - Get leaderboard

### Discussions
- `GET /api/discussions` - Get all discussions
- `POST /api/discussions` - Create new discussion
- `GET /api/discussions/:id` - Get specific discussion
- `POST /api/discussions/:id/like` - Like/unlike discussion
- `POST /api/discussions/:id/reply` - Reply to discussion

### DSA Progress
- `POST /api/dsa/problem/solved` - Mark problem as solved
- `POST /api/dsa/problem/unsolved` - Unmark problem as solved
- `GET /api/dsa/progress` - Get DSA progress

## Environment Variables

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/atoms
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
```

## Database Schema

### User Model
- Authentication data (email, password, provider)
- Profile information (name, photo, verification status)
- Learning progress for all subjects
- Gamification data (points, badges, streak)

### Progress Models
- Quiz attempts with detailed answers
- Video watch progress
- Subject-specific progress tracking

### Discussion Models
- Discussion posts with tags and likes
- Nested replies system
- User engagement tracking

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting for API endpoints
- CORS configuration
- Security headers with Helmet
- Input validation with Joi
- Error handling and logging

## Development

```bash
# Development with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run tests
npm test
```

## Deployment

The backend is ready for deployment on platforms like:
- Heroku
- Railway
- DigitalOcean App Platform
- AWS Elastic Beanstalk

Make sure to:
1. Set up MongoDB Atlas for production database
2. Configure environment variables
3. Set up proper CORS origins
4. Enable SSL/HTTPS