// Static Pages Endpoints
export const STATIC_PAGE_ENDPOINTS = {
  GET_ALL_PUBLIC: '/public/static-pages',
  GET_ALL_ADMIN: '/public/static-pages',
  GET_BY_ID: (id: string) => `/admin/static-pages/${id}`,
  CREATE: '/admin/static-pages',
  UPDATE: (id: string) => `/admin/static-pages/${id}`,
  DELETE: (id: string) => `/admin/static-pages/${id}`
};
// Base URLs for different environments
export const API_BASE_URLS = {
  DEVELOPMENT: 'http://localhost:8080/api/v1',
  PRODUCTION: 'https://api.altrevo.com/v1'
};

// Get current base URL based on environment
export const getCurrentBaseUrl = (): string => {
  return API_BASE_URLS.DEVELOPMENT; // Change this based on your environment
};

// Public API Endpoints (No Authentication Required)
export const PUBLIC_API_ENDPOINTS = {
  // Site Settings
  SETTINGS: '/public/settings',
  
  // Services
  SERVICES: '/public/services',
  SERVICE_BY_ID: (id: number) => `/public/services/${id}`,
  
  // Testimonials
  TESTIMONIALS: '/public/testimonials',
  
  // Team
  TEAM: '/public/team',
  TEAM_BY_ID: (id: number) => `/public/team/${id}`,
  
  // Blog
  BLOGS: '/public/blogs',
  BLOG_BY_ID: (id: number) => `/public/blogs/${id}`,
  BLOG_BY_SLUG: (slug: string) => `/public/blogs/slug/${slug}`,
  
  // Careers
  CAREERS: '/public/careers',
  CAREER_BY_ID: (id: number) => `/public/careers/${id}`,
  
  // Static Pages
  PAGES: '/public/pages',
  PAGE_BY_ID: (id: string) => `/public/pages/${id}`,
  PAGE_BY_SLUG: (slug: string) => `/public/pages/slug/${slug}`,
  
  // Enquiries (Submit)
  ENQUIRIES: '/public/enquiries'
};

// Admin API Endpoints (Authentication Required)
export const ADMIN_API_ENDPOINTS = {
  // Authentication
  LOGIN: '/admin/auth/login',
  REFRESH: '/admin/auth/refresh',
  LOGOUT: '/admin/auth/logout',
  
  // Site Settings
  SETTINGS: '/admin/settings',
  
  // Services Management
  SERVICES: '/admin/services',
  SERVICE_BY_ID: (id: number) => `/admin/services/${id}`,
  
  // Blog Management
  BLOGS: '/admin/blogs',
  BLOG_BY_ID: (id: number) => `/admin/blogs/${id}`,
  
  // Team Management
  TEAM: '/admin/team',
  TEAM_BY_ID: (id: number) => `/admin/team/${id}`,
  
  // Testimonials Management
  TESTIMONIALS: '/admin/testimonials',
  TESTIMONIAL_BY_ID: (id: number) => `/admin/testimonials/${id}`,
  
  // Careers Management
  CAREERS: '/admin/careers',
  CAREER_BY_ID: (id: number) => `/admin/careers/${id}`,
  
  // Projects Management
  PROJECTS: '/admin/projects',
  PROJECT_BY_ID: (id: string) => `/admin/projects/${id}`,
  
  // Enquiries Management
  ENQUIRIES: '/admin/enquiries',
  ENQUIRY_BY_ID: (id: number) => `/admin/enquiries/${id}`,
  
  // Static Pages Management
  PAGES: '/admin/pages',
  PAGE_BY_ID: (id: string) => `/admin/pages/${id}`,
  
  // Dashboard & Analytics
  DASHBOARD_METRICS: '/admin/dashboard/metrics',
  DASHBOARD_ACTIVITIES: '/admin/dashboard/activities',
  
  // Feature Toggles
  FEATURES: '/admin/features',
  FEATURE_BY_ID: (id: string) => `/admin/features/${id}`,
  
  // File Upload
  UPLOAD: '/admin/upload',
  DELETE_FILE: (filename: string) => `/admin/upload/${filename}`
};

// Helper function to build full URL
export const buildApiUrl = (endpoint: string): string => {
  return `${getCurrentBaseUrl()}${endpoint}`;
};

// Legacy endpoints for backward compatibility
export const API_ENDPOINTS = {
  SERVICES: '/api/services',
  TESTIMONIALS: '/api/testimonials'
};
