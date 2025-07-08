export interface SiteSettings {
  id?: string;
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
  };
  
  // General Settings
  maintenanceMode: boolean;
  maintenanceMessage: string;
  theme: 'light' | 'dark';
  primaryColor: string;
  secondaryColor: string;
  
  // Last Updated
  lastUpdated: Date;
  updatedBy: string;
}

export const SITE_SETTINGS: SiteSettings = {
  id: 'main-settings',
  
  // Company Information
  companyName: 'TechNova IT Solutions',
  tagline: 'Innovative Technology Solutions for Modern Business',
  description: 'Leading IT consultancy providing cutting-edge technology solutions, digital transformation, and innovation services to businesses worldwide.',
  logoUrl: 'https://via.placeholder.com/200x60/007bff/ffffff?text=TechNova',
  faviconUrl: 'https://via.placeholder.com/32x32/007bff/ffffff?text=T',
  
  // Contact Information
  email: 'contact@technova.com',
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
    linkedin: 'https://linkedin.com/company/technova-solutions',
    twitter: 'https://twitter.com/technovasolutions',
    facebook: 'https://facebook.com/technovasolutions',
    instagram: 'https://instagram.com/technovasolutions',
    youtube: 'https://youtube.com/@technovasolutions',
    github: 'https://github.com/technova-solutions'
  },
  
  // SEO Settings
  seo: {
    metaTitle: 'TechNova IT Solutions - Leading Technology Consultancy',
    metaDescription: 'Transform your business with TechNova\'s expert IT consulting, digital transformation, cloud solutions, and innovative technology services.',
    keywords: ['IT consulting', 'digital transformation', 'cloud solutions', 'software development', 'technology consulting', 'enterprise solutions'],
    googleAnalyticsId: 'GA-XXXXXXXX',
    facebookPixelId: 'FB-XXXXXXXX'
  },
  
  // Footer Settings
  footer: {
    copyrightText: '© 2024 TechNova IT Solutions. All rights reserved.',
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
    recipientEmail: 'inquiries@technova.com',
    autoReplyEnabled: true,
    autoReplySubject: 'Thank you for contacting TechNova IT Solutions',
    autoReplyMessage: 'Thank you for reaching out to us. We have received your message and will get back to you within 24 hours.'
  },
  
  // General Settings
  maintenanceMode: false,
  maintenanceMessage: 'We are currently performing scheduled maintenance. Please check back soon.',
  theme: 'light',
  primaryColor: '#007bff',
  secondaryColor: '#6c757d',
  
  // Last Updated
  lastUpdated: new Date('2024-01-15'),
  updatedBy: 'admin'
};
