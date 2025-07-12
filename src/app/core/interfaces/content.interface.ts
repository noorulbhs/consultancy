// Service Interface
export interface Service {
  id: number;
  title: string;
  description: string;
  detailedDescription?: string;
  category: string;
  icon: string;
  features: string[];
  technologies: string[];
  duration: string;
  deliverables: string[];
  caseStudy?: CaseStudy;
  featured: boolean;
  status: 'active' | 'inactive' | 'draft';
  createdAt?: string;
  updatedAt?: string;
}

export interface CaseStudy {
  client: string;
  challenge: string;
  solution: string;
  results: string;
}

// Testimonial Interface
export interface Testimonial {
  id: number;
  name: string;
  designation: string;
  company: string;
  companyLogo?: string;
  message: string;
  rating: number;
  photoUrl?: string;
  published: boolean;
  featured: boolean;
  date: string;
  projectType?: string;
  location?: string;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

// Team Member Interface
export interface TeamMember {
  id: number;
  name: string;
  role: string;
  department: string;
  email: string;
  phone?: string;
  linkedin?: string;
  twitter?: string;
  github?: string;
  photoUrl?: string;
  bio?: string;
  skills: string[];
  experience: string;
  education?: string;
  location?: string;
  joinDate?: string;
  isPublic: boolean;
  featured: boolean;
  achievements?: string[];
  languages?: string[];
  specializations?: string[];
  certifications?: string[];
  interests?: string[];
  workStyle?: string;
  motto?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Blog Post Interface
export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  summary?: string;
  excerpt?: string;
  content: string;
  author: Author;
  category: string;
  tags: string[];
  readingTime: string;
  views?: number;
  featured: boolean;
  featuredImage?: string;
  publishedAt?: string;
  status: 'published' | 'draft' | 'archived';
  createdAt?: string;
  updatedAt?: string;
  relatedPosts?: RelatedPost[];
}

export interface Author {
  name: string;
  title: string;
  avatar?: string;
  bio?: string;
}

export interface RelatedPost {
  id: number;
  title: string;
  slug: string;
  featuredImage?: string;
}

// Job/Career Interface
export interface Job {
  id: number;
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  salary?: string;
  remoteWork?: string;
  openings: number;
  description: string;
  requirements: string[];
  responsibilities: string[];
  skills: string[];
  benefits: string[];
  isOpen: boolean;
  postedAt?: string;
  applicationDeadline?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Enquiry Interface
export interface Enquiry {
  id: number;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject: string;
  service?: string;
  message: string;
  date: string;
  isRead: boolean;
  referenceNumber?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Static Page Interface
export interface StaticPage {
  id: string;
  title: string;
  metaDescription?: string;
  content: string;
  slug: string;
  status: 'published' | 'draft';
  lastUpdated?: string;
  createdAt?: string;
  updatedAt?: string;
}
