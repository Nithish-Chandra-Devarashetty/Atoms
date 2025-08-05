export interface Project {
  id: string;
  title: string;
  description: string;
  concepts: string[];
  features: string[];
}

export const mongoProjects: Project[] = [
  {
    id: 'mongo-1',
    title: 'E-commerce Product Catalog',
    description: 'Build a robust product catalog system using MongoDB to store and manage product data with categories, variants, and inventory tracking.',
    concepts: [
      'Schema Design',
      'Indexing',
      'Aggregation Pipeline',
      'Data Modeling',
      'Performance Optimization'
    ],
    features: [
      'Product CRUD operations',
      'Category hierarchy',
      'Product variants and options',
      'Inventory management',
      'Search and filtering',
      'Pagination and sorting'
    ]
  },
  {
    id: 'mongo-2',
    title: 'Blog Platform with Comments',
    description: 'Create a blog platform with nested comments using MongoDB\'s document model to store hierarchical data efficiently.',
    concepts: [
      'Document References',
      'Embedded Documents',
      'Tree Structures',
      'Data Consistency',
      'Query Optimization'
    ],
    features: [
      'Blog post management',
      'Nested comments',
      'User authentication',
      'Rich text content',
      'Tagging system',
      'Content moderation'
    ]
  },
  {
    id: 'mongo-3',
    title: 'Real-time Analytics Dashboard',
    description: 'Develop a real-time analytics dashboard using MongoDB Change Streams to track and visualize data changes as they happen.',
    concepts: [
      'Change Streams',
      'Aggregation Framework',
      'Time Series Data',
      'Data Visualization',
      'Real-time Updates'
    ],
    features: [
      'Real-time data visualization',
      'Custom metrics and KPIs',
      'Time-based analytics',
      'User activity tracking',
      'Exportable reports',
      'Custom dashboards'
    ]
  },
  {
    id: 'mongo-4',
    title: 'Multi-tenant SaaS Application',
    description: 'Build a multi-tenant application where each tenant has isolated data while sharing the same application instance.',
    concepts: [
      'Multi-tenancy',
      'Data Isolation',
      'Schema Design',
      'Access Control',
      'Performance at Scale'
    ],
    features: [
      'Tenant management',
      'Role-based access control',
      'Data isolation',
      'Billing integration',
      'Usage analytics',
      'Custom branding'
    ]
  },
  {
    id: 'mongo-5',
    title: 'Geospatial Service Platform',
    description: 'Create a location-based service using MongoDB\'s geospatial features to handle proximity searches and location data.',
    concepts: [
      'Geospatial Indexes',
      'GeoJSON',
      'Geospatial Queries',
      'Performance Optimization',
      'Data Validation'
    ],
    features: [
      'Location-based search',
      'Proximity alerts',
      'Geofencing',
      'Route mapping',
      'Location history',
      'Spatial analysis'
    ]
  }
];
