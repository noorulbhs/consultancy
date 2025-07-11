export interface SiteSettings {
  id?: string;
  version?: string;
  // Company Information
  companyName: string;
  tagline: string;
  description: string;
  logoUrl: string;
  faviconUrl: string;
  
  // Contact Information
  email: string;
  phone: string;
  alternatePhone?: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  
  // Business Information
  businessHours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  
  // Social Media
  social: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
    youtube?: string;
    github?: string;
  };
  
  // SEO Settings
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
    googleAnalyticsId?: string;
    facebookPixelId?: string;
  };
  
  // Footer Settings
  footer: {
    copyrightText: string;
    quickLinks: Array<{
      title: string;
      url: string;
    }>;
    services: Array<{
      title: string;
      url: string;
    }>;
    aboutLinks: Array<{
      title: string;
      url: string;
    }>;
  };
  
  // Contact Form Settings
  contactForm: {
    recipientEmail: string;
    autoReplyEnabled: boolean;
    autoReplySubject: string;
    autoReplyMessage: string;
    subjectOptions: Array<{
      value: string;
      label: string;
      enabled: boolean;
    }>;
    serviceOptions: Array<{
      value: string;
      label: string;
      enabled: boolean;
    }>;
  };
  
  // General Settings
  maintenanceMode: boolean;
  maintenanceMessage: string;
  theme: 'light' | 'dark';
  primaryColor: string;
  secondaryColor: string;
  
  // Homepage Statistics
  statistics: {
    projectsCompleted: {
      number: string;
      label: string;
      icon: string;
      enabled: boolean;
    };
    happyClients: {
      number: string;
      label: string;
      icon: string;
      enabled: boolean;
    };
    yearsExperience: {
      number: string;
      label: string;
      icon: string;
      enabled: boolean;
    };
    support: {
      number: string;
      label: string;
      icon: string;
      enabled: boolean;
    };
    clientSatisfaction: {
      number: string;
      label: string;
      icon: string;
      enabled: boolean;
    };
    averageRating: {
      number: string;
      label: string;
      icon: string;
      enabled: boolean;
    };
    teamMembers: {
      number: string;
      label: string;
      icon: string;
      enabled: boolean;
    };
    successRate: {
      number: string;
      label: string;
      icon: string;
      enabled: boolean;
    };
  };
  
  // Last Updated
  lastUpdated: Date;
  updatedBy: string;
}

export const SITE_SETTINGS: SiteSettings = {
  id: 'main-settings',
  version: '2.0', // Added version for cache busting
  
  // Company Information
  companyName: 'Altrevo Tech Solutions',
  tagline: 'Innovative Technology Solutions for Modern Business',
  description: 'Leading technology consultancy providing cutting-edge solutions, digital transformation, and innovation services to businesses worldwide.',
  logoUrl: 'altrevo-logo.png',
  faviconUrl: 'altrevo-favicon.png',
  
  // Contact Information
  email: 'contact@altrevo.com',
  phone: '+1 (555) 123-4567',
  alternatePhone: '+1 (555) 123-4568',
  address: '123 Innovation Drive, Suite 100',
  city: 'San Francisco',
  state: 'California',
  country: 'United States',
  zipCode: '94107',
  
  // Business Information
  businessHours: {
    monday: '9:00 AM - 6:00 PM',
    tuesday: '9:00 AM - 6:00 PM',
    wednesday: '9:00 AM - 6:00 PM',
    thursday: '9:00 AM - 6:00 PM',
    friday: '9:00 AM - 6:00 PM',
    saturday: '10:00 AM - 4:00 PM',
    sunday: 'Closed'
  },
  
  // Social Media
  social: {
    linkedin: 'https://linkedin.com/company/altrevo-tech-solutions',
    facebook: 'https://facebook.com/altrevotechsolutions',
    instagram: 'https://instagram.com/altrevotechsolutions'
  },
  
  // SEO Settings
  seo: {
    metaTitle: 'Altrevo Tech Solutions - Leading Technology Consultancy',
    metaDescription: 'Transform your business with Altrevo\'s expert technology consulting, digital transformation, cloud solutions, and innovative technology services.',
    keywords: ['technology consulting', 'digital transformation', 'cloud solutions', 'software development', 'technology consulting', 'enterprise solutions'],
    googleAnalyticsId: 'GA-XXXXXXXX',
    facebookPixelId: 'FB-XXXXXXXX'
  },
  
  // Footer Settings
  footer: {
    copyrightText: '© 2024 Altrevo Tech Solutions. All rights reserved.',
    quickLinks: [
      { title: 'Privacy Policy', url: '/privacy-policy' },
      { title: 'Terms of Service', url: '/terms-of-service' },
      { title: 'Cookie Policy', url: '/cookie-policy' },
      { title: 'Sitemap', url: '/sitemap' }
    ],
    services: [
      { title: 'Cloud Solutions', url: '/services#cloud' },
      { title: 'Digital Transformation', url: '/services#digital-transformation' },
      { title: 'Cybersecurity', url: '/services#cybersecurity' },
      { title: 'Data Analytics', url: '/services#data-analytics' },
      { title: 'Software Development', url: '/services#software-development' }
    ],
    aboutLinks: [
      { title: 'Our Story', url: '/about#story' },
      { title: 'Our Team', url: '/about#team' },
      { title: 'Careers', url: '/careers' },
      { title: 'Press & Media', url: '/press' },
      { title: 'Contact Us', url: '/contact' }
    ]
  },
  
  // Contact Form Settings
  contactForm: {
    recipientEmail: 'inquiries@altrevo.com',
    autoReplyEnabled: true,
    autoReplySubject: 'Thank you for contacting Altrevo Tech Solutions',
    autoReplyMessage: 'Thank you for reaching out to us. We have received your message and will get back to you within 24 hours.',
    subjectOptions: [
      { value: 'general', label: 'General Inquiry', enabled: true },
      { value: 'consultation', label: 'Free Consultation', enabled: true },
      { value: 'support', label: 'Technical Support', enabled: true },
      { value: 'partnership', label: 'Partnership', enabled: true },
      { value: 'career', label: 'Career Opportunities', enabled: true }
    ],
    serviceOptions: [
      { value: 'Cloud Migration', label: 'Cloud Migration', enabled: true },
      { value: 'DevOps Strategy', label: 'DevOps Strategy', enabled: true },
      { value: 'Application Development', label: 'Application Development', enabled: true },
      { value: 'Data Analytics', label: 'Data Analytics', enabled: true },
      { value: 'Cybersecurity', label: 'Cybersecurity', enabled: true },
      { value: 'IT Strategy', label: 'IT Strategy', enabled: true },
      { value: 'Digital Transformation', label: 'Digital Transformation', enabled: true },
      { value: 'AI & Machine Learning', label: 'AI & Machine Learning', enabled: true }
    ]
  },
  
  // General Settings
  maintenanceMode: false,
  maintenanceMessage: 'We are currently performing scheduled maintenance. Please check back soon.',
  theme: 'light',
  primaryColor: '#007bff',
  secondaryColor: '#6c757d',
  
  // Homepage Statistics
  statistics: {
    projectsCompleted: {
      number: '150+',
      label: 'Projects Completed',
      icon: 'fas fa-project-diagram',
      enabled: true
    },
    happyClients: {
      number: '50+',
      label: 'Happy Clients',
      icon: 'fas fa-users',
      enabled: true
    },
    yearsExperience: {
      number: '10+',
      label: 'Years Experience',
      icon: 'fas fa-calendar-alt',
      enabled: true
    },
    support: {
      number: '24/7',
      label: 'Support Available',
      icon: 'fas fa-headset',
      enabled: false
    },
    clientSatisfaction: {
      number: '98%',
      label: 'Client Satisfaction',
      icon: 'fas fa-smile',
      enabled: false
    },
    averageRating: {
      number: '4.9/5',
      label: 'Average Rating',
      icon: 'fas fa-star',
      enabled: false
    },
    teamMembers: {
      number: '25+',
      label: 'Expert Team Members',
      icon: 'fas fa-user-tie',
      enabled: true
    },
    successRate: {
      number: '95%',
      label: 'Project Success Rate',
      icon: 'fas fa-trophy',
      enabled: false
    }
  },
  
  // Last Updated
  lastUpdated: new Date('2024-01-15'),
  updatedBy: 'admin'
};
