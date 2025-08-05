export interface Project {
  id: string;
  title: string;
  description: string;
  concepts: string[];
  features: string[];
}

export const nodeProjects: Project[] = [
  {
    id: 'blog-platform-api',
    title: 'Blog Platform API',
    description: 'A full-featured blogging backend with user authentication, post management, and role-based access control.',
    concepts: [
      'RESTful API design with Express.js',
      'JWT authentication and authorization',
      'MongoDB with Mongoose for data modeling',
      'Middleware for route protection',
      'Pagination and search implementation'
    ],
    features: [
      'User registration and login with JWT',
      'CRUD operations for blog posts',
      'Comment system on posts',
      'Role-based access control (admin/user)',
      'Pagination and search functionality',
      'Input validation and error handling',
      'Rate limiting for API endpoints'
    ]
  },
  {
    id: 'realtime-chat',
    title: 'Real-Time Chat Application',
    description: 'A real-time chat application with multiple rooms, user presence, and message history.',
    concepts: [
      'WebSocket communication with Socket.io',
      'Real-time event handling',
      'Room-based messaging',
      'User presence tracking',
      'Message persistence'
    ],
    features: [
      'Real-time messaging with Socket.io',
      'Multiple chat rooms/channels',
      'User authentication and sessions',
      'Online/offline status',
      'Message history and persistence',
      'Typing indicators',
      'Private messaging between users'
    ]
  },
  {
    id: 'file-manager-api',
    title: 'File Upload & Download Manager',
    description: 'A secure file management system with user authentication and role-based access control.',
    concepts: [
      'File uploads with multer',
      'Streaming files for download',
      'Access control and permissions',
      'File metadata management',
      'Cloud storage integration'
    ],
    features: [
      'Secure file upload with size limits',
      'File download with proper headers',
      'User authentication and authorization',
      'File metadata storage (name, size, type, owner)',
      'Progress tracking for uploads/downloads',
      'File organization (folders, tags)',
      'File sharing between users'
    ]
  },
  {
    id: 'ecommerce-backend',
    title: 'E-Commerce Backend',
    description: 'A complete e-commerce backend with product management, cart functionality, and payment processing.',
    concepts: [
      'RESTful API design',
      'Payment gateway integration',
      'Order processing workflow',
      'Inventory management',
      'Email notifications'
    ],
    features: [
      'Product catalog with categories',
      'User authentication and profiles',
      'Shopping cart functionality',
      'Order processing and management',
      'Payment processing (Stripe/Razorpay)',
      'Order confirmation emails',
      'Admin dashboard for inventory'
    ]
  },
  {
    id: 'task-scheduler',
    title: 'Task Scheduler & Notification Service',
    description: 'A background job scheduler with email/SMS notifications for scheduled tasks and reminders.',
    concepts: [
      'Cron job scheduling',
      'Background job processing',
      'Email/SMS notifications',
      'Task queuing',
      'User preferences management'
    ],
    features: [
      'Create, update, and delete scheduled tasks',
      'Multiple notification channels (email, SMS)',
      'Recurring tasks with flexible scheduling',
      'Notification history and logs',
      'User notification preferences',
      'Webhook support for integrations',
      'Task prioritization and retries'
    ]
  }
];
