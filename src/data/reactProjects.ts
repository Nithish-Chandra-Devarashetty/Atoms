export interface Project {
  id: string;
  title: string;
  description: string;
  concepts: string[];
  features: string[];
}

export const reactProjects: Project[] = [
  {
    id: 'multi-step-form',
    title: 'Multi-Step Form Wizard',
    description: 'Build a multi-step user registration form (e.g., personal info, address, review, confirmation) with form validation, navigation between steps, and a summary screen.',
    concepts: [
      'useState and useReducer for form data/state management',
      'Controlled components for inputs',
      'React Router for step navigation',
      'Lifting state up and prop drilling',
      'Conditional rendering',
      'useEffect for validation/side-effects'
    ],
    features: [
      'Multi-step form with progress indicator',
      'Form validation for each step',
      'Review screen before submission',
      'Success/confirmation message',
      'Responsive design',
      'Save progress functionality'
    ]
  },
  {
    id: 'todo-app',
    title: 'Todo App with Context and Reducer',
    description: 'Create a to-do application with add, delete, mark-as-done, filter, and edit functionalities. Use Context API and useReducer for global state management.',
    concepts: [
      'useContext and Context API for state sharing',
      'useReducer for managing todo actions',
      'Component composition and props',
      'Controlled components',
      'useMemo/useCallback optimizations',
      'Code splitting/lazy loading'
    ],
    features: [
      'Add, edit, and delete todos',
      'Mark todos as complete/incomplete',
      'Filter todos (all/active/completed)',
      'Persistent storage using localStorage',
      'Responsive design',
      'Drag and drop reordering'
    ]
  },
  {
    id: 'blog-platform',
    title: 'Blog Platform with CRUD and Fetch API',
    description: 'A simple CRUD app to create, edit, view, and delete blog posts. Fetch user data from a fake API (like JSONPlaceholder) for comments/author info.',
    concepts: [
      'Functional and class components',
      'useEffect for API calls',
      'useState for post management',
      'Props drilling and lifting',
      'Form handling & validation',
      'Error boundaries',
      'Asynchronous patterns',
      'useRef for DOM access'
    ],
    features: [
      'View all blog posts',
      'Create new blog posts',
      'Edit and delete existing posts',
      'View post details with comments',
      'User authentication (simulated)',
      'Loading and error states',
      'Search functionality',
      'Pagination'
    ]
  },
  {
    id: 'ecommerce-catalog',
    title: 'E-Commerce Product Catalog',
    description: 'Display a list/grid of products with filters (by category, price, etc), add-to-cart functionality, and a cart page (or modal).',
    concepts: [
      'Component hierarchy and data flow',
      'useContext for cart management',
      'State and props management',
      'useEffect for fetching product data',
      'Routing and code splitting',
      'useMemo/useCallback for performance',
      'useRef for image gallery/focus',
      'Error and loading UI'
    ],
    features: [
      'Product listing with grid/list view',
      'Filter and sort products',
      'Product details page',
      'Shopping cart functionality',
      'Responsive design',
      'Product search',
      'Wishlist functionality',
      'Checkout process'
    ]
  },
  {
    id: 'chat-app',
    title: 'Real-Time Chat Application',
    description: 'Build a simple chat application: users can type and send messages in real time (simulate with setInterval or integrate with a real backend if you wish).',
    concepts: [
      'useState, useEffect, useRef for message handling',
      'Component composition',
      'Context API for user/session info',
      'Conditional rendering',
      'Custom hooks',
      'Error boundaries',
      'Event handling',
      'Performance optimization with useMemo/useCallback'
    ],
    features: [
      'Real-time messaging',
      'User authentication',
      'Online/offline status',
      'Message timestamps',
      'Typing indicators',
      'Message read receipts',
      'Emoji picker',
      'File/image sharing'
    ]
  }
];
