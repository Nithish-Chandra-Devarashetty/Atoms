# Atoms - Learning Platform Project Documentation

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Architecture](#architecture)
4. [Features](#features)
5. [Database Schema](#database-schema)
6. [API Endpoints](#api-endpoints)
7. [Deployment](#deployment)
8. [Environment Variables](#environment-variables)

---

## 🎯 Project Overview

**Atoms** is a comprehensive full-stack learning platform designed to help students master technical skills across multiple domains including Web Development, Core Computer Science, Data Structures & Algorithms, and Quantitative Aptitude. The platform features gamification elements, real-time interactions, certificate generation, and AI-powered quiz generation.

### Project Name
- **Repository Name**: zuno
- **Frontend Package**: atoms
- **Backend Package**: atoms-backend

### Key Objectives
- Provide structured learning paths for technical subjects
- Track user progress and award badges/certificates
- Enable peer-to-peer communication through discussions and messaging
- Gamify learning with points, streaks, and leaderboards
- Offer AI-generated quizzes for personalized assessment
- Support real-time updates and notifications

---

## 🛠 Technology Stack

### Frontend Technologies

#### Core Framework & Build Tools
- **React 18.3.1** - Modern UI library with hooks
- **TypeScript 5.5.3** - Type-safe JavaScript
- **Vite 6.3.5** - Fast build tool and dev server
- **React Router DOM 7.7.1** - Client-side routing

#### Styling & UI
- **Tailwind CSS 3.4.1** - Utility-first CSS framework
- **PostCSS 8.4.35** - CSS processing
- **Autoprefixer 10.4.18** - Vendor prefix automation
- **Lucide React 0.532.0** - Icon library
- **Custom CSS** - Glassmorphism, neon effects, animations

#### State Management & Context
- **React Context API** - Global state (Auth, Theme, Notifications)
- **Custom Hooks** - Reusable logic (useWebSocket, useActiveTime, useRealTimeUpdates)

#### Authentication & Real-time
- **Firebase 12.1.0** - Google OAuth authentication
- **Socket.IO Client 4.8.1** - WebSocket real-time communication

#### Development Tools
- **ESLint 9.9.1** - Code linting
- **TypeScript ESLint 8.3.0** - TypeScript-specific linting
- **Vite Plugin React 4.3.1** - React fast refresh

#### Browser Support
```json
{
  "browserslist": [
    "> 1%",
    "last 2 versions",
    "Edge >= 88",
    "Chrome >= 87",
    "Firefox >= 78",
    "Safari >= 14"
  ]
}
```

---

### Backend Technologies

#### Core Framework
- **Node.js** - JavaScript runtime
- **Express 4.18.2** - Web application framework
- **TypeScript 5.3.3** - Type-safe development

#### Database
- **MongoDB** - NoSQL database
- **Mongoose 8.0.3** - ODM (Object Data Modeling)

#### Authentication & Security
- **JSON Web Tokens (jsonwebtoken 9.0.2)** - JWT-based authentication
- **bcryptjs 2.4.3** - Password hashing
- **Google Auth Library 10.3.0** - Google OAuth verification
- **Helmet 7.1.0** - Security headers
- **CORS 2.8.5** - Cross-Origin Resource Sharing
- **Express Rate Limit 7.1.5** - API rate limiting (disabled in production)

#### Real-time Communication
- **Socket.IO 4.8.1** - WebSocket server for real-time features

#### Validation & Utilities
- **Joi 17.11.0** - Request validation
- **PDF-Lib 1.17.1** - Certificate PDF generation
- **Morgan 1.10.0** - HTTP request logging
- **Compression 1.7.4** - Response compression
- **dotenv 16.3.1** - Environment variable management

#### Development Tools
- **tsx 4.20.5** - TypeScript execution and watch mode
- **Jest 29.7.0** - Testing framework
- **TypeScript Type Definitions** - @types packages for type safety

---

## 🏗 Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  React 18 + TypeScript + Vite                        │  │
│  │  • React Router (SPA routing)                        │  │
│  │  • Tailwind CSS (styling)                            │  │
│  │  • Context API (state management)                    │  │
│  │  • Socket.IO Client (real-time)                      │  │
│  │  • Firebase Auth (Google OAuth)                      │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              ↕
                    HTTPS/WSS Protocol
                              ↕
┌─────────────────────────────────────────────────────────────┐
│                        SERVER LAYER                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Express + TypeScript + Node.js                      │  │
│  │  • REST API (HTTP endpoints)                         │  │
│  │  • Socket.IO Server (WebSocket)                      │  │
│  │  • JWT Authentication                                │  │
│  │  • Middleware (CORS, Security, Validation)           │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              ↕
                      MongoDB Protocol
                              ↕
┌─────────────────────────────────────────────────────────────┐
│                      DATABASE LAYER                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  MongoDB Atlas (Cloud Database)                      │  │
│  │  • User Collection                                   │  │
│  │  • Progress & QuizAttempt Collections               │  │
│  │  • Discussion & Message Collections                 │  │
│  │  • Notification & ActiveTime Collections            │  │
│  │  • Contest & ContestSubmission Collections          │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Frontend Architecture

```
src/
├── main.tsx                          # Application entry point
├── App.tsx                           # Root component with routing
├── components/                       # Reusable UI components
│   ├── Navbar.tsx                   # Navigation bar
│   ├── Footer.tsx                   # Footer component
│   ├── ProtectedRoute.tsx           # Route guard
│   ├── ActiveTimeManager.tsx        # Time tracking
│   ├── BadgeDisplay.tsx             # Badge showcase
│   ├── NetworkStatus.tsx            # Connection indicator
│   └── ...
├── pages/                           # Route pages
│   ├── Home.tsx                     # Landing page
│   ├── Auth.tsx                     # Login/Register
│   ├── WebDev.tsx                   # Web development hub
│   ├── CoreCS.tsx                   # Core CS hub
│   ├── DSA.tsx                      # DSA problem set
│   ├── Aptitude.tsx                 # Aptitude tests
│   ├── Discussion.tsx               # Discussion forum
│   ├── Messages.tsx                 # Private messaging
│   ├── Profile.tsx                  # User profile
│   ├── Leaderboard.tsx              # Rankings
│   └── ...
├── contexts/                        # React Context providers
│   ├── AuthContext.tsx              # Authentication state
│   ├── ThemeContext.tsx             # Dark/Light theme
│   └── NotificationContext.tsx      # Notification management
├── hooks/                           # Custom React hooks
│   ├── useWebSocket.ts              # WebSocket connection
│   ├── useActiveTime.ts             # Activity tracking
│   └── useRealTimeUpdates.ts        # Polling & real-time
├── services/                        # External service integrations
│   └── api.ts                       # Axios HTTP client
├── config/                          # Configuration files
│   └── firebase.ts                  # Firebase setup
├── data/                            # Static data & types
│   ├── dsaProblems.ts              # DSA problem bank
│   ├── aptitudeData.ts             # Aptitude questions
│   ├── osTopics.ts                 # OS concepts
│   ├── dbmsTopics.ts               # DBMS concepts
│   └── cnTopics.ts                 # Computer networks
└── styles/
    └── animations.css               # Custom animations
```

### Backend Architecture

```
server/src/
├── server.ts                        # Express server & Socket.IO setup
├── config/
│   └── database.ts                  # MongoDB connection
├── models/                          # Mongoose schemas
│   ├── User.ts                      # User model
│   ├── Progress.ts                  # Learning progress
│   ├── Discussion.ts                # Forum posts
│   ├── Message.ts                   # Private messages
│   ├── Notification.ts              # User notifications
│   ├── Contest.ts                   # Contest definitions
│   ├── ContestSubmission.ts         # Contest answers
│   └── ActiveTime.ts                # Time tracking
├── controllers/                     # Request handlers
│   ├── authController.ts            # Auth logic
│   ├── progressController.ts        # Progress tracking
│   ├── discussionController.ts      # Forum logic
│   ├── messageController.ts         # Messaging logic
│   ├── notificationController.ts    # Notification logic
│   ├── userController.ts            # User profile
│   ├── dsaController.ts             # DSA problem tracking
│   ├── certificateController.ts     # Certificate generation
│   ├── badgeController.ts           # Badge system
│   ├── contestController.ts         # Contest management
│   └── aiQuizController.ts          # AI quiz generation
├── routes/                          # API route definitions
│   ├── auth.ts
│   ├── progress.ts
│   ├── discussion.ts
│   ├── messages.ts
│   ├── notifications.ts
│   ├── user.ts
│   ├── dsa.ts
│   ├── certificates.ts
│   ├── badges.ts
│   ├── contests.ts
│   ├── admin.ts
│   └── aiquiz.ts
├── middleware/                      # Express middleware
│   ├── auth.ts                      # JWT authentication
│   ├── security.ts                  # CORS, rate limiting, headers
│   └── validation.ts                # Input validation
└── utils/                           # Helper functions
    ├── points.ts                    # Gamification logic
    ├── certificateGenerator.ts      # PDF generation
    ├── logger.ts                    # Logging utility
    └── errorHandler.ts              # Error handling
```

---

## ✨ Features

### 1. **Authentication & Authorization**
- Email/password registration and login
- Google OAuth integration (Firebase)
- JWT-based stateless authentication
- Protected routes on frontend
- Secure password hashing with bcrypt

### 2. **Learning Modules**

#### Web Development Track
- **HTML**: Videos + Quiz
- **CSS**: Videos + Quiz
- **JavaScript**: Videos + Quiz
- **React**: Videos + Quiz
- **Node.js**: Videos + Quiz
- **MongoDB**: Videos + Quiz

#### Core Computer Science
- **Operating Systems**: Topic-based learning with quizzes
- **DBMS**: Topic-based learning with quizzes
- **Computer Networks**: Topic-based learning with quizzes

#### Data Structures & Algorithms
- Problem-solving platform
- Categorized by topic and difficulty
- Track solved problems
- Progress visualization

#### Quantitative Aptitude
- Multiple aptitude topics
- Practice questions with solutions
- Score tracking

### 3. **Gamification System**

#### Points System
- Quiz completion: Variable points
- Problem solving: Points by difficulty
- Video watching: Progress points
- Daily login streak bonus
- Engagement rewards

#### Badges
- Subject mastery badges
- Achievement badges
- Milestone badges
- Certificate badges

#### Leaderboard
- Global ranking by total points
- Real-time updates
- User profile integration

### 4. **Certificate Generation**
- Automated PDF certificate generation
- Completion verification
- Unique certificate IDs
- Download and share functionality
- Stored in user profile

### 5. **Social Features**

#### Discussion Forum
- Create discussion posts
- Reply to discussions (nested)
- Like/unlike posts and replies
- Tag-based categorization
- Real-time updates via WebSocket

#### Private Messaging
- One-on-one conversations
- Real-time message delivery
- Conversation management
- Typing indicators
- Unread message counts

#### Notifications
- Real-time notification system
- Discussion replies
- Likes and mentions
- System notifications
- Mark as read functionality

### 6. **AI-Powered Features**
- AI quiz generation using Groq API (LLaMA models)
- Custom quiz generation by topic
- Interview-style MCQs
- Instant feedback and explanations

### 7. **Contest System**
- Admin-created contests
- Time-bound challenges
- Question management
- Submission tracking
- Real-time contest updates

### 8. **User Profile**
- Profile customization
- Photo upload
- Progress statistics
- Badge collection
- Certificate showcase
- Activity tracking
- Follower/following system

### 9. **Real-Time Features**
- WebSocket connection with Socket.IO
- Hybrid transport (polling + WebSocket)
- Real-time message delivery
- Live discussion updates
- Instant notifications
- Connection status indicator
- Automatic reconnection

### 10. **Active Time Tracking**
- Track time spent on platform
- Daily activity logs
- Engagement analytics
- Heartbeat mechanism

### 11. **Responsive Design**
- Mobile-first approach
- Zoom-responsive (100%-200%+)
- Dark theme optimized
- Glassmorphism effects
- Animated gradients
- Custom scrollbars

---

## 🗄 Database Schema

### MongoDB Collections

#### **Users Collection**
```typescript
{
  _id: ObjectId
  email: string (unique, indexed)
  password: string (hashed)
  displayName: string
  photoURL?: string
  provider: 'email' | 'google'
  providerId?: string
  googleId?: string
  isEmailVerified: boolean
  
  // Progress tracking
  progress: {
    webdev: {
      html: { videosWatched: number, quizPassed: boolean, score?: number }
      css: { videosWatched: number, quizPassed: boolean, score?: number }
      javascript: { videosWatched: number, quizPassed: boolean, score?: number }
      react: { videosWatched: number, quizPassed: boolean, score?: number }
      nodejs: { videosWatched: number, quizPassed: boolean, score?: number }
      mongodb: { videosWatched: number, quizPassed: boolean, score?: number }
    }
    core: {
      os: { topicsCompleted: string[], quizzesPassed: number }
      dbms: { topicsCompleted: string[], quizzesPassed: number }
      cn: { topicsCompleted: string[], quizzesPassed: number }
    }
    dsa: {
      solvedProblems: string[]
      topicProgress: { [topic: string]: number }
    }
    aptitude: {
      completedTopics: string[]
      scores: { [topic: string]: number }
    }
  }
  
  // Gamification
  totalPoints: number
  badges: string[]
  streak: number
  lastActiveDate: Date
  lastLogin: Date
  
  // Social
  followers: ObjectId[]
  following: ObjectId[]
  
  // Certificates
  certificates: [{
    type: string
    issuedDate: Date
    certificateId: string
    downloadUrl: string
  }]
  
  createdAt: Date
  updatedAt: Date
}
```

#### **QuizAttempts Collection (Progress)**
```typescript
{
  _id: ObjectId
  userId: ObjectId (ref: User)
  subject: string
  topic: string
  answers: [{
    questionId: string
    userAnswer: number
    correctAnswer: number
    isCorrect: boolean
  }]
  score: number
  totalQuestions: number
  passed: boolean
  completedAt: Date
  pointsEarned: number
}
```

#### **Discussions Collection**
```typescript
{
  _id: ObjectId
  authorId: ObjectId (ref: User)
  title: string
  content: string
  tags: string[]
  likes: ObjectId[] (ref: User)
  likesCount: number
  replies: [{
    _id: ObjectId
    authorId: ObjectId (ref: User)
    content: string
    likes: ObjectId[]
    createdAt: Date
  }]
  createdAt: Date
  updatedAt: Date
}
```

#### **Messages Collection**
```typescript
{
  _id: ObjectId
  senderId: ObjectId (ref: User)
  recipientId: ObjectId (ref: User)
  content: string
  isRead: boolean
  createdAt: Date
}
```

#### **Notifications Collection**
```typescript
{
  _id: ObjectId
  userId: ObjectId (ref: User)
  type: 'like' | 'reply' | 'follow' | 'badge' | 'system'
  title: string
  message: string
  link?: string
  isRead: boolean
  createdAt: Date
  
  // Optional references
  actorId?: ObjectId (ref: User)
  discussionId?: ObjectId (ref: Discussion)
}
```

#### **Contests Collection**
```typescript
{
  _id: ObjectId
  title: string
  description: string
  startTime: Date
  endTime: Date
  questions: [{
    question: string
    options: string[]
    correctOption: number
  }]
  createdBy?: ObjectId (ref: User)
  createdAt: Date
}
```

#### **ContestSubmissions Collection**
```typescript
{
  _id: ObjectId
  contestId: ObjectId (ref: Contest)
  userId: ObjectId (ref: User)
  answers: number[]
  score: number
  submittedAt: Date
}
```

#### **ActiveTime Collection**
```typescript
{
  _id: ObjectId
  userId: ObjectId (ref: User, indexed)
  day: Date (YYYY-MM-DD format, indexed)
  seconds: number
  
  // Compound unique index: { userId: 1, day: 1 }
}
```

---

## 🔌 API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - Login with email/password
- `POST /google` - Google OAuth login
- `GET /profile` - Get current user profile (Protected)
- `PUT /profile` - Update user profile (Protected)
- `POST /heartbeat` - Update user activity (Protected)

### Progress Routes (`/api/progress`)
- `POST /quiz` - Submit quiz attempt (Protected)
- `POST /video-watched` - Mark video as watched (Protected)
- `GET /me` - Get user progress (Protected)
- `GET /leaderboard` - Get global leaderboard
- `GET /user/:userId` - Get specific user's progress

### Discussion Routes (`/api/discussions`)
- `GET /` - Get all discussions (with pagination)
- `POST /` - Create new discussion (Protected)
- `GET /:id` - Get specific discussion
- `POST /:id/like` - Like/unlike discussion (Protected)
- `POST /:id/reply` - Reply to discussion (Protected)
- `POST /:id/reply/:replyId/like` - Like/unlike reply (Protected)

### Message Routes (`/api/messages`)
- `GET /conversations` - Get user's conversations (Protected)
- `GET /conversation/:otherUserId` - Get messages with specific user (Protected)
- `POST /send` - Send private message (Protected)
- `PATCH /:messageId/read` - Mark message as read (Protected)

### Notification Routes (`/api/notifications`)
- `GET /` - Get user notifications (Protected)
- `PATCH /:id/read` - Mark notification as read (Protected)
- `PATCH /mark-all-read` - Mark all as read (Protected)

### User Routes (`/api/user`)
- `GET /:userId` - Get user profile by ID
- `POST /upload-photo` - Upload profile photo (Protected)
- `POST /:userId/follow` - Follow/unfollow user (Protected)

### DSA Routes (`/api/dsa`)
- `POST /problem/solved` - Mark problem as solved (Protected)
- `POST /problem/unsolved` - Unmark problem (Protected)
- `GET /progress` - Get DSA progress (Protected)

### Certificate Routes (`/api/certificates`)
- `POST /webdev/generate` - Generate web dev certificate (Protected)
- `GET /me` - Get user's certificates (Protected)
- `GET /verify/:certificateId` - Verify certificate

### Badge Routes (`/api/badges`)
- `GET /metadata` - Get badge definitions

### Contest Routes (`/api/contests`)
- `GET /` - Get all contests
- `GET /active` - Get active contests
- `GET /:id` - Get contest details
- `POST /:id/submit` - Submit contest answers (Protected)
- `GET /:id/result` - Get contest results (Protected)

### Admin Routes (`/api/admin`)
- `POST /contests` - Create contest (Admin only)
- `PUT /contests/:id` - Update contest (Admin only)
- `DELETE /contests/:id` - Delete contest (Admin only)

### AI Quiz Routes (`/api/aiquiz`)
- `POST /generate` - Generate AI quiz (Protected)

---

## 🚀 Deployment

### Hosting Platforms

#### Frontend (Vercel)
- **Platform**: Vercel
- **Build Command**: `npm ci && npm run build`
- **Output Directory**: `dist`
- **Framework**: Vite
- **SPA Routing**: Configured via `_redirects` file

#### Backend (Render)
- **Platform**: Render Web Service
- **Build Command**: `npm ci && npm run build`
- **Start Command**: `npm start`
- **Environment**: Node.js
- **Health Check**: `/health` endpoint

#### Database (MongoDB Atlas)
- **Platform**: MongoDB Atlas (Cloud)
- **Region**: Configurable
- **Connection**: MongoDB URI with authentication

### Deployment Configuration

**render.yaml**
```yaml
services:
  - type: web
    name: atoms-backend
    env: node
    rootDir: server
    plan: free
    buildCommand: npm ci && npm run build
    startCommand: npm start
    autoDeploy: true
    healthCheckPath: /health

  - type: static
    name: atoms-frontend
    env: static
    rootDir: .
    buildCommand: npm ci && npm run build
    publishPath: dist
    autoDeploy: true
    routes:
      - type: rewrite
        source: "/**"
        destination: "/index.html"
```

### Build Process

**Frontend**
```bash
npm ci                  # Clean install dependencies
npm run build          # Vite builds to dist/
# Output: Static files (HTML, JS, CSS, assets)
```

**Backend**
```bash
npm ci                  # Clean install dependencies
npm run build          # TypeScript compiles to dist/
npm start              # Node runs dist/server.js
```

---

## ⚙️ Environment Variables

### Frontend Environment Variables

Create `.env` file in project root:

```env
# Backend API URL
VITE_API_URL=https://atoms-backend.onrender.com/api

# Optional: Separate WebSocket URL (if different from API)
VITE_SOCKET_URL=https://atoms-backend.onrender.com

# Optional: Socket.IO path override
VITE_SOCKET_PATH=/socket.io/

# Development
VITE_API_URL=http://localhost:5000/api
```

### Backend Environment Variables

Create `.env` file in `server/` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=production

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/atoms

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# CORS Configuration
FRONTEND_URL=https://your-frontend-domain.vercel.app
ALLOWED_ORIGINS=https://your-frontend-domain.vercel.app,https://atoms-frontend.onrender.com

# AI Quiz (Groq API)
GROQ_API_KEY=your-groq-api-key
GROQ_MODEL=llama-3.1-70b-versatile
GROQ_MODEL_FALLBACK=llama-3.1-8b-instant

# Optional: Logging
REQUEST_LOG=minimal
```

---

## 📊 Key Features Summary

### Frontend Capabilities
✅ Single Page Application (SPA) with React Router  
✅ TypeScript for type safety  
✅ Real-time updates with Socket.IO  
✅ Firebase Google OAuth  
✅ Context API for global state  
✅ Custom hooks for reusable logic  
✅ Tailwind CSS with custom design system  
✅ Responsive across all devices and zoom levels  
✅ Dark theme with glassmorphism effects  

### Backend Capabilities
✅ RESTful API with Express  
✅ WebSocket server with Socket.IO  
✅ JWT authentication  
✅ MongoDB with Mongoose ODM  
✅ Input validation with Joi  
✅ Security middleware (Helmet, CORS)  
✅ PDF generation for certificates  
✅ AI integration with Groq API  
✅ Real-time notifications and messaging  
✅ Gamification with points and badges  

### Database Features
✅ NoSQL document-based storage  
✅ Indexed queries for performance  
✅ Aggregation pipelines for analytics  
✅ Relationship modeling with references  
✅ Automatic timestamps  
✅ Data validation at schema level  

---

## 🎨 Design System

### Color Palette
- **Primary**: Cyan (`#06b6d4`)
- **Secondary**: Purple (`#8b5cf6`)
- **Accent**: Pink (`#ec4899`)
- **Background**: Dark gradient (`#0f172a` to `#1e1b4b`)
- **Text**: White (`#ffffff`)

### UI Elements
- **Glassmorphism**: Semi-transparent backgrounds with backdrop blur
- **Neon Glow**: Box shadows with cyan and purple colors
- **Animated Gradients**: Shifting gradient backgrounds
- **Custom Scrollbars**: Styled with gradient colors
- **Clip Paths**: Hexagon, diamond, and arrow shapes

### Typography
- **Heading Font**: Poppins
- **Body Font**: System UI sans-serif stack

---

## 🔐 Security Features

1. **Authentication**: JWT tokens with expiration
2. **Password Security**: bcrypt hashing with salt rounds
3. **CORS**: Configured allowed origins
4. **Security Headers**: Helmet middleware
5. **Rate Limiting**: Disabled in production (was causing issues)
6. **Input Validation**: Joi schemas for all endpoints
7. **MongoDB Injection Protection**: Mongoose sanitization
8. **XSS Protection**: Built-in Express escaping

---

## 📈 Performance Optimizations

### Frontend
- Vite for fast HMR and build times
- Code splitting with React Router
- Lazy loading of components
- WebSocket with polling fallback
- Optimized images and assets
- CSS minification

### Backend
- Response compression middleware
- MongoDB connection pooling
- Indexed database queries
- Efficient aggregation pipelines
- Static file serving optimization

### Network
- HTTP/2 support on hosting platforms
- CDN for static assets (Vercel)
- Gzip/Brotli compression
- WebSocket for reduced overhead

---

## 🧪 Testing & Development

### Development Commands

**Frontend**
```bash
npm run dev        # Start dev server (port 5173)
npm run build      # Production build
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

**Backend**
```bash
npm run dev        # Start with tsx watch mode
npm run build      # Compile TypeScript
npm start          # Run production server
npm test           # Run Jest tests
```

### Development Tools
- **Browser DevTools**: React Developer Tools
- **Network Inspector**: Monitor API and WebSocket traffic
- **WebSocket Debugger**: Custom component for debugging connections
- **Morgan**: HTTP request logging

---

## 📝 Code Quality

### Linting
- ESLint with TypeScript support
- React Hooks linting rules
- React Refresh linting

### Type Safety
- Strict TypeScript configuration
- Interface definitions for all data structures
- Type-safe API responses

### Code Organization
- Feature-based folder structure
- Separation of concerns
- Reusable components and hooks
- Centralized API service

---

## 🌐 Browser Compatibility

Supports all modern browsers:
- Chrome 87+
- Firefox 78+
- Safari 14+
- Edge 88+

Responsive design tested from 320px to 4K displays.

---

## 📦 Package Management

**Frontend**: npm with package.json  
**Backend**: npm with package.json  
**Node Version**: Compatible with Node 18+  
**Package Lock**: package-lock.json committed for reproducible builds

---

## 🔄 Real-Time Architecture

### WebSocket Events

**Client → Server**
- `join-room` - Join user-specific room
- `typing-private` - User typing in message
- `typing-discussion` - User typing in discussion

**Server → Client**
- `private-message` - New private message
- `conversation-updated` - Conversation state changed
- `discussion-reply` - New discussion reply
- `discussion-created` - New discussion post
- `discussion-like-updated` - Like/unlike event
- `notification` - New notification
- `notifications-marked-all-read` - Bulk read event
- `contest-created` - New contest available

### Polling Fallback
- Messages: 10-12 second intervals
- Discussions: 12 second intervals
- Notifications: 20 second intervals
- Enabled regardless of WebSocket status for reliability

---

## 🎓 Learning Content Structure

### Web Development
6 modules × (5-10 videos + 1 quiz) = Comprehensive full-stack path

### Core CS
3 subjects × (15-20 topics + quizzes) = Foundation knowledge

### DSA
200+ problems across 10 topics × 3 difficulty levels = Interview prep

### Aptitude
15+ topics × (20-50 questions) = Quantitative reasoning

---

## 🏆 Gamification Mechanics

### Point System
- Quiz pass: 50-100 points
- Problem solve: 10-30 points by difficulty
- Video complete: 5-10 points
- Daily streak: Bonus multiplier

### Badge Tiers
- Bronze: Beginner achievements
- Silver: Intermediate milestones
- Gold: Advanced mastery
- Platinum: Expert level

### Leaderboard Ranking
- Real-time updates
- Top 100 display
- Points-based ranking
- Social proof and motivation

---

## 📧 Contact & Support

For issues, feature requests, or contributions, refer to the repository owner: **Nithish-Chandra-Devarashetty**

---

**Last Updated**: October 2025  
**Version**: 1.0.0  
**Status**: Production Ready ✅
